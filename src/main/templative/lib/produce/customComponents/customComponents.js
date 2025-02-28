const outputWriter = require('../outputWriter');
const svgscissors = require('./svgscissors/svgScissors');
const os = require('os');
const path = require('path');

const { ProduceProperties, PreviewProperties } = require('../../manage/models/produceProperties');
const { StudioData, GameData, ComponentData, ComponentBackData, PieceData } = require('../../manage/models/gamedata');
const ComponentComposition = require('../../manage/models/composition');
const ComponentArtdata = require('../../manage/models/artdata');
const defineLoader = require('../../manage/defineLoader');

const { COMPONENT_INFO } = require('../../componentInfo');

const { BackProducer } = require('./backProducer');
const { FrontOnlyProducer } = require('./frontOnlyProducer');
const { DiceProducer } = require('./diceProducer');
const { FontCache } = require('./svgscissors/fontCache');

async function getComponentArtdata(componentName, inputDirectoryPath, componentComposition) {
  const artDatas = {};
  const componentType = componentComposition.componentCompose["type"];
  for (const artDataTypeName of COMPONENT_INFO[componentType]["ArtDataTypeNames"]) {
    const artDataTypeFilepath = componentComposition.componentCompose[`artdata${artDataTypeName}Filename`];
    const artData = await defineLoader.loadArtdata(inputDirectoryPath, componentComposition.gameCompose["artdataDirectory"], artDataTypeFilepath);
    if (!artData) {
      console.log(`Skipping ${componentName} component due to missing ${artDataTypeName} art metadata.`);
    }
    artDatas[artDataTypeName] = artData;
  }

  return new ComponentArtdata(artDatas);
}

async function produceCustomComponent(produceProperties, gamedata, componentComposition, fontCache) {
  const componentName = componentComposition.componentCompose["name"];

  const componentDataBlob = await defineLoader.loadComponentGamedata(produceProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["componentGamedataFilename"]);
  if (!componentDataBlob || Object.keys(componentDataBlob).length === 0) {
    console.log(`Skipping ${componentName} component due to missing component gamedata.`);
    return;
  }

  const componentArtdata = await getComponentArtdata(componentName, produceProperties.inputDirectoryPath, componentComposition);
  if (componentArtdata === null) {
    return;
  }

  const componentData = new ComponentData(gamedata.studioDataBlob, gamedata.gameDataBlob, componentDataBlob);

  let producer = null;
  if ("Front" in componentArtdata.artDataBlobDictionary && Object.keys(componentArtdata.artDataBlobDictionary).length === 1) {
    producer = FrontOnlyProducer;
  } else if ("Back" in componentArtdata.artDataBlobDictionary) {
    producer = BackProducer;
  } else if ("DieFace" in componentArtdata.artDataBlobDictionary && Object.keys(componentArtdata.artDataBlobDictionary).length === 1) {
    producer = DiceProducer;
  } else {
    console.log(`No production instructions for ${componentComposition.componentCompose["type"]} ${componentComposition.componentCompose["name"]}.`);
    return;
  }

  console.log(`Creating art assets for ${componentName} component.`);
  await producer.createComponent(produceProperties, componentComposition, componentData, componentArtdata, fontCache);
}

async function produceCustomComponentPreview(previewProperties, gamedata, componentComposition, fontCache) {
  const componentName = componentComposition.componentCompose["name"];

  const componentDataBlob = await defineLoader.loadComponentGamedata(previewProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["componentGamedataFilename"]);
  if (!componentDataBlob || Object.keys(componentDataBlob).length === 0) {
    console.log(`Skipping ${componentName} component due to missing component gamedata.`);
    return;
  }

  const componentArtdata = await getComponentArtdata(componentName, previewProperties.inputDirectoryPath, componentComposition);
  if (componentArtdata === null) {
    return;
  }

  const componentData = new ComponentData(gamedata.studioDataBlob, gamedata.gameDataBlob, componentDataBlob);

  let producer = null;
  if ("Front" in componentArtdata.artDataBlobDictionary && Object.keys(componentArtdata.artDataBlobDictionary).length === 1) {
    producer = FrontOnlyProducer;
  } else if ("Back" in componentArtdata.artDataBlobDictionary) {
    producer = BackProducer;
  } else if ("DieFace" in componentArtdata.artDataBlobDictionary && Object.keys(componentArtdata.artDataBlobDictionary).length === 1) {
    producer = DiceProducer;
    console.log("Previews for dice are disabled since they dont piece filtering");
    return;
  } else {
    console.log(`No production instructions for ${componentComposition.componentCompose["type"]} ${componentComposition.componentCompose["name"]}.`);
    return;
  }
  console.log(`Creating art assets for ${componentName} component ${previewProperties.pieceName}.`);
  await producer.createPiecePreview(previewProperties, componentComposition, componentData, componentArtdata, fontCache);
}

module.exports = { produceCustomComponent, produceCustomComponentPreview };