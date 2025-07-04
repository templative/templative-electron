const os = require('os');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const glob = require('glob');
const {captureMessage, captureException } = require("../sentryElectronWrapper");
const { access } = require('fs').promises;

const outputWriter = require('./outputWriter');
const rulesMarkdownProcessor = require('./rulesMarkdownProcessor');
const defineLoader = require('../manage/defineLoader');
const producerPicker = require('./customComponents/producerPicker');
const ProduceProperties = require('../manage/models/produceProperties').ProduceProperties;
const PreviewProperties = require('../manage/models/produceProperties').PreviewProperties;
const GameData = require('../manage/models/gamedata').GameData;
const ComponentComposition = require('../manage/models/composition');
const FontCache = require('./customComponents/svgscissors/caching/fontCache').FontCache;
const { SvgFileCache } = require('./customComponents/svgscissors/caching/svgFileCache');
const { RENDER_MODE, RENDER_PROGRAM, OVERLAPPING_RENDERING_TASKS } = require('../manage/models/produceProperties');
const { COMPONENT_INFO } = require('../../../../shared/componentInfo');
const { clipAndScaleSvgContentToElement, CLIPPING_ELEMENT_ID } = require('./customComponents/svgscissors/artdataProcessing/imageClipper');
const { processInkscapeShellCommands, createInkscapeShellExportCommand } = require('./customComponents/svgscissors/fileConversion/inkscapeProcessor');
const { convertSvgFileToPngUsingResvg } = require('./customComponents/svgscissors/fileConversion/svgToRasterConverter');
const { cacheFiles } = require('./customComponents/svgscissors/caching/renderedPiecesCache');


async function getPreviewsPath() {
    const previewsPath = path.join(os.homedir(), 'Documents', 'Templative', 'previews');
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
    try {
        // Read all files in the directory
        const files = await fsPromises.readdir(directoryPath);
        
        // Delete each file
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            try {
                await fsPromises.unlink(filePath);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(`Error deleting file ${filePath}:`, err);
                }
            }
        }
    } catch (err) {
        console.error(`Error clearing directory ${directoryPath}:`, err);
        throw err;
    }
}

