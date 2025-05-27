const path = require('path');
const os = require('os');
const fsPromises = require('fs').promises;

async function folderExists(directory) {
    if (!directory) return false;
    try {
        await fsPromises.access(directory);
        return true;
    } catch (error) {
        return false;
    }
}

const DEFAULT_SETTINGS = {
    lastProjectDirectory: null,
    isOnChangeRenderingDisabled: false,
    isCacheIgnored: false,
    isGitEnabled: false,
    renderProgram: "Templative",
    overlappingRenderingTasks: "One at a Time",
    printSize: "Letter",
    unit: "px"
}

async function readOrCreateSettingsFile() {
    const templativeSettingsDirectoryPath = path.join(os.homedir(), "Documents/Templative");
    try {
        if (!await folderExists(templativeSettingsDirectoryPath)) {
            await fsPromises.mkdir(templativeSettingsDirectoryPath, { recursive: true });
        }
        const templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json");
        if (!await folderExists(templativeSettingsPath)) {
            await fsPromises.writeFile(templativeSettingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 4), 'utf-8');
            return DEFAULT_SETTINGS;
        } 
        const fileContent = await fsPromises.readFile(templativeSettingsPath, 'utf8');
        const settings = JSON.parse(fileContent);
        for (const key in DEFAULT_SETTINGS) {
            if (settings[key] === undefined) {
                settings[key] = DEFAULT_SETTINGS[key];
            }
        }
        return settings;
    } catch (error) {
        console.error('Error reading settings file:', error);
        return DEFAULT_SETTINGS;
    }
}

async function writeToSettingsFile(settings) {
    try {
        const templativeSettingsDirectoryPath = path.join(os.homedir(), "Documents/Templative");
        if (!await folderExists(templativeSettingsDirectoryPath)) {
            await fsPromises.mkdir(templativeSettingsDirectoryPath, { recursive: true });
        }
        const templativeSettingsPath = path.join(templativeSettingsDirectoryPath, "settings.json");
        await fsPromises.writeFile(templativeSettingsPath, JSON.stringify(settings, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing settings file:', error);
    }
}

async function updateSetting(key, value) {
    try {
        const settings = await readOrCreateSettingsFile();
        settings[key] = value;
        await writeToSettingsFile(settings);
        return settings;
    } catch (error) {
        console.error('Error updating setting:', error);
        return null;
    }
}

module.exports = {
    readOrCreateSettingsFile,
    writeToSettingsFile,
    updateSetting,
    folderExists
}
