
const path = require('path');
const { writeFileSync } = require('fs');
const { createHash } = require('crypto');
const { copyFrontImageToTextures, copyBackImageToTextures } = require('./packageFileManagement.js');
const { createCompositeImageInTextures } = require('./playgroundTextureMaker.js');
const { board, card, stockModel } = require('../playgroundTemplates/index.js');

const gameCrafterScaleToPlaygroundScale = 0.014;

async function createBoard(packageDirectoryPath, componentInstructions, componentTypeInfo) {
    const textureDirectory = path.join(packageDirectoryPath, "Textures");
    await copyFrontImageToTextures(componentInstructions["name"], componentInstructions["frontInstructions"][0], textureDirectory);
    await copyBackImageToTextures(componentInstructions["name"], componentInstructions["backInstructions"], textureDirectory);

    const componentGuid = createHash('md5').update(componentInstructions["name"]).digest('hex');
    const templateDirectory = path.join(packageDirectoryPath, "Templates");
    return await createBoardTemplateFile(templateDirectory, componentGuid, componentInstructions["name"], componentTypeInfo, componentInstructions["quantity"]);
}

async function createBoardTemplateFile(templateDirectoryPath, guid, name, componentTypeInfo, quantity) {
    const frontTextureName = `${name}-front.jpeg`;
    const backTextureName = `${name}-back.jpeg`;
    const cardTemplateData = createBoardTemplateData(guid, name, componentTypeInfo, quantity, frontTextureName, backTextureName);
    const templateFilepath = path.join(templateDirectoryPath, `${guid}.json`);
    writeFileSync(templateFilepath, JSON.stringify(cardTemplateData, null, 2));
    return cardTemplateData;
}

function createBoardTemplateData(guid, name, componentTypeInfo, quantity, frontTextureName, backTextureName) {    
    const scaleDown = gameCrafterScaleToPlaygroundScale / 53 * 1.5;
    const dimensions = [
        componentTypeInfo["DimensionsPixels"][0] * scaleDown,
        componentTypeInfo["DimensionsPixels"][1] * scaleDown
    ];
        
    return board.createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions);
}

async function createDeck(packageDirectoryPath, componentInstructions, componentTypeInfo) {
    const textureDirectory = path.join(packageDirectoryPath, "Textures");
    const [totalCount, cardColumnCount, cardRowCount] = await createCompositeImageInTextures(componentInstructions["name"], componentTypeInfo, componentInstructions["frontInstructions"], textureDirectory);
    await copyBackImageToTextures(componentInstructions["name"], componentInstructions["backInstructions"], textureDirectory);
    const componentGuid = createHash('md5').update(componentInstructions["name"]).digest('hex');
    const templateDirectory = path.join(packageDirectoryPath, "Templates");
    return await createCardTemplateFile(templateDirectory, componentGuid, componentInstructions["name"], componentTypeInfo, componentInstructions["quantity"], totalCount, cardColumnCount, cardRowCount);
}

async function createCardTemplateFile(templateDirectoryPath, guid, name, componentTypeInfo, componentQuantity, totalCount, cardColumnCount, cardRowCount) {
    const frontTextureName = `${name}-front.jpeg`;
    const backTextureName = `${name}-back.jpeg`;
    const cardTemplateData = createCardTemplateData(guid, name, componentTypeInfo, frontTextureName, componentQuantity, totalCount, cardColumnCount, cardRowCount, backTextureName);
    const templateFilepath = path.join(templateDirectoryPath, `${guid}.json`);
    writeFileSync(templateFilepath, JSON.stringify(cardTemplateData, null, 2));
    return cardTemplateData;
}

function createCardTemplateData(guid, name, componentTypeInfo, frontTextureName, componentQuantity, totalCount, cardColumnCount, cardRowCount, backTextureName) {    
    const dimensions = [
        componentTypeInfo["DimensionsPixels"][0] * gameCrafterScaleToPlaygroundScale, 
        componentTypeInfo["DimensionsPixels"][1] * gameCrafterScaleToPlaygroundScale, 
        componentTypeInfo["Thickness"]
    ];
    
    const indices = [];
    for (let i = 0; i < totalCount; i++) {
        indices.push(i);
    }

    return card.createCard(guid, name, frontTextureName, backTextureName, componentQuantity, cardColumnCount, cardRowCount, dimensions, componentTypeInfo["PlaygroundModel"], indices);
}

async function createStock(packageDirectoryPath, componentInstructions, stockPartInfo) {
    const guid = createHash('md5').update(componentInstructions["name"]).digest('hex');
    const stockTemplateData = await createStockTemplateData(guid, componentInstructions, stockPartInfo);

    const templateDirectory = path.join(packageDirectoryPath, "Templates");
    const templateFilepath = path.join(templateDirectory, `${guid}.json`);

    writeFileSync(templateFilepath, JSON.stringify(stockTemplateData, null, 2));
    
    return stockTemplateData;
}

async function createStockTemplateData(guid, componentInstructions, stockPartInfo) {
    const normalMap = stockPartInfo["PlaygroundNormalMap"] || "";
    const extraMap = stockPartInfo["PlaygroundExtraMap"] || "";
    const stockTemplateData = stockModel.createStockModel(componentInstructions["name"], guid, stockPartInfo["PlaygroundModelFile"], stockPartInfo["PlaygroundColor"], normalMap, extraMap, componentInstructions["quantity"]);

    if ("PlaygroundDieFaces" in stockPartInfo) {
        stockTemplateData["Faces"] = stockPartInfo["PlaygroundDieFaces"];
    }
    
    return stockTemplateData;
}

module.exports = {
    createBoard,
    createDeck,
    createStock
};
