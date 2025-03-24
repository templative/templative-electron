const fs = require('fs/promises');
const fsExtra = require('fs-extra');

class SvgFileCache {
    constructor(name) {
        this.cache = new Map();
    }

    async readSvgFile(filePath) {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }
        
        if (!await fsExtra.pathExists(filePath)) {
            throw new Error(`SVG file ${filePath} does not exist.`);
        }
        
        const fileContent = await fs.readFile(filePath, 'utf8');
        this.cache.set(filePath, fileContent);
        return fileContent;
    }

    isCached(filePath) {
        return this.cache.has(filePath);
    }

    // Note that destructing this suffices for clearing the cache
    clearCache() {
        this.cache.clear();
    }

    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

const defaultInstance = new SvgFileCache();

module.exports = {
    SvgFileCache,
    readSvgFile: (path) => defaultInstance.readSvgFile(path),
    isCached: (path) => defaultInstance.isCached(path),
    clearSvgFileCache: () => defaultInstance.clearCache(),
    getCacheStats: () => defaultInstance.getCacheStats()
}; 