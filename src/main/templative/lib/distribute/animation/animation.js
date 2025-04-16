const fs = require('fs').promises;
const path = require('path');

async function lookForAnimationFile() {
    const animationFileLocation = "./.animation";
    try {
        return await fs.readFile(animationFileLocation, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}

async function writeAnimationFile(outputPath) {
    const animationFileLocation = path.join("./", ".animation");
    await fs.writeFile(animationFileLocation, outputPath);
}

async function getAnimationDirectory(inputedAnimationDirectory) {
    if (inputedAnimationDirectory !== null) {
        return inputedAnimationDirectory;
    }
    
    return await lookForAnimationFile();
}

module.exports = {
    getAnimationDirectory,
    writeAnimationFile
};