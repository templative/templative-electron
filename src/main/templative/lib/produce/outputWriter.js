const fs = require('fs').promises;
const path = require('path');

async function dumpInstructions(filepath, data) {
    if (!filepath) {
        throw new Error("Instructions filepath cannot be None");
    }

    await fs.writeFile(filepath, JSON.stringify(data, null, 4));
}

async function createGameFolder(gameRootDirectoryPath, outputDirectory, name) {
    const gameFolderPath = path.join(gameRootDirectoryPath, outputDirectory, name);
    await fs.mkdir(gameFolderPath, { recursive: true });
    return gameFolderPath;
}

async function updateLastOutputFolder(gameRootDirectoryPath, outputDirectory, gameFolderPath) {
    const lastFilepath = path.join(gameRootDirectoryPath, outputDirectory, ".last");
    await fs.writeFile(lastFilepath, gameFolderPath);
}

async function createComponentFolder(name, outputDirectory) {
    const componentDirectory = path.join(outputDirectory, name);
    await fs.mkdir(componentDirectory, { recursive: true });
    return componentDirectory;
}

async function copyStudioFromGameFolderToOutput(studio, gameFolderPath) {
    const studioFilepath = path.join(gameFolderPath, "studio.json");
    await dumpInstructions(studioFilepath, studio);
}

async function copyGameFromGameFolderToOutput(game, gameFolderPath) {
    const studioFilepath = path.join(gameFolderPath, "game.json");
    await dumpInstructions(studioFilepath, game);
}

module.exports = {
    dumpInstructions,
    createGameFolder,
    updateLastOutputFolder,
    createComponentFolder,
    copyStudioFromGameFolderToOutput,
    copyGameFromGameFolderToOutput
};