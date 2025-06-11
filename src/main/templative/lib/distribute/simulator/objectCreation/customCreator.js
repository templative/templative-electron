const { 
  createDeckObjectState,
  createCustomDie,
  createStandardDie,
  createStandeeFromNameImageUrlAndQuantities,
  createFlatTokenWithTransparencyBasedShape
} = require('../simulatorTemplates/objectState');
const { getAdapter } = require('./customObjectAdapter');

/**
 * Create a custom component (decks, boards, custom dice, etc.)
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Custom object state or null if failed
 */
async function createCustom(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal, templativeToken) {
  if (!templativeToken) {
    console.log("!!! No templative token provided, skipping custom object creation.");
    return null;
  }
  // Check if SimulatorCreationTask is specified
  if (!componentInfo.hasOwnProperty("SimulatorCreationTask") || 
      componentInfo["SimulatorCreationTask"] === "none") {
    console.log(`Skipping ${componentInstructions.uniqueName || componentInstructions.name} due to no SimulatorCreationTask.`);
    return null;
  }
  
  const simulatorCreationTask = componentInfo["SimulatorCreationTask"];
  
  // Get the appropriate adapter function
  const adapter = getAdapter(simulatorCreationTask);
  if (!adapter) {
    console.log(`!!! Unsupported SimulatorCreationTask: ${simulatorCreationTask}`);
    return null;
  }

  // Pass templativeToken to adapter
  const params = await adapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal, templativeToken);
  if (!params) {
    // Adapter already logged the error
    return null;
  }

  // Call the appropriate function with the parameters
  const functions = {
    "DECK": createDeckObjectState,
    "BOARD": createDeckObjectState,
    "CustomDie": createCustomDie,
    "StandardDie": createStandardDie,
    "CustomStandee": createStandeeFromNameImageUrlAndQuantities,
    "CustomToken": createFlatTokenWithTransparencyBasedShape
  };

  const createFunction = functions[simulatorCreationTask];
  return createFunction(...Object.values(params));
}


module.exports = {
  createCustom
}; 