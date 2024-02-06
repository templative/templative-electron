const fs = window.require('fs/promises');
const path = window.require("path");

export default class TemplativeAccessTools {

    static readFileContentsAsJsonAsync = async (templativeRootDirectoryPath, fileName) => {
        var filepath = path.join(templativeRootDirectoryPath, fileName);
        var fileContentsBuffer = await fs.readFile(filepath, 'utf8')     
        var fileContents = fileContentsBuffer.toString()
        if (fileContents.trim() === "") {
            console.error(`${fileName} is invalid json: ${fileContents.trim()}`)
            return undefined;
        }        
        return JSON.parse(fileContents);
    }
    static readFileContentsAsync = async (templativeRootDirectoryPath, fileName) => {
        var filepath = path.join(templativeRootDirectoryPath, fileName);      
        var fileContentsBuffer = await fs.readFile(filepath, 'utf8')      
        return fileContentsBuffer.toString()
    }
    static getOutputDirectoriesAsync = async (templativeRootDirectoryPath) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsAsJsonAsync(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"])
        var directories = await fs.readdir(outputDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent)
        return directories;
    }
    static getOutputDirectoriesComponentDirectoriesAsync = async (templativeRootDirectoryPath, individualOutputDirectoryPath) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsAsJsonAsync(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"], individualOutputDirectoryPath)
        
        return await fs.readdir(outputDirectory, { withFileTypes: true })
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
    static getRulesFilepath(templativeRootDirectoryPath) {
        return path.join(templativeRootDirectoryPath, "rules.md")
    }
    static getStudioGamedataFilename(templativeRootDirectoryPath) {
        return path.join(templativeRootDirectoryPath, "studio.json")
    }
    static getGameGamedataFilenames(templativeRootDirectoryPath) {
        return path.join(templativeRootDirectoryPath, "game.json")
    }
    static getComponentComposeFilepath(templativeRootDirectoryPath) {
        return path.join(templativeRootDirectoryPath, "component-compose.json")
    }
}