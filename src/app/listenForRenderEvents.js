const { ipcMain, shell } = require('electron')
const { openFolder, createProject, openPlaygroundFolder, openSimulatorFolder} = require("./dialogMaker")
const { channels } = require('../shared/constants');
const { login, giveLoginInformation } = require("./accountManager")

var openUrl = async (event, url) => {
    shell.openExternal(url);
}

function listenForRenderEvents(window) {
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND, openPlaygroundFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_SIMULATOR, openSimulatorFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG, openFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG, createProject);
    ipcMain.handle(channels.TO_SERVER_OPEN_URL, openUrl)
    
    ipcMain.handle(channels.TO_SERVER_LOGIN, login)
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_IN, giveLoginInformation)
}
module.exports = { listenForRenderEvents }