const { ipcMain, shell } = require('electron')
const { setCurrentFolder, openFolder, createProject, openPlaygroundFolder, openSimulatorFolder} = require("./dialogMaker")
const { channels } = require('../shared/constants');
const { login, giveLoginInformation, getTgcSessionFromStore, getDesigners, uploadGame, logoutTgc, clearGithubAuth, giveGithubAuth, pollGithubAuth } = require("./accountManager")

var openUrl = async (event, url) => {
    shell.openExternal(url);
}
var openFilepath = async (event, filepath) => {
    const fs = require('fs').promises;
    try {
        shell.openPath(filepath)
            .catch(err => console.error('Error opening folder:', err));
    } catch (err) {
        console.error('Error checking path:', err);
    }
}


function listenForRenderEvents(window) {
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND, openPlaygroundFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_SIMULATOR, openSimulatorFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG, openFolder);
    ipcMain.handle(channels.TO_SERVER_GIVE_CURRENT_PROJECT, setCurrentFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG, createProject);

    ipcMain.handle(channels.TO_SERVER_OPEN_URL, openUrl)
    ipcMain.handle(channels.TO_SERVER_OPEN_FILEPATH, openFilepath)

    ipcMain.handle(channels.TO_SERVER_GET_TGC_SESSION, getTgcSessionFromStore)
    ipcMain.handle(channels.TO_SERVER_GET_TGC_DESIGNERS, getDesigners)
    ipcMain.handle(channels.TO_SERVER_LOGIN, login)
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_IN, giveLoginInformation)
    ipcMain.handle(channels.TO_SERVER_UPLOAD_GAME, uploadGame)
    ipcMain.handle(channels.TO_SERVER_TGC_LOGOUT, logoutTgc)

    ipcMain.handle(channels.TO_SERVER_CLEAR_GITHUB_LOGIN, clearGithubAuth);
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_INTO_GITHUB, giveGithubAuth);
    ipcMain.handle(channels.TO_SERVER_GITHUB_AUTH, pollGithubAuth);
}
module.exports = { listenForRenderEvents }
