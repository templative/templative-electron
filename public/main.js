const { app, BrowserWindow, Menu, ipcMain  } = require('electron')
const { spawn } = require('child_process');
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
var axios  = require('axios');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
      }
    })
  
    Menu.setApplicationMenu(mainMenu);
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools()
    ipcMain.on('app-quit', (_event, _arg) => shutdown());
  }

app.whenReady().then(async () => {
    
    spawn(`python ./app.py 3001`, { detached: true, shell: true, stdio: 'inherit' });
    
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})
const shutdown = () => {
  axios.get(`http://localhost:3001/quit`)
    .then(app.quit)
    .catch(app.quit);
};
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      shutdown()
    }
})

listenForRenderEvents()