const path = require('path');
const fs = require('fs').promises;
const { app } = require('electron');

async function getComponentTemplate(type) {
    let templatePath;
    
    // Check if we're in Electron or in a Node.js script
    if (app) {
        // We're in Electron
        if (app.isPackaged) {
            // In production build
            templatePath = path.join(process.resourcesPath, 'app.asar', 'src', 'main', 'templative', 'lib', 'componentTemplates', `${type}.svg`);
            console.log(`Packaged path: ${templatePath}`);
        } else {
            // In development with Electron
            templatePath = path.join(__dirname, 'componentTemplates', `${type}.svg`);
            console.log(`Development path: ${templatePath}`);
        }
    } else {
        // We're in a Node.js script outside of Electron
        templatePath = path.join(__dirname, 'componentTemplates', `${type}.svg`);
        console.log(`Node.js path: ${templatePath}`);
    }
    
    // Verify the file exists
    try {
        await fs.access(templatePath);
        return templatePath;
    } catch (error) {
        console.error(`Template file not found: ${templatePath}`);
        throw new Error(`Component template for type "${type}" not found at ${templatePath}`);
    }
}

module.exports = { getComponentTemplate };