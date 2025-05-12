const {captureMessage, captureException } = require("../../sentryElectronWrapper");
const { ComponentData,  } = require('../../manage/models/gamedata');
const ComponentArtdata = require('../../manage/models/artdata');
const defineLoader = require('../../manage/defineLoader');

const { COMPONENT_INFO } = require('../../../../../shared/componentInfo');

const { SvgFileCache } = require('./svgscissors/caching/svgFileCache');
const { BackProducer } = require('./backProducer');
const { FrontOnlyProducer } = require('./frontOnlyProducer');
const { DiceProducer } = require('./diceProducer');

function getProducer(componentArtdata) {
  if ("Front" in componentArtdata.artDataBlobDictionary && Object.keys(componentArtdata.artDataBlobDictionary).length === 1) {
    return FrontOnlyProducer;
  } else if ("Back" in componentArtdata.artDataBlobDictionary) {
    return BackProducer;
  } else if ("DieFace" in componentArtdata.artDataBlobDictionary && Object.keys(componentArtdata.artDataBlobDictionary).length === 1) {
    return DiceProducer;
  } else {
    return null;
  }
}
async function getComponentArtdata(componentName, inputDirectoryPath, componentComposition) {
  const artDatas = {};
  const componentType = componentComposition.componentCompose["type"];
  for (const artDataTypeName of COMPONENT_INFO[componentType]["ArtDataTypeNames"]) {
    const artDataTypeFilepath = componentComposition.componentCompose[`artdata${artDataTypeName}Filename`];
    const artData = await defineLoader.loadArtdata(inputDirectoryPath, componentComposition.gameCompose["artdataDirectory"], artDataTypeFilepath);
    if (!artData) {
      console.log(`Skipping ${componentName} component due to missing ${artDataTypeName} art recipe.`);
    }
    artDatas[artDataTypeName] = artData;
  }

  return new ComponentArtdata(artDatas);
}

async function produceCustomComponent(produceProperties, gamedata, componentComposition, fontCache, svgFileCache = new SvgFileCache()) {
  const componentName = componentComposition.componentCompose["name"];
  let componentDataBlob = null;
  try {
    componentDataBlob = await defineLoader.loadComponentGamedata(produceProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["componentGamedataFilename"]);
    if (!componentDataBlob || Object.keys(componentDataBlob).length === 0) {
      console.log(`Skipping ${componentName} component due to missing component gamedata.`);
      return;
    }
  } catch (error) {
    console.error(`Error producing custom component ${componentName}:`, error);
    captureException(error);
    return;
  }

  let componentArtdata = null;
  try {
    componentArtdata = await getComponentArtdata(componentName, produceProperties.inputDirectoryPath, componentComposition);
  } catch (error) {
    console.error(`Error producing custom component ${componentName}:`, error);
    return;
  }
  const componentData = new ComponentData(gamedata.studioDataBlob, gamedata.gameDataBlob, componentDataBlob);
  const producer = getProducer(componentArtdata);

  if (!producer) {
    console.log(`No production instructions for ${componentComposition.componentCompose["type"]} ${componentComposition.componentCompose["name"]}.`);
    return;
  }

  console.log(`Creating art assets for ${componentName} component.`);
  await producer.createComponent(produceProperties, componentComposition, componentData, componentArtdata, fontCache, svgFileCache);
}

async function produceCustomComponentPreview(previewProperties, gamedata, componentComposition, fontCache, svgFileCache = new SvgFileCache()) {
  const componentName = componentComposition.componentCompose["name"];
  const componentDataBlob = await defineLoader.loadComponentGamedata(previewProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["componentGamedataFilename"]);
  if (!componentDataBlob || Object.keys(componentDataBlob).length === 0) {
    console.log(`Skipping ${componentName} component due to missing component gamedata.`);
    return;
  }

  let componentArtdata = null;
  try {
    componentArtdata = await getComponentArtdata(componentName, previewProperties.inputDirectoryPath, componentComposition);
  } catch (error) {
    console.error(`Error producing custom component ${componentName}:`, error);
    return;
  }
  if (componentArtdata === null) {
    return;
  }
  const componentData = new ComponentData(gamedata.studioDataBlob, gamedata.gameDataBlob, componentDataBlob);
  const producer = getProducer(componentArtdata);

  if (!producer) {
    console.log(`No production instructions for ${componentComposition.componentCompose["type"]} ${componentComposition.componentCompose["name"]}.`);
    return;
  }

  if (producer === DiceProducer) {
    console.log("Previews for dice are disabled since they don't support piece filtering.");
    return;
  }

  console.log(`Creating art assets for ${componentName} component ${previewProperties.pieceName}.`);
  await producer.createPiecePreview(previewProperties, componentComposition, componentData, componentArtdata, fontCache, svgFileCache);
}

module.exports = { produceCustomComponent, produceCustomComponentPreview };
module.exports = { produceCustomComponent, produceCustomComponentPreview };