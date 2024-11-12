const { app, BrowserWindow, Menu } = require('electron')
const killPort = require('kill-port');
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
const { setupOauthListener, handleDeepLink } = require("./app/accountManager")

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
    setupOauthListener(templativeWindow)
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
    try {
        // Prevent multiple shutdown attempts
        if (app.isQuitting) {
          return;
        }
        app.isQuitting = true;
        
        log("Initiating shutdown sequence");
        
        // Shutdown servers first
        await serverManager.shutDownServers();
        
        // Force kill any remaining processes on the server ports
        for (const server of servers) {
            await killPort(server.port, "tcp").catch(() => {});
        }
        
        // Close windows
        if (startupWindow) {
            startupWindow.closable = true;
            startupWindow.destroy();
        }
        if (templativeWindow) {
            templativeWindow.closable = true;
            templativeWindow.destroy();
        }
        
        // Exit the app
        app.exit(0);
    } catch (err) {
        error(`Error during shutdown: ${err}`);
        app.exit(1);
    }
};

// Ensure shutdown happens on all possible exit scenarios
app.on('before-quit', async (event) => {
    event.preventDefault();
    await shutdown();
});

app.on("ready", onReady)
app.on('window-all-closed', async () => {
    await shutdown();
});

// app.on('open-url', async (event, url) => {
//   event.preventDefault();
//   await handleDeepLink(url);
// });