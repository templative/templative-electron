const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const { JSDOM } = require('jsdom');
const { COMPONENT_INFO } = require('../../../../../../shared/componentInfo.js');
const { convertSvgContentToPngUsingResvg } = require('./fileConversion/svgToRasterConverter.js');
const { addNewlines } = require("./artdataProcessing/newlineInserter.js");
const { outputSvgArtFile} = require("./fileConversion/svgArtExporter.js");
const { addOverlays, collectOverlayFiles} = require("./artdataProcessing/overlayHandler.js");
const { textReplaceInFile} = require("./artdataProcessing/textReplacer.js");
const { updateStylesInFile} = require("./artdataProcessing/styleUpdater.js");
const { clipSvgContentToClipFile, CLIPPING_ELEMENT_ID } = require("./artdataProcessing/imageClipper.js");
const { getComponentTemplatesDirectoryPath } = require("../../../componentTemplateUtility.js");
const { SvgFileCache } = require('./caching/svgFileCache.js');
const { createInputHash, getCachedFiles, getRenderedPiecesCacheDir, cacheFiles } = require('./caching/renderedPiecesCache.js');
const { RENDER_MODE, RENDER_PROGRAM, OVERLAPPING_RENDERING_TASKS } = require('../../../manage/models/produceProperties');
const { cleanupSvgNamespacesAsync, cleanupUnusedDefs } = require('./artdataProcessing/svgCleaner.js');
const { replaceShapeInsideTextElementsWithPositionedTspans } = require('./artdataProcessing/shapeInsideReplacer.js');
const { replaceIconGlyphWithPuaCharsAsync } = require('./artdataProcessing/iconGlyphReplacer');
const { replaceFormattingShortcutElementsWithTspansAsync } = require('./artdataProcessing/formattingShortcutReplacer');
const { captureException } = require('../../../sentryElectronWrapper.js');
const { exportSvgToPngUsingInkscape } = require('./fileConversion/inkscapeProcessor.js');

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

async function createArtFileForPiece(compositions, componentArtdata, uniqueComponentBackData, piecesDataBlob, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache = new SvgFileCache()) {
    const tasks = [];
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
            const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Front"], pieceData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache);
            if (previewProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                await task;
            }
        }
        if ("DieFace" in componentArtdata.artDataBlobDictionary) {
            const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache);
            if (previewProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                await task;
            }
        }
    }
    uniqueComponentBackData.componentBackDataBlob.name = "back";
    if ("Back" in componentArtdata.artDataBlobDictionary) {
        const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Back"], uniqueComponentBackData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache);
        if (previewProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
            tasks.push(task);
        } else {
            await task;
        }
    }

    await Promise.all(tasks);   
}
        
async function createArtFilesForComponent(compositions, componentArtdata, uniqueComponentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache = new SvgFileCache()) {
    const tasks = [];

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
            const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Front"], pieceData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache);
            if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                await task;
            }
        }
        if ("DieFace" in componentArtdata.artDataBlobDictionary) {
            const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache);
            if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
                tasks.push(task);
            } else {
                await task;
            }
        }
    }

    uniqueComponentBackData.componentBackDataBlob.name = "back";
    if ("Back" in componentArtdata.artDataBlobDictionary) {
        const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Back"], uniqueComponentBackData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache);
        if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE) {
            tasks.push(task);
        } else {
            await task;
        }
    }

    await Promise.all(tasks);
}

async function createArtFileOfPiece(compositions, artdata, gamedata, componentBackOutputDirectory, productionProperties, fontCache, svgFileCache = new SvgFileCache()) {
    const initialMemory = process.memoryUsage();  // Optional: for memory tracking
    
    const templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"];
    if (artdata === null) {
      console.log(`!!! Missing artdata ${gamedata.componentDataBlob["name"]}`);
      return;
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
        return;
    }
  
    const pieceName = gamedata.pieceData ? gamedata.pieceData["name"] : gamedata.componentBackDataBlob["name"];
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
            return;
        }
        const hasOutputDirectory = componentBackOutputDirectory !== null;
        if(productionProperties.renderMode !== RENDER_MODE.RENDER_EXPORT_WITHOUT_CACHE && hasOutputDirectory) {
            console.log(`Using cached version of ${pieceName}`);
            var absoluteOutputDirectoryPath = path.normalize(path.resolve(componentBackOutputDirectory));
            var outputArtFileOutputFilepath = path.join(absoluteOutputDirectoryPath, `${artFileOutputName}.png`);
            var outputArtFileOutputSvgFilepath = path.join(absoluteOutputDirectoryPath, `${artFileOutputName}.svg`);
            await fsExtra.copy(cachedFiles.svgPath, outputArtFileOutputSvgFilepath);
            await fsExtra.copy(cachedFiles.pngPath, outputArtFileOutputFilepath);
            return;
        }
      }
      var absoluteEndResultDirectoryPath = path.normalize(path.resolve(componentBackOutputDirectory || getRenderedPiecesCacheDir()));
      
      // If not cached, generate new files
      let contents = templateContent;
      contents = await addOverlays(contents, artdata["overlays"], compositions, gamedata, productionProperties, svgFileCache);
      contents = await textReplaceInFile(contents, artdata["textReplacements"], gamedata, productionProperties);
      contents = await updateStylesInFile(contents, artdata["styleUpdates"], gamedata);
      contents = await addNewlines(contents);
      contents = await cleanupSvgNamespacesAsync(contents);
      const dom = new JSDOM(contents, { contentType: 'image/svg+xml' });
      const document = dom.window.document;
      
      await replaceFormattingShortcutElementsWithTspansAsync(document);
      await replaceIconGlyphWithPuaCharsAsync(document, productionProperties.inputDirectoryPath);
    //   if (productionProperties.renderProgram === RENDER_PROGRAM.TEMPLATIVE && contents.includes('shape-inside:url(#')) {
    //     await replaceShapeInsideTextElementsWithPositionedTspans(document);
    //   }
      await cleanupUnusedDefs(document);
      contents = dom.serialize();
      
      if (productionProperties.isClipped) {
        const potentialPaths = await getComponentTemplatesDirectoryPath(componentType);
        const clipSvgFilepath = path.join(potentialPaths, `${componentType}.svg`);
        try {
          contents = await clipSvgContentToClipFile(contents, clipSvgFilepath, CLIPPING_ELEMENT_ID, svgFileCache);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }
      // Create and cache the files
      await outputSvgArtFile(contents, artFileOutputName, imageSizePixels, absoluteEndResultDirectoryPath);
      const absoluteSvgFilepath = path.join(absoluteEndResultDirectoryPath, `${artFileOutputName}.svg`);
      var absolutePngFilepath = path.join(absoluteEndResultDirectoryPath, `${artFileOutputName}.png`);
      if (productionProperties.renderProgram === RENDER_PROGRAM.INKSCAPE) {
        await exportSvgToPngUsingInkscape(absoluteSvgFilepath, absolutePngFilepath);
      }
      else {
        await convertSvgContentToPngUsingResvg(contents, imageSizePixels, absolutePngFilepath);
      }

      await cacheFiles(inputHash, contents, absolutePngFilepath);
      console.log(`Produced ${pieceName}`);
      
      // Optional: Log memory usage
      const finalMemory = process.memoryUsage();
      console.debug('Memory usage (MB):', {
          heapDiff: (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024,
          current: finalMemory.heapUsed / 1024 / 1024,
      });
      
    } catch (error) {
      console.error(`Error producing ${pieceName}: ${error.message}`);
      console.error(error.stack);
    }
}


module.exports = { createArtFileForPiece, createArtFilesForComponent };