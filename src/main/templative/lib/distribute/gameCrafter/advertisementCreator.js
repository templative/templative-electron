const { httpOperations } = require('./util/httpOperations.js');
const { createFileInFolder } = require('./fileFolderManager.js');
const path = require('path');
const fs = require('fs');

async function createAdvertisementFolder(gameCrafterSession, rootFolderId) {
    const folder = await httpOperations.postFolder(gameCrafterSession, "Advertisements", rootFolderId);
    return folder.id;
}

async function createAdvertismentImageInFolder(gameCrafterSession, filepath, backupFilepath, folderId) {
    let filepathUsed = filepath;
    if (!fs.existsSync(filepath)) {
        filepathUsed = backupFilepath;
        console.log(`!!! Advertising file ${filepath} doesn't exist, using default ${backupFilepath}`);
    }
    const filenameWithoutExtension = path.parse(filepathUsed).name;
    const fileId = await createFileInFolder(gameCrafterSession, filenameWithoutExtension, filepathUsed, folderId);
    return fileId;
}

async function createActionShot(gameCrafterSession, gameId, fileId) {
    if (fileId === "" || fileId === null) {
        throw new Error("File id invalid.");
    }
    await httpOperations.createActionShot(gameCrafterSession, gameId, fileId);
}

module.exports = { createAdvertisementFolder, createAdvertismentImageInFolder, createActionShot };
