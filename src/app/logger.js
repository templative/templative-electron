const log = require('electron-log');
const os = require('os')

console.log(`Writing logs to ${os.homedir() + "/Documents/Templative/log.log"}`)

log.transports.file.level = 'info';
log.transports.file.resolvePathFn = () => os.homedir() + "/Documents/Templative/log.log";

module.exports = {
    log: (entry) => log.info(entry),
    error: (entry) => log.error(entry),
    warn: (entry) => log.warn(entry)
}
