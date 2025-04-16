const os = require('os');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const glob = require('glob');
const Sentry = require('@sentry/electron/main');

const outputWriter = require('./outputWriter');
const rulesMarkdownProcessor = require('./rulesMarkdownProcessor');
const defineLoader = require('../manage/defineLoader');
const producerPicker = require('./customComponents/producerPicker');
const ProduceProperties = require('../manage/models/produceProperties').ProduceProperties;
const PreviewProperties = require('../manage/models/produceProperties').PreviewProperties;
const GameData = require('../manage/models/gamedata').GameData;
const ComponentComposition = require('../manage/models/composition');
const FontCache = require('./customComponents/svgscissors/fontCache').FontCache;
const { SvgFileCache } = require('./customComponents/svgscissors/modules/svgFileCache');

async function getPreviewsPath() {
    let base_path;
    if (process.resourcesPath) {
        base_path = process.resourcesPath;
    } else {
        base_path = path.resolve(".");
    }

    const previewsPath = path.join(base_path, "previews");
    try {
        await fsPromises.mkdir(previewsPath, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    return previewsPath;
}

async function clearPreviews(directoryPath) {
    const files = glob.sync(path.join(directoryPath, '*'));
    await Promise.all(files.map(filepath => fsPromises.unlink(filepath).catch(err => {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    })));
}

async function producePiecePreview(gameRootDirectoryPath, componentName, pieceName, language) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path is invalid.");
    }
    
    const gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath);
    const gameDataBlob = await defineLoader.loadGame(gameRootDirectoryPath);
    const studioDataBlob = await defineLoader.loadStudio(gameRootDirectoryPath);
    const componentsCompose = await defineLoader.loadComponentCompose(gameRootDirectoryPath);
    if (!gameCompose || !gameDataBlob || !studioDataBlob || !componentsCompose) {
        console.log(`!!! Malformed Templative Project. ${path.basename(gameRootDirectoryPath)} is missing: ${gameCompose ? "" : "game-compose.json "}${gameDataBlob ? "" : "game.json "}${studioDataBlob ? "" : "studio.json "}${componentsCompose ? "" : "component-compose.json "}`);
        return;
    }
    
    let component = null;
    for (const componentCompose of componentsCompose) {
        const isMatchingComponentFilter = componentCompose["name"] === componentName;
        if (!isMatchingComponentFilter) {
            continue;
        }
        component = componentCompose;
    }
    const componentComposition = new ComponentComposition(gameCompose, component);
    const gameData = new GameData(studioDataBlob, gameDataBlob);
    const outputDirectoryPath = await getPreviewsPath();
    await clearPreviews(outputDirectoryPath);
    const isClipped = false
    const previewProperties = new PreviewProperties(gameRootDirectoryPath, outputDirectoryPath, pieceName, language, isClipped);

    const fontCache = new FontCache();
    const svgFileCache = new SvgFileCache();
    
    await producerPicker.produceCustomComponentPreview(previewProperties, gameData, componentComposition, fontCache, svgFileCache);
    console.log(`Wrote previews to ${outputDirectoryPath}`);
}

