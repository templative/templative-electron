const { app, BrowserWindow, Menu } = require('electron')
var kill  = require('tree-kill');
const { spawn } = require('child_process');
const fs = require("fs")
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
const ServerManager = require("./serverManager")
const ServerRunner = require("./serverRunner")

app.setName('Templative');
var templativeWindow = undefined

const createWindow = () => {
    templativeWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: "Templative",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
      backgroundColor: '#282c34',
      icon: __dirname + "/favicon.ico"
    })
    
    Menu.setApplicationMenu(mainMenu);
    templativeWindow.loadURL('http://localhost:3000');
    templativeWindow.webContents.openDevTools()
    templativeWindow.on("close", async () => {
        await shutdown()
    })
}

const createServerManager = () => {
  var templativeServerCommandsByEnvironment = {
    "PROD": `${process.resourcesPath}/python/__main__ serve --port 8080`,
    "TEST_BUILT": `/Users/oliverbarnum/Documents/git/templative-electron/python/dist/app/app`,
    "GLOBALLY_INSTALLED": `templative serve --port 8080`,
    "DEV": `./python/__main__ serve --port 8080`
  }
  var templativeServerRunner = new ServerRunner("templativeServer", "http://localhost:8080/status", templativeServerCommandsByEnvironment)

  var reactServerCommandsByEnvironment = {
    "PROD": `npx --yes serve -s ${process.resourcesPath}/build`,
    "TEST_BUILT": `npx --yes serve -s ./build`,
    "GLOBALLY_INSTALLED": `templative serve --port 8080`,
    "DEV": `react-scripts start`
  }
  var reactServerRunner = new ServerRunner("reactServer", "http://127.0.0.1:3000", reactServerCommandsByEnvironment)
  var servers = [templativeServerRunner, reactServerRunner]
  return new ServerManager(servers)
}
var serverManager = createServerManager()

const launchServers = async () => {
  try {
    var environment = "DEV"
    if (app.isPackaged) {
      environment = "PROD"
    }
    return await serverManager.runServers(environment)
  } catch (err) {
    console.log(err)
    return 0
  }
}

app.whenReady().then(async () => {
  // installImageMagick()
  
  var serverStartResult = await launchServers()
  if (serverStartResult == 0) {
    console.log("Failure!")
    await shutdown()
    return
  }
  createWindow()
  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
const shutdown = async () => {
    await serverManager.shutDownServers()
};
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      await shutdown()
    }
})


listenForRenderEvents()