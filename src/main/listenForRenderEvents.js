const { ipcMain, shell } = require('electron')
const { setCurrentFolder, openFolder, createTemplativeProjectWithDialog, openPlaygroundFolder, openSimulatorFolder} = require("./dialogMaker")
const { channels } = require('../shared/constants');
const { login, giveLoginInformation, getTgcSessionFromStore, logoutTgc, clearGithubAuth, giveGithubAuth, pollGithubAuth } = require("./accountManager")
const { 
    createTemplativeComponent,
    produceTemplativeProject,
    getPreviewsDirectory,
    previewPiece,
    createPlaygroundPackage,
    createPrintout,
    createSimulatorSave,
    listGameCrafterDesigners,
    uploadTemplativeProjectToGameCrafter
} = require("./templative/index")

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
    ipcMain.handle(channels.TO_SERVER_OPEN_CREATE_PROJECT_DIALOG, createTemplativeProjectWithDialog);

    ipcMain.handle(channels.TO_SERVER_OPEN_URL, openUrl)
    ipcMain.handle(channels.TO_SERVER_OPEN_FILEPATH, openFilepath)

    ipcMain.handle(channels.TO_SERVER_GET_TGC_SESSION, getTgcSessionFromStore)
    ipcMain.handle(channels.TO_SERVER_GET_TGC_DESIGNERS, listGameCrafterDesigners)
    ipcMain.handle(channels.TO_SERVER_LOGIN, login)
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_IN, giveLoginInformation)
    ipcMain.handle(channels.TO_SERVER_UPLOAD_GAME, uploadTemplativeProjectToGameCrafter)
    ipcMain.handle(channels.TO_SERVER_TGC_LOGOUT, logoutTgc)
    
    ipcMain.handle(channels.TO_SERVER_CLEAR_GITHUB_LOGIN, clearGithubAuth);
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_INTO_GITHUB, giveGithubAuth);
    ipcMain.handle(channels.TO_SERVER_GITHUB_AUTH, pollGithubAuth);
    
    ipcMain.handle(channels.TO_SERVER_CREATE_COMPONENT, createTemplativeComponent);
    ipcMain.handle(channels.TO_SERVER_PRODUCE_GAME, produceTemplativeProject);
    ipcMain.handle(channels.TO_SERVER_GET_PREVIEWS_DIRECTORY, getPreviewsDirectory);
    ipcMain.handle(channels.TO_SERVER_PREVIEW_PIECE, previewPiece);
    ipcMain.handle(channels.TO_SERVER_CREATE_PLAYGROUND_PACKAGE, createPlaygroundPackage);
    ipcMain.handle(channels.TO_SERVER_CREATE_PRINTOUT, createPrintout);
    ipcMain.handle(channels.TO_SERVER_CREATE_SIMULATOR_SAVE, createSimulatorSave);
}
module.exports = { listenForRenderEvents }
