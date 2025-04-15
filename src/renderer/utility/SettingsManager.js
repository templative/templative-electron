const os = require('os')
const path = require('path')
const fsPromises = require("fs/promises")

async function folderExists(directory) {
    try {
        await fsPromises.access(directory);
        return true;
    } catch (error) {
        return false;
    }
}
async function readOrCreateSettingsFile() {
    var templativeSettingsDirectoryPath = path.join(os.homedir() , "Documents/Templative")
    if (!await folderExists(templativeSettingsDirectoryPath)) {
        await fsPromises.mkdir(templativeSettingsDirectoryPath, { recursive: true });
    }
    var templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json")
    if (!await folderExists(templativeSettingsPath)) {
        await fsPromises.writeFile(templativeSettingsPath, "{}", 'utf-8');
        return {}
    } 
    return JSON.parse(await fsPromises.readFile(templativeSettingsPath, 'utf8'));
}

async function writeToSettingsFile(newFileContents) {
    var templativeSettingsDirectoryPath = path.join(os.homedir() , "Documents/Templative")
    var templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json")
    await fsPromises.writeFile(templativeSettingsPath, newFileContents, 'utf-8');
}

export async function getLastProjectDirectory () {
    var settings = await readOrCreateSettingsFile()
    const lastProjectDirectory = settings["lastProjectDirectory"]
    if (!await folderExists(lastProjectDirectory)) {
        return undefined
    }
    return lastProjectDirectory
}

export async function writeLastOpenedProject (lastProjectDirectory) {
    var settings = await readOrCreateSettingsFile()
    settings["lastProjectDirectory"] = lastProjectDirectory
    var newFileContents = JSON.stringify(settings, null, 4)
    await writeToSettingsFile(newFileContents)
}

export async function getLastUsedTableTopPlaygroundDirectory () {
    var settings = await readOrCreateSettingsFile()
    
    // Check if we already have a saved directory
    if (settings["lastTableTopPlaygroundDirectory"] && await folderExists(settings["lastTableTopPlaygroundDirectory"])) {
        return settings["lastTableTopPlaygroundDirectory"];
    }
    
    // If not, try to find the default directory based on OS
    let defaultDirectory
    if (process.platform === 'win32') {
        defaultDirectory = path.join('C:', 'Program Files (x86)', 'Steam', 'steamapps', 'common', 'TabletopPlayground', 'TabletopPlayground', 'PersistentDownloadDir')
    } else if (process.platform === 'darwin') {
        defaultDirectory = path.join(os.homedir(), 'Library', 'Application Support', 'Steam', 'steamapps', 'common', 'TabletopPlayground', 'TabletopPlayground', 'PersistentDownloadDir')
    }
    
    if (defaultDirectory && await folderExists(defaultDirectory)) {
        settings["lastTableTopPlaygroundDirectory"] = defaultDirectory
        await writeToSettingsFile(JSON.stringify(settings, null, 4))
        return defaultDirectory
    }
    
    return undefined
}
export async function writeLastUseTableTopPlaygroundDirectory (lastTableTopPlaygroundDirectory) {
    var settings = await readOrCreateSettingsFile()
    settings["lastTableTopPlaygroundDirectory"] = lastTableTopPlaygroundDirectory
    var newFileContents = JSON.stringify(settings, null, 4)
    await writeToSettingsFile(newFileContents)
}

export async function getLastUsedTableTopSimulatorDirectory () {
    var settings = await readOrCreateSettingsFile()
    
    // Check if we already have a saved directory
    if (settings["lastTableTopSimulatorDirectory"] && await folderExists(settings["lastTableTopSimulatorDirectory"])) {
        return settings["lastTableTopSimulatorDirectory"];
    }
    
    // If not, try to find the default directory based on OS
    let defaultDirectory
    if (process.platform === 'win32') {
        defaultDirectory = path.join(os.homedir(), 'Documents', 'My Games', 'Tabletop Simulator')
    } else if (process.platform === 'darwin') {
        defaultDirectory = path.join(os.homedir(), 'Library', 'Tabletop Simulator')
    }
    
    if (defaultDirectory && await folderExists(defaultDirectory)) {
        settings["lastTableTopSimulatorDirectory"] = defaultDirectory
        await writeToSettingsFile(JSON.stringify(settings, null, 4))
        return defaultDirectory
    }
    
    return undefined
}
export async function writeLastUseTableTopSimulatorDirectory (lastTableTopSimulatorDirectory) {
    var settings = await readOrCreateSettingsFile()
    settings["lastTableTopSimulatorDirectory"] = lastTableTopSimulatorDirectory
    var newFileContents = JSON.stringify(settings, null, 4)
    await writeToSettingsFile(newFileContents)
}