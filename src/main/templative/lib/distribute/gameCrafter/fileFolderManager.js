const fs = require('fs/promises');
const path = require('path');
const httpOperations = require('./util/httpOperations.js');

async function createGame(gameCrafterSession, uniqueGameName, gameInfo, designerId, isPublish, shortDescription, longDescription, coolFactors, logoFileId, backdropFileId, advertisementFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers) {
    const gameName = isPublish ? gameInfo.name : uniqueGameName;
  const uploadedGame = await httpOperations.postGame(gameCrafterSession, gameName, designerId, shortDescription, longDescription, coolFactors, logoFileId, backdropFileId, advertisementFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers);
  const gameId = uploadedGame.id;
  const editUrl = `https://www.thegamecrafter.com/make/games/${gameId}`;
  // console.log(`Created ${gameName}.`);

  return uploadedGame;
}

async function createFolderAtRoot(gameCrafterSession, name) {
  try {
    const user = await httpOperations.getUser(gameCrafterSession);
    if (!user || !user.root_folder_id) {
      console.error('Error: User information or root_folder_id is missing.');
      throw new Error('Cannot create folder: User root folder ID not available.');
    }
    return await httpOperations.postFolder(gameCrafterSession, name, user.root_folder_id);
    
  } catch (error) {
    console.error(`Error in createFolderAtRoot: ${error.message}`);
    throw error;
  }
}

async function postFile(gameCrafterSession, filepath, folderId) {
  try {
    const stats = await fs.stat(filepath);
    if (!stats.isFile()) {
      throw new Error(`Not a file: ${filepath}`);
    }
  } catch (error) {
    throw new Error(`File does not exist or cannot be accessed: ${filepath}`);
  }

  const filename = path.basename(filepath);
  return await httpOperations.postFile(gameCrafterSession, filepath, filename, folderId);
}

async function createFileInFolder(gameCrafterSession, name, filepath, cloudComponentFolderId) {
  const cloudFile = await postFile(gameCrafterSession, filepath, cloudComponentFolderId);
  return cloudFile.id;
}

module.exports = {
  createGame,
  createFolderAtRoot,
  postFile,
  createFileInFolder
};
