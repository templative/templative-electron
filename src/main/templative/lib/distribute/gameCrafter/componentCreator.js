const os = require('os');
const path = require("path")
const fs = require("fs")
const httpOperations = require('./util/httpOperations.js');
const COMPONENT_INFO = require('../../../../../shared/componentInfo.js').COMPONENT_INFO;
const STOCK_COMPONENT_INFO = require('../../../../../shared/stockComponentInfo.js').STOCK_COMPONENT_INFO;
const instructionsLoader = require('../../manage/instructionsLoader.js');
const fileFolderManager = require('./fileFolderManager.js');
const {captureMessage, captureException } = require("../../sentryElectronWrapper");

async function createRules(gameCrafterSession, gameRootDirectoryPath, cloudGame, folderId) {
    const filepath = path.join(gameRootDirectoryPath, "rules.pdf");
    console.log(`Uploading ${path.basename(filepath)}`);
    var cloudFile = await fileFolderManager.attemptPostFile(gameCrafterSession, filepath, folderId);
    if (!cloudFile) {
        console.log(`!!! Rules file does not exist at ${filepath}.`);
        return;
    }
    const document = await httpOperations.postDownloadableDocument(gameCrafterSession, cloudGame["id"], cloudFile["id"]);
}

async function createComponents(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed) {
    if (!outputDirectory) {
        throw new Error("outputDirectory cannot be None");
    }

    try {
        const directories = fs.readdirSync(outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        for (const directoryName of directories) {
            const componentDirectoryPath = path.join(outputDirectory, directoryName);
            try {
                await createComponent(gameCrafterSession, componentDirectoryPath, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed);
            } catch (e) {
                console.log(`!!! Error creating component in ${componentDirectoryPath}: ${e.toString()}`);
            }
        }
    } catch (error) {
        console.error(`Failed to read component directories: ${error.message}`);
        captureException(error);
        throw error;
    }
}

async function createComponent(gameCrafterSession, componentDirectoryPath, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed) {
    if (!componentDirectoryPath) {
        throw new Error("componentDirectoryPath cannot be None");
    }

    try {
        const componentFile = await instructionsLoader.loadComponentInstructions(componentDirectoryPath);
        if (!componentFile) {
            const errorMessage = `!!! Skipping ${componentDirectoryPath} because it has no component instructions.`;
            console.log(errorMessage);
            captureMessage(errorMessage);
            return;
        }
        const isDebugInfo = componentFile["isDebugInfo"] !== undefined ? componentFile["isDebugInfo"] : false;
        if (isDebugInfo && isPublish) {
            console.log(`!!! Skipping ${componentFile["name"]}. It is debug only and we are publishing.`);
            return;
        }
        
        const componentType = componentFile["type"];
        if (componentFile["quantity"] === 0) {
            console.log(`${componentFile["name"]} has 0 quantity, skipping.`);
            return;
        }
        
        const componentTypeTokens = componentType.split("_");
        const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK"; 

        if (isStockComponent) {
            if (!isStock) {
                return;
            }
            try {
                await createStockPart(gameCrafterSession, componentFile, cloudGame["id"]);
            } catch (e) {
                captureException(e);
                console.log(`!!! Error creating stock part ${componentFile['name']}: ${e.toString()}`);
            }
            return;
        }

        try {
            await createCustomComponent(gameCrafterSession, componentType, componentFile, cloudGame["id"], cloudGameFolderId, isProofed);
        } catch (e) {
            captureException(e);
            console.log(`!!! Error creating custom component ${componentFile['name']}: ${e.toString()}`);
        }
            
    } catch (e) {
        captureException(e);
        console.log(`!!! Error processing component in ${componentDirectoryPath}: ${e.toString()}`);
    }
}

async function createCustomComponent(gameCrafterSession, componentType, componentFile, cloudGameId, cloudGameFolderId, isProofed) {
    if (!(componentType in COMPONENT_INFO)) {
        console.log(`!!! Missing component info for ${componentType}`);
        return;
    }
    
    const component = COMPONENT_INFO[componentType];
    const componentTasks = {        
        "deck": createDeck,
        "twosidedbox": createTwoSidedBox,
        "twosidedsluggedset": createTwoSidedSlugged,
        "tuckbox": createTuckBox,
        "twosidedset": createTwoSided,
        "hookbox": createHookbox,
        "boxface": createBoxface,
        "customcolord6": createCustomPlasticDie,
        "customcolord4": createCustomPlasticDie,
        "customcolord8": createCustomPlasticDie,
        "customwoodd6": createCustomWoodDie,
        "onesidedsluggedset": createOneSidedSlugged,
        "twosidedboxgloss": createTwoSidedBoxGloss,
        "scorepad": createScorePad,
        "onesided": createOneSided,
        "onesidedgloss": createOneSided, //createOneSidedGloss
        "dial": createDial,
        "customprintedmeeple": createCustomPrintedMeeple,
        "boxtop": createBoxTop,
        "boxtopgloss": createBoxTop, //createBoxTopGloss
        // "perfectboundbook": createPerfectBoundBook,
        // "coilbook": createCoilBook,
    };

    if (!("GameCrafterUploadTask" in component)) {
        console.log(`Skipping ${componentType} with undefined 'GameCrafterUploadTask'`);
        return;
    }

    if (!(component["GameCrafterUploadTask"] in componentTasks)) {
        console.log(`!!! Skipping ${componentType} since we don't know how to upload it yet.`);
        return;
    }
    
    const uploadTask = componentTasks[component["GameCrafterUploadTask"]];
    await uploadTask(gameCrafterSession, componentFile, componentType, cloudGameId, cloudGameFolderId, isProofed);
}

async function createStockPart(gameCrafterSession, component, cloudGameId) {
    const componentName = component["name"];
    const componentType = component["type"];
    const componentTypeTokens = componentType.split("_");
    const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK"; 
    if (!isStockComponent) {
        console.log(`!!! ${componentName} is not a stock part!`);
        return;
    }
    const stockPartId = componentTypeTokens[1];
    const quantity = component["quantity"];

    if (!(stockPartId in STOCK_COMPONENT_INFO)) {
        console.log(`!!! Skipping missing stock component ${stockPartId}`);
        return;
    }
    const stockComponentInfo = STOCK_COMPONENT_INFO[stockPartId];

    if (!("GameCrafterGuid" in stockComponentInfo)) {
        console.log(`!!! Skipping stock part ${stockPartId} with missing GameCrafterGuid.`);
        return;
    }
    const gameCrafterGuid = stockComponentInfo["GameCrafterGuid"];

    await httpOperations.postStockPart(gameCrafterSession, gameCrafterGuid, quantity, cloudGameId);
}

async function createTwoSided(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const backInstructions = component["backInstructions"];
    
    console.log(`Uploading ${quantity} ${componentName} ${identity}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    
    var backImageId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    if (!backImageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    const cloudPokerDeck = await httpOperations.postTwoSidedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createTwoSidedPiece(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createTwoSidedPiece(gameCrafterSession, instructions, setId, folderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    
    console.log(`Uploading ${path.basename(filepath)}`);
    var cloudFile = await fileFolderManager.attemptPostFile(gameCrafterSession, filepath, folderId);
    if (!cloudFile) {
        console.log(`!!! Rules file does not exist at ${filepath}.`);
        return;
    }
    const twoSided = await httpOperations.postTwoSided(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed);
}

async function createTwoSidedSlugged(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const backInstructions = component["backInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${identity}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    
    const backImageId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    if (!backImageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    const cloudPokerDeck = await httpOperations.postTwoSidedSluggedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createTwoSidedSluggedPiece(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createTwoSidedSluggedPiece(gameCrafterSession, instructions, setId, folderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }

    console.log(`Uploading ${path.basename(filepath)}`);
    var cloudFile = await fileFolderManager.attemptPostFile(gameCrafterSession, filepath, folderId);
    if (!cloudFile) {
        console.log(`!!! Rules file does not exist at ${filepath}.`);
        return;
    }
    const twoSidedSlugged = await httpOperations.postTwoSidedSlugged(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed);
}

async function createTwoSidedBox(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const backInstructions = component["backInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const topImageFileId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    if (!topImageFileId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    const bottomImageFileId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    if (!bottomImageFileId) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    
    const cloudTwoSidedBox = await httpOperations.postTwoSidedBox(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed);
}

async function createHookbox(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];  // Outside
    const backInstructions = component["backInstructions"];    // Inside

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const outsideImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!outsideImageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    const insideImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        backInstructions["name"], 
        backInstructions["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!insideImageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }

    const cloudHookbox = await httpOperations.postHookBox(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        outsideImageId,
        insideImageId,
        identity,  // This will be something like "JumboHookBox36"
        isProofed
    );
}

async function createBoxface(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];  // Face image

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const faceImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!faceImageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    const cloudBoxface = await httpOperations.postBoxFace(
        gameCrafterSession,
        componentName,
        cloudGameId, 
        quantity,
        faceImageId,
        identity,  // This will be something like "PokerBooster"
        isProofed
    );
}

async function createTuckBox(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    if (!imageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    const cloudPokerDeck = await httpOperations.postTuckBox(gameCrafterSession, componentName, identity, quantity, cloudGameId, imageId, isProofed);
}

async function createDeck(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        console.log("!!! Deck has no quantity, skipping.");
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const backInstructions = component["backInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    
    const backImageId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    if (!backImageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    const cloudPokerDeck = await httpOperations.postDeck(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createDeckCard(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createDeckCard(gameCrafterSession, instructions, deckId, folderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    
    console.log(`Uploading ${path.basename(filepath)}`);
    
    var cloudFile = await fileFolderManager.attemptPostFile(gameCrafterSession, filepath, folderId);
    if (!cloudFile) {
        console.log(`!!! Rules file does not exist at ${filepath}.`);
        return;
    }
    const pokerCard = await httpOperations.postDeckCard(gameCrafterSession, name, deckId, quantity, cloudFile["id"], isProofed);
}

async function createCustomPlasticDie(gameCrafterSession, componentInstructionsOutput, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = componentInstructionsOutput["name"];
    const quantity = componentInstructionsOutput["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const dieFaceFilepaths = componentInstructionsOutput["dieFaceFilepaths"];

    console.log(`Uploading ${quantity} ${componentName} ${identity}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const imageFileIds = [];
    for (const dieFaceFilepath of dieFaceFilepaths) {
        const fileId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, os.path.basename(dieFaceFilepath), dieFaceFilepath, cloudComponentFolder["id"]);
        if (!fileId) {
            console.log(`!!! Cannot create ${componentName}, missing ${dieFaceFilepath}`);
            return;
        }
        imageFileIds.push(fileId);
    }
    
    const dieCreationFunctions = {
        "4": httpOperations.postCustomD4,
        "6": httpOperations.postCustomD6,
        "8": httpOperations.postCustomD8,
    };
    
    if (!(dieFaceFilepaths.length.toString() in dieCreationFunctions)) {
        throw new Error(`Cannot create ${dieFaceFilepaths.length} sided die for ${componentName}.`);
    }
    
    const dieCreationFunction = dieCreationFunctions[dieFaceFilepaths.length.toString()];
    await dieCreationFunction(gameCrafterSession, componentName, cloudGameId, quantity, "white", imageFileIds, isProofed);
}

async function createOneSidedSlugged(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];
    
    console.log(`Uploading ${quantity} ${componentName} ${identity}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const cloudOneSidedSluggedSet = await httpOperations.postOneSidedSluggedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createOneSidedSluggedPiece(gameCrafterSession, instructions, cloudOneSidedSluggedSet["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createOneSidedSluggedPiece(gameCrafterSession, instructions, setId, folderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    console.log(`Uploading ${path.basename(filepath)}`);
    var cloudFile = await fileFolderManager.attemptPostFile(gameCrafterSession, filepath, folderId);
    if (!cloudFile) {
        console.log(`!!! Rules file does not exist at ${filepath}.`);
        return;
    }
    const oneSidedSlugged = await httpOperations.postOneSidedSlugged(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed);
}

async function createCustomWoodDie(gameCrafterSession, componentInstructionsOutput, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = componentInstructionsOutput["name"];
    const quantity = componentInstructionsOutput["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const dieFaceFilepaths = componentInstructionsOutput["dieFaceFilepaths"];

    console.log(`Uploading ${quantity} ${componentName} ${identity}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const imageFileIds = [];
    for (const dieFaceFilepath of dieFaceFilepaths) {
        const fileId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, os.path.basename(dieFaceFilepath), dieFaceFilepath, cloudComponentFolder["id"]);
        if (!fileId) {
            console.log(`!!! Cannot create ${componentName}, missing ${dieFaceFilepath}`);
            return;
        }
        imageFileIds.push(fileId);
    }
    
    await httpOperations.postCustomWoodD6(gameCrafterSession, componentName, cloudGameId, quantity, imageFileIds, isProofed);
}

