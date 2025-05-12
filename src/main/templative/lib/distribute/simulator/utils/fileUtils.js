const fs = require('fs').promises;
const path = require('path');
const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file exists, false otherwise
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Look for the simulator configuration file
 * @returns {Promise<string|null>} - Path to the simulator directory or null if not found
 */
async function lookForSimulatorFile() {
  const simulatorFileLocation = "./.simulator";
  try {
    return await fs.readFile(simulatorFileLocation, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return null;
  }
}

/**
 * Write the simulator configuration file
 * @param {string} outputPath - Path to write to the simulator file
 * @returns {Promise<void>}
 */
async function writeSimulatorFile(outputPath) {
  const simulatorFileLocation = path.join("./", ".simulator");
  await fs.writeFile(simulatorFileLocation, outputPath);
}

/**
 * Get the simulator directory path
 * @param {string|null} inputedSimulatorDirectory - User-provided simulator directory path
 * @returns {Promise<string|null>} - Path to the simulator directory
 */
async function getSimulatorDirectory(inputedSimulatorDirectory) {
  if (inputedSimulatorDirectory !== null) {
    return inputedSimulatorDirectory;
  }
  return await lookForSimulatorFile();
}

/**
 * Copy a file from source to destination
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 * @returns {Promise<void>}
 */
async function copyFile(sourcePath, destinationPath) {
  await pipeline(
    createReadStream(sourcePath),
    createWriteStream(destinationPath)
  );
}

module.exports = {
  fileExists,
  lookForSimulatorFile,
  writeSimulatorFile,
  getSimulatorDirectory,
  copyFile
}; 