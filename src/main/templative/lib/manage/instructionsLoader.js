const fs = require('fs').promises;
const path = require('path');

async function loadGameInstructions(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }
    
    const gameFile = await fs.readFile(path.join(gameRootDirectoryPath, "game.json"), 'utf8');
    return JSON.parse(gameFile);
}

async function loadStudioInstructions(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const studioFile = await fs.readFile(path.join(gameRootDirectoryPath, "studio.json"), 'utf8');
    return JSON.parse(studioFile);
}

async function loadComponentInstructions(componentDirectoryPath) {
    if (!componentDirectoryPath) {
        throw new Error("componentDirectoryPath cannot be None");
    }

    const componentFile = await fs.readFile(path.join(componentDirectoryPath, "component.json"), 'utf8');
    return JSON.parse(componentFile);
}

async function loadGameCompose() {
    const gameComposeFile = await fs.readFile("game-compose.json", 'utf8');
    return JSON.parse(gameComposeFile);
}

async function getLastOutputFileDirectory() {
    const gameCompose = await loadGameCompose();
    const outputDirectory = gameCompose["outputDirectory"];
    const lastFileDirectory = path.join(outputDirectory, ".last");

    if (!fs.existsSync(lastFileDirectory)) {
        return null;
    }

    return await fs.readFile(lastFileDirectory, 'utf8');
}

module.exports = {
    loadGameInstructions,
    loadStudioInstructions,
    loadComponentInstructions,
    loadGameCompose,
    getLastOutputFileDirectory
};