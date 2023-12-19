const { app, BrowserWindow, Menu } = require('electron')
var kill  = require('tree-kill');
const { spawn } = require('child_process');
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")

var reactProcess = undefined
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

const waitforhost = async (url, interval = 1000, attempts = 10) => {

  const sleep = ms => new Promise(r => setTimeout(r, ms))
  
  let count = 1

  return new Promise(async (resolve, reject) => {
    while (count < attempts) {

      await sleep(interval)

      try {
        const response = await fetch(url)
        if (response !== undefined && response.ok) {
          if (response.status === 200) {
            resolve()
            break
          }
        } else {
          count++
        }
      } catch (e) {
        count++
        console.log(`${e}\n${url} failed. Trying ${count} of ${attempts}`)
      }
    }

    reject(new Error(`${url} is down: ${count} attempts tried`))
  })
}
const launchServers = async () => {
  try {
    var pythonServerCommand = `python3 ${app.isPackaged ? process.resourcesPath : "."}/python/app.py`
    pythonProcess = spawn(pythonServerCommand, { detached: false, shell: true, stdio: 'inherit' });
    
    var reactServerCommand = app.isPackaged ? `npx run serve -s ${process.resourcesPath}/build` : `react-scripts start`
    reactProcess = spawn(reactServerCommand, { detached: false, shell: true, stdio: 'inherit' });
    await waitforhost("http://localhost:8080/status", 2000, 10)
    await waitforhost("http://127.0.0.1:3000", 2000, 10)
    
    console.log(`Servers are up`)
    return 1
  } catch (err) {
    console.log(err)
    return 0
  }
}

app.whenReady().then(async () => {
  var serverStartResult = await launchServers()
  if (serverStartResult == 0) {
    console.log("Failure!")
    shutdown()
    return
  }
  createWindow()
  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})
const shutdown = () => {
    kill(reactProcess.pid)
    kill(pythonProcess.pid)
};
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      shutdown()
    }
})


listenForRenderEvents()