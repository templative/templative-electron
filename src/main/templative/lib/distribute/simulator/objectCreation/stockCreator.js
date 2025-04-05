const chalk = require('chalk');
const { 
  createStandardDie, 
  createCustomDie,
  createStockCube, 
  createStockModel, 
  createStockMeeple,
  createStandeeFromNameImageUrlAndQuantities, 
  createTokenWithDefinedShape, 
  createStockCylinder,
  createFlatTokenWithTransparencyBasedShape,
  createThickTokenWithTransparencyBasedShape
} = require('../simulatorTemplates/objectState');
const { getAdapter } = require('./stockObjectAdapter');

/**
 * Create a stock component (dice, cubes, etc.)
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Promise<Object|null>} - Stock object state or null if failed
 */
async function createStock(componentInstructions, stockPartInfo) {
  // Check if SimulatorCreationTask is specified
  // console.log(componentInstructions);
  // console.log(stockPartInfo);
  if (!stockPartInfo.hasOwnProperty("SimulatorCreationTask") || 
      stockPartInfo["SimulatorCreationTask"] === "none") {
    console.log(chalk.yellow(`Skipping ${componentInstructions.name} due to no SimulatorCreationTask.`));
    return null;
  }
  const simulatorCreationTask = stockPartInfo["SimulatorCreationTask"];
  // Get the appropriate adapter function
  const adapter = getAdapter(simulatorCreationTask);
  if (!adapter) {
    console.log(chalk.red(`!!! Unsupported SimulatorCreationTask: ${simulatorCreationTask}`));
    return null;
  }

  // Use the adapter to convert componentInstructions and stockPartInfo into parameters
  const params = adapter(componentInstructions, stockPartInfo);
  if (!params) {
    // Adapter already logged the error
    return null;
  }

  // Call the appropriate function with the parameters
  const functions = {
    "StandardDie": createStandardDie,
    "CustomDie": createCustomDie,
    "StockCube": createStockCube,
    "StockCylinder": createStockCylinder,
    "StockMeeple": createStockMeeple,
    "StockModel": createStockModel,
    "Standee": createStandeeFromNameImageUrlAndQuantities,
    "TokenWithDefinedShape": createTokenWithDefinedShape,
    "FlatTokenWithTransparencyBasedShape": createFlatTokenWithTransparencyBasedShape,
    "ThickTokenWithTransparencyBasedShape": createThickTokenWithTransparencyBasedShape
  };

  const createFunction = functions[simulatorCreationTask];
  if (!createFunction) {
    console.log(chalk.red(`!!! Unsupported SimulatorCreationTask: ${simulatorCreationTask}`));
    return null;
  }
  return createFunction(...Object.values(params));
}

module.exports = {
  createStock
}; 