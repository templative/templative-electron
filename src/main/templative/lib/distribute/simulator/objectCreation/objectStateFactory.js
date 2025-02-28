const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { createDeck } = require('./deckCreator.js');
const { createStock } = require('./stockCreator.js');
const { createComponentLibraryChest } = require('../simulatorTemplates/objectState.js');
const COMPONENT_INFO = require('../../../componentInfo.js').COMPONENT_INFO;
const STOCK_COMPONENT_INFO = require('../../../stockComponentInfo.js').STOCK_COMPONENT_INFO;

/**
 * Create object states for all components in a directory
 * @param {string} producedDirectoryPath - Path to the produced directory
 * @param {string} tabletopSimulatorDirectoryPath - Path to the TTS directory
 * @returns {Promise<Array>} - Array of object states
 */
async function createObjectStates(producedDirectoryPath, tabletopSimulatorDirectoryPath) {
  const objectStates = [];
  let index = 0;
  const directories = await fs.readdir(producedDirectoryPath, { withFileTypes: true });
  
  // Ensure the TTS images directory exists
  const tabletopSimulatorImageDirectoryPath = path.join(tabletopSimulatorDirectoryPath, "Mods/Images");
  try {
    await fs.access(tabletopSimulatorImageDirectoryPath);
  } catch {
    console.log(chalk.red(`!!! TTS images directory at ${tabletopSimulatorImageDirectoryPath} does not exist.`));
    return []
  }
  
  for (const directory of directories) {
    if (directory.isDirectory()) {
      const componentDirectoryPath = path.join(producedDirectoryPath, directory.name);
      const objectState = await createObjectState(componentDirectoryPath, tabletopSimulatorDirectoryPath, tabletopSimulatorImageDirectoryPath, index, directories.length);
      index++;
      if (objectState === null) {
        console.log(chalk.red(`!!! Skipping ${directory.name} due to errors.`));
        continue;
      }
      objectStates.push(objectState);
    }
  }
  return objectStates;
}

/**
 * Create an object state for a component
 * @param {string} componentDirectoryPath - Path to the component directory
 * @param {string} tabletopSimulatorDirectoryPath - Path to the TTS directory
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to the TTS images directory
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Object state or null if failed
 */
async function createObjectState(componentDirectoryPath, tabletopSimulatorDirectoryPath, tabletopSimulatorImageDirectoryPath, componentIndex, componentCountTotal) {
  const componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json");
  const componentInstructions = JSON.parse(await fs.readFile(componentInstructionsFilepath, 'utf8'));

  const supportedInstructionTypes = {
    "DECK": createDeck,
    "BOARD": createDeck,
  };

  const componentTypeTokens = componentInstructions.type.split("_");
  const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK";
  if (isStockComponent) {
    if (!STOCK_COMPONENT_INFO.hasOwnProperty(componentTypeTokens[1])) {
      console.log(chalk.red(`!!! Missing stock info for ${componentTypeTokens[1]}.`));
      return null;
    }
    const stockComponentInfo = STOCK_COMPONENT_INFO[componentTypeTokens[1]];
    return await createStock(componentInstructions, stockComponentInfo);
  }

  if (!COMPONENT_INFO.hasOwnProperty(componentInstructions.type)) {
    console.log(chalk.red(`!!! Missing component info for ${componentInstructions.type}.`));
    return null;
  }
  const componentInfo = COMPONENT_INFO[componentInstructions.type];

  if (!componentInfo.hasOwnProperty("SimulatorCreationTask")) {
    console.log(chalk.yellow(`Skipping ${componentInstructions.type} that has no SimulatorCreationTask.`));
    return null;
  }
  const simulatorTask = componentInfo.SimulatorCreationTask;

  let totalCount = 0;
  for (const instruction of componentInstructions.frontInstructions) {
    totalCount += instruction.quantity;
  }

  if (totalCount === 0) {
    return null;
  }

  if (!supportedInstructionTypes.hasOwnProperty(simulatorTask)) {
    console.log(chalk.red(`!!! Skipping unsupported ${simulatorTask}.`));
    return null;
  }
  const instruction = supportedInstructionTypes[simulatorTask];
  console.log(`Creating ${componentInstructions.uniqueName}`);
  return await instruction(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal);
}

/**
 * Create a component library chest containing all components
 * @param {Array} objectStates - Array of object states
 * @returns {Object} - Component library chest object state
 */
function createComponentLibrary(objectStates) {
  return createComponentLibraryChest(objectStates);
}

module.exports = {
  createObjectStates,
  createObjectState,
  createComponentLibrary
}; 