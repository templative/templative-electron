const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const { JSDOM } = require('jsdom');
const { COMPONENT_INFO } = require('../../../../../../shared/componentInfo.js');
const { convertSvgContentToPngUsingResvg } = require('./fileConversion/svgToRasterConverter.js');
const { outputSvgArtFile, scaleSvg } = require("./fileConversion/svgArtExporter.js");
const { addOverlays, collectOverlayFiles} = require("./artdataProcessing/overlayHandler.js");
const { textReplaceInFile} = require("./artdataProcessing/textReplacer.js");
const { updateStylesInFile} = require("./artdataProcessing/styleUpdater.js");
const { clipSvgContentToClipFile, CLIPPING_ELEMENT_ID } = require("./artdataProcessing/imageClipper.js");
const { getComponentTemplatesDirectoryPath } = require("../../../componentTemplateUtility.js");
const { SvgFileCache } = require('./caching/svgFileCache.js');
const { createInputHash, getCachedFiles, getRenderedPiecesCacheDir } = require('./caching/renderedPiecesCache.js');
const { RENDER_MODE, RENDER_PROGRAM, OVERLAPPING_RENDERING_TASKS } = require('../../../manage/models/produceProperties');
const { removeNamedViews } = require('./artdataProcessing/svgCleaner.js');
const { replaceShapeInsideTextElementsWithPositionedTspans } = require('./artdataProcessing/shapeInsideReplacer.js');
const { replaceIconGlyphWithPuaCharsAsync, replacePlaceholdersWithUnicodeEntities } = require('./artdataProcessing/iconGlyphReplacer');
const { replaceFormattingShortcutElementsWithTspansAsync } = require('./artdataProcessing/formattingShortcutReplacer');
const { captureException } = require('../../../sentryElectronWrapper.js');

// Helper function to create a unique hash for a piece
function createUniqueBackHashForPiece(pieceSpecificBackArtDataSources, pieceGamedata) {
    let pieceBackSourceHash = "";
    for (const pieceSpecificSource of pieceSpecificBackArtDataSources) {
        if (!(pieceSpecificSource in pieceGamedata)) {
            console.log(`Piece ${pieceGamedata["name"]} does not define the field ${pieceSpecificSource} as the backartdata expects`);
            continue;
        }
        pieceBackSourceHash += pieceGamedata[pieceSpecificSource].replace(/\s/g, "");
    }
    if (pieceBackSourceHash === "") {
        return pieceBackSourceHash;
    }
    return createHash('md5').update(pieceBackSourceHash).digest('hex').slice(0, 8);
}

async function createSvgArtFilesForPieceAndGiveExportCommands(compositions, componentArtdata, uniqueComponentBackData, piecesDataBlob, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache = new SvgFileCache(), glyphUnicodeMap = {}) {
    const tasks = [];
    var commands = [];
    for (const pieceGamedata of piecesDataBlob) {
        if (pieceGamedata.name !== previewProperties.pieceName) {
            continue;
        }
        // Create a pieceData object with the same properties as uniqueComponentBackData plus pieceData
        const pieceData = {
            ...uniqueComponentBackData,
            pieceData: pieceGamedata
        };
        if ("Front" in componentArtdata.artDataBlobDictionary) {
            const task = createSvgArtFileOfPieceAndGiveCommand(compositions, componentArtdata.artDataBlobDictionary["Front"], pieceData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache, glyphUnicodeMap, "Front");
            if (previewProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                const command = await task;
                if (command) commands.push(command);
            }
        }
        if ("DieFace" in componentArtdata.artDataBlobDictionary) {
            const task = createSvgArtFileOfPieceAndGiveCommand(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache, glyphUnicodeMap, "DieFace");
            if (previewProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                const command = await task;
                if (command) commands.push(command);
            }
        }
        const needsPieceNameAsBackName = uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData.includes("name");
        if (needsPieceNameAsBackName) {
            uniqueComponentBackData.componentBackDataBlob.name = pieceGamedata["name"];
        } else {
            uniqueComponentBackData.componentBackDataBlob.name = "back";
        }
    }
    
    if ("Back" in componentArtdata.artDataBlobDictionary) {
        const backNeedsPieceName = Array.isArray(uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData)
            && uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData.includes("name");
        // For previews, we only have one selected piece; find it for data access
        const selected = piecesDataBlob.find(p => p.name === previewProperties.pieceName);
        const backGamedata = backNeedsPieceName && selected
            ? { ...uniqueComponentBackData, pieceData: selected }
            : uniqueComponentBackData;
        // Keep filename as "back"
        backGamedata.componentBackDataBlob.name = "back";
        const task = createSvgArtFileOfPieceAndGiveCommand(compositions, componentArtdata.artDataBlobDictionary["Back"], backGamedata, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache, glyphUnicodeMap, "Back");
        if (previewProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
            tasks.push(task);
        } else {
            const command = await task;
            if (command) commands.push(command);
        }
    }
    if (tasks.length > 0) {
        const taskResults = await Promise.all(tasks);
        for (const result of taskResults) {
            if (result) commands.push(result);
        }
    }
    return commands;
}
        
