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
    if (!user) {
      console.error('Error: User information is missing.');
      throw new Error('Cannot create folder: User information not available.');
    }
    if (!user.root_folder_id) {
      console.error('Error: root_folder_id is missing.');
      throw new Error('Cannot create folder: User root folder ID not available.');
    }
    return await httpOperations.postFolder(gameCrafterSession, name, user.root_folder_id);
    
  } catch (error) {
    console.error(`Error in createFolderAtRoot: ${error.message}`);
    throw error;
  }
}

async function postFile(gameCrafterSession, filepath, folderId) {
  const filename = path.basename(filepath);
  return await httpOperations.postFile(gameCrafterSession, filepath, filename, folderId);
}

async function attemptPostFile(gameCrafterSession, filepath, folderId) {
  try {
    return await postFile(gameCrafterSession, filepath, folderId);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`!!! File does not exist at ${filepath}.`);
      return null;
    }
    throw error;
  }
}


async function attemptCreateFileInFolder(gameCrafterSession, name, filepath, cloudComponentFolderId) {
  const cloudFile = await attemptPostFile(gameCrafterSession, filepath, cloudComponentFolderId);
  if (!cloudFile) {
    console.log(`!!! File does not exist at ${filepath}.`);
    return null;
  }
  return cloudFile.id;
}

module.exports = {
  createGame,
  createFolderAtRoot,
  attemptPostFile,
  attemptCreateFileInFolder,
};
