const { basename } = require('path');
const { readFileSync, readdirSync } = require('fs');
const path = require('path');
const { createBoard, createDeck, createStock } = require('./deeper/templateMaker.js');
const { createGameStateVts } = require('./deeper/gameStateMaker.js');
const { createPackageDirectories, createManifest } = require('./deeper/packageFileManagement.js');

const { COMPONENT_INFO } = require('../../componentInfo.js');
const { STOCK_COMPONENT_INFO } = require('../../stockComponentInfo.js');

async function convertToTabletopPlayground(producedDirectoryPath, playgroundPackagesDirectory) {
    const uniqueGameName = basename(producedDirectoryPath);
    const packageDirectoryPath = await createPackageDirectories(uniqueGameName, playgroundPackagesDirectory);
    const packageGuid = await createManifest(uniqueGameName, packageDirectoryPath);
    const components = await copyComponentsToPackage(producedDirectoryPath, packageDirectoryPath);
    const defaultPlayerCount = 8;
    await createGameStateVts(uniqueGameName, packageGuid, components, defaultPlayerCount, packageDirectoryPath);
    return 1;
}

async function copyComponentsToPackage(producedDirectoryPath, packageDirectoryPath) {
    const templates = [];
    for (const directoryPath of readdirSync(producedDirectoryPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
        const componentDirectoryPath = `${producedDirectoryPath}/${directoryPath}`;
        const templateJson = await copyComponentToPackage(componentDirectoryPath, packageDirectoryPath);
        if (templateJson == null) {
            continue;
        }
        templates.push(templateJson);
    }
    return templates;
}

async function copyComponentToPackage(componentDirectoryPath, packageDirectoryPath) {
    let componentInstructions = null;
    const componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json");
    componentInstructions = JSON.parse(readFileSync(componentInstructionsFilepath, 'utf8'));
    
    const supportedInstructionTypes = {
        "DECK": createDeck,
        "BOARD": createDeck // createBoard
    };
    const componentType = componentInstructions["type"];
    const componentTypeTokens = componentType.split("_");
    const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK";
    if (isStockComponent) {
        if (!(componentTypeTokens[1] in STOCK_COMPONENT_INFO)) {
            console.log(`Missing stock info for ${componentTypeTokens[1]}.`);
            return null;
        }
        const stockComponentInfo = STOCK_COMPONENT_INFO[componentTypeTokens[1]];
        if (!("PlaygroundModelFile" in stockComponentInfo)) {
            console.log(`Skipping ${componentTypeTokens[1]} as it doesn't have a PlaygroundModelFile.`);
            return null;
        }
        return await createStock(packageDirectoryPath, componentInstructions, stockComponentInfo);
    }

    if (!(componentType in COMPONENT_INFO)) {
        console.log(`Missing component info for ${componentType}.`);
        return null;
    }
    const componentTypeInfo = COMPONENT_INFO[componentType];

    if (!("PlaygroundCreationTask" in componentTypeInfo)) {
        console.log(`Skipping ${componentType} that has no PlaygroundCreationTask.`);
        return null;
    }
    const playgroundTask = componentTypeInfo["PlaygroundCreationTask"];

    let totalCount = 0;
    for (const instruction of componentInstructions["frontInstructions"]) {
        totalCount += instruction["quantity"];
    }

    if (totalCount === 0) {
        console.log(`Skipping ${componentInstructions['name']} that has 0 total pieces.`);
        return null;
    }
    
    if (!(playgroundTask in supportedInstructionTypes)) {
        console.log(`Skipping unsupported ${playgroundTask}.`);
        return null;
    }
    const instruction = supportedInstructionTypes[playgroundTask];

    if (!("DimensionsPixels" in componentTypeInfo) || !("PlaygroundThickness" in componentTypeInfo)) {
        console.log(`Skipping ${componentType} with undefined size.`);
        return null;
    }
    
    return await instruction(packageDirectoryPath, componentInstructions, componentTypeInfo);
}

module.exports = {
    convertToTabletopPlayground,
    copyComponentsToPackage,
    copyComponentToPackage
};