async function createTwoSidedBoxGloss(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const backInstructions = component["backInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const topImageFileId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    if (!topImageFileId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    const bottomImageFileId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    if (!bottomImageFileId) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    const cloudTwoSidedBoxGloss = await httpOperations.postTwoSidedBoxGloss(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed);
}

async function createScorePad(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!imageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    const pageCount = component["pageCount"] !== undefined ? component["pageCount"] : 40;
    
    const cloudScorePad = await httpOperations.postScorePad(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        imageId,
        pageCount,
        identity,
        isProofed
    );
}

async function createOneSided(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    if (!imageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    const cloudOneSided = await httpOperations.postOneSided(
        gameCrafterSession, 
        componentName, 
        cloudGameId, 
        quantity, 
        imageId,
        identity,  // This will be something like "MediumGameMat"
        isProofed
    );
}

async function createOneSidedGloss(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const spotGlossInstructions = component["spotGlossInstructions"] !== undefined ? component["spotGlossInstructions"] : null;

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.attemptCreateFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    if (!imageId) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    let spotGlossId = null;
    if (spotGlossInstructions) {
        spotGlossId = await fileFolderManager.attemptCreateFileInFolder(
            gameCrafterSession, 
            spotGlossInstructions["name"], 
            spotGlossInstructions["filepath"], 
            cloudComponentFolder["id"]
        );
        if (!spotGlossId) {
            console.log(`!!! Cannot create ${componentName}, missing ${spotGlossInstructions['filepath']}`);
            return;
        }
    }
    
    const cloudOneSidedGloss = await httpOperations.postOneSidedGloss(
        gameCrafterSession, 
        componentName, 
        cloudGameId, 
        quantity, 
        imageId,
        identity,  // This will be something like "QuadFoldBoard"
        isProofed,
        spotGlossId
    );
}

async function createDial(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];  // Outside image

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const outsideImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!outsideImageId) {
        console.log(`!!! Cannot create ${componentName}, missing outside image ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    const cloudDial = await httpOperations.postDial(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        outsideImageId,
        identity,  // This will be something like "SmallDial"
        isProofed
    );
}

async function createCustomPrintedMeeple(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];  // Side 1
    const backInstructions = component["backInstructions"] !== undefined ? component["backInstructions"] : null;  // Side 2 (optional)
    const diecolor = component["diecolor"] !== undefined ? component["diecolor"] : "white";  // Optional color specification

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    // Upload side 1 image
    const side1ImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!side1ImageId) {
        console.log(`!!! Cannot create ${componentName}, missing side 1 image ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    // Upload side 2 image if provided
    let side2ImageId = null;
    if (backInstructions) {
        side2ImageId = await fileFolderManager.attemptCreateFileInFolder(
            gameCrafterSession, 
            backInstructions["name"], 
            backInstructions["filepath"], 
            cloudComponentFolder["id"]
        );
        if (!side2ImageId) {
            console.log(`!!! Cannot create ${componentName}, missing side 2 image ${backInstructions['filepath']}`);
            return;
        }
    }
    
    const cloudMeeple = await httpOperations.postCustomPrintedMeeple(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        side1ImageId,
        side2ImageId,
        diecolor,
        isProofed
    );
}

async function createBoxTop(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];  // Top image

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const topImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!topImageId) {
        console.log(`!!! Cannot create ${componentName}, missing top image ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    const cloudBoxTop = await httpOperations.postBoxTop(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        topImageId,
        identity,  // This will be something like "DeckBoxTopAndSide"
        isProofed
    );
}

async function createBoxTopGloss(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];  // Top image
    const spotGlossInstructions = component["spotGlossInstructions"] !== undefined ? component["spotGlossInstructions"] : null;

    console.log(`Uploading ${quantity} ${componentName} ${component["type"]}`);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const topImageId = await fileFolderManager.attemptCreateFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    if (!topImageId) {
        console.log(`!!! Cannot create ${componentName}, missing top image ${frontInstructions[0]['filepath']}`);
        return;
    }
    
    let spotGlossId = null;
    if (spotGlossInstructions) {
        spotGlossId = await fileFolderManager.attemptCreateFileInFolder(
            gameCrafterSession, 
            spotGlossInstructions["name"], 
            spotGlossInstructions["filepath"], 
            cloudComponentFolder["id"]
        );
        if (!spotGlossId) {
            console.log(`!!! Cannot create ${componentName}, missing spot gloss ${spotGlossInstructions['filepath']}`);
            return;
        }
    }
    
    const cloudBoxTopGloss = await httpOperations.postBoxTopGloss(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        topImageId,
        identity,  // This will be something like "LargeStoutBoxTopAndSide"
        isProofed,
        spotGlossId
    );
}

module.exports = {
    createRules,
    createComponents,
    createComponent,
    createCustomComponent,
    createStockPart
};