async function produceGame(gameRootDirectoryPath, componentFilter, isSimple, isPublish, targetLanguage, isClipped=false, isCacheOnly=false) {
    const startTime = performance.now();
    
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path is invalid.");
    }

    
    let componentFilterString = "";
    if (componentFilter != null) {
        componentFilterString = `_${componentFilter}`;
    }
    
    const gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath);
    const gameDataBlob = await defineLoader.loadGame(gameRootDirectoryPath);
    const studioDataBlob = await defineLoader.loadStudio(gameRootDirectoryPath);
    const componentsCompose = await defineLoader.loadComponentCompose(gameRootDirectoryPath);
    if (!gameCompose || !gameDataBlob || !studioDataBlob || !componentsCompose) {
        console.log(`!!! Malformed Templative Project. ${path.basename(gameRootDirectoryPath)} is missing: ${gameCompose ? "" : "game-compose.json "}${gameDataBlob ? "" : "game.json "}${studioDataBlob ? "" : "studio.json "}${componentsCompose ? "" : "component-compose.json "}`);
        return;
    }
    
    console.log(`Producing ${path.basename(gameRootDirectoryPath)}.`);
    
    var outputDirectoryPath = null;
    if (!isCacheOnly) {
        const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-'); 
        const uniqueGameName = `${gameDataBlob['name']}_${gameDataBlob['versionName']}_${gameDataBlob['version']}_${timestamp}${componentFilterString}`.replace(/\s/g, "");
        
        // This stuff isnt typically stored in the game.json, but it is for exporting
        gameDataBlob["timestamp"] = timestamp;
        gameDataBlob["componentFilter"] = componentFilter;
        
        outputDirectoryPath = await outputWriter.createGameFolder(gameRootDirectoryPath, gameCompose["outputDirectory"], uniqueGameName);
        await outputWriter.updateLastOutputFolder(gameRootDirectoryPath, gameCompose["outputDirectory"], outputDirectoryPath);
        
        const gameTasks = [];
        gameTasks.push(outputWriter.copyGameFromGameFolderToOutput(gameDataBlob, outputDirectoryPath));
        gameTasks.push(outputWriter.copyStudioFromGameFolderToOutput(studioDataBlob, outputDirectoryPath));
        gameTasks.push(produceRules(gameRootDirectoryPath, outputDirectoryPath));
        
        await Promise.all(gameTasks);
    }
    

    const gameData = new GameData(studioDataBlob, gameDataBlob);
    const produceProperties = new ProduceProperties(gameRootDirectoryPath, outputDirectoryPath, isPublish, isSimple, targetLanguage, isClipped, isCacheOnly);
    
    const fontCache = new FontCache();
    const svgFileCache = new SvgFileCache();
    
    const componentTasks = [];
    
    for (const componentCompose of componentsCompose) {
        const isProducingOneComponent = componentFilter != null;
        const isMatchingComponentFilter = isProducingOneComponent && componentCompose["name"] === componentFilter;
        if (!isMatchingComponentFilter && componentCompose["disabled"]) {
            if (!isProducingOneComponent) {
                console.log(`Skipping disabled ${componentCompose["name"]} component.`);
            }
            continue;
        }

        const isDebugInfo = componentCompose["isDebugInfo"] ?? false;
        if (isDebugInfo && isPublish) {
            console.log(`Skipping debug only ${componentCompose["name"]} component as we are publishing.`);
            continue;
        }

        if (isProducingOneComponent && !isMatchingComponentFilter) {
            continue;
        }
        
        if (componentCompose["quantity"] === 0 && !isMatchingComponentFilter) {
            console.log(`Skipping ${componentCompose["name"]} component as it has a quantity of 0.`);
            continue;
        }
        
        // Skip components that dont have fronts
        // This doesnt handle uniqueBacks
        const componentType = componentCompose["type"];
        const componentTypeTokens = componentType.split("_");
        const isCustomComponent = componentTypeTokens[0].toUpperCase() !== "STOCK";
        const isDie = !("piecesGamedataFilename" in componentCompose);
        
        if (isCustomComponent && !isDie) {
            let needsToProduceAPiece = false;
            
            const piecesGamedata = await defineLoader.loadPiecesGamedata(gameRootDirectoryPath, gameCompose, componentCompose["piecesGamedataFilename"]);
            for (const piece of piecesGamedata) {
                if (!("quantity" in piece) || piece["quantity"] > 0) {
                    needsToProduceAPiece = true;
                    break; 
                }
            }
                
            if (!needsToProduceAPiece) {
                console.log(`Skipping ${componentCompose['name']} due to not having any pieces to make.`);
                continue;
            }
        }
        const componentComposition = new ComponentComposition(gameCompose, componentCompose);

        componentTasks.push(produceGameComponent(produceProperties, gameData, componentComposition, fontCache, svgFileCache));
    }
    
    await Promise.all(componentTasks);
    
    const endTime = performance.now();
    const totalTimeMs = endTime - startTime;
    const totalTimeSec = (totalTimeMs / 1000).toFixed(2);
    
    console.log(`Done producing${outputDirectoryPath ? ` ${path.basename(outputDirectoryPath)} ` : ""} in ${totalTimeSec} seconds`);
    
    return outputDirectoryPath;
}

async function produceRules(gameRootDirectoryPath, outputDirectoryPath) {
    try {
        const rules = await defineLoader.loadRules(gameRootDirectoryPath);
        if (!rules) {
            console.log("!!! rules.md not found.");
            return;
        }
        await rulesMarkdownProcessor.produceRulebook(rules, outputDirectoryPath);
    } catch (error) {
        Sentry.captureException(error);
        console.error(`Error producing rules:`, error);
    }
}

async function produceGameComponent(produceProperties, gamedata, componentComposition, fontCache, svgFileCache) {
    const componentType = componentComposition.componentCompose["type"];
    const componentTypeTokens = componentType.split("_");
    const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK";

    if (isStockComponent && produceProperties.outputDirectoryPath !== null && !produceProperties.isCacheOnly) {
        await produceStockComponent(componentComposition.componentCompose, produceProperties.outputDirectoryPath);
        return;
    }

    await producerPicker.produceCustomComponent(produceProperties, gamedata, componentComposition, fontCache, svgFileCache);
}

async function produceStockComponent(componentCompose, outputDirectory) {
    const componentName = componentCompose["name"];

    console.log(`Outputing stock parts for ${componentName} component.`);

    const componentDirectory = await outputWriter.createComponentFolder(componentName, outputDirectory);

    const stockPartInstructions = {
        "name": componentCompose["name"],
        "quantity": componentCompose["quantity"],
        "type": componentCompose["type"]
    };

    const componentInstructionFilepath = path.join(componentDirectory, "component.json");
    await outputWriter.dumpInstructions(componentInstructionFilepath, stockPartInstructions);
}

module.exports = {
    getPreviewsPath,
    clearPreviews,
    producePiecePreview,
    produceGame,
    produceGameComponent,
    produceStockComponent
};