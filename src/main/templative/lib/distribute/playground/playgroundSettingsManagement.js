const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

async function writePlaygroundFile(outputPath) {
    const playgroundFileLocation = path.join("./", ".playground");
    await fsPromises.writeFile(playgroundFileLocation, outputPath);
}

async function getPlaygroundDirectory(inputedPlaygroundDirectory) {
    if (inputedPlaygroundDirectory !== undefined) {
        return inputedPlaygroundDirectory;
    }
    
    const playgroundFileLocation = "./.playground";
    try {
        return await fsPromises.readFile(playgroundFileLocation, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        return undefined;
    }
}

module.exports = {
    writePlaygroundFile,
    getPlaygroundDirectory
};