const { ipcMain, shell, dialog } = require('electron')
const { openFolder, openPlaygroundFolder, openSimulatorFolder, openProjectLocationFolder, createTemplativeProjectWithName, openFileDialog } = require("./dialogMaker")
const { channels } = require('../shared/constants');
const { login, initiateGoogleLogin, giveLoginInformation, getTgcSessionFromStore, logoutTgc, clearGithubAuth, giveGithubAuth, pollGithubAuth, testDeepLink, checkTemplativeOwnership, giveLogout } = require("./accountManager")
const { 
    createTemplativeComponent,
    produceTemplativeProject,
    getPreviewsDirectory,
    previewPiece,
    createPlaygroundPackage,
    createPrintout,
    createSimulatorSave,
    listGameCrafterDesigners,
    uploadTemplativeProjectToGameCrafter,
    createTemplativeIconFont
} = require("./templative/index")
const { setCurrentTemplativeRootDirectory, getCurrentTemplativeRootDirectory } = require("./templativeProjectManager");

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
    ipcMain.handle(channels.TO_SERVER_GIVE_CURRENT_PROJECT, setCurrentTemplativeRootDirectory);
    ipcMain.handle(channels.TO_SERVER_GET_CURRENT_PROJECT, getCurrentTemplativeRootDirectory);

    ipcMain.handle(channels.TO_SERVER_OPEN_URL, openUrl)
    ipcMain.handle(channels.TO_SERVER_OPEN_FILEPATH, openFilepath)

    ipcMain.handle(channels.TO_SERVER_GET_TGC_SESSION, getTgcSessionFromStore)
    ipcMain.handle(channels.TO_SERVER_GET_TGC_DESIGNERS, listGameCrafterDesigners)
    ipcMain.handle(channels.TO_SERVER_LOGIN, login)
    ipcMain.handle(channels.TO_SERVER_GOOGLE_LOGIN, initiateGoogleLogin)
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_IN, giveLoginInformation)
    ipcMain.handle(channels.TO_SERVER_UPLOAD_GAME, uploadTemplativeProjectToGameCrafter)
    ipcMain.handle(channels.TO_SERVER_TGC_LOGOUT, logoutTgc)
    ipcMain.handle(channels.TO_SERVER_CHECK_TEMPLATIVE_OWNERSHIP, async (event) => {
        return await checkTemplativeOwnership();
    })
    
    ipcMain.handle(channels.TO_SERVER_CLEAR_GITHUB_LOGIN, clearGithubAuth);
    ipcMain.handle(channels.TO_SERVER_IS_LOGGED_INTO_GITHUB, giveGithubAuth);
    ipcMain.handle(channels.TO_SERVER_GITHUB_AUTH, pollGithubAuth);
    ipcMain.handle('TO_SERVER_TEST_DEEP_LINK', testDeepLink);
    
    ipcMain.handle(channels.TO_SERVER_CREATE_COMPONENT, createTemplativeComponent);
    ipcMain.handle(channels.TO_SERVER_PRODUCE_GAME, produceTemplativeProject);
    ipcMain.handle(channels.TO_SERVER_GET_PREVIEWS_DIRECTORY, getPreviewsDirectory);
    ipcMain.handle(channels.TO_SERVER_PREVIEW_PIECE, previewPiece);
    ipcMain.handle(channels.TO_SERVER_CREATE_PLAYGROUND_PACKAGE, createPlaygroundPackage);
    ipcMain.handle(channels.TO_SERVER_CREATE_PRINTOUT, createPrintout);
    ipcMain.handle(channels.TO_SERVER_CREATE_SIMULATOR_SAVE, createSimulatorSave);
    ipcMain.handle(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PROJECT_LOCATION, openProjectLocationFolder);
    ipcMain.handle(channels.TO_SERVER_CREATE_PROJECT, createTemplativeProjectWithName);
    ipcMain.handle(channels.TO_SERVER_CREATE_ICON_FONT, createTemplativeIconFont);

    ipcMain.handle(channels.TO_SERVER_OPEN_FILE_DIALOG, async (event, filters) => {
        return await openFileDialog(window, filters);
    });

    ipcMain.handle(channels.TO_SERVER_LOGOUT, async (event) => {
        return await giveLogout();
    });
}
module.exports = { listenForRenderEvents }
