const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const fsPromises = require('fs').promises;
const { getScopedValue } = require('../artdataProcessing/valueResolver');
const os = require('os');

async function getRenderedPiecesCacheDir() {
    const cacheDir = path.join(os.homedir(), 'Documents', 'Templative', 'art-cache');
    await fsExtra.mkdirs(cacheDir);
    return cacheDir;
}

async function createInputHash(inputs) {
    const hash = createHash('sha256');
    const commands = [...inputs.artdata.textReplacements, ...inputs.artdata.styleUpdates, ...inputs.artdata.overlays];

    for (const command of commands) {
        const value = await getScopedValue(command, inputs.gamedata);
        var hashableCommand = Object.assign({}, command);
        delete hashableCommand.scope;
        delete hashableCommand.source;
        hashableCommand.value = value;

        hash.update(JSON.stringify(hashableCommand));
    }

    var hashableProductionProperties = Object.assign({}, inputs.productionProperties);
    delete hashableProductionProperties.inputDirectoryPath;
    delete hashableProductionProperties.outputDirectoryPath;
    delete hashableProductionProperties.renderMode;
    hash.update(JSON.stringify(hashableProductionProperties || {}));

    hash.update(inputs.templateContent || '');
    if (inputs.overlayFiles) {
        for (const overlayFile of inputs.overlayFiles) {
            try {
                hash.update(overlayFile.content || '');
            } catch (e) { continue; }
        }
    }
    const hashString = hash.digest('hex');
    return hashString;
}

function getCachedFilePath(hash, extension) {
    const cacheDir = getRenderedPiecesCacheDir();
    return path.join(cacheDir, `${hash}.${extension}`);
}

async function getCachedFiles(hash) {
    const svgPath = getCachedFilePath(hash, 'svg');
    const pngPath = getCachedFilePath(hash, 'png');
    let svgContent = null;
    try {
        svgContent = await fsExtra.readFile(svgPath, 'utf8');
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
        return null;
    }
    try {
        await fsExtra.readFile(pngPath, 'utf8');
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
        return null;
    }
    
    return {
        svg: svgContent,
        svgPath,
        pngPath
    };
}

async function cacheFiles(hash, svgContent, pngPath) {
    const cacheSvgPath = getCachedFilePath(hash, 'svg');
    const cachePngPath = getCachedFilePath(hash, 'png');
    await fsExtra.writeFile(cacheSvgPath, svgContent);
    await fsExtra.copy(pngPath, cachePngPath);
}

module.exports = { createInputHash, getCachedFilePath, getCachedFiles, cacheFiles, getRenderedPiecesCacheDir }; 