const path = require('path');
const fs = require('fs').promises;
const { app } = require('electron');

async function fileExists(filepath) {
    try {
        await fs.access(filepath);
        return true;
    } catch (error) {
        return false;
    }
}
async function getComponentTemplate(type, artDataTypeName) {
    let templatePath;
    
    // Check if we're in Electron or in a Node.js script
    if (app) {
        // We're in Electron
        if (app.isPackaged) {
            // In production build
            templatePath = path.join(process.resourcesPath, 'app.asar', 'src', 'main', 'templative', 'lib', 'componentTemplates', `${type}`);
            console.log(`Packaged path: ${templatePath}`);
        } else {
            // In development with Electron
            // Fix for __dirname being undefined in dev mode
            const currentDir = path.dirname(__filename);
            templatePath = path.join(currentDir, 'componentTemplates', `${type}`);
            console.log(`Development path: ${templatePath}`);
        }
    } else {
        // We're in a Node.js script outside of Electron
        templatePath = path.join(__dirname, 'componentTemplates', `${type}`);
        console.log(`Node.js path: ${templatePath}`);
    }
    
    // Verify the file exists
    const artdataSpecificFilepath = `${templatePath}/${artDataTypeName}.svg`;
    const defaultFilepath = `${templatePath}.svg`;
    if (await fileExists(artdataSpecificFilepath)) {
        return artdataSpecificFilepath;
    } else if (await fileExists(defaultFilepath)) {
        return defaultFilepath;
    } else {
        throw new Error(`Component template for type "${type}" not found at ${templatePath}`);
    }

}

module.exports = { getComponentTemplate };