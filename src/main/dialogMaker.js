const { channels } = require("../shared/constants");
const { createTemplativeProject } = require("./templative/index");
const { dialog, BrowserWindow, app  } = require('electron')
var axios  = require('axios');
var path = require('path');

const setCurrentFolder = async (event, projectDirectory) => {
    let mainWindow = BrowserWindow.getAllWindows()[0];
    var directoryName = path.basename(projectDirectory);
    mainWindow.setTitle(`Templative v${app.getVersion()} - ${directoryName}`);
}

const openFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.warn("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    var directoryName = path.basename(chosenDirectory);
    let mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.setTitle(`Templative v${app.getVersion()} - ${directoryName}`);
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

const openPlaygroundFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.warn("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_PLAYGROUND_FOLDER, chosenDirectory)
}
const openSimulatorFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.warn("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_SIMULATOR_FOLDER, chosenDirectory)
}

const openProjectLocationFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.warn("Chose nothing!")
        return { canceled: true }
    }
    var chosenDirectory = result.filePaths[0]
    return { canceled: false, filePaths: [chosenDirectory] }
}

const createTemplativeProjectWithName = async(event, { projectLocation, projectName, templateName }) => {
    if (!projectLocation || !projectName) {
        console.warn("Missing required project information")
        return { success: false, error: "Missing required project information" }
    }

    console.log(`Creating project at: ${projectLocation} with template: ${templateName || 'blank'}`)
    
    try {
        var creationResult = await createTemplativeProject(projectLocation, projectName, templateName)
        if (!creationResult.success) {
            return { success: false, error: creationResult.error }
        }
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, projectLocation)
        return { success: true, projectDirectory: projectLocation }
    } catch (error) {
        console.error("Error creating project:", error)
        return { success: false, error: error.message }
    }
}

module.exports = { 
    openPlaygroundFolder,
    setCurrentFolder,
    openSimulatorFolder,
    openFolder,
    openProjectLocationFolder,
    createTemplativeProjectWithName
}