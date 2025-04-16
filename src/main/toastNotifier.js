const { channels } = require('../shared/constants');
const { BrowserWindow } = require('electron');

const updateToast = (message, type) => {
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TOAST_MESSAGE, message, type);
}

module.exports = {
    updateToast
}