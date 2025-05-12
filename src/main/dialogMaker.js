const { channels } = require("../shared/constants");
const { createTemplativeProject } = require("./templative/index");
var path = require('path');
const { dialog, BrowserWindow } = require('electron');
const { setCurrentTemplativeRootDirectory, checkIfFolderIsValidTemplativeProject } = require('./templativeProjectManager');

const { updateToast } = require('./toastNotifier');


const openFolder = async(event) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.filePaths.length === 0) {
        console.warn("No directory selected");
        return;
    }
    var chosenDirectory = result.filePaths[0];
    const isInvalidProject = !await checkIfFolderIsValidTemplativeProject(event, chosenDirectory);
    if (isInvalidProject) {
        console.warn("Invalid project selected");
        const directory = path.basename(chosenDirectory);
        updateToast(`/${directory} is an invalid Templative project.`, "error");
        return;
    }
    await setCurrentTemplativeRootDirectory(event, chosenDirectory);
    updateToast(`/${path.basename(chosenDirectory)} loaded.`, "success");
}

const openPlaygroundFolder = async(event) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.filePaths.length === 0) {
        console.warn("No directory selected");
        return;
    }
    var chosenDirectory = result.filePaths[0];
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_PLAYGROUND_FOLDER, chosenDirectory);
}

const openSimulatorFolder = async(event) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.filePaths.length === 0) {
        console.warn("No directory selected");
        return;
    }
    var chosenDirectory = result.filePaths[0];
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_SIMULATOR_FOLDER, chosenDirectory);
}

const openProjectLocationFolder = async(event) => {
    var result = await dialog.showOpenDialog({ 
        properties: ['openDirectory', 'createDirectory']
    });
    if (result.filePaths.length === 0) {
        console.warn("No directory selected");
        return { canceled: true };
    }
    return { canceled: false, filePaths: [result.filePaths[0]] };
}

const createTemplativeProjectWithName = async(event, { projectLocation, projectName, templateName }) => {
    if (!projectLocation || !projectName) {
        console.warn("Missing required project information");
        return { success: false, error: "Missing required project information" };
    }

    console.log(`Creating project at: ${projectLocation} with template: ${templateName || 'blank'}`);
    
    try {
        var creationResult = await createTemplativeProject(projectLocation, projectName, templateName);
        if (!creationResult.success) {
            return { success: false, error: creationResult.error };
        }
        await setCurrentTemplativeRootDirectory(event, projectLocation);
        return { success: true, projectDirectory: projectLocation };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: error.message };
    }
}

const openFileDialog = async (window, filters) => {
    const result = await dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: filters
    });
    return result.filePaths[0];
}

module.exports = { 
    openPlaygroundFolder,
    openSimulatorFolder,
    openFolder,
    openProjectLocationFolder,
    createTemplativeProjectWithName,
    openFileDialog
};