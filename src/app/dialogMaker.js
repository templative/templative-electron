const { channels } = require("../shared/constants");
const { dialog, BrowserWindow  } = require('electron')
var axios  = require('axios');

const openFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

const openPlaygroundFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_PLAYGROUND_FOLDER, chosenDirectory)
}
const openSimulatorFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_SIMULATOR_FOLDER, chosenDirectory)
}

const createProject = async(event, args) => {
    var result = await dialog.showOpenDialog({  title:"Create new Templative Project",  buttonLabel: "Create", properties: [ 'openDirectory', 'createDirectory', "promptToCreate"] })
    if (result.filePaths.length === 0) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    console.log(chosenDirectory)
    var creationResult = await axios.post(`http://127.0.0.1:8080/project`, { directoryPath: chosenDirectory})
    console.log(creationResult)
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

module.exports = { 
    openPlaygroundFolder,
    openSimulatorFolder,
    createProject,
    openFolder
}