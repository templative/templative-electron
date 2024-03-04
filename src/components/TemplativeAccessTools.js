const fs = require('fs/promises');
const path = require("path");

export default class TemplativeAccessTools {

    static loadFileContentsAsJson = async (filepath) => {
        if (filepath === undefined || filepath.trim() === "") {
            console.error("No filepath given to loadFileContentsAsJson.")
        }
        var fileContentsBuffer = await fs.readFile(filepath, 'utf8')     
        var fileContents = fileContentsBuffer.toString()
        if (fileContents.trim() === "") {
            console.error(`${filepath} is invalid json: ${fileContents.trim()}`)
            return undefined;
        }        
        return JSON.parse(fileContents);
    }

    static readFileContentsFromTemplativeProjectAsJsonAsync = async (templativeRootDirectoryPath, fileName) => {
        if (templativeRootDirectoryPath === undefined || templativeRootDirectoryPath.trim() === "") {
            console.error("No templativeRootDirectoryPath given to readFileContentsFromTemplativeProjectAsJsonAsync.")
        }
        if (fileName === undefined || fileName.trim() === "") {
            console.error("No fileName given to readFileContentsFromTemplativeProjectAsJsonAsync.")
        }
        var filepath = path.join(templativeRootDirectoryPath, fileName);
        return await this.loadFileContentsAsJson(filepath)
    }
    
    static readFileContentsAsync = async (filepath) => {
        if (filepath === undefined || filepath.trim() === "") {
            console.error("No filepath given to readFileContentsAsync.")
        }
        var fileContentsBuffer = await fs.readFile(filepath, 'utf8')      
        return fileContentsBuffer.toString()
    }

    static readFileContentsFromTemplativeProjectAsync = async (templativeRootDirectoryPath, fileName) => {
        if (templativeRootDirectoryPath === undefined || templativeRootDirectoryPath.trim() === "") {
            console.error("No templativeRootDirectoryPath given to readFileContentsFromTemplativeProjectAsync.")
        }
        if (fileName === undefined || fileName.trim() === "") {
            console.error("No fileName given to readFileContentsFromTemplativeProjectAsync.")
        }
        var filepath = path.join(templativeRootDirectoryPath, fileName);      
        return await TemplativeAccessTools.readFileContentsAsync(filepath)
    }
    static getOutputDirectoriesAsync = async (templativeRootDirectoryPath) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"])
        var directories = await fs.readdir(outputDirectory, { withFileTypes: true })
        directories = directories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent)
        return directories;
    }
    static getOutputDirectoriesComponentDirectoriesAsync = async (templativeRootDirectoryPath, individualOutputDirectoryPath) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"], individualOutputDirectoryPath)
        var outputDirectories = await fs.readdir(outputDirectory, { withFileTypes: true })
        outputDirectories = outputDirectories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                return path.join(dirent.path, dirent.name)})
        return outputDirectories
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