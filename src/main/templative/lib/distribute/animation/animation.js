const fs = require('fs').promises;
const path = require('path');

async function lookForAnimationFile() {
    const animationFileLocation = "./.animation";
    if (!await fs.exists(animationFileLocation)) {
        return null;
    }
    
    return await fs.readFile(animationFileLocation, 'utf8');
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