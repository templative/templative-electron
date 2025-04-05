const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const chalk = require('chalk');
const instructionsLoader = require('../../manage/instructionsLoader.js');
const advertisementCreator = require('./advertisementCreator.js');
const { createComponents, createRules } = require('./componentCreator.js');
const { createGame, createFolderAtRoot } = require('./fileFolderManager.js');
const httpOperations = require('./util/httpOperations.js');

const gameCrafterBaseUrl = "https://www.thegamecrafter.com";

async function uploadGame(gameCrafterSession, gameRootDirectoryPath, outputDirectory, isPublish, isStock, isProofed, designerId) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    try {
        const game = await instructionsLoader.loadGameInstructions(outputDirectory);
        const studio = await instructionsLoader.loadStudioInstructions(outputDirectory);
        
        if (designerId === null && (!("gameCrafterDesignerId" in studio) || studio["gameCrafterDesignerId"] === "")) {
            console.log("!!! Missing 'gameCrafterDesignerId' in studio.json.");
            return;
        }
        const gameCrafterDesignerId = designerId !== null ? designerId : studio["gameCrafterDesignerId"];

        console.log(`Uploading ${game["name"]} for ${studio["name"]}`);

        const uniqueGameName = path.basename(outputDirectory);
        
        // First, verify session is valid by making a simple API call
        try {
            const user = await httpOperations.getUser(gameCrafterSession);
            console.log(`Verified GameCrafter session for user: ${user.username || user.email || user.id}`);
        } catch (sessionError) {
            console.error(`!!! Session validation error: ${sessionError.message}`);
            throw new Error(`Invalid GameCrafter session. Please check your credentials. Error: ${sessionError.message}`);
        }
        
        try {
            const cloudGameFolder = await createFolderAtRoot(gameCrafterSession, uniqueGameName);

            const [logoImageFileId, backdropImageFileId, advertisementImageFileId, actionShotImageFileId] = await createAdvertisments(gameCrafterSession, gameRootDirectoryPath, cloudGameFolder["id"]);

            const shortDescription = await pullAdvertDataFromGameJsonButAllowDefault(game, "shortDescription", "It was a good game.");
            const longDescription = await pullAdvertDataFromGameJsonButAllowDefault(game, "longDescription", "Generated using templative.lib.");
            const coolFactors = await pullAdvertDataFromGameJsonButAllowDefault(game, "coolFactors", ["Mechanically Built", "Humans Need Not Apply", "Auto-generated"]);
            const category = await pullAdvertDataFromGameJsonButAllowDefault(game, "category", "Board Games");
            const websiteUrl = await pullAdvertDataFromGameJsonButAllowDefault(game, "websiteUrl", "");
            const minAge = await pullAdvertDataFromGameJsonButAllowDefault(game, "minAge", "12+");
            const playTime = await pullAdvertDataFromGameJsonButAllowDefault(game, "playTime", "30-60");
            const minPlayers = await pullAdvertDataFromGameJsonButAllowDefault(game, "minPlayers", "4");
            const maxPlayers = await pullAdvertDataFromGameJsonButAllowDefault(game, "maxPlayers", "4");

            const cloudGame = await createGame(gameCrafterSession, uniqueGameName, game, gameCrafterDesignerId, isPublish, shortDescription, longDescription, coolFactors, logoImageFileId, backdropImageFileId, advertisementImageFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers);

            await advertisementCreator.createActionShot(gameCrafterSession, cloudGame["id"], actionShotImageFileId);
            
            await createRules(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolder["id"]);            
            await createComponents(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolder["id"], isPublish, isStock, isProofed);
            
            const gameUrl = `${gameCrafterBaseUrl}/make/games/${cloudGame["id"]}`;
            console.log(`Upload finished for ${cloudGame["name"]}, visit ${gameUrl}`);
        
            await writeGameUrlToDirectory(game, gameUrl, outputDirectory);
            
            return gameUrl;
        } catch (uploadError) {
            console.error(`!!! Upload process error: ${uploadError.message}`);
            throw new Error(`Error during game upload process: ${uploadError.message}`);
        }
    } catch (error) {
        console.error(`!!! Error uploading game: ${error.message}`);
        throw error;
    }
}

async function pullAdvertDataFromGameJsonButAllowDefault(gameData, key, defaultValue) {
    if (key in gameData) {
        return gameData[key];
    }
    
    console.log(`!!! Missing "${key}" in game.json. Using default value of "${defaultValue}".`);
    return defaultValue;
}
async function createAdvertisments(gameCrafterSession, gameRootDirectoryPath, cloudGameFolderId) {
    const advertismentFolderId = await advertisementCreator.createAdvertisementFolder(gameCrafterSession, cloudGameFolderId);
    
    const backupFilesDirectoryPath = path.join(__dirname, "testImages");
    
    const logoImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        path.resolve(path.join(gameRootDirectoryPath, "gamecrafter/logo.png")), 
        path.join(backupFilesDirectoryPath, "logo.png"), 
        advertismentFolderId);
    
    const backdropImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        path.resolve(path.join(gameRootDirectoryPath, "./gamecrafter/backdrop.png")),
        path.join(backupFilesDirectoryPath, "backdrop.png"), 
        advertismentFolderId);

    const advertisementImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        path.resolve(path.join(gameRootDirectoryPath, "./gamecrafter/advertisement.png")),
        path.join(backupFilesDirectoryPath, "advertisement.png"), 
        advertismentFolderId);

    const actionShotImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        path.resolve(path.join(gameRootDirectoryPath, "./gamecrafter/actionShot.png")),
        path.join(backupFilesDirectoryPath, "actionShot.png"), 
        advertismentFolderId);
    
    return [logoImageFileId, backdropImageFileId, advertisementImageFileId, actionShotImageFileId];
}

async function writeGameUrlToDirectory(gameJson, gameUrl, outputDirectory) {
    gameJson["gameCrafterUrl"] = gameUrl;
    await fs.writeFile(path.join(outputDirectory, "game.json"), JSON.stringify(gameJson, null, 4));
}

module.exports = {
    uploadGame
};
