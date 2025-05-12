const fs = require('fs/promises');

class SvgFileCache {
    constructor(name) {
        this.cache = new Map();
    }

    async readSvgFile(filePath) {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }
        
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            this.cache.set(filePath, fileContent);
            return fileContent;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            console.error(`Error reading SVG file ${filePath}: ${error}`);
            return null;
        }
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