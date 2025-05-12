const httpOperations = require('./util/httpOperations.js');
const { attemptCreateFileInFolder } = require('./fileFolderManager.js');
const path = require('path');
const fs = require('fs').promises;

async function createAdvertisementFolder(gameCrafterSession, rootFolderId) {
    const folder = await httpOperations.postFolder(gameCrafterSession, "Advertisements", rootFolderId);
    return folder.id;
}

async function createAdvertismentImageInFolder(gameCrafterSession, filepath, backupFilepath, folderId) {
    const filenameWithoutExtension = path.parse(filepath).name;
    const fileId = await attemptCreateFileInFolder(gameCrafterSession, filenameWithoutExtension, filepath, folderId);
    if (!fileId) {
        console.log(`!!! Advertising file ${filepath} doesn't exist, using default ${backupFilepath}`);
        const backupFilenameWithoutExtension = path.parse(backupFilepath).name;
        fileId = await attemptCreateFileInFolder(gameCrafterSession, backupFilenameWithoutExtension, backupFilepath, folderId);
    }
    return fileId;
}

async function createActionShot(gameCrafterSession, gameId, fileId) {
    if (fileId === "" || fileId === null) {
        throw new Error("File id invalid.");
    }
    await httpOperations.createActionShot(gameCrafterSession, gameId, fileId);
}

module.exports = { createAdvertisementFolder, createAdvertismentImageInFolder, createActionShot };
