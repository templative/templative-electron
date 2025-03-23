const { app, BrowserWindow, Menu, ipcMain,  protocol } = require('electron')
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")
const {log, error, warn} = require("./logger")
const { setupAppUpdateListener } = require("./appUpdater")
// const { initialize } = require("@aptabase/electron/main");
const { setupOauthListener } = require("./accountManager")
const axios = require('axios');
// const Sentry = require("@sentry/electron/main");
const path = require('path');
const fsPromises = require('fs').promises;

// Sentry.init({
//   dsn: "https://ea447f3e89982daf599068c5b6bf933c@o4508842181459968.ingest.us.sentry.io/4508859562328064",
//   enableNative: true,
//   release: `templative@${app.getVersion()}`,
//   environment: app.isPackaged ? 'production' : 'development',
// });

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Ensure we only try to quit once
let isQuitting = false;

if (require('electron-squirrel-startup')) {
    app.quit();
    process.exit(0);
}

app.setName('Templative');

var templativeWindow = undefined

// Add a debounce/throttle mechanism for Aptabase events
// const aptabaseThrottleMap = new Map();
// const APTABASE_THROTTLE_MS = 1000; // Minimum time between identical events

// const initializeAptabase = () => {
//   // Only enable analytics in production builds
//   if (app.isPackaged) {
//     log("Initializing Aptabase analytics for production");
//     initialize("A-US-3966824173");
    
//     // Patch the track method to add throttling
//     const originalTrack = global.aptabase?.track;
//     if (originalTrack) {
//       global.aptabase.track = (eventName, props) => {
//         const key = `${eventName}-${JSON.stringify(props || {})}`;
//         const now = Date.now();
//         const lastTime = aptabaseThrottleMap.get(key) || 0;
        
//         if (now - lastTime >= APTABASE_THROTTLE_MS) {
//           aptabaseThrottleMap.set(key, now);
//           originalTrack(eventName, props);
//         } else {
//           // Skip sending to avoid rate limiting
//           log(`Throttled Aptabase event: ${eventName}`);
//         }
//       };
//     }
//   } else {
//     log("Aptabase analytics disabled in development mode");
//     // Create a no-op implementation for development
//     global.aptabase = {
//       track: (eventName, props) => {
//         log(`[DEV] Aptabase event (not sent): ${eventName}`);
//       }
//     };
//   }
// };

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
        createWindow();
        setupAppUpdateListener();
        listenForRenderEvents(templativeWindow);
        setupOauthListener(templativeWindow);

    } catch (err) {
        await logError(err, 'app_initialization');
        error(err);
        await sleep(2000);
        await shutdown();
    }
};

// Replace the direct initialize call with the conditional version
// initialize("A-US-3966824173");
// initializeAptabase();

app.on('ready', initializeApp);

const shutdown = async () => {
    try {
        // Prevent multiple shutdown attempts
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
