const path = require('path');
const fs = require('fs').promises;
const instructionsLoader = require('../../manage/instructionsLoader.js');
const { createSave } = require('./simulatorTemplates/save.js');
const { lookForSimulatorFile, writeSimulatorFile, getSimulatorDirectory } = require('./utils/fileUtils.js');
const { createObjectStates, createComponentLibrary } = require('./objectCreation/objectStateFactory.js');
const { recutOutput } = require('../../produce/gameProducer.js');
/**
 * Convert a produced game directory to Tabletop Simulator format
 * @param {string} producedDirectoryPath - Path to the produced game directory
 * @param {string} tabletopSimulatorDirectoryPath - Path to the Tabletop Simulator directory
 * @returns {Promise<number>} - 1 if successful
 */
async function convertToTabletopSimulator(producedDirectoryPath, tabletopSimulatorDirectoryPath, templativeToken, renderProgram=RENDER_PROGRAM.TEMPLATIVE) {
  if (!templativeToken) {
    console.log("!!! No templative token provided, skipping Tabletop Simulator conversion.");
    return;
  }

  producedDirectoryPath = path.resolve(producedDirectoryPath);
  tabletopSimulatorDirectoryPath = path.resolve(tabletopSimulatorDirectoryPath);

  // Ensure the TTS directory exists
  try {
    await fs.mkdir(tabletopSimulatorDirectoryPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  const gameInstructions = await instructionsLoader.loadGameInstructions(producedDirectoryPath);
  if (!gameInstructions) {
    console.log("!!! game.json not found.");
    return;
  }
  console.log(`Converting ${gameInstructions.name} into a Tabletop Simulator save.`);

  const uniqueGameName = path.basename(producedDirectoryPath);
  await recutOutput(producedDirectoryPath, renderProgram);
  const objectStates = await createObjectStates(producedDirectoryPath, tabletopSimulatorDirectoryPath, templativeToken);

  let rulesContent = "";
  const rulesPath = path.join(producedDirectoryPath, "rules.md");
  try {
    rulesContent = await fs.readFile(rulesPath, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  const playerCount = 8;

  const componentLibraryChest = createComponentLibrary(objectStates);
  await createSaveFile(uniqueGameName, [componentLibraryChest], tabletopSimulatorDirectoryPath, playerCount, rulesContent);
  return 1;
}

/**
 * Create a save file for Tabletop Simulator
 * @param {string} uniqueGameName - Unique name of the game
 * @param {Array} objectStates - Array of object states
 * @param {string} tabletopSimulatorDirectoryPath - Path to the TTS directory
 * @param {number} playerCount - Number of players
 * @param {string} rulesMd - Rules in markdown format
 * @returns {Promise<void>}
 */
async function createSaveFile(uniqueGameName, objectStates, tabletopSimulatorDirectoryPath, playerCount = 8, rulesMd = "") {
  const gameSave = createSave(uniqueGameName, objectStates, playerCount, rulesMd);
  const savesDir = path.join(tabletopSimulatorDirectoryPath, "Saves");
  
  try {
    await fs.mkdir(savesDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  const saveFilepath = path.join(savesDir, `${uniqueGameName}.json`);
  await fs.writeFile(saveFilepath, JSON.stringify(gameSave, null, 2));
  console.log(`Saved file at ${saveFilepath}`);
}

module.exports = {
  lookForSimulatorFile,
  writeSimulatorFile,
  getSimulatorDirectory,
  convertToTabletopSimulator
}; 