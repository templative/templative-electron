const fs = require('fs/promises');
const path = require("path");

export default class TemplativeAccessTools {
    
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
    static getAllComponentThumbnails = async(templativeRootDirectoryPath, componentNames) => {
        if (templativeRootDirectoryPath === undefined || templativeRootDirectoryPath.trim() === "") {
            console.error("No templativeRootDirectoryPath given");
            return {};
        }

        const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(
            templativeRootDirectoryPath, 
            "game-compose.json"
        );
        const outputDirectory = path.join(templativeRootDirectoryPath, gameCompose["outputDirectory"]);
        
        // Get and sort output directories by most recent first
        const outputDirents = await fs.readdir(outputDirectory, { withFileTypes: true });
        const outputDirs = await Promise.all(
            outputDirents
                .filter(dirent => dirent.isDirectory())
                .map(async dirent => {
                    const fullPath = path.join(outputDirectory, dirent.name);
                    const stats = await fs.stat(fullPath);
                    return { path: fullPath, mtime: stats.mtime };
                })
        );
        outputDirs.sort((a, b) => b.mtime - a.mtime);

        // Create a map to store results
        const thumbnailPaths = {};
        
        // Check the most recent output directory first
        for (const outputDir of outputDirs) {
            const componentDirents = await fs.readdir(outputDir.path, { withFileTypes: true });
            const componentDirs = componentDirents
                .filter(dirent => dirent.isDirectory())
                .map(dirent => path.join(outputDir.path, dirent.name));
                
            // Process all components in this directory
            await Promise.all(componentDirs.map(async componentDir => {
                try {
                    const instructionsPath = path.join(componentDir, "component.json");
                    const instructions = await TemplativeAccessTools.loadFileContentsAsJson(instructionsPath);
                    const componentName = instructions["name"];
                    
                    // Only process if we're looking for this component and haven't found it yet
                    if (componentNames.includes(componentName) && !thumbnailPaths[componentName]) {
                        thumbnailPaths[componentName] = componentDir;
                    }
                } catch (error) {
                    // Skip if can't read instructions
                }
            }));
            
            // Break early if we've found all components
            if (Object.keys(thumbnailPaths).length === componentNames.length) {
                break;
            }
        }
        
        return thumbnailPaths;
    }
}