const { app, BrowserWindow, Menu } = require('electron')
const {mainMenu} = require("./app/menuMaker")
const {listenForRenderEvents} = require("./app/listenForRenderEvents")
const serverEnvironmentConfiguration = require("./app/serverEnvironmentConfiguration")
const {log, error, warn} = require("./app/logger")
const ServerManager = require("./app/serverManager")
const ServerRunner = require("./app/serverRunner")
const { setupAppUpdateListener } = require("./app/appUpdater")
const { initialize } = require("@aptabase/electron/main");
const path = require('path');
if (require('electron-squirrel-startup')) app.quit();
app.setName('Templative');
var templativeWindow = undefined
var startupWindow = undefined

initialize("A-US-9521417167");

const createWindow = () => {
    templativeWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: `Templative v${app.getVersion()}`,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webSecurity: false,
      },
      backgroundColor: '#282c34'
    })
    
    Menu.setApplicationMenu(mainMenu);
    templativeWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // templativeWindow.webContents.openDevTools();
    templativeWindow.on("close", async () => {
        await shutdown()
    })
}

var servers = [
  new ServerRunner("templativeServer", 8080, serverEnvironmentConfiguration.templativeServerCommandsByEnvironment),
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
const onReady = async () => {
  log("Starting Templative")
  try {
    var serverStartResult = await launchServers()
    if (serverStartResult === 0) {
      warn("Failed to start servers!")
      await shutdown()
      return
    }
    createWindow()
    setupAppUpdateListener()
    listenForRenderEvents(templativeWindow)
  }
  catch(err) {
    error(err)
    shutdown()
  }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}
const shutdown = async () => {
    await serverManager.shutDownServers()
    if (startupWindow !== undefined && startupWindow) {
      startupWindow.closable=true
      startupWindow.close()
    }
    if (templativeWindow !== undefined && templativeWindow) {
      templativeWindow.closable=true
      templativeWindow.close()
    }
    app.exit(0)
};

app.on('before-quit', async () => {
  await serverManager.shutDownServers()
});

app.on("ready", onReady)
app.on('window-all-closed', shutdown)
