const fs = require('fs');
const path = require('path');
const httpOperations = require('./util/httpOperations.js');

async function createGame(gameCrafterSession, uniqueGameName, gameInfo, designerId, isPublish, shortDescription, longDescription, coolFactors, logoFileId, backdropFileId, advertisementFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers) {
  const gameName = isPublish ? gameInfo.name : uniqueGameName;
  const uploadedGame = await httpOperations.postGame(gameCrafterSession, gameName, designerId, shortDescription, longDescription, coolFactors, logoFileId, backdropFileId, advertisementFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers);
  const gameId = uploadedGame.id;
  const editUrl = `https://www.thegamecrafter.com/make/games/${gameId}`;
  console.log(`Created ${gameName}.`);

  return uploadedGame;
}

async function createFolderAtRoot(gameCrafterSession, name) {
  const user = await httpOperations.getUser(gameCrafterSession);
  return await httpOperations.postFolder(gameCrafterSession, name, user.root_folder_id);
}

async function postFile(gameCrafterSession, filepath, folderId) {
  if (!fs.existsSync(filepath) || !fs.lstatSync(filepath).isFile()) {
    throw new Error(`Not a file: ${filepath}`);
  }

  const filename = path.basename(filepath);

  const fileToUpload = fs.createReadStream(filepath);
  return await httpOperations.postFile(gameCrafterSession, fileToUpload, filename, folderId);
}

async function createFileInFolder(gameCrafterSession, name, filepath, cloudComponentFolderId) {
  console.log(`Uploading ${name} from ${filepath}`);
  const cloudFile = await postFile(gameCrafterSession, filepath, cloudComponentFolderId);
  return cloudFile.id;
}

module.exports = {
  createGame,
  createFolderAtRoot,
  postFile,
  createFileInFolder
};
