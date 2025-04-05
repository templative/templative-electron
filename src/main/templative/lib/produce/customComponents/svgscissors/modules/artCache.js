const { createHash } = require('crypto');
const path = require('path');
const fsExtra = require('fs-extra');
const fsPromises = require('fs').promises;
const electron = require('electron');
const { getScopedValue } = require('../artdataProcessing/valueResolver');

class ArtCache {
    constructor() {
        let userDataPath;
        if (typeof electron !== 'undefined' && (electron.app || electron.remote?.app)) {
            userDataPath = (electron.app || electron.remote.app).getPath('userData');
        } else {
            userDataPath = path.join(process.cwd(), '.templativeCache');
            fsExtra.ensureDirSync(userDataPath)
        }
        this.cacheDir = path.join(userDataPath, 'art-cache');
        fsExtra.ensureDirSync(this.cacheDir);
    }
    async createInputHash(inputs) {
        const hash = createHash('sha256');
        
        const commands = [...inputs.artdata.textReplacements, ...inputs.artdata.styleUpdates, ...inputs.artdata.overlays]

        for (const command of commands) {
            const value = await getScopedValue(command, inputs.gamedata);
            var hashableCommand = Object.assign({}, command);
            delete hashableCommand.scope;
            delete hashableCommand.source;
            hashableCommand.value = value;

            hash.update(JSON.stringify(hashableCommand));
        }

        // Keep isPublish, isSimple, targetLanguage, isClipped
        var hashableProductionProperties = Object.assign({}, inputs.productionProperties);
        delete hashableProductionProperties.inputDirectoryPath;
        delete hashableProductionProperties.outputDirectoryPath;
        hash.update(JSON.stringify(hashableProductionProperties || {}));

        hash.update(inputs.templateContent || '');
        // console.log(inputs.overlayFiles);
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

    getCachedFilePath(hash, extension) {
        return path.join(this.cacheDir, `${hash}.${extension}`);
    }

    async getCachedFiles(hash) {
        const svgPath = this.getCachedFilePath(hash, 'svg');
        const pngPath = this.getCachedFilePath(hash, 'png');

        if (await fsExtra.pathExists(svgPath) && await fsExtra.pathExists(pngPath)) {
            return {
                svg: await fsExtra.readFile(svgPath, 'utf8'),
                svgPath,
                pngPath
            };
        }
        return null;
    }

    async cacheFiles(hash, svgContent, pngPath) {
        const cacheSvgPath = this.getCachedFilePath(hash, 'svg');
        const cachePngPath = this.getCachedFilePath(hash, 'png');

        await fsExtra.writeFile(cacheSvgPath, svgContent);
        await fsExtra.copy(pngPath, cachePngPath);
    }
}

module.exports = { ArtCache }; 