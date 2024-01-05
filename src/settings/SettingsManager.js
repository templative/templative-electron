const os = window.require('os')
const path = window.require('path')
const fs = window.require("fs")

function readOrCreateSettingsFile() {
    var templativeSettingsDirectoryPath = path.join(os.homedir() , "Documents/Templative")
    if (!fs.existsSync(templativeSettingsDirectoryPath)) {
        fs.mkdir(templativeSettingsDirectoryPath, { recursive: true }, (err) => {});
    }
    var templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json")
    if (!fs.existsSync(templativeSettingsPath)) {
        fs.writeFileSync(templativeSettingsPath, "{}", 'utf-8');
        return {}
    } 
    return JSON.parse(fs.readFileSync(templativeSettingsPath, 'utf8'));
}

function writeToSettingsFile(newFileContents) {
    var templativeSettingsDirectoryPath = path.join(os.homedir() , "Documents/Templative")
    var templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json")
    fs.writeFileSync(templativeSettingsPath, newFileContents, 'utf-8');
}

export function getLastProjectDirectory () {
    var settings = readOrCreateSettingsFile()
    return settings["lastProjectDirectory"]
}

export function writeLastOpenedProject (lastProjectDirectory) {
    var settings = readOrCreateSettingsFile()
    settings["lastProjectDirectory"] = lastProjectDirectory
    var newFileContents = JSON.stringify(settings, null, 4)
    writeToSettingsFile(newFileContents)
}

export function getLastUsedGameCrafterUsername () {
    var settings = readOrCreateSettingsFile()
    return settings["lastTheGameCrafterUsername"]
}
export function writeLastUseGameCrafterUsername (lastGameCrafterUsername) {
    var settings = readOrCreateSettingsFile()
    settings["lastTheGameCrafterUsername"] = lastGameCrafterUsername
    var newFileContents = JSON.stringify(settings, null, 4)
    writeToSettingsFile(newFileContents)
}

export function getLastUsedGameCrafterApiKey () {
    var settings = readOrCreateSettingsFile()
    return settings["lastTheGameCrafterApiKey"]
}
export function writeLastUseGameCrafterApiKey (lastGameCrafterApiKey) {
    var settings = readOrCreateSettingsFile()
    settings["lastTheGameCrafterApiKey"] = lastGameCrafterApiKey
    var newFileContents = JSON.stringify(settings, null, 4)
    writeToSettingsFile(newFileContents)
}

export function getLastUsedTableTopPlaygroundDirectory () {
    var settings = readOrCreateSettingsFile()
    return settings["lastTableTopPlaygroundDirectory"]
}
export function writeLastUseTableTopPlaygroundDirectory (lastTableTopPlaygroundDirectory) {
    var settings = readOrCreateSettingsFile()
    settings["lastTableTopPlaygroundDirectory"] = lastTableTopPlaygroundDirectory
    var newFileContents = JSON.stringify(settings, null, 4)
    writeToSettingsFile(newFileContents)
}