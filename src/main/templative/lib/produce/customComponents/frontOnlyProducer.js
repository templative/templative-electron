const outputWriter = require('../outputWriter');
const svgscissors = require('./svgscissors/main');
const os = require('os');
const path = require('path');
const defineLoader = require('../../manage/defineLoader');
const { ComponentBackData } = require('../../manage/models/gamedata');
const { SvgFileCache } = require('./svgscissors/modules/svgFileCache');

class FrontOnlyProducer {
    static async createPiecePreview(previewProperties, componentComposition, componentData, componentArtdata, fontCache, svgFileCache = new SvgFileCache()) {
        const piecesDataBlob = await defineLoader.loadPiecesGamedata(previewProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"]);
        if (!piecesDataBlob || Object.keys(piecesDataBlob).length === 0) {
            console.log(`Skipping ${componentComposition.componentCompose["name"]} component due to missing pieces gamedata.`);
            return;
        }
        await FrontOnlyProducer.createPiece(previewProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache, svgFileCache);
    }
    
    static async createPiece(previewProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache, svgFileCache = new SvgFileCache()) {        
        const componentBackData = new ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob);
        await svgscissors.createArtFileForPiece(componentComposition, componentArtdata, componentBackData, piecesDataBlob, previewProperties.outputDirectoryPath, previewProperties, fontCache, svgFileCache);
    }

    static async createComponent(produceProperties, componentComposition, componentData, componentArtdata, fontCache, svgFileCache = new SvgFileCache()) {
        const piecesDataBlob = await defineLoader.loadPiecesGamedata(produceProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"]);
        if (!piecesDataBlob || Object.keys(piecesDataBlob).length === 0) {
            console.log(`Skipping ${componentComposition.componentCompose["name"]} component due to missing pieces gamedata.`);
            return;
        }

        await FrontOnlyProducer.createComponentPieces(produceProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache, svgFileCache);
    }

    static async createComponentPieces(produceProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache, svgFileCache = new SvgFileCache()) {
        const componentFolderName = componentComposition.componentCompose["name"];
        
        const componentBackOutputDirectory = await outputWriter.createComponentFolder(componentFolderName, produceProperties.outputDirectoryPath);
        await FrontOnlyProducer.writeComponentInstructions(componentComposition, componentBackOutputDirectory, componentFolderName, piecesDataBlob);
        
        const componentBackData = new ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob);
        await svgscissors.createArtFilesForComponent(componentComposition, componentArtdata, componentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache, svgFileCache);
    }

    static async writeComponentInstructions(compositions, componentBackOutputDirectory, componentFolderName, piecesGamedata) {
        if (!componentBackOutputDirectory) {
            return;
        }
        const componentInstructionFilepath = path.join(componentBackOutputDirectory, "component.json");
        const frontInstructions = await FrontOnlyProducer.getInstructionSetsForFilesForBackArtdataHash(componentFolderName, piecesGamedata, componentBackOutputDirectory);
        
        const componentInstructions = {
            "name": componentFolderName,
            "isDebugInfo": compositions.componentCompose["isDebugInfo"] ? compositions.componentCompose["isDebugInfo"] : false,
            "type": compositions.componentCompose["type"],
            "quantity": compositions.componentCompose["quantity"],
            "frontInstructions": frontInstructions
        };
        await outputWriter.dumpInstructions(componentInstructionFilepath, componentInstructions);
    }

    static async getInstructionSetsForFilesForBackArtdataHash(componentName, piecesGamedataBlog, componentFilepath) {
        const instructionSets = [];
        for (const pieceGamedata of piecesGamedataBlog) {
            if (pieceGamedata["quantity"] === 0) {
                continue;
            }
            const filename = `${componentName}-${pieceGamedata["name"]}.png`;
            const artFilepath = path.resolve(path.join(componentFilepath, filename));
            instructionSets.push({"name": pieceGamedata["name"], "filepath": artFilepath, "quantity": pieceGamedata["quantity"]});
        }

        return instructionSets;
    }
}

module.exports = { FrontOnlyProducer };