async function createSvgArtFilesForComponentAndGiveExportCommands(compositions, componentArtdata, uniqueComponentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache = new SvgFileCache(), glyphUnicodeMap = {}) {
    const tasks = [];
    var commands = [];

    // Create output directory once at the beginning

    if (produceProperties.renderMode !== RENDER_MODE.RENDER_TO_CACHE) {
        await fsExtra.ensureDir(componentBackOutputDirectory);
    }

    for (const pieceGamedata of piecesDataBlob) {
        const pieceHash = createUniqueBackHashForPiece(uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData, pieceGamedata);
        if (pieceHash !== uniqueComponentBackData.pieceUniqueBackHash) {
            continue;
        }
        
        if ("quantity" in pieceGamedata && pieceGamedata.quantity === 0) {
            console.log(`Skipping ${pieceGamedata.name} as it has a quantity of 0.`);
            continue;
        }
        
        // Create a pieceData object with the same properties as uniqueComponentBackData plus pieceData
        const pieceData = {
            ...uniqueComponentBackData,
            pieceData: pieceGamedata
        };

        if ("Front" in componentArtdata.artDataBlobDictionary) {
            const task = createSvgArtFileOfPieceAndGiveCommand(compositions, componentArtdata.artDataBlobDictionary["Front"], pieceData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache, glyphUnicodeMap, "Front");
            if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                const command = await task;
                if (command) commands.push(command);
            }
        }
        if ("DieFace" in componentArtdata.artDataBlobDictionary) {
            const task = createSvgArtFileOfPieceAndGiveCommand(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache, glyphUnicodeMap, "DieFace");
            if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                const command = await task;
                if (command) commands.push(command);
            }
        }
        
        // If needsPieceNameAsBackName, that means that this componentBack has only 1 item in it, so we can use the piece name as the back name
        const needsPieceNameAsBackName = uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData.includes("name");
        if (needsPieceNameAsBackName) {
            uniqueComponentBackData.componentBackDataBlob.name = pieceGamedata["name"];
        } else {
            uniqueComponentBackData.componentBackDataBlob.name = "back";
        }
    }

    if ("Back" in componentArtdata.artDataBlobDictionary) {
        const backNeedsPieceName = Array.isArray(uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData)
            && uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData.includes("name");
        let backGamedata = uniqueComponentBackData;
        if (backNeedsPieceName) {
            // Provide piece data context while keeping filename as "back"
            const representativePiece = piecesDataBlob.find(p => createUniqueBackHashForPiece(uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData, p) === uniqueComponentBackData.pieceUniqueBackHash);
            if (representativePiece) {
                backGamedata = { ...uniqueComponentBackData, pieceData: representativePiece };
            }
        }
        backGamedata.componentBackDataBlob.name = "back";
        const task = createSvgArtFileOfPieceAndGiveCommand(compositions, componentArtdata.artDataBlobDictionary["Back"], backGamedata, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache, glyphUnicodeMap, "Back");
        if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
            tasks.push(task);
        } else {
            const command = await task;
            if (command) commands.push(command);
        }
    }

    const taskResults = await Promise.all(tasks);
    // Collect commands from tasks that returned them
    for (const result of taskResults) {
        if (result) commands.push(result);
    }

    return commands;
}

