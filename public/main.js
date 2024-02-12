const { app, BrowserWindow, Menu } = require('electron')
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
const serverEnvironmentConfiguration = require("./serverEnvironmentConfiguration")
const {log, error, warn} = require("./logger")
const ServerManager = require("./serverManager")
const ServerRunner = require("./serverRunner")
const { setupAppUpdateListener } = require("./appUpdater")

if (require('electron-squirrel-startup')) app.quit();

app.setName('Templative');
var templativeWindow = undefined
var startupWindow = undefined

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
var servers = [
    // new ServerRunner("templativeServer", 8080, serverEnvironmentConfiguration.templativeServerCommandsByEnvironment),
    new ServerRunner("reactServer", 3000, serverEnvironmentConfiguration.reactServerCommandsByEnvironment),
]
var serverManager = new ServerManager(servers)
const launchServers = async () => {
    try {
        
        var environment = app.isPackaged ? "PROD" : "DEV"
        return await serverManager.runServers(environment)
    } 
    catch (err) {
        error(err)
        return 0
    }
}

app.whenReady().then(async () => {
  log("Starting Templative")
  startupWindow = createStartupWindow()
  var serverStartResult = await launchServers()
  if (serverStartResult === 0) {
    warn("Failed to start servers!")
    await shutdown()
    return
  }
  createWindow()
  setupAppUpdateListener()
  startupWindow.closable=true
  startupWindow.close()
  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
const shutdown = async () => {
    await serverManager.shutDownServers()
    if (startupWindow !== undefined && startupWindow) {
      startupWindow.closable=true
      startupWindow.close()
    }
};
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      await shutdown()
    }
})


listenForRenderEvents()