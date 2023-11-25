const { app, BrowserWindow, Menu, ipcMain  } = require('electron')
const { spawn } = require('child_process');
const {mainMenu} = require("./menuMaker")
var kill  = require('tree-kill');

const { channels } = require('../src/shared/constants');

ipcMain.on(channels.GET_DATA, (event, arg) => {
  const { product } = arg;
  console.log(product);

  event.sender.send(channels.GET_DATA, "hello");
});

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
  
    Menu.setApplicationMenu(mainMenu);
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools()
  }

app.whenReady().then(async () => {
    
    var pythonServer = spawn(`python ./app.py 3001`, { detached: true, shell: true, stdio: 'inherit' });
    
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    app.on("before-quit", ()=> {
      kill(pythonServer.pid)
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})