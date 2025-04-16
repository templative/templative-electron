const path = require('path');
const { app } = require('electron');

async function getComponentTemplatesDirectoryPath() {   
    // Check if we're in Electron or in a Node.js script
    if (!app) {
        return path.join(__dirname, 'componentTemplates');
    }
    if (app.isPackaged) {
        // In production build
        return path.join(process.resourcesPath, 'app.asar', 'src', 'main', 'templative', 'lib', 'componentTemplates');
    }
    // In development with Electron
    // Fix for __dirname being undefined in dev mode
    const currentDir = path.dirname(__filename);
    return path.join(currentDir, 'componentTemplates');
    
}

module.exports = { getComponentTemplatesDirectoryPath };