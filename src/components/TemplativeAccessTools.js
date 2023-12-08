const fs = window.require('fs');
const path = window.require("path");

export default class TemplativeAccessTools {

    static readFile(templativeRootDirectoryPath, fileName) {
        var filepath = path.join(templativeRootDirectoryPath, fileName);            
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    static getArtdataFilenames(templativeRootDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        return TemplativeAccessTools.getRecursiveFilenamesInDirectory(templativeRootDirectoryPath, gameCompose.artdataDirectory)
    }
    static getTemplateFilenames(templativeRootDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        return TemplativeAccessTools.getRecursiveFilenamesInDirectory(templativeRootDirectoryPath, gameCompose.artTemplatesDirectory)
    }
    static getOverlayFilenames(templativeRootDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        return TemplativeAccessTools.getRecursiveFilenamesInDirectory(templativeRootDirectoryPath, gameCompose.artInsertsDirectory)
    }
    static getPieceGamedataFilenames(templativeRootDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        return TemplativeAccessTools.getRecursiveFilenamesInDirectory(templativeRootDirectoryPath, gameCompose.piecesGamedataDirectory)
    }
    static getComponentGamedataFilenames(templativeRootDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        return TemplativeAccessTools.getRecursiveFilenamesInDirectory(templativeRootDirectoryPath, gameCompose.componentGamedataDirectory)
    }
    static getOutputDirectories(templativeRootDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"])
        var directories = fs.readdirSync(outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
        return directories;
    }
    static getOutputDirectoriesComponentDirectories(templativeRootDirectoryPath, individualOutputDirectoryPath) {
        var gameCompose = TemplativeAccessTools.readFile(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"], individualOutputDirectoryPath)
        
        return fs.readdirSync(outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                return path.join(dirent.path, dirent.name)})
    }
    static getStudioAndGamedataFilenames(templativeRootDirectoryPath) {
        return [
            path.join(templativeRootDirectoryPath, "studio.json"),
            path.join(templativeRootDirectoryPath, "game.json")
        ]
    }
    static getComponentComposeFilepath(templativeRootDirectoryPath) {
        return path.join(templativeRootDirectoryPath, "component-compose.json")
    }
    static getRecursiveFilenamesInDirectory(templativeRootDirectoryPath, directory) {
        var directoryPath = path.join(templativeRootDirectoryPath, directory)
        var fileNames = fs.readdirSync(directoryPath, { recursive: true })
        var filepaths = []
        fileNames.forEach(element => {
            var filepath = path.join(directory, element)
            if (filepath.split(".").pop() === "md") {
                return;
            }
            filepaths.push(path.join(templativeRootDirectoryPath, filepath))
        });
        return filepaths;
    }
    static hydrateGameComposeFile(templativeRootDirectoryPath, gameCompose) {
        Object.keys(gameCompose).forEach((key) => {
            gameCompose[key] = path.join(templativeRootDirectoryPath, gameCompose[key])
        })
    }
}