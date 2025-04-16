const fs = require('fs').promises;
const path = require('path');
const { attemptToLoadJsonFile } = require('../fileManagement/fileLoader');

async function loadGameInstructions(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }
    
    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "game.json"));
}

async function loadStudioInstructions(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "studio.json"));
}

async function loadComponentInstructions(componentDirectoryPath) {
    if (!componentDirectoryPath) {
        throw new Error("componentDirectoryPath cannot be None");
    }

    return attemptToLoadJsonFile(path.join(componentDirectoryPath, "component.json"));
}

async function loadGameCompose() {
    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "game-compose.json"));
}

async function getLastOutputFileDirectory() {
    const gameCompose = await loadGameCompose();
    const outputDirectory = gameCompose["outputDirectory"];
    const lastFileDirectory = path.join(outputDirectory, ".last");
    try {
        return await fs.readFile(lastFileDirectory, 'utf8');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return null;
    }
}

module.exports = {
    loadGameInstructions,
    loadStudioInstructions,
    loadComponentInstructions,
    loadGameCompose,
    getLastOutputFileDirectory
};