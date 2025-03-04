const templateComponentProjectUpdater = require('./templateComponentProjectUpdater');
const { aiArtGenerator } = require('../ai/aiArtGenerator');
const { loadGameCompose, loadComponentCompose } = require('../manage/defineLoader');
const { COMPONENT_INFO } = require('../../../../shared/componentInfo');
const { STOCK_COMPONENT_INFO } = require('../../../../shared/stockComponentInfo');
const { join } = require('path');

async function createComponentByType(gameRootDirectoryPath, name, type, componentAIDescription) {
    if (COMPONENT_INFO[type]) {
        await createCustomComponent(gameRootDirectoryPath, name, type, componentAIDescription);
        return;
    }
    
    if (STOCK_COMPONENT_INFO[type]) {
        await createStockComponent(gameRootDirectoryPath, name, type);
        return;
    }
    
    console.log(`Skipping ${name} component as we don't have component info on ${type}`);
}

async function createCustomComponent(gameRootDirectoryPath, name, type, componentAIDescription) {
    if (name == null || name === "") {
        console.log("Must include a name.");
        return;
    }
    
    if (type == null || type === "") {
        throw new Error("Must include a type.");
    }

    if (!COMPONENT_INFO[type]) {
        console.log(`Skipping ${name} component as we don't have component info on ${type}`);
        return;
    }
    
    const componentInfo = COMPONENT_INFO[type];

    const gameCompose = await loadGameCompose(gameRootDirectoryPath);
    const componentComposeData = await loadComponentCompose(gameRootDirectoryPath);
    await templateComponentProjectUpdater.addToComponentCompose(name, type, gameRootDirectoryPath, componentComposeData, componentInfo);

    const piecesDirectoryPath = join(gameRootDirectoryPath, gameCompose["piecesGamedataDirectory"]);
    const componentGamedataDirectoryPath = join(gameRootDirectoryPath, gameCompose["componentGamedataDirectory"]);
    const artdataDirectoryPath = join(gameRootDirectoryPath, gameCompose["artdataDirectory"]);
    const artTemplatesDirectoryPath = join(gameRootDirectoryPath, gameCompose["artTemplatesDirectory"]);
    const artOverlaysDirectoryPath = join(gameRootDirectoryPath, gameCompose["artInsertsDirectory"]);
    
    console.log(`Creating ${name} the ${type}.`);

    const files = [];

    const artdataFiles = await templateComponentProjectUpdater.createArtDataFiles(artdataDirectoryPath, name, componentInfo["ArtDataTypeNames"]);
    files.push(...artdataFiles);

    const componentFile = await templateComponentProjectUpdater.createComponentJson(componentGamedataDirectoryPath, name);
    files.push(componentFile);
    
    if (componentInfo["HasPieceData"]) {
        const hasPieceQuantity = componentInfo["HasPieceQuantity"];
        const piecesFile = await templateComponentProjectUpdater.createPiecesJson(
            piecesDirectoryPath, 
            name, 
            hasPieceQuantity,
            type
        );
        files.push(piecesFile);
    }

    const artFiles = await templateComponentProjectUpdater.createArtFiles(
        artTemplatesDirectoryPath, 
        name, 
        type, 
        componentInfo["ArtDataTypeNames"]
    );
    files.push(...artFiles);

    await templateComponentProjectUpdater.createOverlayFiles(artOverlaysDirectoryPath, type, {}, []);
}

async function createStockComponent(gameRootDirectoryPath, name, stockPartId) {
    if (name == null || name === "") {
        console.log("Must include a name.");
        return;
    }
    
    if (stockPartId == null || stockPartId === "") {
        throw new Error("Must include a type.");
    }
    
    if (!STOCK_COMPONENT_INFO[stockPartId]) {
        console.log(`Skipping ${name} component as we don't have component info on ${stockPartId}`);
        return;
    }

    const gameCompose = await loadGameCompose(gameRootDirectoryPath);
    const componentComposeData = await loadComponentCompose(gameRootDirectoryPath);
    await templateComponentProjectUpdater.addStockComponentToComponentCompose(name, stockPartId, gameRootDirectoryPath, componentComposeData);
}

module.exports = {
    createComponentByType,
    createCustomComponent,
    createStockComponent
};