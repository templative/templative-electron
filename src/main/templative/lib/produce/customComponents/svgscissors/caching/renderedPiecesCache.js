const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const fsPromises = require('fs').promises;
const { getScopedValue } = require('../artdataProcessing/valueResolver');
const os = require('os');

async function getRenderedPiecesCacheDir() {
    const cacheDir = path.join(os.homedir(), 'Documents', 'Templative', 'art-cache');
    
    try {
        await fsExtra.mkdirs(cacheDir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
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

async function getCachedFilePath(hash, extension) {
    const cacheDir = await getRenderedPiecesCacheDir();
    return path.join(cacheDir, `${hash}.${extension}`);
}

async function getCachedFiles(hash) {
    const svgPath = await getCachedFilePath(hash, 'svg');
    const pngPath = await getCachedFilePath(hash, 'png');
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
    const cacheSvgPath = await getCachedFilePath(hash, 'svg');
    const cachePngPath = await getCachedFilePath(hash, 'png');
    await fsExtra.writeFile(cacheSvgPath, svgContent);
    await fsExtra.copy(pngPath, cachePngPath);
}

module.exports = { createInputHash, getCachedFiles, cacheFiles, getRenderedPiecesCacheDir }; 