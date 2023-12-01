const { channels } = require("../src/shared/constants");
const { Menu, dialog, BrowserWindow  } = require('electron')

const openFolder = async() => {
    var result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result === undefined) {
        console.log("Chose nothing!")
        return
    }
    var chosenDirectory = result.filePaths[0]
    BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, chosenDirectory)
}

const template = [
    {
        label: "File",
        submenu: [
            { 
                label: "Open Folder...",
                click: openFolder
            },
            {
                label: "Save File",
                click: ()=>{}
            },
            {
                label: "Close Project",
                click: ()=>{}
            },
            {role:"quit"}
        ]
    },
    {
        label: "View",
        submenu: [
            {role:"toggleDevTools"},
            {role: "reload"},
            {role: "forceReload"}
        ]
    }
]

module.exports.mainMenu = Menu.buildFromTemplate(template);