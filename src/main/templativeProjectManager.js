const { BrowserWindow, app } = require('electron');
const path = require('path');
const os = require('os');
const fsPromises = require('fs').promises;
const { channels } = require('../shared/constants');
// Get the main process
const { CachePreProducerWatcher } = require('./templative/lib/produce/cachePreProducerWatcher');
const mainProcess = require('electron').app;
const { readOrCreateSettingsFile, writeToSettingsFile, folderExists } = require('./settingsManager');

const checkIfFolderIsValidTemplativeProject = async(event, folderPath) => {
    try {
        await fsPromises.readFile(path.join(folderPath, 'component-compose.json'), 'utf8');
        // console.log("component-compose.json found");
        await fsPromises.readFile(path.join(folderPath, 'game.json'), 'utf8');
        // console.log("game.json found");
        await fsPromises.readFile(path.join(folderPath, 'studio.json'), 'utf8');
        // console.log("studio.json found");
        const gameCompose = await fsPromises.readFile(path.join(folderPath, 'game-compose.json'), 'utf8');
        // console.log("game-compose.json found");
        const gameComposeJson = JSON.parse(gameCompose);
        // console.log("game-compose.json parsed");
        const checkFolders= [
            path.join(folderPath, gameComposeJson.piecesGamedataDirectory),
            path.join(folderPath, gameComposeJson.componentGamedataDirectory),
            path.join(folderPath, gameComposeJson.artdataDirectory),
            path.join(folderPath, gameComposeJson.artTemplatesDirectory),
            path.join(folderPath, gameComposeJson.artInsertsDirectory)
        ]
        for (const checkFolder of checkFolders) {
            if (!await fsPromises.stat(checkFolder)) {
                console.log(`${checkFolder} not found`);
                return false;
            }
        }
        return true;
    } catch (error) {
        console.log("error", error);
        return false
    }
}


function updateWindowTitle(newTemplativeRootDirectory) {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length === 0) return;

        const mainWindow = windows[0];
        if (!mainWindow || mainWindow.isDestroyed()) return;

        const directoryName = newTemplativeRootDirectory ? path.basename(newTemplativeRootDirectory) : '';
        mainWindow.setTitle(`Templative v${app.getVersion()}${directoryName ? ` - ${directoryName}` : ''}`);
    } catch (error) {
        console.error('Error updating window title:', error);
    }
}

function notifyRenderer(event, newTemplativeRootDirectory) {
    try {
        // if (!event || !event.sender || event.sender.isDestroyed()) return;
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, newTemplativeRootDirectory);
    } catch (error) {
        console.error('Error notifying renderer:', error);
    }
}

async function startWatchingProjectForFileChangesToPreProduceCache(newTemplativeRootDirectory) {
    if (mainProcess.cachePreProducer) {
        await mainProcess.cachePreProducer.closeWatchers();
    }
    var cachePreProducer = new CachePreProducerWatcher(newTemplativeRootDirectory);
    await cachePreProducer.openWatchers();
    mainProcess.cachePreProducer = cachePreProducer;
}

async function setCurrentTemplativeRootDirectory(event, newTemplativeRootDirectory) {
    try {
        // Store in main process
        mainProcess.currentTemplativeRootDirectory = newTemplativeRootDirectory;
        
        // Begin watching the new project for file changes
        var settings = await readOrCreateSettingsFile();
        if (!settings.isOnChangeRenderingDisabled) {
            console.log("Starting to watch for file changes to pre-produce the cache");
            await startWatchingProjectForFileChangesToPreProduceCache(newTemplativeRootDirectory);
        }
        else {
            console.log("Not watching for file changes to pre-produce the cache");
        }
        
        
        // Update window title
        updateWindowTitle(newTemplativeRootDirectory);

        // Save to settings
        if (newTemplativeRootDirectory) {
            const settings = await readOrCreateSettingsFile();
            settings.lastProjectDirectory = newTemplativeRootDirectory;
            await writeToSettingsFile(settings);
        }

        // Notify renderer
        notifyRenderer(event, newTemplativeRootDirectory);

        return newTemplativeRootDirectory;
    } catch (error) {
        console.error('Error setting current directory:', error);
        throw error;
    }
}

async function getCurrentTemplativeRootDirectory() {
    try {
        if (!mainProcess.currentTemplativeRootDirectory) {
            const settings = await readOrCreateSettingsFile();
            if (settings.lastProjectDirectory && await folderExists(settings.lastProjectDirectory)) {
                mainProcess.currentTemplativeRootDirectory = settings.lastProjectDirectory;
            }
        }
        return mainProcess.currentTemplativeRootDirectory;
    } catch (error) {
        console.error('Error getting current directory:', error);
        return null;
    }
}

async function clearCurrentTemplativeRootDirectory() {
    try {
        mainProcess.currentTemplativeRootDirectory = null;
        const settings = await readOrCreateSettingsFile();
        settings.lastProjectDirectory = null;
        await writeToSettingsFile(settings);
    } catch (error) {
        console.error('Error clearing current directory:', error);
    }
}

async function loadLastProject() {
    const lastProjectDirectory = await getCurrentTemplativeRootDirectory();
    if (lastProjectDirectory) {
        await setCurrentTemplativeRootDirectory(null, lastProjectDirectory);
    }
}

module.exports = {
    setCurrentTemplativeRootDirectory,
    getCurrentTemplativeRootDirectory,
    clearCurrentTemplativeRootDirectory,
    loadLastProject,
    checkIfFolderIsValidTemplativeProject,
    readOrCreateSettingsFile
};