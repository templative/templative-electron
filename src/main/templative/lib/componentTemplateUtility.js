const path = require('path');
const { app } = require('electron');

async function getComponentTemplatesDirectoryPath() {   
    // Check if we're in Electron or in a Node.js script

    // Dev
    // "./src/main/templative/lib/componentTemplates"
    
    // npm run make (packaged)
    // "./out/Templative-darwin-arm64/Templative.app/Contents/Resources/componentTemplates"
    // "./out/Templative-darwin-arm64/Templative.app/Contents/Resources/app.asar/.webpack/main/native_modules/componentTemplates/SmallStoutBox.svg"

    // console.log(`process.resourcesPath: ${process.resourcesPath}`);
    // console.log(`__dirname: ${__dirname}`);
    // console.log(`__filename: ${__filename}`);
    // console.log(`app: ${app !== undefined}`);
    // if (app !== undefined) {
    //     console.log(`app.isPackaged: ${app.isPackaged}`);
    // }
    

    if (!app) {
        // console.log(`app is undefined`);
        const result = path.join(__dirname, 'componentTemplates')
        // console.log(`result: ${result}`);
        return result;
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
        // console.log("App is packaged");
        const result = path.join(process.resourcesPath, 'app.asar', '.webpack', 'main', 'native_modules', 'componentTemplates');
        // console.log(`result: ${result}`);
        return result;
    }
    // In development with Electron
    // Fix for __dirname being undefined in dev mode
    const currentDir = path.dirname(__filename);
    const result = path.join(currentDir, 'componentTemplates')
    // console.log("App is not packaged");
    // console.log(`result: ${result}`);
    return result;
    
}

module.exports = { getComponentTemplatesDirectoryPath };