async function createSvgArtFileOfPieceAndGiveCommand(compositions, artdata, gamedata, componentBackOutputDirectory, productionProperties, fontCache, svgFileCache = new SvgFileCache(), glyphUnicodeMap = {}, artType = null) {
    const initialMemory = process.memoryUsage();  // Optional: for memory tracking
    
    const templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"];
    if (artdata === null) {
      console.log(`!!! Missing artdata ${gamedata.componentDataBlob["name"]}`);
      return null;
    }
    const artFilename = `${artdata["templateFilename"]}.svg`;
    const artFilepath = path.normalize(path.join(productionProperties.inputDirectoryPath, templateFilesDirectory, artFilename));

    const componentType = compositions.componentCompose["type"]
    if (!(componentType in COMPONENT_INFO)) {
      throw new Error(`No image size for ${componentType}`);
    }
    const component = COMPONENT_INFO[componentType];
  
    let templateContent = await svgFileCache.readSvgFile(artFilepath);
    if (!templateContent) {
        const shortPath = path.basename(path.dirname(artFilepath)) + path.sep + path.basename(artFilepath);
        console.log(`!!! Template art file ${shortPath} does not exist.`);
        return null;
    }
  
    const isBackArt = artType === "Back";
    const pieceName = isBackArt
        ? gamedata.componentBackDataBlob["name"]
        : (gamedata.pieceData ? gamedata.pieceData["name"] : gamedata.componentBackDataBlob["name"]);
    const imageSizePixels = component["DimensionsPixels"];
  
    try {
      const pieceUniqueHash = gamedata.pieceUniqueBackHash !== '' ? `_${gamedata.pieceUniqueBackHash}` : '';
      const artFileOutputName = `${compositions.componentCompose['name']}${pieceUniqueHash}-${pieceName}`;

      const overlayFiles = await collectOverlayFiles(
          artdata["overlays"] || [], 
          compositions, 
          gamedata, 
          productionProperties,
          svgFileCache
      );

      // Create cache key from all inputs including overlays
      const inputHash = await createInputHash({
          artdata,
          gamedata,
          productionProperties,
          templateContent,
          templateFilePath: artFilepath,
          overlayFiles
      });

      // Check cache
      const cachedFiles = await getCachedFiles(inputHash);
      const hasCachedFiles = cachedFiles !== null;
      
      if (hasCachedFiles) {
        if (productionProperties.renderMode === RENDER_MODE.RENDER_TO_CACHE || componentBackOutputDirectory === null) {
            // We already have these files cached, and we are not export them
            return null;
        }
        const hasOutputDirectory = componentBackOutputDirectory !== null;
        if(productionProperties.renderMode !== RENDER_MODE.RENDER_EXPORT_WITHOUT_CACHE && hasOutputDirectory) {
            console.log(`Using cached version of ${pieceName}`);
            var absoluteOutputDirectoryPath = path.normalize(path.resolve(componentBackOutputDirectory));
            var outputArtFileOutputFilepath = path.join(absoluteOutputDirectoryPath, `${artFileOutputName}.png`);
            var outputArtFileOutputSvgFilepath = path.join(absoluteOutputDirectoryPath, `${artFileOutputName}.svg`);
            await fsExtra.copy(cachedFiles.svgPath, outputArtFileOutputSvgFilepath);
            await fsExtra.copy(cachedFiles.pngPath, outputArtFileOutputFilepath);
            return null;
        }
      }
      var absoluteEndResultDirectoryPath = path.normalize(path.resolve(componentBackOutputDirectory || await getRenderedPiecesCacheDir()));
      
      // If not cached, generate new files
      let contents = templateContent;

      const dom = new JSDOM(contents, { contentType: 'image/svg+xml' });
      const document = dom.window.document;
      
      await addOverlays(document, artdata["overlays"], compositions, gamedata, productionProperties, svgFileCache);
      await textReplaceInFile(document, artdata["textReplacements"], gamedata, productionProperties);
      await updateStylesInFile(document, artdata["styleUpdates"], gamedata);
      await replaceFormattingShortcutElementsWithTspansAsync(document);
      const iconGlyphPlaceholders = await replaceIconGlyphWithPuaCharsAsync(document, productionProperties.inputDirectoryPath, glyphUnicodeMap);
      await removeNamedViews(document);
      
    //   if (productionProperties.renderProgram === RENDER_PROGRAM.TEMPLATIVE && document.querySelector('[style*="shape-inside:url(#"]')) {
    //     await replaceShapeInsideTextElementsWithPositionedTspans(document);
    //   }
      const isClippingBorder = productionProperties.renderProgram === RENDER_PROGRAM.INKSCAPE;
      if (productionProperties.isClipped) {
        const componentTemplatesDirectoryPath = await getComponentTemplatesDirectoryPath(componentType);
        const clipSvgFilepath = path.join(componentTemplatesDirectoryPath, `${componentType}.svg`);
        try {
            
          await clipSvgContentToClipFile(document, clipSvgFilepath, CLIPPING_ELEMENT_ID, svgFileCache, isClippingBorder);
        } catch (error) {
            captureException(error);
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
      }
      if (productionProperties.renderProgram === RENDER_PROGRAM.INKSCAPE) {
        await scaleSvg(document, imageSizePixels);
      }
      
      contents = dom.serialize();
      contents = replacePlaceholdersWithUnicodeEntities(contents, iconGlyphPlaceholders);

      // Create and cache the files
      await outputSvgArtFile(contents, artFileOutputName, absoluteEndResultDirectoryPath);
      const absoluteSvgFilepath = path.join(absoluteEndResultDirectoryPath, `${artFileOutputName}.svg`);
      var absolutePngFilepath = path.join(absoluteEndResultDirectoryPath, `${artFileOutputName}.png`);
      
      return {
        hash: inputHash,
        imageSizePixels: imageSizePixels,
        svgFilepath: absoluteSvgFilepath,
        pngFilepath: absolutePngFilepath
      }
    } catch (error) {
      console.error(`Error producing ${pieceName}: ${error.message}`);
    //   console.error(error.stack);
      captureException(error);
      return null;
    }
}


module.exports = { createSvgArtFilesForPieceAndGiveExportCommands, createSvgArtFilesForComponentAndGiveExportCommands };
module.exports = { createSvgArtFilesForPieceAndGiveExportCommands, createSvgArtFilesForComponentAndGiveExportCommands };