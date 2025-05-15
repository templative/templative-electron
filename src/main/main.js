const { app, BrowserWindow, Menu, ipcMain,  protocol } = require('electron')
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
const {log, error, warn} = require("./logger")
const { setupAppUpdateListener } = require("./appUpdater")
const { initialize: initializeAptabase } = require("@aptabase/electron/main");
const { setupOauthListener } = require("./accountManager")
const axios = require('axios');
const Sentry = require("@sentry/electron/main");
const { loadLastProject } = require("./templativeProjectManager");

Sentry.init({
    dsn: "https://ea447f3e89982daf599068c5b6bf933c@o4508842181459968.ingest.us.sentry.io/4508859562328064",
    enableNative: true,
    release: `templative@${app.getVersion()}`,
});

ipcMain.handle('get-app-is-packaged', () => {
    return app.isPackaged;
});
    
initializeAptabase("A-US-3966824173");
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Ensure we only try to quit once
let isQuitting = false;

if (require('electron-squirrel-startup')) {
    app.quit();
    process.exit(0);
}

app.setName('Templative');

var templativeWindow = undefined


const createWindow = () => {
    templativeWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: `Templative v${app.getVersion()}`,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true,
        devTools: true,
        webSecurity: false,
      },
      backgroundColor: '#282c34'
    })
    
    Menu.setApplicationMenu(mainMenu);
    
    templativeWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    if (!app.isPackaged) {
        templativeWindow.webContents.openDevTools();
    }
    templativeWindow.on("close", async () => {
        await shutdown()
    })
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
    try {        
        listenForRenderEvents(templativeWindow);
        setupOauthListener(templativeWindow);
        createWindow();
        setupAppUpdateListener();
        await loadLastProject();
    } catch (err) {
        await logError(err, 'app_initialization');
        error(err);
        await sleep(2000);
        await shutdown();
    }
};

app.on('ready', initializeApp);

const shutdown = async () => {
    try {
        if (isQuitting) {
            return;
        }
        isQuitting = true;
        
        log("Initiating shutdown sequence");
    
        try {
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
