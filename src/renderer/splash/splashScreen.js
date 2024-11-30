const { BrowserWindow, app } = require('electron');
const path = require('path');

class SplashScreen {
    constructor() {
        console.time('splash-window-creation');
        this.window = new BrowserWindow({
            width: 400,
            height: 300,
            frame: false,
            transparent: true,
            show: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
                devTools: true
            },
            title: "Templative Startup",
            icon: path.join(__dirname, '../assets/images/icon.ico')
        });
        
        console.time('splash-window-load');
        
        this.window.loadURL(SPLASH_WINDOW_WEBPACK_ENTRY);
        
        this.window.webContents.once('did-finish-load', () => {
            console.timeEnd('splash-window-load');
            this.updateProgress('Testing initial progress', 10);
        });
        
        // this.window.once('ready-to-show', () => {
        this.window.show();
        this.window.focus();
        // });
        
        console.timeEnd('splash-window-creation');
    }

    updateProgress(message, percent) {
        if (!this.window) return;
        this.window.webContents.send('update-progress', {
            message,
            percent
        });
    }

    close() {
        if (!this.window) return;
        this.window.close();
        this.window = null;
    }
}

module.exports = SplashScreen;