const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const killPort = require('kill-port');
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
const serverEnvironmentConfiguration = require("./serverEnvironmentConfiguration")
const {log, error, warn} = require("./logger")
const ServerManager = require("./serverManager")
const ServerRunner = require("./serverRunner")
const { setupAppUpdateListener } = require("./appUpdater")
const { initialize } = require("@aptabase/electron/main");
const SplashScreen = require('../renderer/splash/splashScreen');
const { setupOauthListener } = require("./accountManager")
const axios = require('axios');
const Sentry = require("@sentry/electron/main");

Sentry.init({
  dsn: "https://ea447f3e89982daf599068c5b6bf933c@o4508842181459968.ingest.us.sentry.io/4508859562328064",
  enableNative: true,
  release: `templative@${app.getVersion()}`,
  environment: app.isPackaged ? 'production' : 'development',
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Ensure we only try to quit once
let isQuitting = false;

if (require('electron-squirrel-startup')) {
    app.quit();
    process.exit(0);
}

app.setName('Templative');

var templativeWindow = undefined
var splashScreen = undefined

initialize("A-US-3966824173");

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
  new ServerRunner("templativeServer", 8085, serverEnvironmentConfiguration.templativeServerCommandsByEnvironment),
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

const logError = async (error, route, additionalContext = {}) => {
    try {
        await axios.post('https://api.templative.net/logging', {
            error: {
                type: error.name,
                message: error.message,
                stacktrace: error.stack
            },
            route: route,
            additionalContext: {
                ...additionalContext,
                application_layer: 'electron',
                electron_version: process.versions.electron,
                app_version: app.getVersion()
            }
        });
    } catch (err) {
        console.error('Failed to log error:', err);
    }
};

const initializeApp = async () => {
    splashScreen = new SplashScreen();
    
    // Wait for splash screen to be ready before proceeding
    await new Promise((resolve) => {
        splashScreen.window.webContents.once('did-finish-load', () => {
            resolve();
        });
    });
    
    // Now set up server callbacks and proceed with initialization
    servers.forEach(server => {
        server.setProgressCallback((message, percent) => {
            splashScreen.updateProgress(message, percent);
        });
    });

    try {
        splashScreen.updateProgress("Starting servers...", 0);
        const serverStartResult = await launchServers();
        
        if (serverStartResult === 0) {
            splashScreen.updateProgress("Failed to start servers!", 100);
            await sleep(2000);
            await shutdown();
            return;
        }

        splashScreen.updateProgress("Loading application...", 90);
        
        createWindow();
        setupAppUpdateListener();
        listenForRenderEvents(templativeWindow);
        setupOauthListener(templativeWindow);

        templativeWindow.webContents.once('did-finish-load', () => {
            splashScreen.close();
        });

    } catch (err) {
        await logError(err, 'app_initialization');
        error(err);
        splashScreen.updateProgress(`Error: ${err.message}`, 100);
        await sleep(2000);
        await shutdown();
    }
};

app.on('ready', initializeApp);

const shutdown = async () => {
    try {
        // Prevent multiple shutdown attempts
        if (isQuitting) {
            return;
        }
        isQuitting = true;
        
        log("Initiating shutdown sequence");
        
        // If we're shutting down due to an error and splash screen is visible,
        // wait before proceeding with shutdown
        if (splashScreen && splashScreen.window) {
            await sleep(2000); // Give users time to read error message
        }
        
        try {
            // Shutdown servers first
            await serverManager.shutDownServers();
        } catch (err) {
            error(`Error shutting down servers: ${err}`);
        }
        
        try {
            // Force kill any remaining processes on the server ports
            for (const server of servers) {
                await killPort(server.port, "tcp").catch(() => {});
            }
        } catch (err) {
            error(`Error killing ports: ${err}`);
        }
        
        try {
            // Close windows
            if (splashScreen) {
                splashScreen.close();
                splashScreen = null;
            }
            if (templativeWindow) {
                templativeWindow.destroy();
                templativeWindow = null;
            }
        } catch (err) {
            error(`Error closing windows: ${err}`);
        }

        // Force exit after a timeout if something is hanging
        setTimeout(() => {
            process.exit(0);
        }, 2000);

        app.quit();
    } catch (err) {
        error(`Critical error during shutdown: ${err}`);
        await sleep(2000).catch(() => {});
        process.exit(1);
    }
};

app.on('before-quit', async (event) => {
    event.preventDefault();
    await shutdown();
});

app.on('window-all-closed', async () => {
    await shutdown();
});

process.on('SIGTERM', async () => {
    await shutdown();
});

process.on('SIGINT', async () => {
    await shutdown();
});

process.on('uncaughtException', async (err) => {
    await logError(err, 'process_uncaught_exception');
    await shutdown();
});

process.on('unhandledRejection', async (err) => {
    await logError(err, 'process_unhandled_rejection');
    await shutdown();
});

ipcMain.on('error', async (event, error) => {
    await logError(error, 'ipc_error', {
        sender: event.sender.getTitle()
    });
});
