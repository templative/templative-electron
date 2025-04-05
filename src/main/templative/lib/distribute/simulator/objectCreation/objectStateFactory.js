const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { createCustom } = require('./customCreator.js');
const { createStock } = require('./stockCreator.js');
const { createComponentLibraryChest } = require('../simulatorTemplates/objectState.js');
const COMPONENT_INFO = require('../../../../../../shared/componentInfo.js').COMPONENT_INFO;
const STOCK_COMPONENT_INFO = require('../../../../../../shared/stockComponentInfo.js').STOCK_COMPONENT_INFO;

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
    console.log(`!!! TTS images directory at ${tabletopSimulatorImageDirectoryPath} does not exist.`);
    return []
  }
  
  for (const directory of directories) {
    if (directory.isDirectory()) {
      const componentDirectoryPath = path.join(producedDirectoryPath, directory.name);
      const objectState = await createObjectState(componentDirectoryPath, tabletopSimulatorDirectoryPath, tabletopSimulatorImageDirectoryPath, index, directories.length);
      index++;
      if (objectState === null) {
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
  try {    
    const componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json");
    const componentInstructions = JSON.parse(await fs.readFile(componentInstructionsFilepath, 'utf8'));

    const componentTypeTokens = componentInstructions.type.split("_");
    const isStockComponent = componentTypeTokens[0].toUpperCase() === "STOCK";
    
    if (isStockComponent) {
      const stockComponentInfo = STOCK_COMPONENT_INFO[componentTypeTokens[1]];
      if (!stockComponentInfo) {
        console.log(`!!! Missing stock info for ${componentTypeTokens[1]}.`);
        return null;
      }
      if (stockComponentInfo.hasOwnProperty("IsDisabled") && stockComponentInfo.IsDisabled) {
        console.log(`Skipping ${componentInstructions.name} because it is disabled.`);
        return null;
      }
      
      return await createStock(componentInstructions, stockComponentInfo);
    }

    if (!COMPONENT_INFO.hasOwnProperty(componentInstructions.type)) {
      console.log(`!!! Missing component info for ${componentInstructions.type}.`);
      return null;
    }
    const componentInfo = COMPONENT_INFO[componentInstructions.type];
    if (componentInfo.hasOwnProperty("IsDisabled") && componentInfo.IsDisabled) {
      console.log(`Skipping ${componentInstructions.uniqueName || componentInstructions.name} because it is disabled.`);
      return null;
    }

    if (componentInstructions.frontInstructions) {
      let totalCount = 0;
      for (const instruction of componentInstructions.frontInstructions) {
        totalCount += instruction.quantity;
      }
    
      if (totalCount === 0) {
        return null;
      }
    }

    // Use the new createCustom function for all custom components
    return await createCustom(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal);
  } catch (error) {
    console.log(`!!! Error creating object state for ${componentDirectoryPath}.`);
    console.log(error.message);
    return null;
  }
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