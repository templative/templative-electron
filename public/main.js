const { app, BrowserWindow, Menu, ipcMain  } = require('electron')
var kill  = require('tree-kill');
const { spawn } = require('child_process');
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
var axios  = require('axios');

var pythonProcess = undefined
var templativeWindow = undefined

const createWindow = () => {
    templativeWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
      },
      icon: __dirname + "/favicon.ico"
    })
  
    Menu.setApplicationMenu(mainMenu);
    templativeWindow.loadURL('http://localhost:3000');
    templativeWindow.webContents.openDevTools()
    templativeWindow.on("close", () => {
        shutdown()
    })
}

app.whenReady().then(async () => {
    pythonProcess = spawn(`python ./app.py`, { detached: false, shell: true, stdio: 'inherit' });
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})
const shutdown = () => {
    kill(pythonProcess.pid)
};
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      shutdown()
    }
})


listenForRenderEvents()