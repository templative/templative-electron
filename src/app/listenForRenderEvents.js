const { ipcMain  } = require('electron')
const { openFolder, createProject, openPlaygroundFolder} = require("./dialogMaker")
const { channels } = require('../shared/constants');

function listenForRenderEvents() {
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PLAYGROUND, openPlaygroundFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG, openFolder);
    ipcMain.handle(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG, createProject);
}
module.exports = { listenForRenderEvents }