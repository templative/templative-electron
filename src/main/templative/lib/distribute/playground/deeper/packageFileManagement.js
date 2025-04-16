const path = require('path');
const fs = require('fs').promises;
const { copyFile } = require('fs').promises;
const { createHash } = require('crypto');

async function createPackageDirectories(gameName, packagesDirectoryPath) {
    const packageDirectoryPath = path.join(packagesDirectoryPath, gameName);
    try {
        await fs.mkdir(packageDirectoryPath, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    const subDirectoryNames = [
        "Fonts", "Models", "Scripts", "Sounds", "States", "Templates", "Textures", "Thumbnails"
    ];

    for (const subDirectoryName of subDirectoryNames) {
        const subDirectoryPath = path.join(packageDirectoryPath, subDirectoryName);
        try {
            await fs.mkdir(subDirectoryPath, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    return packageDirectoryPath;
}

async function copyFrontImageToTextures(componentName, frontInstructions, textureDirectoryFilepath) {
    const frontImageName = `${componentName}-front.jpeg`;
    const frontImageFilepath = path.join(textureDirectoryFilepath, frontImageName);
    await copyFile(frontInstructions.filepath, frontImageFilepath);
}

async function copyBackImageToTextures(componentName, backInstructions, textureDirectoryFilepath) {
    const backImageName = `${componentName}-back.jpeg`;
    const backImageFilepath = path.join(textureDirectoryFilepath, backImageName);
    await copyFile(backInstructions.filepath, backImageFilepath);
}

async function createManifest(gameName, packageDirectoryPath) {
    const packageGuid = createHash('md5').update(gameName).digest('hex');
    const manifestData = {
        "Name": gameName,
        "Version": "1",
        "GUID": packageGuid
    };
    const manifestFilepath = path.join(packageDirectoryPath, "manifest.json");
    await fs.writeFile(manifestFilepath, JSON.stringify(manifestData, null, 2));
    return packageGuid;
}

module.exports = {
    createPackageDirectories,
    copyFrontImageToTextures,
    copyBackImageToTextures,
    createManifest
};