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

    constructor(templativeRootDirectoryPath) {
        this.componentCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "component-compose.json");
        this.gameCompose = TemplativeProject.readFile(templativeRootDirectoryPath, "game-compose.json");
        this.gameFile = TemplativeProject.readFile(templativeRootDirectoryPath, "game.json");
        this.studioFile = TemplativeProject.readFile(templativeRootDirectoryPath, "studio.json");
    }
}