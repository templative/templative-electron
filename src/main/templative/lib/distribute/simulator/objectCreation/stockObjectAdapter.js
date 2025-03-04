// { name: 'Cathedral', quantity: 1, type: 'STOCK_CathedralBlue' }
// {
//   DisplayName: 'Cathedral, Blue',
//   Description: 'A blue tile featuring a basic-style cathedral church.',
//   GameCrafterGuid: '70739E1A-8086-11EC-BF40-00458E9C19B6',
//   GameCrafterSkuId: '707D5A04-8086-11EC-BF40-00458E9C19B6',
//   Tags: [ 'church', 'blue', 'building', 'animal' ],
//   PreviewUri: '//s3.amazonaws.com/preview.thegamecrafter.com/89056294-9047-11EC-A139-006B2DFC60CF.png',
//   PlaygroundCreationTask: 'TokenWithTransparencyBasedShape',
//   SimulatorCreationTask: 'TokenWithTransparencyBasedShape',
//   Color: 'blue',
//   IsDisabled: false
// }

/**
 * This file serves as an adapter layer between stockCreator.js and objectState.js.
 * It converts componentInstructions and stockPartInfo into the specific parameters
 * needed by the objectState.js functions.
 */

const chalk = require('chalk');
const { getColorValueRGB } = require('../../../../../../shared/stockComponentColors');
/**
 * Adapter for createStandardDie
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createStandardDie or null if invalid
 */
function standardDieAdapter(componentInstructions, stockPartInfo) {
  if (!stockPartInfo.hasOwnProperty("Color")) {
    console.log(chalk.red(`!!! Missing Color for ${componentInstructions.type}`));
    return null;
  }

  const componentTypeTokens = componentInstructions.type.split("_");
  const stockType = componentTypeTokens[1];

  const sizeStr = stockType.slice(2).split("mm")[0];
  const sizeInches = parseFloat(sizeStr) / 25.4; // Convert mm to inches

  return {
    name: componentInstructions.name,
    numberSides: parseInt(stockType.slice(2)),
    sizeInches: sizeInches,
    colorRGBOutOfOne: getColorValueRGB(stockPartInfo.Color),
    isMetal: componentInstructions.type.toUpperCase().includes("METAL")
  };
}

/**
 * Adapter for createCustomDie
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createCustomDie or null if invalid
 */
function customDieAdapter(componentInstructions, stockPartInfo) {
  if (!stockPartInfo.hasOwnProperty("ImageUrl")) {
    console.log(chalk.red(`!!! Missing ImageUrl for custom die ${componentInstructions.type}`));
    return null;
  }

  const componentTypeTokens = componentInstructions.type.split("_");
  const stockType = componentTypeTokens[1];
  
  // Extract die type (e.g., D4, D6, D8, D10, D12, D20)
  const dieTypeMatch = stockType.match(/D(\d+)/);
  if (!dieTypeMatch) {
    console.log(chalk.red(`!!! Invalid custom die type: ${stockType}. Expected D4, D6, D8, D10, D12, or D20`));
    return null;
  }

  const numberSides = parseInt(dieTypeMatch[1]);
  const validSides = [4, 6, 8, 10, 12, 20];
  if (!validSides.includes(numberSides)) {
    console.log(chalk.red(`!!! Unsupported die type: D${numberSides}. Only D4, D6, D8, D10, D12, and D20 are supported.`));
    return null;
  }

  return {
    name: componentInstructions.name,
    imageUrl: stockPartInfo.ImageUrl,
    numberSides: numberSides
  };
}

/**
 * Adapter for createStockCube
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createStockCube or null if invalid
 */
function stockCubeAdapter(componentInstructions, stockPartInfo) {

  if (!stockPartInfo.hasOwnProperty("Color")) {
    console.log(chalk.red(`!!! Missing Color for ${componentInstructions.type}`));
    return null;
  }

  const componentTypeTokens = componentInstructions.type.split("_");
  const stockType = componentTypeTokens[1];
  
  if (!stockType.startsWith("Cube")) {
    console.log(chalk.red(`!!! Invalid cube type: ${stockType}. Expected Cube*`));
    return null;
  }

  const sizeStr = stockType.slice(4).split("mm")[0];
  const sizeInches = parseFloat(sizeStr) / 25.4; // Convert mm to inches

  return {
    name: componentInstructions.name,
    sizeInches: sizeInches,
    color: getColorValueRGB(stockPartInfo.Color)
  };
}

/**
 * Adapter for createStockModel
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createStockModel or null if invalid
 */
function stockModelAdapter(componentInstructions, stockPartInfo) {
  if (
    !stockPartInfo.hasOwnProperty("3DModel") || 
    !stockPartInfo["3DModel"].hasOwnProperty("ObjUrl") || 
    !stockPartInfo["3DModel"].hasOwnProperty("TextureUrl") || 
    !stockPartInfo["3DModel"].hasOwnProperty("NormalMapUrl")
  ) {
    console.log(chalk.red(`!!! Missing 3D model information for ${componentInstructions.type}`));
    return null;
  }

  return {
    name: componentInstructions.name,
    objUrl: stockPartInfo["3DModel"]["ObjUrl"],
    textureUrl: stockPartInfo["3DModel"]["TextureUrl"],
    normalMapUrl: stockPartInfo["3DModel"]["NormalMapUrl"]
  };
}

