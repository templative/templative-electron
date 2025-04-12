const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const { produceGame } = require('./gameProducer');
const defineLoader = require('../manage/defineLoader');

const SIMPLE = false;
const NOT_PUBLISHED = false;
const ENGLISH = "en";
const NOT_CLIPPED = false;
const CACHE_ONLY = true;

class CachePreProducerWatcher {
    constructor(gameRootDirectoryPath) {
        if (!gameRootDirectoryPath) {
            throw new Error("Game root directory path is invalid.");
        }
        this.gameRootDirectoryPath = gameRootDirectoryPath;
        this.componentWatchers = {};
        this.artTemplatesWatcher = null;
        this.artInsertsWatcher = null;
        this.componentComposeWatcher = null;
    }

    async openWatchers() {
        console.log(`Watching ${path.normalize(this.gameRootDirectoryPath)}`);
        this.gameCompose = await defineLoader.loadGameCompose(this.gameRootDirectoryPath);

        const componentComposeFilepath = path.join(this.gameRootDirectoryPath, "component-compose.json");
        console.log(componentComposeFilepath);
        this.componentComposeContents = await fsPromises.readFile(componentComposeFilepath, 'utf8');
        this.components = JSON.parse(this.componentComposeContents);

        const noComponentFilter = null;
        // Do not await this, it will block the main thread
        produceGame(this.gameRootDirectoryPath, noComponentFilter, SIMPLE, NOT_PUBLISHED, ENGLISH, NOT_CLIPPED, CACHE_ONLY);

        await this.setupArtWatchers();
        await this.setupComponentWatchers();
        this.watchComponentComposeFile(componentComposeFilepath);
    }

    async setupArtWatchers() {
        const artTemplatesDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["artTemplatesDirectory"]);
        const artInsertsDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["artInsertsDirectory"]);

        this.artTemplatesWatcher = fs.watch(artTemplatesDirectory, async (eventType) => {
            if (eventType === 'change') {
                console.log(`Art template file changed, triggering full rebuild...`);
                // Do not await this, it will block the main thread
                produceGame(this.gameRootDirectoryPath, null, SIMPLE, NOT_PUBLISHED, ENGLISH, NOT_CLIPPED, CACHE_ONLY);
            }
        });

        this.artInsertsWatcher = fs.watch(artInsertsDirectory, async (eventType) => {
            if (eventType === 'change') {
                console.log(`Art insert file changed, triggering full rebuild...`);
                // Do not await this, it will block the main thread
                produceGame(this.gameRootDirectoryPath, null, SIMPLE, NOT_PUBLISHED, ENGLISH, NOT_CLIPPED, CACHE_ONLY);
            }
        });
    }

    async setupComponentWatchers() {
        const filePathsAndTheComponentsThatCareAboutThem = await this.getFilepathsAndTheComponentsThatCareAboutThem();
        for (const [filepath, components] of Object.entries(filePathsAndTheComponentsThatCareAboutThem)) {
            console.log(`Watching ${filepath} for changes...`, Array.from(components));
            const watcher = fs.watch(filepath, this.debounce(async (eventType) => {
                if (eventType !== 'change') {
                    return;
                }
                console.log(`File ${filepath} changed, triggering rebuild for components: ${Array.from(components).join(', ')}`);
                for (const componentName of components) {
                    // Do not await this, it will block the main thread
                    produceGame(this.gameRootDirectoryPath, componentName, SIMPLE, NOT_PUBLISHED, ENGLISH, NOT_CLIPPED, CACHE_ONLY);
                }
            }, 5000));
            this.componentWatchers[filepath] = watcher;
        }
    }

    async getFilepathsAndTheComponentsThatCareAboutThem() {
        const filePathsAndTheComponentsThatCareAboutThem = {};
        for (const component of this.components) {
            const filepathsComponentCaresAbout = await this.getFilepathsForComponent(component);
            for (const filepath of filepathsComponentCaresAbout) {
                if (!filePathsAndTheComponentsThatCareAboutThem[filepath]) {
                    filePathsAndTheComponentsThatCareAboutThem[filepath] = new Set();
                }
                filePathsAndTheComponentsThatCareAboutThem[filepath].add(component.name);
            }
        }
        return filePathsAndTheComponentsThatCareAboutThem;
    }

    async getFilepathsForComponent(component) {
        const piecesContentDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["piecesGamedataDirectory"]);
        const componentContentDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["componentGamedataDirectory"]);
        const artdataDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["artdataDirectory"]);

        const piecesFilepath = path.join(piecesContentDirectory, `${component.piecesGamedataFilename}.json`);
        const componentFilepath = path.join(componentContentDirectory, `${component.componentGamedataFilename}.json`);
        const filepathsComponentCaresAbout = [piecesFilepath, componentFilepath];
        if (component.artdataFrontFilename) {
            const artdataFrontFilepath = path.join(artdataDirectory, `${component.artdataFrontFilename}.json`);
            filepathsComponentCaresAbout.push(artdataFrontFilepath);
        }
        if (component.artdataBackFilename) {
            const artdataBackFilepath = path.join(artdataDirectory, `${component.artdataBackFilename}.json`);
            filepathsComponentCaresAbout.push(artdataBackFilepath);
        }
        if (component.artdataDieFaceFilename) {
            const artdataDieFaceFilepath = path.join(artdataDirectory, `${component.artdataDieFaceFilename}.json`);
            filepathsComponentCaresAbout.push(artdataDieFaceFilepath);
        }
        return filepathsComponentCaresAbout;
    }

    watchComponentComposeFile(componentComposeFilepath) {
        this.componentComposeWatcher = fs.watch(componentComposeFilepath, async (_, filename) => {
            try {
                await fsPromises.access(componentComposeFilepath, fs.constants.R_OK);
                console.log(`Component compose file ${filename} changed, checking for content changes...`);
                const newComponentComposeContents = await fsPromises.readFile(componentComposeFilepath, 'utf8');
                if (this.componentComposeContents === newComponentComposeContents) {
                    return;
                }
                this.componentComposeContents = newComponentComposeContents;

                this.components = JSON.parse(newComponentComposeContents);
                for (const watcher of Object.values(this.componentWatchers)) {
                    watcher.close();
                }
                await this.setupComponentWatchers();

                console.log(`Component compose file ${filename} contents changed, triggering rebuild...`);
                // Do not await this, it will block the main thread
                produceGame(this.gameRootDirectoryPath, null, SIMPLE, NOT_PUBLISHED, ENGLISH, NOT_CLIPPED, CACHE_ONLY);
            } catch (err) {
                console.error(`Error accessing component compose file: ${err}`);
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    closeWatchers() {
        for (const watcher of Object.values(this.componentWatchers)) {
            watcher.close();
        }
        if (this.artTemplatesWatcher) {
            this.artTemplatesWatcher.close();
        }   
        if (this.artInsertsWatcher) {
            this.artInsertsWatcher.close();
        }
        if (this.componentComposeWatcher) {
            this.componentComposeWatcher.close();
        }
    }
}

module.exports = {
    CachePreProducerWatcher
};