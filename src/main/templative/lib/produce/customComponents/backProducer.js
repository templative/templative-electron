const { Producer } = require('./producer');
const outputWriter = require('../outputWriter');
const svgscissors = require('./svgscissors/svgScissors');
const svgscissorsMain = require('./svgscissors/main');
const os = require('os');
const { createHash } = require('crypto');
const path = require('path');
const defineLoader = require('../../manage/defineLoader');
const { FontCache } = require('./svgscissors/fontCache');
const { COMPONENT_INFO } = require('../../../../../shared/componentInfo');
const { ComponentBackData } = require('../../manage/models/gamedata');
const chalk = require('chalk');

class BackProducer extends Producer {
    static async createPiecePreview(previewProperties, componentComposition, componentData, componentArtdata, fontCache) {
        const componentTypeInfo = COMPONENT_INFO[componentComposition.componentCompose["type"]];
        const defaultPieceGamedataBlob = [{ 
            "name": componentComposition.componentCompose["name"],
            "quantity": 1, 
        }];
        let piecesDataBlob = defaultPieceGamedataBlob;
        if (componentTypeInfo["HasPieceData"]) {
            piecesDataBlob = await defineLoader.loadPiecesGamedata(previewProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"]);
            if (!piecesDataBlob || Object.keys(piecesDataBlob).length === 0) {
                console.log(`Skipping ${componentComposition.componentCompose["name"]} component due to missing pieces gamedata.`);
                return;
            }
        }

        const sourcedVariableNamesSpecificToPieceOnBackArtData = BackProducer.getSourcedVariableNamesSpecificToPieceOnBackArtdata(componentArtdata.artDataBlobDictionary["Back"]);

        let uniqueComponentBackData = {};
        var foundPiece = false;
        for (const pieceGamedata of piecesDataBlob) {
            if (pieceGamedata["name"] !== previewProperties.pieceName) {
                continue;
            }
            foundPiece = true;
            const uniqueHashOfSourceData = BackProducer.createUniqueBackHashForPiece(sourcedVariableNamesSpecificToPieceOnBackArtData, pieceGamedata);
            const componentBackDataBlob = {};
            for (const sourcedVariable of sourcedVariableNamesSpecificToPieceOnBackArtData) {
                componentBackDataBlob[sourcedVariable] = pieceGamedata[sourcedVariable];
            }

            uniqueComponentBackData = new ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob, componentBackDataBlob, sourcedVariableNamesSpecificToPieceOnBackArtData, uniqueHashOfSourceData);
            
            await svgscissorsMain.createArtFileForPiece(componentComposition, componentArtdata, uniqueComponentBackData, piecesDataBlob, previewProperties.outputDirectoryPath, previewProperties, fontCache);
        }
        if (!foundPiece) {
            console.warn(chalk.yellow(`There is no piece named ${previewProperties.pieceName} in the pieces gamedata for ${componentComposition.componentCompose["name"]}.`));
        }
    }
    
    static async createComponent(produceProperties, componentComposition, componentData, componentArtdata, fontCache) {
        const componentTypeInfo = COMPONENT_INFO[componentComposition.componentCompose["type"]];
        const defaultPieceGamedataBlob = [{ 
            "name": componentComposition.componentCompose["name"], 
            "quantity": 1, 
        }];
        let piecesDataBlob = defaultPieceGamedataBlob;
        if (componentTypeInfo["HasPieceData"]) {
            piecesDataBlob = await defineLoader.loadPiecesGamedata(produceProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"]);
            if (!piecesDataBlob || Object.keys(piecesDataBlob).length === 0) {
                console.log(`Skipping ${componentComposition.componentCompose["name"]} component due to missing pieces gamedata.`);
                return;
            }
        }

        const sourcedVariableNamesSpecificToPieceOnBackArtData = BackProducer.getSourcedVariableNamesSpecificToPieceOnBackArtdata(componentArtdata.artDataBlobDictionary["Back"]);
        
        const uniqueComponentBackDatas = BackProducer.createNewComponentBackPerUniqueBackGamedata(sourcedVariableNamesSpecificToPieceOnBackArtData, componentData, piecesDataBlob);
       
        for (const key in uniqueComponentBackDatas) {
            const uniqueComponentBackData = uniqueComponentBackDatas[key];
            let needsToProduceAPiece = false;
            for (const piece of piecesDataBlob) {
                const pieceHash = BackProducer.createUniqueBackHashForPiece(sourcedVariableNamesSpecificToPieceOnBackArtData, piece);
                if (pieceHash === uniqueComponentBackData.pieceUniqueBackHash && "quantity" in piece && piece["quantity"] > 0) {
                    needsToProduceAPiece = true;
                    break;
                }
            }
            if (!needsToProduceAPiece) {
                const skippedPieces = [];
                for (const piece of piecesDataBlob) {
                    const pieceHash = BackProducer.createUniqueBackHashForPiece(sourcedVariableNamesSpecificToPieceOnBackArtData, piece);
                    if (pieceHash !== uniqueComponentBackData.pieceUniqueBackHash) {
                        continue;
                    }
                    skippedPieces.push(piece["name"]);
                }
                console.log(`Skipping ${componentComposition.componentCompose['name']}${uniqueComponentBackData.pieceUniqueBackHash} due to not have pieces to make. Skipped the following peices: ${skippedPieces}`);
                continue;
            }
            await BackProducer.createComponentBackDataPieces(uniqueComponentBackData, sourcedVariableNamesSpecificToPieceOnBackArtData, componentComposition, produceProperties, componentArtdata, piecesDataBlob, fontCache);
        }
    }
    
    static getSourcedVariableNamesSpecificToPieceOnBackArtdata(componentBackArtdata) {
        const keys = [];
        for (const textReplacement of componentBackArtdata["textReplacements"]) {
            if (textReplacement["scope"] !== "piece") {
                continue;
            }
            keys.push(textReplacement["source"]);
        }
        for (const overlay of componentBackArtdata["overlays"]) {
            if (overlay["scope"] !== "piece") {
                continue;
            }
            keys.push(overlay["source"]);
        }
        for (const styleUpdate of componentBackArtdata["styleUpdates"]) {
            if (styleUpdate["scope"] !== "piece") {
                continue;
            }
            keys.push(styleUpdate["source"]);
        }
        return keys;
    }
    
    static createNewComponentBackPerUniqueBackGamedata(sourcedVariableNamesSpecificToPieceOnBackArtData, componentData, piecesDataBlob) {
        const uniqueComponentBackDatas = {};
        for (const pieceGamedata of piecesDataBlob) {
            const uniqueHashOfSourceData = BackProducer.createUniqueBackHashForPiece(sourcedVariableNamesSpecificToPieceOnBackArtData, pieceGamedata);
            const componentBackDataBlob = {};
            for (const sourcedVariable of sourcedVariableNamesSpecificToPieceOnBackArtData) {
                componentBackDataBlob[sourcedVariable] = pieceGamedata[sourcedVariable];
            }

            uniqueComponentBackDatas[uniqueHashOfSourceData] = new ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob, componentBackDataBlob, sourcedVariableNamesSpecificToPieceOnBackArtData, uniqueHashOfSourceData);
        }
        return uniqueComponentBackDatas;
    }

