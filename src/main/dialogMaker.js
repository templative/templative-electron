const { channels } = require("../shared/constants");
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

const createProject = async(event, args) => {
    var result = await dialog.showOpenDialog({  title:"Create new Templative Project",  buttonLabel: "Create", properties: [ 'openDirectory', 'createDirectory', "promptToCreate"] })
    if (result.filePaths.length === 0) {
        console.warn("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    var creationResult = await axios.post(`http://127.0.0.1:8085/project`, { directoryPath: chosenDirectory})

    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

module.exports = { 
    openPlaygroundFolder,
    setCurrentFolder,
    openSimulatorFolder,
    createProject,
    openFolder
}