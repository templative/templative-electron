const { channels } = require("../src/shared/constants");
const { dialog, BrowserWindow  } = require('electron')
var axios  = require('axios');

const openFolder = async(event, args) => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.filePaths.length === 0) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

const createProject = async(event, args) => {
    var result = await dialog.showOpenDialog({  title:"Create new Templative Project",  buttonLabel: "Create", properties: [ 'openDirectory', 'createDirectory', "promptToCreate"] })
    if (result.filePaths.length === 0) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    console.log(chosenDirectory)
    var creationResult = await axios.post(`http://127.0.0.1:3001/project`, { directoryPath: chosenDirectory})
    console.log(creationResult)
    BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

module.exports = { 
    createProject,
    openFolder
}