async function producePiecePreview(gameRootDirectoryPath, outputDirectoryPath, componentName, pieceName, language, renderProgram=RENDER_PROGRAM.TEMPLATIVE) {
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
    await clearPreviews(outputDirectoryPath);
    const CLIPPED = true;
    const previewProperties = new PreviewProperties(gameRootDirectoryPath, outputDirectoryPath, pieceName, language, CLIPPED, renderProgram);

    const fontCache = new FontCache();
    const svgFileCache = new SvgFileCache();
    const glyphUnicodeMap = {};
    
    var commands = await producerPicker.produceCustomComponentPreview(previewProperties, gameData, componentComposition, fontCache, svgFileCache, glyphUnicodeMap);

    await processExportToPngCommands(commands, renderProgram);
    for (const command of commands) {
        await cacheFiles(command.hash, command.svgFilepath, command.pngFilepath);
    }
    console.log(`Wrote previews to ${outputDirectoryPath}`);
}
async function getTimestamp() {
    const now = new Date();
    // Format date using local time instead of UTC
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function produceGame(gameRootDirectoryPath, componentFilter, isSimple, isPublish, targetLanguage, isClipped=false, renderMode=RENDER_MODE.RENDER_EXPORT_USING_CACHE, renderProgram=RENDER_PROGRAM.TEMPLATIVE, overlappingRenderingTasks=OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME) {
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
    if (renderMode !== RENDER_MODE.RENDER_TO_CACHE) {   
        const timestamp = await getTimestamp();
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
    const produceProperties = new ProduceProperties(gameRootDirectoryPath, outputDirectoryPath, isPublish, isSimple, targetLanguage, isClipped, renderMode, renderProgram, overlappingRenderingTasks);
    
    const fontCache = new FontCache();
    const svgFileCache = new SvgFileCache();
    const glyphUnicodeMap = {};
    
    const componentTasks = [];
    const exportToPngCommands = [];
    
    for (const componentCompose of componentsCompose) {
        const isProducingOneComponent = componentFilter != null;
        const isMatchingComponentFilter = isProducingOneComponent && componentCompose["name"] === componentFilter;
        if (!isMatchingComponentFilter && componentCompose["disabled"]) {
            if (!isProducingOneComponent) {
                console.log(`Skipping disabled ${componentCompose["name"]} component.`);
            }
            // console.log(`Skipping disabled ${componentCompose["name"]} component.`);
            continue;
        }

        const isDebugInfo = componentCompose["isDebugInfo"] ?? false;
        if (isDebugInfo && isPublish) {
            console.log(`Skipping debug only ${componentCompose["name"]} component as we are publishing.`);
            continue;
        }

        if (isProducingOneComponent && !isMatchingComponentFilter) {
            // console.log(`Skipping ${componentCompose["name"]} component as it is not the one we are producing.`);
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
        const componentTask = produceGameComponent(produceProperties, gameData, componentComposition, fontCache, svgFileCache, glyphUnicodeMap);
        if (produceProperties.overlappingRenderingTasks === OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME) {
            const commands = await componentTask;
            if (commands) exportToPngCommands.push(...commands);
        } else {
            componentTasks.push(componentTask);
        }
    }
    
    const componentResults = await Promise.all(componentTasks);
    for (const commands of componentResults) {
        if (commands) exportToPngCommands.push(...commands);
    }
    
    await processExportToPngCommands(exportToPngCommands, renderProgram);
    for (const command of exportToPngCommands) {
        await cacheFiles(command.hash, command.svgFilepath, command.pngFilepath);
    }
    
    
    
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
        await rulesMarkdownProcessor.produceRulebook(gameRootDirectoryPath, rules, outputDirectoryPath);
    } catch (error) {
        captureException(error);
        console.error(`Error producing rules:`, error);
    }
}

async function produceGameComponent(produceProperties, gamedata, componentComposition, fontCache, svgFileCache, glyphUnicodeMap) {
    const componentType = componentComposition.componentCompose["type"];
    const componentTypeTokens = componentType.split("_");
    const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK";

    if (isStockComponent && produceProperties.outputDirectoryPath !== null && produceProperties.renderMode !== RENDER_MODE.RENDER_TO_CACHE) {
        await produceStockComponent(componentComposition.componentCompose, produceProperties.outputDirectoryPath);
        return [];
    }

    return await producerPicker.produceCustomComponent(produceProperties, gamedata, componentComposition, fontCache, svgFileCache, glyphUnicodeMap);
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

async function loadSvgClipFile(componentType, sourcedStuff) {
    if (sourcedStuff[componentType]) {
        return sourcedStuff[componentType];
    }
    var clipDirectory = __dirname.includes('app.asar') ? 
        path.join(__dirname, '../../../componentTemplates') :
        path.join(__dirname, '../../src/main/templative/lib/componentTemplates');
    const clipFilepath = path.join(clipDirectory, `${componentType}.svg`)
    const clipFileContent = await fsPromises.readFile(clipFilepath, 'utf8');
    sourcedStuff[componentType] = clipFileContent;
    return clipFileContent;
}
async function fileExists(filepath) {
    try {
        await access(filepath);
        return true;
    } catch {
        return false;
    }
}
async function clipSvgFile(svgFilePath, clipSvgContent, imageSizePixels, renderProgram=RENDER_PROGRAM.TEMPLATIVE) {
    var svgContent = await fsPromises.readFile(svgFilePath, 'utf8');
    const isClippingBorder = renderProgram === RENDER_PROGRAM.INKSCAPE;
    svgContent = await clipAndScaleSvgContentToElement(svgContent, clipSvgContent, CLIPPING_ELEMENT_ID, isClippingBorder);
    const clippedSvgFilePath = svgFilePath.replace(".svg", "_clipped.svg");
    const clippedPngFilePath = svgFilePath.replace(".svg", "_clipped.png");
    await fsPromises.writeFile(clippedSvgFilePath, svgContent);
    return {
        imageSizePixels: imageSizePixels,
        svgFilepath: clippedSvgFilePath,
        pngFilepath: clippedPngFilePath
    }
}

async function recutOutput(outputDirectoryPath, renderProgram=RENDER_PROGRAM.TEMPLATIVE) {
    const outputFolders = await fsPromises.readdir(outputDirectoryPath);
    
    var componentTemplates = {};
    var exportToPngCommands = []
    for (const outputFolder of outputFolders) {
        // If its not a folder continue
        if (!fs.statSync(path.join(outputDirectoryPath, outputFolder)).isDirectory()) {
            continue;
        }
        
        const outputFolderPath = path.join(outputDirectoryPath, outputFolder);
        const compositionFilepath = path.join(outputFolderPath, "component.json");
        const composition = await fsPromises.readFile(compositionFilepath, 'utf8');
        const compositionType = JSON.parse(composition)["type"];
        const isStockComponent = compositionType.startsWith("STOCK");
        const componentInfo = COMPONENT_INFO[compositionType];
        if (isStockComponent) {
            continue;
        }
        const clipSvgContent = await loadSvgClipFile(compositionType, componentTemplates);
        
        // Read every svg file in outputFolder
        
        const svgFiles = await fsPromises.readdir(outputFolderPath);
        for (const svgFile of svgFiles) {
            if (!svgFile.endsWith(".svg")) {
                continue;
            }
            if (svgFile.endsWith("_clipped.svg")) {
                continue;
            }
            const svgFilePath = path.join(outputFolderPath, svgFile);
            var newSvgFilePath = svgFilePath.replace(".svg", "_clipped.svg");
            const doesFileExist = await fileExists(newSvgFilePath)
            if (doesFileExist) {
                continue;
            }
            
            // console.log(`Clipping ${svgFilePath.split("\\").pop().split(".")[0]} to size.`);
            exportToPngCommands.push(await clipSvgFile(svgFilePath, clipSvgContent, componentInfo["DimensionsPixels"], renderProgram));
        }
    }
    await processExportToPngCommands(exportToPngCommands, renderProgram);
    
    
}

async function processExportToPngCommands(exportToPngCommands, renderProgram) {
    if (exportToPngCommands.length === 0) {
        return;
    }
    if (renderProgram === RENDER_PROGRAM.INKSCAPE) {
        const inkscapeCommands = [];
        for (const command of exportToPngCommands) {
            inkscapeCommands.push(await createInkscapeShellExportCommand(command.svgFilepath, command.pngFilepath));
        }
        await processInkscapeShellCommands(inkscapeCommands);
    }
    else if (renderProgram === RENDER_PROGRAM.TEMPLATIVE) {
        for (const command of exportToPngCommands) {
            await convertSvgFileToPngUsingResvg(command.svgFilepath, command.imageSizePixels, command.pngFilepath) 
        }
    }
    else {
        throw new Error(`Invalid render program: ${renderProgram}`);
    }
}

module.exports = {
    getPreviewsPath,
    clearPreviews,
    producePiecePreview,
    produceGame,
    produceGameComponent,
    produceStockComponent,
    recutOutput
};