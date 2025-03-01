const chalk = require('chalk');
const { createStandardDie, createStockCube, createStockModel, createStandee } = require('../simulatorTemplates/objectState');

/**
 * Create a stock component (dice, cubes, etc.)
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Promise<Object|null>} - Stock object state or null if failed
 */
async function createStock(componentInstructions, stockPartInfo) {
  const componentTypeTokens = componentInstructions.type.split("_");
  const stockType = componentTypeTokens[1];
  console.log(componentInstructions);
  console.log(stockPartInfo);
  if (
    stockPartInfo.hasOwnProperty("3DModel") && 
    stockPartInfo["3DModel"].hasOwnProperty("ObjUrl") && 
    stockPartInfo["3DModel"].hasOwnProperty("TextureUrl") && 
    stockPartInfo["3DModel"].hasOwnProperty("NormalMapUrl")
  ) {
    return createStockModel(
      componentInstructions.name, 
      stockPartInfo["3DModel"]["ObjUrl"], 
      stockPartInfo["3DModel"]["TextureUrl"], 
      stockPartInfo["3DModel"]["NormalMapUrl"]
    );
  }

  const isDie = stockType.startsWith("D6");
  const isCube = stockType.startsWith("Cube");

  if (!isDie && !isCube) {
    // Check if we have a preview image to use as fallback
    if (stockPartInfo.hasOwnProperty("PreviewUri")) {
      console.log(chalk.yellow(`Using preview image as fallback for ${stockType}`));
      return createStandee(
        componentInstructions.name,
        stockPartInfo.PreviewUri
      );
    }
    
    console.log(chalk.red(`!!! Unsupported stock type: ${stockType}`));
    return null;
  }
  if (!stockPartInfo.hasOwnProperty("PlaygroundColor")) {
    console.log(chalk.red(`!!! Missing PlaygroundColor for ${stockType}`));
    return null;
  }
  const color = stockPartInfo.PlaygroundColor;

  let sizeStr = "";
  if (isDie) {
    sizeStr = stockType.slice(2).split("mm")[0];
  } else if (isCube) {
    sizeStr = stockType.slice(4).split("mm")[0];
  }

  const size = parseFloat(sizeStr) / 25.4;

  if (isDie) {
    return createStandardDie(
      componentInstructions.name,
      size,
      color
    );
  } else {
    return createStockCube(
      componentInstructions.name,
      size,
      color
    );
  }
  
}

module.exports = {
  createStock
}; 