/**
 * Adapter for createStandee
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createStandee or null if invalid
 */
function standeeAdapter(componentInstructions, stockPartInfo) {
   let frontImageUrl = null;
  let backImageUrl = null;

  if (stockPartInfo.hasOwnProperty("PreviewUri")) {
    frontImageUrl = stockPartInfo.PreviewUri;
  } else if (stockPartInfo.hasOwnProperty("FrontImageUrl")) {
    frontImageUrl = stockPartInfo.FrontImageUrl;
  } else {
    console.log(chalk.red(`!!! Missing image URL for standee ${componentInstructions.type}`));
    return null;
  }

  if (stockPartInfo.hasOwnProperty("BackImageUrl")) {
    backImageUrl = stockPartInfo.BackImageUrl;
  } else {
    // Use front image as back image if not specified
    backImageUrl = frontImageUrl;
  }

  return {
    name: componentInstructions.name,
    frontImageUrl: frontImageUrl,
    backImageUrl: backImageUrl
  };
}

/**
 * Adapter for createTokenWithDefinedShape
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createTokenWithDefinedShape or null if invalid
 */
function tokenWithDefinedShapeAdapter(componentInstructions, stockPartInfo) {

  if (!stockPartInfo.hasOwnProperty("FrontImageUrl")) {
    console.log(chalk.red(`!!! Missing FrontImageUrl for token ${componentInstructions.type}`));
    return null;
  }

  if (!stockPartInfo.hasOwnProperty("Shape")) {
    console.log(chalk.red(`!!! Missing Shape for token ${componentInstructions.type}`));
    return null;
  }

  const validShapes = ["Box", "Hex", "Circle", "Rounded"];
  if (!validShapes.includes(stockPartInfo.Shape)) {
    console.log(chalk.red(`!!! Invalid shape: ${stockPartInfo.Shape}. Expected one of: ${validShapes.join(", ")}`));
    return null;
  }

  const backImageUrl = stockPartInfo.hasOwnProperty("BackImageUrl") 
    ? stockPartInfo.BackImageUrl 
    : stockPartInfo.FrontImageUrl;

  return {
    name: componentInstructions.name,
    frontImageUrl: stockPartInfo.FrontImageUrl,
    backImageUrl: backImageUrl,
    shape: stockPartInfo.Shape
  };
}

/**
 * Adapter for flatTokenWithTransparencyBasedShapeAdapter
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createFlatTokenWithTransparencyBasedShape or null if invalid
 */
function flatTokenWithTransparencyBasedShapeAdapter(componentInstructions, stockPartInfo) {
  if (!stockPartInfo.hasOwnProperty("PreviewUri")) {
    console.log(chalk.red(`!!! Missing PreviewUri for token ${componentInstructions.type}`));
    return null;
  }

  return {
    name: componentInstructions.name,
    frontImageUrl: stockPartInfo.PreviewUri,
    backImageUrl: stockPartInfo.PreviewUri
  };
}
/**
 * Adapter for thickTokenWithTransparencyBasedShapeAdapter
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createThickTokenWithTransparencyBasedShape or null if invalid
 */
function thickTokenWithTransparencyBasedShapeAdapter(componentInstructions, stockPartInfo) {
  if (!stockPartInfo.hasOwnProperty("PreviewUri")) {
    console.log(chalk.red(`!!! Missing PreviewUri for token ${componentInstructions.type}`));
    return null;
  }

  return {
    name: componentInstructions.name,
    frontImageUrl: stockPartInfo.PreviewUri,
    backImageUrl: stockPartInfo.PreviewUri
  };
}

/**
 * Get the appropriate adapter function based on the simulator creation task
 * @param {string} simulatorCreationTask - The simulator creation task
 * @returns {Function|null} - The adapter function or null if not supported
 */
function getAdapter(simulatorCreationTask) {
  const adapters = {
    "StandardDie": standardDieAdapter,
    "CustomDie": customDieAdapter,
    "StockCube": stockCubeAdapter,
    "StockModel": stockModelAdapter,
    "Standee": standeeAdapter,
    "TokenWithDefinedShape": tokenWithDefinedShapeAdapter,
    "FlatTokenWithTransparencyBasedShape": flatTokenWithTransparencyBasedShapeAdapter,
    "ThickTokenWithTransparencyBasedShape": thickTokenWithTransparencyBasedShapeAdapter
  };

  return adapters[simulatorCreationTask] || null;
}

module.exports = {
  standardDieAdapter,
  customDieAdapter,
  stockCubeAdapter,
  stockModelAdapter,
  standeeAdapter,
  tokenWithDefinedShapeAdapter,
  flatTokenWithTransparencyBasedShapeAdapter,
  thickTokenWithTransparencyBasedShapeAdapter,
  getAdapter
}; 