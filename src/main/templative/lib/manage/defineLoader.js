const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');
const chalk = require('chalk');

async function loadGameCompose(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const gameComposePath = path.join(gameRootDirectoryPath, "game-compose.json");
    const gameCompose = await fs.readFile(gameComposePath, 'utf8');
    return JSON.parse(gameCompose);
}

async function loadComponentCompose(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const componentComposePath = path.join(gameRootDirectoryPath, "component-compose.json");
    const componentCompose = await fs.readFile(componentComposePath, 'utf8');
    return JSON.parse(componentCompose);
}

async function loadGame(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const gamePath = path.join(gameRootDirectoryPath, "game.json");
    const game = await fs.readFile(gamePath, 'utf8');
    return JSON.parse(game);
}

async function loadStudio(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const studioPath = path.join(gameRootDirectoryPath, "studio.json");
    const studio = await fs.readFile(studioPath, 'utf8');
    return JSON.parse(studio);
}

async function attemptToLoadPieceJsonFile(piecesDirectory, piecesGamedataFilename) {
    const filepath = path.join(piecesDirectory, `${piecesGamedataFilename}.json`);
    if (!fsSync.existsSync(filepath)) {
        return null;
    }
    const gamedataFile = await fs.readFile(filepath, 'utf8');
    const data = JSON.parse(gamedataFile);
    const gamedata = data.map(item => item);

    const varNames = new Set();
    for (const piece of gamedata) {
        if (varNames.has(piece.name)) {
            console.log(`!!! Duplicate piece ${piece.name}.`);
        }
        varNames.add(piece.name);
    }
    return gamedata;
}

async function attemptToLoadPieceCsvFile(piecesDirectory, piecesGamedataFilename) {
    const filepath = path.join(piecesDirectory, `${piecesGamedataFilename}.csv`);
    if (!fsSync.existsSync(filepath)) {
        return null;
    }
    const gamedataFile = await fs.readFile(filepath, 'utf8');
    const data = csv.parse(gamedataFile, {columns: true});
    const gamedata = data.map(item => item);

    const varNames = new Set();
    for (const piece of gamedata) {
        if (!piece.name) {
            console.log(chalk.red("!!! Error parsing piece."));
            console.log(piece);
            return null;
        }
        if (varNames.has(piece.name)) {
            console.log(`!!! Duplicate piece ${piece.name}.`);
        }
        varNames.add(piece.name);
    }
    return gamedata;
}

async function loadPiecesGamedata(gameRootDirectoryPath, gameCompose, piecesGamedataFilename) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    if (!piecesGamedataFilename) {
        return {};
    }

    const piecesDirectory = path.join(gameRootDirectoryPath, gameCompose.piecesGamedataDirectory);
    const pieces = await attemptToLoadPieceJsonFile(piecesDirectory, piecesGamedataFilename);
    if (pieces !== null) {
        return pieces;
    }
    return await attemptToLoadPieceCsvFile(piecesDirectory, piecesGamedataFilename);
}

async function loadComponentGamedata(gameRootDirectoryPath, gameCompose, componentGamedataFilename) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    if (!componentGamedataFilename) {
        return {};
    }

    const componentGamedataDirectory = gameCompose.componentGamedataDirectory;
    const componentGamedataFilenameWithExtension = `${componentGamedataFilename}.json`;
    const filepath = path.join(gameRootDirectoryPath, componentGamedataDirectory, componentGamedataFilenameWithExtension);
    const componentGamedata = await fs.readFile(filepath, 'utf8');
    return JSON.parse(componentGamedata);
}

async function loadArtdata(gameRootDirectoryPath, artdataDirectory, artdataFilename) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const artdataPath = path.join(gameRootDirectoryPath, artdataDirectory);
    const filepath = path.join(artdataPath, `${artdataFilename}.json`);
    if (!fsSync.existsSync(filepath)) {
        return {};
    }
    
    const metadataFile = await fs.readFile(filepath, 'utf8');
    return JSON.parse(metadataFile);
}

async function loadRules(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const filepath = path.join(gameRootDirectoryPath, "rules.md");
    return await fs.readFile(filepath, 'utf8');
}

module.exports = {
    loadGameCompose,
    loadComponentCompose,
    loadGame,
    loadStudio,
    loadPiecesGamedata,
    loadComponentGamedata,
    loadArtdata,
    loadRules
};