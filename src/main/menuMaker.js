const { channels } = require("../shared/constants");
const { Menu, BrowserWindow  } = require('electron')
const { createProject, openFolder } = require("./dialogMaker")
const { giveLogout, goToAccount} = require("./accountManager")
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
                click: ()=>BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_CLOSE_PROJECT)
            },
            {role:"quit"}
        ]
    },
    {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    },
    {
        label: "View",
        submenu: [
            {role:"toggleDevTools"},
            {role: "reload"},
            {role: "forceReload"}
        ]
    },
    {
        label: "Account",
        submenu: [
            { 
                label: "Go to Account",
                click: goToAccount
            },
            { 
                label: "Logout",
                click: giveLogout
            }
        ]
    },
]

module.exports.mainMenu = Menu.buildFromTemplate(templates);