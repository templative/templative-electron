const path = require('path');
const { app } = require('electron');
// const asar = require('asar');

async function getComponentTemplatesDirectoryPath() {   
    // Check if we're in Electron or in a Node.js script
    if (!app) {
        return path.join(__dirname, 'componentTemplates');
    }
    if (app.isPackaged) {
        // In production build
        // const asarPath = path.join(process.resourcesPath, 'app.asar');
        // try {
        //     const files = asar.listPackage(asarPath);
        //     console.log(`Files in app.asar: ${files.join(', ')}`);
        // } catch (error) {
        //     console.error(`Error reading app.asar:`, error);
        // }
        return path.join(process.resourcesPath, 'app.asar', '.webpack', 'main', 'native_modules', 'componentTemplates');
    }
    // In development with Electron
    // Fix for __dirname being undefined in dev mode
    const currentDir = path.dirname(__filename);
    return path.join(currentDir, 'componentTemplates');
    
}

module.exports = { getComponentTemplatesDirectoryPath };