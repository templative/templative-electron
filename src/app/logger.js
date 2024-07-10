const log = require('electron-log');
const os = require('os');
const fs = require('fs');
const path = require('path');

const logDir = path.join(os.homedir(), 'Documents', 'Templative');
const logFilePath = path.join(logDir, 'log.log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

console.log(`Writing logs to ${logFilePath}`);

log.transports.file.level = 'info';
log.transports.file.resolvePathFn = () => logFilePath;

log.transports.file.maxSize = 5 * 1024 * 1024;

module.exports = {
    log: (entry) => log.info(entry),
    error: (entry) => log.error(entry),
    warn: (entry) => log.warn(entry)
};