    static createUniqueBackHashForPiece(pieceSpecificBackArtDataSources, pieceGamedata) {
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

    static async createComponentBackDataPieces(uniqueComponentBackData, sourcedVariableNamesSpecificToPieceOnBackArtData, compositions, produceProperties, componentArtdata, piecesDataBlob, fontCache) {
        const pieceUniqueBackHash = uniqueComponentBackData.pieceUniqueBackHash ? `_${uniqueComponentBackData.pieceUniqueBackHash}` : '';
        const componentFolderName = `${compositions.componentCompose['name']}${pieceUniqueBackHash}`;

        const componentBackOutputDirectory = await outputWriter.createComponentFolder(componentFolderName, produceProperties.outputDirectoryPath);
        await BackProducer.createUniqueComponentBackInstructions(uniqueComponentBackData, sourcedVariableNamesSpecificToPieceOnBackArtData, compositions, componentBackOutputDirectory, componentFolderName, piecesDataBlob);
        await svgscissorsMain.createArtFilesForComponent(compositions, componentArtdata, uniqueComponentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache);
    }

    static async createUniqueComponentBackInstructions(uniqueComponentBackData, sourcedVariableNamesSpecificToPieceOnBackArtData, compositions, componentBackOutputDirectory, componentFolderName, piecesGamedata) {
        const componentInstructionFilepath = path.join(componentBackOutputDirectory, "component.json");
        const frontInstructionSets = await BackProducer.getInstructionSetsForFilesForBackArtdataHash(uniqueComponentBackData.pieceUniqueBackHash, sourcedVariableNamesSpecificToPieceOnBackArtData, componentFolderName, piecesGamedata, componentBackOutputDirectory);
        const backInstructionSetFilepath = await BackProducer.getBackInstructionSetFilepath(componentFolderName, componentBackOutputDirectory);
        
        const componentInstructions = {
            "name": compositions.componentCompose["name"],
            "uniqueName": componentFolderName,
            "isDebugInfo": "isDebugInfo" in compositions.componentCompose ? compositions.componentCompose["isDebugInfo"] : false,
            "type": compositions.componentCompose["type"],
            "quantity": compositions.componentCompose["quantity"],
            "frontInstructions": frontInstructionSets,
            "backInstructions": backInstructionSetFilepath
        };
        await outputWriter.dumpInstructions(componentInstructionFilepath, componentInstructions);
    }

    static async getInstructionSetsForFilesForBackArtdataHash(uniqueComponentBackHash, sourcedVariableNamesSpecificToPieceOnBackArtData, componentBackName, piecesGamedataBlog, componentBackFilepath) {
        const instructionSets = [];
        for (const pieceGamedata of piecesGamedataBlog) {
            if (pieceGamedata["quantity"] === 0) {
                continue;
            }
            const pieceUniqueBackHash = BackProducer.createUniqueBackHashForPiece(sourcedVariableNamesSpecificToPieceOnBackArtData, pieceGamedata);
            const isPieceInComponentBack = uniqueComponentBackHash === pieceUniqueBackHash;
            if (!isPieceInComponentBack) {
                continue;
            }
            const filename = `${componentBackName}-${pieceGamedata["name"]}.png`;
            const artFilepath = path.resolve(path.join(componentBackFilepath, filename));
            instructionSets.push({"name": pieceGamedata["name"], "filepath": artFilepath, "quantity": pieceGamedata["quantity"]});
        }

        return instructionSets;
    }

    static async getBackInstructionSetFilepath(componentName, componentFilepath) {
        const filename = `${componentName}-back.png`;
        const backFilepath = path.resolve(path.join(componentFilepath, filename));
        return {"name": filename, "filepath": backFilepath};
    }
}

module.exports = { BackProducer };