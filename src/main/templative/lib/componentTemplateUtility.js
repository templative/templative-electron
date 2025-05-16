const path = require('path');

async function getComponentTemplatesDirectoryPath() {   
    // Check if we're in Electron or in a Node.js script

    // Dev
    // "./src/main/templative/lib/componentTemplates"
    
    // npm run make (packaged)
    // "./out/Templative-darwin-arm64/Templative.app/Contents/Resources/componentTemplates"
    // "./out/Templative-darwin-arm64/Templative.app/Contents/Resources/app.asar/.webpack/main/native_modules/componentTemplates/SmallStoutBox.svg"

    // Production 
    // "/Applications/Templative.app/Contents/Resources/componentTemplates"

    // console.log(`process.resourcesPath: ${process.resourcesPath}`);
    // console.log(`__dirname: ${__dirname}`);
    // console.log(`__filename: ${__filename}`);
    // console.log(`app: ${app !== undefined}`);
    // if (app !== undefined) {
    //     console.log(`app.isPackaged: ${app.isPackaged}`);
    // }
    
//     /.webpack/main/previewPieceWorker.bundle.js
// /.webpack/main/produceGameWorker.bundle.js
    if (__dirname.includes('app.asar')) {
        return path.join(__dirname, '../../../componentTemplates');
    }
    return path.join(__dirname, '../../src/main/templative/lib/componentTemplates');
    
}

module.exports = { getComponentTemplatesDirectoryPath };