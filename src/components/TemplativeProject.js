const fs = window.require('fs');
const path = window.require("path");

export default class TemplativeProject {
    componentCompose = undefined
    gameCompose = undefined
    gameFile = undefined
    studioFile = undefined

    static readFile(templativeRootDirectoryPath, fileName) {
        var filepath = path.join(templativeRootDirectoryPath, fileName);            
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    getArtdataFilenames() {
        return this.getRecursiveFilenamesInDirectory(this.gameCompose.artdataDirectory)
    }
    getTemplateFilenames() {
        return this.getRecursiveFilenamesInDirectory(this.gameCompose.artTemplatesDirectory)
    }
    getOverlayFilenames() {
        return this.getRecursiveFilenamesInDirectory(this.gameCompose.artInsertsDirectory)
    }
    getPieceGamedataFilenames() {
        return this.getRecursiveFilenamesInDirectory(this.gameCompose.piecesGamedataDirectory)
    }
    getComponentGamedataFilenames() {
        return this.getRecursiveFilenamesInDirectory(this.gameCompose.componentGamedataDirectory)
    }
    getOutputDirectories() {
        var directories = fs.readdirSync(this.gameCompose.outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
        return directories;
    }
    getOutputDirectoriesComponentDirectories(individualOutputDirectoryPath) {
        var outputDirectory = path.join(this.gameCompose.outputDirectory, individualOutputDirectoryPath)
        
        return fs.readdirSync(outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                return path.join(dirent.path, dirent.name)})
    }
    getStudioAndGamedataFilenames() {
        return [
            path.join(this.templativeRootDirectoryPath, "studio.json"),
            path.join(this.templativeRootDirectoryPath, "game.json")
        ]
    }
    getComponentComposeFilepath() {
        return path.join(this.templativeRootDirectoryPath, "component-compose.json")
    }
    getRecursiveFilenamesInDirectory(directory) {
        var fileNames = fs.readdirSync(directory, { recursive: true })
        var filepaths = []
        fileNames.forEach(element => {
            var filepath = path.join(directory, element)
            if (filepath.split(".").pop() === "md") {
                return;
            }
            filepaths.push(filepath)
        });
        return filepaths;
    }
    hydrateGameComposeFile() {
        Object.keys(this.gameCompose).forEach((key) => {
            this.gameCompose[key] = path.join(this.templativeRootDirectoryPath, this.gameCompose[key])
        })
    }

    constructor(templativeRootDirectoryPath) {
        this.templativeRootDirectoryPath = templativeRootDirectoryPath
        this.componentCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "component-compose.json");
        this.gameCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "game-compose.json");
        this.hydrateGameComposeFile()
        
        this.gameFile = TemplativeProject.readFile(templativeRootDirectoryPath, "game.json");
        this.studioFile = TemplativeProject.readFile(templativeRootDirectoryPath, "studio.json");
    }
}