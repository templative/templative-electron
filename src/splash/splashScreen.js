const { BrowserWindow, app } = require('electron');
const path = require('path');
const fs = require('fs');

class SplashScreen {
    constructor() {
        // Calculate the absolute path to the gif, accounting for webpack output
        const gifPath = app.isPackaged
            ? path.join(process.resourcesPath, 'app', '.webpack', 'assets', 'images', 'undulatingEye.gif')
            : path.join(__dirname, '..', '..', 'src', 'splash', 'undulatingEye.gif');
        
        const cssPath = app.isPackaged
            ? path.join(process.resourcesPath, 'app', '.webpack', 'assets', 'css', 'splash.css')
            : path.join(__dirname, '..', '..', 'src', 'splash', 'splash.css');

        // Similarly adjust favicon and splash paths
        const faviconPath = app.isPackaged
            ? path.join(process.resourcesPath, 'app', '.webpack', 'main', 'native_modules', 'favicon.ico')
            : path.join(__dirname, '..', '..', 'src', 'splash', 'favicon.ico');
            
        const splashPath = app.isPackaged
            ? path.join(process.resourcesPath, 'app', '.webpack', 'main', 'native_modules', 'splash.html')
            : path.join(__dirname, '..', '..', 'src', 'splash', 'splash.html');

        // Log paths and existence
        console.log('Current directory:', __dirname);
        console.log('Paths and existence check:');
        console.log(`GIF Path: ${gifPath}`);
        console.log(`GIF exists: ${fs.existsSync(gifPath)}`);
        console.log(`CSS Path: ${cssPath}`);
        console.log(`CSS exists: ${fs.existsSync(cssPath)}`);
        console.log(`Favicon Path: ${faviconPath}`);
        console.log(`Favicon exists: ${fs.existsSync(faviconPath)}`);
        console.log(`Splash HTML Path: ${splashPath}`);
        console.log(`Splash HTML exists: ${fs.existsSync(splashPath)}`);

        this.window = new BrowserWindow({
            width: 400,
            height: 300,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
                devTools: true,
                additionalArguments: [
                    `--gif-path=${gifPath}`,
                    `--css-path=${cssPath}`
                ]
            },
            title: "Templative Startup",
            icon: faviconPath,
        });
        
        this.window.loadFile(splashPath);
        // this.window.webContents.openDevTools();
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