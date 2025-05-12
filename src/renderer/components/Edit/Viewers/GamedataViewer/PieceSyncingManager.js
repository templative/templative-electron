const path = require("path")

function getSyncKey(templativeRootDirectoryPath, gameCompose, filepath) {
    const syncKey = path.relative(path.join(templativeRootDirectoryPath, gameCompose["piecesGamedataDirectory"]), filepath).replace(/\\/g, "/")
    return syncKey
}

module.exports = {
    getSyncKey
}