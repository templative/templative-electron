const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const { COMPONENT_INFO } = require('../../../../../../shared/componentInfo.js');
const { convertSvgContentToPng } = require('./modules/fileConversion/svgConverter.js');

const { addNewlines } = require("./artdataProcessing/newlineInserter.js");
const { createArtfile} = require("./modules/artFileCreator.js");
const { addOverlays, collectOverlayFiles} = require("./artdataProcessing/overlayHandler.js");
const { textReplaceInFile} = require("./artdataProcessing/textReplacer.js");
const { updateStylesInFile} = require("./artdataProcessing/styleUpdater.js");
const { clipSvgContentToClipFile, CLIPPING_ELEMENT_ID } = require("./modules/imageClipper.js");
const { getComponentTemplateFilepath } = require("../../../componentTemplateUtility.js");
const { preprocessSvgText } = require('./modules/fileConversion/textWrapping/index.js');
const { SvgFileCache } = require('./modules/svgFileCache.js');
const { ArtCache } = require('./modules/artCache.js');

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
            tasks.push(task);
        }
        if ("DieFace" in componentArtdata.artDataBlobDictionary) {
            const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache);
            tasks.push(task);
        }
    }
    uniqueComponentBackData.componentBackDataBlob.name = "back";
    if ("Back" in componentArtdata.artDataBlobDictionary) {
        tasks.push(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Back"], uniqueComponentBackData, componentBackOutputDirectory, previewProperties, fontCache, svgFileCache));
    }

    await Promise.all(tasks);   
}
        
async function createArtFilesForComponent(compositions, componentArtdata, uniqueComponentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache = new SvgFileCache()) {
    const tasks = [];

    // Create output directory once at the beginning

    if (!produceProperties.isCacheOnly) {
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
            tasks.push(task);
        }
        if ("DieFace" in componentArtdata.artDataBlobDictionary) {
            const task = createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache);
            tasks.push(task);
        }
    }

    uniqueComponentBackData.componentBackDataBlob.name = "back";
    if ("Back" in componentArtdata.artDataBlobDictionary) {
        tasks.push(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Back"], uniqueComponentBackData, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache));
    }

    await Promise.all(tasks);
}

async function createArtFileOfPiece(compositions, artdata, gamedata, componentBackOutputDirectory, productionProperties, fontCache, svgFileCache = new SvgFileCache()) {
    const templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"];
    if (artdata === null) {
      console.log(`!!! Missing artdata ${gamedata.componentDataBlob["name"]}`);
      return;
    }
    const isCachingWithoutOutput = productionProperties.isCacheOnly || componentBackOutputDirectory === null;
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
      const artCache = new ArtCache();
      const inputHash = await artCache.createInputHash({
          artdata,
          gamedata,
          productionProperties,
          templateContent,
          templateFilePath: artFilepath,
          overlayFiles
      });

      // Check cache
      const cachedFiles = await artCache.getCachedFiles(inputHash);
      var absoluteOutputDirectory = path.normalize(path.resolve(componentBackOutputDirectory || artCache.cacheDir));
      var absoluteArtFileOutputFilepath = path.join(absoluteOutputDirectory, `${artFileOutputName}.png`);

      if (cachedFiles) {
        if (!isCachingWithoutOutput) {
            const absoluteArtFileOutputSvgFilepath = path.join(absoluteOutputDirectory, `${artFileOutputName}.svg`);
            console.log(`Using cached version of ${pieceName}`);
            await fsExtra.copy(cachedFiles.svgPath, absoluteArtFileOutputSvgFilepath);
            await fsExtra.copy(cachedFiles.pngPath, absoluteArtFileOutputFilepath);
        }
        return;
      }

      // If not cached, generate new files
      let contents = templateContent;
      contents = await addOverlays(contents, artdata["overlays"], compositions, gamedata, productionProperties, svgFileCache);
      contents = await textReplaceInFile(contents, artdata["textReplacements"], gamedata, productionProperties);
      contents = await updateStylesInFile(contents, artdata["styleUpdates"], gamedata);
      contents = await addNewlines(contents);
      contents = await preprocessSvgText(contents);
      
      if (productionProperties.isClipped) {
          const potentialPaths = await getComponentTemplateFilepath(componentType);
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
      await createArtfile(contents, artFileOutputName, imageSizePixels, absoluteOutputDirectory);
      await convertSvgContentToPng(contents, imageSizePixels, absoluteArtFileOutputFilepath);

      await artCache.cacheFiles(inputHash, contents, absoluteArtFileOutputFilepath);
      console.log(`Produced ${pieceName}`);
    } catch (error) {
      console.error(`Error producing ${pieceName}: ${error.message}`);
      console.error(error.stack);
    }
}


module.exports = { createArtFileForPiece, createArtFilesForComponent, createArtFileOfPiece };