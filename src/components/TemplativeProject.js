const fs = window.require('fs');
const path = window.require("path");

export default class TemplativeProject {
    static readFile(templativeRootDirectoryPath, fileName) {            
        return JSON.parse(fs.readFileSync(path.join(templativeRootDirectoryPath, fileName), 'utf8'));
    }
    constructor(templativeRootDirectoryPath) {
        var componentCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "component-compose.json");
        var gameCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "game-compose.json");
        var gameFile = TemplativeProject.readFile(templativeRootDirectoryPath, "game.json");
        var studioFile = TemplativeProject.readFile(templativeRootDirectoryPath, "studio.json");
        console.log(componentCompose, gameCompose, gameFile, studioFile)
    }
}