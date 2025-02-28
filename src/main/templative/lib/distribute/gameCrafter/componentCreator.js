const os = require('os');
const path = require('path');
const fs = require('fs');
const httpOperations = require('./util/httpOperations.js');
const COMPONENT_INFO = require('../../componentInfo.js').COMPONENT_INFO;
const STOCK_COMPONENT_INFO = require('../../stockComponentInfo.js').STOCK_COMPONENT_INFO;
const instructionsLoader = require('../../manage/instructionsLoader.js');
const fileFolderManager = require('./fileFolderManager.js');
const chalk = require('chalk'); 

async function createRules(gameCrafterSession, gameRootDirectoryPath, cloudGame, folderId) {
    const filepath = os.path.join(gameRootDirectoryPath, "rules.pdf");
    if (!os.path.exists(filepath)) {
        console.log(chalk.red("!!! Rules file does not exist at %s"), filepath);
        return;
    }
    console.log("Uploading %s", filepath);
    const cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, folderId);
    const document = await httpOperations.postDownloadableDocument(gameCrafterSession, cloudGame["id"], cloudFile["id"]);
}

async function createComponents(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed) {
    if (!outputDirectory) {
        throw new Error("outputDirectory cannot be None");
    }

    for (const directoryPath of Object.keys(os.walk(outputDirectory).next().value[1])) {
        const componentDirectoryPath = `${outputDirectory}/${directoryPath}`;
        try {
            await createComponent(gameCrafterSession, componentDirectoryPath, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed);
        } catch (e) {
            console.log(`!!! Error creating component in ${componentDirectoryPath}: ${e.toString()}`);
        }
    }
}

async function createComponent(gameCrafterSession, componentDirectoryPath, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed) {
    if (!componentDirectoryPath) {
        throw new Error("componentDirectoryPath cannot be None");
    }

    try {
        const componentFile = await instructionsLoader.loadComponentInstructions(componentDirectoryPath);

        const isDebugInfo = componentFile["isDebugInfo"] !== undefined ? componentFile["isDebugInfo"] : false;
        if (isDebugInfo && isPublish) {
            console.log(chalk.red("!!! Skipping %s. It is debug only and we are publishing."), componentFile["name"]);
            return;
        }
        
        const componentType = componentFile["type"];
        if (componentFile["quantity"] === 0) {
            console.log("%s has 0 quantity, skipping.", componentFile["name"]);
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
                console.log(`!!! Error creating stock part ${componentFile['name']}: ${e.toString()}`);
            }
            return;
        }

        try {
            await createCustomComponent(gameCrafterSession, componentType, componentFile, cloudGame["id"], cloudGameFolderId, isProofed);
        } catch (e) {
            console.log(`!!! Error creating custom component ${componentFile['name']}: ${e.toString()}`);
        }
            
    } catch (e) {
        console.log(`!!! Error processing component in ${componentDirectoryPath}: ${e.toString()}`);
    }
}

