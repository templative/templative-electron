const log = require('electron-log');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const logDir = path.join(os.homedir(), 'Documents', 'Templative');
const logFilePath = path.join(logDir, 'log.log');

try {
    fs.mkdirSync(logDir, { recursive: true });
} catch (err) {
    if (err.code !== 'EEXIST') {
        throw err;
    }
}


console.log(`Writing logs to ${logFilePath}`);

log.transports.file.level = 'info';
log.transports.file.resolvePathFn = () => logFilePath;

log.transports.file.maxSize = 5 * 1024 * 1024;

// Override console methods to capture all logs in packaged app
if (app.isPackaged) {
    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug
    };

    // Override console methods to pipe to electron-log
    console.log = (...args) => {
        log.info(...args);
        originalConsole.log(...args); // Still output to original console
    };
    
    console.error = (...args) => {
        log.error(...args);
        originalConsole.error(...args);
    };
    
    console.warn = (...args) => {
        log.warn(...args);
        originalConsole.warn(...args);
    };
    
    console.info = (...args) => {
        log.info(...args);
        originalConsole.info(...args);
    };
    
    console.debug = (...args) => {
        log.debug(...args);
        originalConsole.debug(...args);
    };
}

module.exports = {
    log: (entry) => log.info(entry),
    error: (entry) => log.error(entry),
    warn: (entry) => log.warn(entry)
};
