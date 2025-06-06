const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const defineLoader = require('../manage/defineLoader');
const {captureMessage, captureException } = require("../sentryElectronWrapper");
const { RENDER_MODE, RENDER_PROGRAM, OVERLAPPING_RENDERING_TASKS } = require('../manage/models/produceProperties');
// This ties us to electron
const { readOrCreateSettingsFile } = require('../../../settingsManager');
// const mainProcess = require('electron').app;
const { createProduceGameWorker } = require('../../workerThread');


const SIMPLE = false;
const NOT_PUBLISHED = false;
const ENGLISH = "en";
const NOT_CLIPPED = false;
const NO_COMPONENT_FILTER = null;

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
        if (!this.gameCompose) {
            console.log("!!! game-compose.json not found.");
            return;
        }

        const componentComposeFilepath = path.join(this.gameRootDirectoryPath, "component-compose.json");
        try {
            this.componentComposeContents = await fsPromises.readFile(componentComposeFilepath, 'utf8');
        } catch (error) {
            console.log(`Component compose file ${componentComposeFilepath} does not exist, skipping watcher setup...`);
            return;
        }
        this.components = JSON.parse(this.componentComposeContents);

        // if (mainProcess.isRendering) {
        //     return;
        // }

        // mainProcess.isRendering = true;

        try {
            const settings = await readOrCreateSettingsFile();
            const renderProgram = settings.renderProgram || RENDER_PROGRAM.TEMPLATIVE;
            
            await createProduceGameWorker({
                directoryPath: this.gameRootDirectoryPath,
                componentFilter: NO_COMPONENT_FILTER,
                isSimple: SIMPLE,
                isPublished: NOT_PUBLISHED,
                language: ENGLISH,
                isClipped: NOT_CLIPPED,
                renderMode: RENDER_MODE.RENDER_TO_CACHE,
                renderProgram: renderProgram,
                overlappingRenderingTasks: OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME
              });
        } catch (error) {
            console.error(`Error producing game from cache pre-producer watcher:`, error);
            captureException(error);
        } finally {
            // mainProcess.isRendering = false; // Reset the flag after rendering is complete
        }

        await this.setupArtWatchers();
        await this.setupComponentWatchers();
        this.watchComponentComposeFile(componentComposeFilepath);
    }

    async setupArtWatchers() {
        const artTemplatesDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["artTemplatesDirectory"]);
        const artInsertsDirectory = path.join(this.gameRootDirectoryPath, this.gameCompose["artInsertsDirectory"]);

        // Track the latest modification time for each directory
        let lastTemplatesModTime = await this.getLatestModificationTime(artTemplatesDirectory);
        let lastInsertsModTime = artTemplatesDirectory === artInsertsDirectory ? 
            lastTemplatesModTime : 
            await this.getLatestModificationTime(artInsertsDirectory);

        const fullRebuild = this.debounce(async (eventType, directoryPath, isTemplates) => {
            if (eventType !== 'change') {
                return;
            }
            // if (mainProcess.isRendering) {
            //     return;
            // }

            // Check if any file in the directory has a newer modification time
            const currentModTime = await this.getLatestModificationTime(directoryPath);
            const lastModTime = isTemplates ? lastTemplatesModTime : lastInsertsModTime;
            
            if (currentModTime <= lastModTime) {
                console.log(`No actual file changes detected in ${directoryPath}, skipping rebuild`);
                return;
            }
            
            // Update the stored modification time
            if (isTemplates) {
                lastTemplatesModTime = currentModTime;
                if (artTemplatesDirectory === artInsertsDirectory) {
                    lastInsertsModTime = currentModTime;
                }
            } else {
                lastInsertsModTime = currentModTime;
            }
            
            console.log(`Arts file changed, triggering full rebuild...`);
            // mainProcess.isRendering = true;
            try {
                // Do not await this, it will block the main thread
                const settings = await readOrCreateSettingsFile();
                const renderProgram = settings.renderProgram || RENDER_PROGRAM.TEMPLATIVE;  
                
                await createProduceGameWorker({
                    directoryPath: this.gameRootDirectoryPath,
                    componentFilter: NO_COMPONENT_FILTER,
                    isSimple: SIMPLE,
                    isPublished: NOT_PUBLISHED,
                    language: ENGLISH,
                    isClipped: NOT_CLIPPED,
                    renderMode: RENDER_MODE.RENDER_TO_CACHE,
                    renderProgram: renderProgram,
                    overlappingRenderingTasks: OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME
                  });
            } catch (error) {
                console.error(`Error producing game from art inserts watcher:`, error);
                captureException(error);
            } finally {
                // mainProcess.isRendering = false;
            }
        }, 5000);
        
        this.artTemplatesWatcher = fs.watch(artTemplatesDirectory, (eventType) => 
            fullRebuild(eventType, artTemplatesDirectory, true));
        
        if (artTemplatesDirectory != artInsertsDirectory) {
            this.artInsertsWatcher = fs.watch(artInsertsDirectory, (eventType) => 
                fullRebuild(eventType, artInsertsDirectory, false));
        }
    }

    // Helper method to get the latest modification time of any file in a directory
    async getLatestModificationTime(directoryPath) {
        try {
            let latestTime = 0;
            
            // Recursive function to scan directory and find latest modification time
            const scanDirectory = async (dirPath) => {
                const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dirPath, entry.name);
                    
                    try {
                        const stats = await fsPromises.stat(fullPath);
                        
                        if (stats.isDirectory()) {
                            // Recursively scan subdirectories
                            await scanDirectory(fullPath);
                        } else {
                            // Update latest time if this file is newer
                            if (stats.mtimeMs > latestTime) {
                                latestTime = stats.mtimeMs;
                            }
                        }
                    } catch (err) {
                        console.log(`Error accessing ${fullPath}: ${err.message}`);
                    }
                }
            };
            
            await scanDirectory(directoryPath);
            return latestTime;
        } catch (error) {
            console.error(`Error scanning directory ${directoryPath}:`, error);
            return 0;
        }
    }

    async setupComponentWatchers() {
        const filePathsAndTheComponentsThatCareAboutThem = await this.getFilepathsAndTheComponentsThatCareAboutThem();
        
        for (const [filepath, components] of Object.entries(filePathsAndTheComponentsThatCareAboutThem)) {
            // console.log(`Watching ${filepath} for changes...`, Array.from(components));
            try {
                await fsPromises.access(filepath, fs.constants.R_OK);
            } catch (error) {
                console.log(`File ${filepath} does not exist, skipping watcher setup for ${Array.from(components).join(', ')}...`);
                continue;
            }
            let previousContents = await fsPromises.readFile(filepath, 'utf8');
            const watcher = fs.watch(filepath, this.debounce(async () => {
                try {
                    const currentContents = await fsPromises.readFile(filepath, 'utf8');
                    if (currentContents === previousContents) {
                        return;
                    }
                    previousContents = currentContents;
                    console.log(`File ${filepath} contents changed, triggering rebuild for components: ${Array.from(components).join(', ')}`);

                    // if (mainProcess.isRendering) {
                    //     return;
                    // }
                    // mainProcess.isRendering = true;

                    for (const componentName of components) {
                        try {
                            // Do not await this, it will block the main thread
                            const settings = await readOrCreateSettingsFile();
                            const renderProgram = settings.renderProgram || RENDER_PROGRAM.TEMPLATIVE;
                            
                            await createProduceGameWorker({
                                directoryPath: this.gameRootDirectoryPath,
                                componentFilter: componentName,
                                isSimple: SIMPLE,
                                isPublished: NOT_PUBLISHED,
                                language: ENGLISH,
                                isClipped: NOT_CLIPPED,
                                renderMode: RENDER_MODE.RENDER_TO_CACHE,
                                renderProgram: renderProgram,
                                overlappingRenderingTasks: OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME
                              });
                        } catch (error) {
                            console.error(`Error producing game from component ${componentName} watcher:`, error);
                            captureException(error);
                        } finally {
                            // mainProcess.isRendering = false; // Reset the flag after rendering is complete
                        }
                    }
                } catch (error) {
                    console.error(`Error reading file ${filepath}:`, error);
                }
            }, 5000));
            this.componentWatchers[filepath] = watcher;
        }
    }

    async getFilepathsAndTheComponentsThatCareAboutThem() {
        const filePathsAndTheComponentsThatCareAboutThem = {};
        for (const component of this.components) {
            const componentType = component.type;
            if (componentType.startsWith("STOCK_")) {
                continue;
            }
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
        const fullRebuildWithRewiring = this.debounce(async (_, filename) => {
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
                // if (mainProcess.isRendering) {
                //     return;
                // }

                // mainProcess.isRendering = true;

                try {
                    const settings = await readOrCreateSettingsFile();
                    const renderProgram = settings.renderProgram || RENDER_PROGRAM.TEMPLATIVE;
                    await createProduceGameWorker({
                        directoryPath: this.gameRootDirectoryPath,
                        componentFilter: NO_COMPONENT_FILTER,
                        isSimple: SIMPLE,
                        isPublished: NOT_PUBLISHED,
                        language: ENGLISH,
                        isClipped: NOT_CLIPPED,
                        renderMode: RENDER_MODE.RENDER_TO_CACHE,
                        renderProgram: renderProgram,
                        overlappingRenderingTasks: OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME
                    });
                } catch (error) {
                    console.error(`Error producing game from component compose file watcher:`, error);
                    captureException(error);
                } finally {
                    // mainProcess.isRendering = false;
                }
            } catch (err) {
                console.error(`Error accessing component compose file: ${err}`);
            }
        }, 5000)
        this.componentComposeWatcher = fs.watch(componentComposeFilepath, fullRebuildWithRewiring);
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