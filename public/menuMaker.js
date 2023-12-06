const { channels } = require("../src/shared/constants");
const { Menu, BrowserWindow  } = require('electron')
const { createProject, openFolder } = require("./dialogMaker")

const templates = [
    {
        label: "File",
        submenu: [
            { 
                label: "Create Project",
                click: createProject
            },
            { 
                label: "Open Project",
                click: openFolder
            },
            {
                label: "Close Project",
                click: ()=>BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_CLOSE_PROJECT)
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

module.exports.mainMenu = Menu.buildFromTemplate(templates);