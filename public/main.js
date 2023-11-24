const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools()
  }

app.whenReady().then(async () => {
    
    spawn(`python ./flask/app.py 3001`, { detached: true, shell: true, stdio: 'inherit' });
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})