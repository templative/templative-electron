const { ipcMain, shell } = require('electron')
const { openFolder, createProject, openPlaygroundFolder} = require("./dialogMaker")
const { channels } = require('../shared/constants');

var openUrl = async (event, url) => {
    shell.openExternal(url);
}

function listenForRenderEvents() {
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND, openPlaygroundFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG, openFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG, createProject);
    ipcMain.handle(channels.TO_SERVER_OPEN_URL, openUrl)
}
module.exports = { listenForRenderEvents }