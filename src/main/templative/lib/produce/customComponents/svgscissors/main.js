const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const { COMPONENT_INFO } = require('../../../../../../shared/componentInfo.js');
const { convertSvgContentToPng } = require('./modules/fileConversion/svgConverter.js');

const { addNewlines } = require("./artdataProcessing/newlineInserter.js");
const { createArtfile} = require("./modules/artFileCreator.js");
const { addOverlays} = require("./artdataProcessing/overlayHandler.js");
const { textReplaceInFile} = require("./artdataProcessing/textReplacer.js");
const { updateStylesInFile} = require("./artdataProcessing/styleUpdater.js");
const { clipSvgContentToClipFile, CLIPPING_ELEMENT_ID } = require("./modules/imageClipper.js");
const { getComponentTemplate } = require("../../../componentTemplateUtility.js");
const { preprocessSvgText } = require('./modules/fileConversion/textWrapping/index.js');
const { SvgFileCache } = require('./modules/svgFileCache.js');

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
    await fsExtra.ensureDir(componentBackOutputDirectory);

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

/**
 * Create an art file of a piece
 * @param {Object} compositions - Component compositions
 * @param {Object} artdata - Art data
 * @param {Object} gamedata - Game data
 * @param {string} componentBackOutputDirectory - Output directory
 * @param {Object} productionProperties - Production properties
 * @param {Object} fontCache - Font cache instance
 * @param {Object} svgFileCache - SVG file cache instance
 * @returns {Promise<void>}
 */
async function createArtFileOfPiece(compositions, artdata, gamedata, componentBackOutputDirectory, productionProperties, fontCache, svgFileCache = new SvgFileCache()) {
    const templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"];
    if (artdata === null) {
      console.log(`!!! Missing artdata ${gamedata.componentDataBlob["name"]}`);
      return;
    }
    const artFilename = `${artdata["templateFilename"]}.svg`;
    const artFilepath = path.normalize(path.join(productionProperties.inputDirectoryPath, templateFilesDirectory, artFilename));
    if (!await fsExtra.pathExists(artFilepath)) {
      console.log(`!!! Template art file ${artFilepath} does not exist.`);
      return;
    }
    const componentType = compositions.componentCompose["type"]
  
    if (!(componentType in COMPONENT_INFO)) {
      throw new Error(`No image size for ${componentType}`);
    }
    const component = COMPONENT_INFO[componentType];
  
    let contents = null;
    try {
      contents = await svgFileCache.readSvgFile(artFilepath);
    } catch (e) {
      console.log(`!!! Template art file ${artFilepath} cannot be parsed. Error: ${e}`);
      return;
    }
  
    const pieceName = gamedata.pieceData ? gamedata.pieceData["name"] : gamedata.componentBackDataBlob["name"];
    const imageSizePixels = component["DimensionsPixels"];
  
    try {
      contents = await addOverlays(contents, artdata["overlays"], compositions, gamedata, productionProperties, svgFileCache);
      contents = await textReplaceInFile(contents, artdata["textReplacements"], gamedata, productionProperties);
      contents = await updateStylesInFile(contents, artdata["styleUpdates"], gamedata);
      contents = await addNewlines(contents);
      contents = await preprocessSvgText(contents);
      
      if (productionProperties.isClipped) {
        const clipSvgFilepath = await getComponentTemplate(componentType);
        contents = await clipSvgContentToClipFile(contents, clipSvgFilepath, CLIPPING_ELEMENT_ID, svgFileCache);
      }
      
      const pieceUniqueHash = gamedata.pieceUniqueBackHash !== '' ? `_${gamedata.pieceUniqueBackHash}` : '';
      const artFileOutputName = `${compositions.componentCompose['name']}${pieceUniqueHash}-${pieceName}`;
      
      await createArtfile(contents, artFileOutputName, imageSizePixels, componentBackOutputDirectory);
      
      const absoluteOutputDirectory = path.normalize(path.resolve(componentBackOutputDirectory))
      const absoluteArtFileOutputFilepath = path.join(absoluteOutputDirectory, `${artFileOutputName}.png`)
      await convertSvgContentToPng(contents, imageSizePixels, absoluteArtFileOutputFilepath);

      console.log(`Produced ${pieceName}.`);
    } catch (error) {
      console.error(`Error producing ${pieceName}: ${error.message}`);
      console.error(error.stack);
    }
  }


module.exports = { createArtFileForPiece, createArtFilesForComponent, createArtFileOfPiece };