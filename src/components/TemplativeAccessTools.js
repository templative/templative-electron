const fs = require('fs/promises');
const path = require("path");

export default class TemplativeAccessTools {
    static getMostRecentComponentImage = async(templativeRootDirectoryPath, componentName) => {
        if (templativeRootDirectoryPath === undefined || templativeRootDirectoryPath.trim() === "") {
            console.error("No templativeRootDirectoryPath given to readFileContentsFromTemplativeProjectAsJsonAsync.")
        }
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"])
        var outputDirectories = await fs.readdir(outputDirectory, { withFileTypes: true })
        outputDirectories = outputDirectories
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                // console.log(`Output Directory ${dirent.name}`)
                return path.join(outputDirectory, dirent.name)}
            )
        for (let index = 0; index < outputDirectories.length; index++) {
            const outputDirectoryPath = outputDirectories[index];
            var outputDirectoryComponentDirectories = await fs.readdir(outputDirectoryPath, { withFileTypes: true })
            outputDirectoryComponentDirectories = outputDirectoryComponentDirectories
                .filter(dirent => dirent.isDirectory())
                .map(dirent => {
                    // console.log(`Component Directory ${dirent.name}`)
                    return path.join(outputDirectoryPath, dirent.name)}
                )
            for (let index = 0; index < outputDirectoryComponentDirectories.length; index++) {
                const componentDirectoryPath = outputDirectoryComponentDirectories[index];
                
                var componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json")
                var instructions = await TemplativeAccessTools.loadFileContentsAsJson(componentInstructionsFilepath)
                if (instructions["name"] !== componentName) {
                    continue;
                }
                return componentDirectoryPath
            }
        }
        return undefined
    }
    static loadFileContentsAsJson = async (filepath) => {
        if (filepath === undefined || filepath.trim() === "") {
            console.error("No filepath given to loadFileContentsAsJson.")
        }
        if (!await this.doesFileExistAsync(filepath)) {
            console.error(`Does not exist ${filepath}.`)
        }
        var fileContentsBuffer = await fs.readFile(filepath, 'utf8')     
        var fileContents = fileContentsBuffer.toString()
        // console.log(fileContentsBuffer)
        // console.log(fileContents)
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

    static doesFileExistAsync = async (filepath) => {
        try {
            await fs.access(filepath, fs.constants.F_OK)
            return true
        }
        catch {
            return false
        }
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
            .map(dirent => ({
                name: dirent.name,
                path: path.join(outputDirectory)
            }))
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