const { channels } = require("../shared/constants");
const { Menu, BrowserWindow  } = require('electron')
const { openFolder } = require("./dialogMaker")
const { giveLogout, goToAccount, reportBug, giveFeedback, viewDocumentation } = require("./accountManager")


const templates = [
    {
        label: "File",
        submenu: [
            { 
                label: "Create Project",
                click: () => BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_OPEN_CREATE_PROJECT_VIEW)
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
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
            { label: "Edit Settings", click: ()=>BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_OPEN_SETTINGS)}
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
    {
        label: "Bugs and Feedback",
        submenu: [
            { 
                label: "Report a Bug",
                click: reportBug
            },
            { 
                label: "Give Feedback",
                click: giveFeedback
            }
        ]
    },
    {
        label: "Documentation",
        submenu: [
            {
                label: "View Documentation",
                click: viewDocumentation
            }
        ]
    }
    
]

module.exports.mainMenu = Menu.buildFromTemplate(templates);