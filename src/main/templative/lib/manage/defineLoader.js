const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parse/sync');
const { attemptToLoadJsonFile } = require('../fileManagement/fileLoader');

async function loadGameCompose(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "game-compose.json"));
}

async function loadComponentCompose(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "component-compose.json"));
}

async function loadGame(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "game.json"));
}

async function loadStudio(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    return attemptToLoadJsonFile(path.join(gameRootDirectoryPath, "studio.json"));
}

async function attemptToLoadPieceJsonFile(piecesDirectory, piecesGamedataFilename) {
    const filepath = path.join(piecesDirectory, `${piecesGamedataFilename}.json`);
    try {
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
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return null;
    }
}

async function attemptToLoadPieceCsvFile(piecesDirectory, piecesGamedataFilename) {
    const filepath = path.join(piecesDirectory, `${piecesGamedataFilename}.csv`);
    var gamedataFile;
    try {
        gamedataFile = await fs.readFile(filepath, 'utf8');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return null;
    }
    const data = csv.parse(gamedataFile, {columns: true});
    const gamedata = data.map(item => item);

    const varNames = new Set();
    for (const piece of gamedata) {
        if (!piece.name) {
            console.log("!!! Error parsing piece.");
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
    return attemptToLoadJsonFile(filepath);
}

async function loadArtdata(gameRootDirectoryPath, artdataDirectory, artdataFilename) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const artdataPath = path.join(gameRootDirectoryPath, artdataDirectory);
    const filepath = path.join(artdataPath, `${artdataFilename}.json`);
    return attemptToLoadJsonFile(filepath);
}

async function loadRules(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path cannot be None");
    }

    const filepath = path.join(gameRootDirectoryPath, "rules.md");
    try {
        return await fs.readFile(filepath, 'utf8');
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        return null;
    }
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