async function createCustomComponent(gameCrafterSession, componentType, componentFile, cloudGameId, cloudGameFolderId, isProofed) {
    if (!(componentType in COMPONENT_INFO)) {
        console.log(chalk.red("!!! Missing component info for %s."), componentType);
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
        console.log("Skipping %s with undefined 'GameCrafterUploadTask'", componentType);
        return;
    }

    if (!(component["GameCrafterUploadTask"] in componentTasks)) {
        console.log(chalk.red("!!! Skipping %s since we don't know how to upload it yet."), componentType);
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
        console.log(chalk.red("!!! %s is not a stock part!"), componentName);
        return;
    }
    const stockPartId = componentTypeTokens[1];
    const quantity = component["quantity"];

    if (!(stockPartId in STOCK_COMPONENT_INFO)) {
        console.log(chalk.red("!!! Skipping missing stock component %s."), stockPartId);
        return;
    }
    const stockComponentInfo = STOCK_COMPONENT_INFO[stockPartId];

    if (!("GameCrafterGuid" in stockComponentInfo)) {
        console.log(chalk.red("!!! Skipping stock part %s with missing GameCrafterGuid."), stockPartId);
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
    if (!os.path.isfile(backInstructions["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, identity);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    
    const backImageId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    const cloudPokerDeck = await httpOperations.postTwoSidedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createTwoSidedPiece(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createTwoSidedPiece(gameCrafterSession, instructions, setId, cloudComponentFolderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    if (!os.path.isfile(filepath)) {
        console.log(`!!! Cannot create two sided piece, no file at ${filepath}`);
        return;
    }
    console.log("Uploading %s", filepath);
    const cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId);
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

    if (!os.path.isfile(backInstructions["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, identity);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    
    const backImageId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    const cloudPokerDeck = await httpOperations.postTwoSidedSluggedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createTwoSidedSluggedPiece(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createTwoSidedSluggedPiece(gameCrafterSession, instructions, setId, cloudComponentFolderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    if (!os.path.isfile(filepath)) {
        console.log(`!!! Cannot create two sided slugged piece, no file at ${filepath}`);
        throw new Error();
    }
    console.log("Uploading %s", filepath);
    const cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId);
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
    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    if (!os.path.isfile(backInstructions["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const topImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    const bottomImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);

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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing outside image ${frontInstructions[0]['filepath']}`);
        return;
    }
    if (!os.path.isfile(backInstructions["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing inside image ${backInstructions['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const outsideImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    const insideImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        backInstructions["name"], 
        backInstructions["filepath"], 
        cloudComponentFolder["id"]
    );

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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing face image ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const faceImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );

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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    const cloudPokerDeck = await httpOperations.postTuckBox(gameCrafterSession, componentName, identity, quantity, cloudGameId, imageId, isProofed);
}

async function createDeck(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        console.log(chalk.red("!!! Deck has no quantity, skipping."));
        return;
    }
    const frontInstructions = component["frontInstructions"];
    const backInstructions = component["backInstructions"];

    if (!os.path.isfile(backInstructions["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    
    const backImageId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);
    const cloudPokerDeck = await httpOperations.postDeck(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createDeckCard(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createDeckCard(gameCrafterSession, instructions, deckId, cloudComponentFolderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    if (!os.path.isfile(filepath)) {
        console.log(`!!! Cannot create deck card, no file at ${filepath}`);
        return;
    }
    console.log("Uploading %s", filepath);
    const cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId);
    const pokerCard = await httpOperations.postDeckCard(gameCrafterSession, name, deckId, quantity, cloudFile["id"], isProofed);
}

async function createCustomPlasticDie(gameCrafterSession, componentInstructionsOutput, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = componentInstructionsOutput["name"];
    const quantity = componentInstructionsOutput["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const dieFaceFilepaths = componentInstructionsOutput["dieFaceFilepaths"];

    for (const dieFaceFilepath of dieFaceFilepaths) {
        if (!os.path.isfile(dieFaceFilepath)) {
            console.log(`!!! Cannot create ${componentName}, missing ${dieFaceFilepath}`);
            return;
        }
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, identity);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const imageFileIds = [];
    for (const dieFaceFilepath of dieFaceFilepaths) {
        const fileId = await fileFolderManager.createFileInFolder(gameCrafterSession, os.path.basename(dieFaceFilepath), dieFaceFilepath, cloudComponentFolder["id"]);
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
    
    console.log("Uploading %s %s %s(s)", quantity, componentName, identity);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const cloudOneSidedSluggedSet = await httpOperations.postOneSidedSluggedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, isProofed);

    const tasks = [];
    for (const instructions of frontInstructions) {
        tasks.push(createOneSidedSluggedPiece(gameCrafterSession, instructions, cloudOneSidedSluggedSet["id"], cloudComponentFolder["id"], isProofed));
    }

    const res = await Promise.all(tasks);
}

async function createOneSidedSluggedPiece(gameCrafterSession, instructions, setId, cloudComponentFolderId, isProofed) {
    const name = instructions["name"];
    const filepath = instructions["filepath"];
    const quantity = instructions["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    if (!os.path.isfile(filepath)) {
        console.log(`!!! Cannot create one sided slugged piece, no file at ${filepath}`);
        return;
    }
    console.log("Uploading %s", filepath);
    const cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId);
    const oneSidedSlugged = await httpOperations.postOneSidedSlugged(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed);
}

async function createCustomWoodDie(gameCrafterSession, componentInstructionsOutput, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = componentInstructionsOutput["name"];
    const quantity = componentInstructionsOutput["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const dieFaceFilepaths = componentInstructionsOutput["dieFaceFilepaths"];

    for (const dieFaceFilepath of dieFaceFilepaths) {
        if (!os.path.isfile(dieFaceFilepath)) {
            console.log(`!!! Cannot create ${componentName}, missing ${dieFaceFilepath}`);
            return;
        }
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, identity);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const imageFileIds = [];
    for (const dieFaceFilepath of dieFaceFilepaths) {
        const fileId = await fileFolderManager.createFileInFolder(gameCrafterSession, os.path.basename(dieFaceFilepath), dieFaceFilepath, cloudComponentFolder["id"]);
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    if (!os.path.isfile(backInstructions["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${backInstructions['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);

    const topImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    const bottomImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"]);

    const cloudTwoSidedBoxGloss = await httpOperations.postTwoSidedBoxGloss(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed);
}

async function createScorePad(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed) {
    const componentName = component["name"];
    const quantity = component["quantity"];
    if (parseInt(quantity) === 0) {
        return;
    }
    const frontInstructions = component["frontInstructions"];

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const imageId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"]);
    
    let spotGlossId = null;
    if (spotGlossInstructions && os.path.isfile(spotGlossInstructions["filepath"])) {
        spotGlossId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            spotGlossInstructions["name"], 
            spotGlossInstructions["filepath"], 
            cloudComponentFolder["id"]
        );
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing outside image ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const outsideImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing side 1 image ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    // Upload side 1 image
    const side1ImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    
    // Upload side 2 image if provided
    let side2ImageId = null;
    if (backInstructions && os.path.isfile(backInstructions["filepath"])) {
        side2ImageId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            backInstructions["name"], 
            backInstructions["filepath"], 
            cloudComponentFolder["id"]
        );
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing top image ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const topImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    
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

    if (!os.path.isfile(frontInstructions[0]["filepath"])) {
        console.log(`!!! Cannot create ${componentName}, missing top image ${frontInstructions[0]['filepath']}`);
        return;
    }
    console.log("Uploading %s %s %s(s)", quantity, componentName, component["type"]);

    const cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId);
    
    const topImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    );
    
    let spotGlossId = null;
    if (spotGlossInstructions && os.path.isfile(spotGlossInstructions["filepath"])) {
        spotGlossId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            spotGlossInstructions["name"], 
            spotGlossInstructions["filepath"], 
            cloudComponentFolder["id"]
        );
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