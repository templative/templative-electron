const { Producer } = require('./producer');
const outputWriter = require('../outputWriter');
const svgscissors = require('./svgscissors/main');
const path = require('path');
const defineLoader = require('../../manage/defineLoader');
const { ComponentBackData } = require('../../manage/models/gamedata');

class DiceProducer extends Producer {
  static async createComponent(produceProperties, componentComposition, componentData, componentArtdata, fontCache) {
    const piecesDataBlob = await defineLoader.loadPiecesGamedata(produceProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"]);
    if (!piecesDataBlob || Object.keys(piecesDataBlob).length === 0) {
      console.log(`Skipping ${componentComposition.componentCompose["name"]} component due to missing pieces gamedata.`);
      return;
    }

    await DiceProducer.createComponentBackDataPieces(produceProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache);
  }

  static async createComponentBackDataPieces(produceProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache) {
    const componentFolderName = componentComposition.componentCompose["name"];
    
    const componentBackOutputDirectory = await outputWriter.createComponentFolder(componentFolderName, produceProperties.outputDirectoryPath);
    await DiceProducer.writeComponentInstructions(componentComposition, componentBackOutputDirectory, componentFolderName, piecesDataBlob);
    
    const componentBackData = new ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob);
    await svgscissors.createArtFilesForComponent(componentComposition, componentArtdata, componentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache);
  }

  static async writeComponentInstructions(compositions, componentBackOutputDirectory, componentFolderName, piecesGamedata) {
    const componentInstructionFilepath = path.join(componentBackOutputDirectory, "component.json");
    const dieFaceFilepaths = await DiceProducer.getDieFaceFilepaths(componentFolderName, piecesGamedata, componentBackOutputDirectory);
    
    const componentInstructions = {
      "name": componentFolderName,
      "isDebugInfo": compositions.componentCompose["isDebugInfo"] ? compositions.componentCompose["isDebugInfo"] : false,
      "type": compositions.componentCompose["type"],
      "quantity": compositions.componentCompose["quantity"],
      "dieFaceFilepaths": dieFaceFilepaths
    };
    await outputWriter.dumpInstructions(componentInstructionFilepath, componentInstructions);
  }

  static async getDieFaceFilepaths(componentName, piecesGamedata, componentArtDirectoryPath) {
    const filepaths = [];
    for (const pieceGamedata of piecesGamedata) {
      const filename = `${componentName}-${pieceGamedata["name"]}.png`;
      const artFilepath = path.resolve(path.join(componentArtDirectoryPath, filename));
      filepaths.push(artFilepath);
    }

    return filepaths;
  }
}

module.exports = { DiceProducer };
