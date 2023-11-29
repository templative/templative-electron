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
        return this.getFilenamesForField(this.gameCompose.artdataDirectory)
    }
    getTemplateFilenames() {
        return this.getFilenamesForField(this.gameCompose.artTemplatesDirectory)
    }
    getOverlayFilenames() {
        return this.getFilenamesForField(this.gameCompose.artInsertsDirectory)
    }
    getPieceGamedataFilenames() {
        return this.getFilenamesForField(this.gameCompose.piecesGamedataDirectory)
    }
    getComponentGamedataFilenames() {
        return this.getFilenamesForField(this.gameCompose.componentGamedataDirectory)
    }
    getOutputDirectories() {
        var outputDirectory = path.join(this.templativeRootDirectoryPath, this.gameCompose.outputDirectory)

        var directories = fs.readdirSync(outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
        return directories;
    }
    getOutputDirectoriesComponentDirectories(individualOutputDirectoryPath) {
        var outputDirectory = path.join(this.templativeRootDirectoryPath, this.gameCompose.outputDirectory, individualOutputDirectoryPath)
        
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
    getFilenamesForField(field) {
        var fieldPath = path.join(this.templativeRootDirectoryPath, field);
        var fileNames = fs.readdirSync(fieldPath)
        var filepaths = []
        fileNames.forEach(element => {
            filepaths.push(path.join(this.templativeRootDirectoryPath, field, element))
        });
        return filepaths;
    }

    constructor(templativeRootDirectoryPath) {
        this.templativeRootDirectoryPath = templativeRootDirectoryPath
        this.componentCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "component-compose.json");
        this.gameCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "game-compose.json");
        this.gameFile = TemplativeProject.readFile(templativeRootDirectoryPath, "game.json");
        this.studioFile = TemplativeProject.readFile(templativeRootDirectoryPath, "studio.json");
    }
}