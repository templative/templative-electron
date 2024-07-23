const { ipcMain, shell } = require('electron')
const { openFolder, createProject, openPlaygroundFolder} = require("./dialogMaker")
const { channels } = require('../shared/constants');
const { login, giveLoginInformation, loginGoogle } = require("./accountManager")

var openUrl = async (event, url) => {
    shell.openExternal(url);
}

function listenForRenderEvents() {
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND, openPlaygroundFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG, openFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG, createProject);
    ipcMain.handle(channels.TO_SERVER_OPEN_URL, openUrl)
    
    ipcMain.handle(channels.TO_SERVER_LOGIN_GOOGLE, loginGoogle)
    ipcMain.handle(channels.TO_SERVER_LOGIN, login)
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_IN, giveLoginInformation)
}
module.exports = { listenForRenderEvents }