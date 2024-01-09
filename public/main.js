const { app, BrowserWindow, Menu } = require('electron')
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
const ServerManager = require("./serverManager")
const ServerRunner = require("./serverRunner")
const {log, error, warn} = require("./logger")

app.setName('Templative');
var templativeWindow = undefined

const createWindow = () => {
    templativeWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: "Templative",
      webPreferences: {
        nodeIntegration: true,
        // preload: "absPath",
        devTools: true,
        contextIsolation: false,
        webSecurity: false,
      },
      backgroundColor: '#282c34',
      icon: __dirname + "/favicon.ico"
    })
    
    Menu.setApplicationMenu(mainMenu);
    templativeWindow.loadURL('http://localhost:3000');
    templativeWindow.on("close", async () => {
        await shutdown()
    })
}
const createStartupWindow = () => {
  var startupWindow = new BrowserWindow({
    width: 125 * 2, height: 100 * 2,
    title: "Templative Startup",
    center:true, resizable:false, movable: true, minimizable: false,
    maximizable: false, closable: false, focusable: false, alwaysOnTop: false,
    fullscreenable: false, skipTaskbar: true, frame: false, hiddenInMissionControl: true,
    titleBarStyle: "hidden", backgroundColor: '#282c34',
    show: false,
    icon: __dirname + "/favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      webSecurity: false,
    },
  })
  startupWindow.loadURL(`file://${__dirname}/startup.html`);
  startupWindow.show()
  return startupWindow
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
    error(err)
    return 0
  }
}

app.whenReady().then(async () => {
  log("Starting Templative")
  var startupWindow = createStartupWindow()
  var serverStartResult = await launchServers()
  if (serverStartResult == 0) {
    warn("Failed to start servers!")
    await shutdown()
    return
  }
  createWindow()
  startupWindow.closable=true
  startupWindow.close()
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