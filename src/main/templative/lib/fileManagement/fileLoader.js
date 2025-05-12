const fs = require('fs').promises;
const path = require('path');

async function attemptToLoadJsonFile(filepath) {
    if (!filepath) {
        throw new Error("filepath cannot be None");
    }
    if (!path.isAbsolute(filepath)) {
        throw new Error("filepath must be an absolute path");
    }
    if (path.extname(filepath) !== ".json") {
        throw new Error("filepath must be a JSON file");
    }

    let file;
    try {
        file = await fs.readFile(filepath, 'utf8');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return null;
    }
    return JSON.parse(file);
}

module.exports = {
    attemptToLoadJsonFile
};