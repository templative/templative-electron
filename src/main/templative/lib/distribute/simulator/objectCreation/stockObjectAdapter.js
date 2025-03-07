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
const { getColorValueRGB, getColorValueHex } = require('../../../../../../shared/stockComponentColors');
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

  // First let's extract size if present
  const sizeStr = stockType.match(/(?:^|[\s,])([0-9]+)mm/)?.[1] || '16';
  const sizeInches = parseFloat(sizeStr) / 25.4; // Convert mm to inches

  // Extract die type with improved regex that handles D4, D6, D8, D10, D12, D20 
  // regardless of what follows (color, dimensions, etc.)
  const dieTypeMatch = stockType.match(/D(4|6|8|10|12|20)/);
  
  // Parse the number of sides or default to 6
  let numberSides = 6;
  if (dieTypeMatch) {
    numberSides = parseInt(dieTypeMatch[1]);
    // console.log(chalk.blue(`Detected die with ${numberSides} sides from type: ${stockType}`));
  } else {
    console.log(chalk.yellow(`Could not detect die type from ${stockType}, defaulting to D6`));
  }
// console.log(stockPartInfo.Color)
  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    numberSides: numberSides,
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
  
  // Extract die type with improved regex
  const validSides = [4, 6, 8, 10, 12, 20];
  // Simplified pattern to just match the die type
  const dieTypeMatch = stockType.match(/D(4|6|8|10|12|20)/);
  if (!dieTypeMatch) {
    console.log(chalk.red(`!!! Invalid custom die type: ${stockType}. Expected D4, D6, D8, D10, D12, or D20`));
    return null;
  }

  const numberSides = parseInt(dieTypeMatch[1]);
  if (!validSides.includes(numberSides)) {
    console.log(chalk.red(`!!! Unsupported die type: D${numberSides}. Only D4, D6, D8, D10, D12, and D20 are supported.`));
    return null;
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
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
  
  // Accept both Cube* and Block* formats
  if (!stockType.startsWith("Cube") && !stockType.startsWith("Block")) {
    console.log(chalk.red(`!!! Invalid cube/block type: ${stockType}. Expected Cube* or Block*`));
    return null;
  }

  // Extract size in mm, handling both formats
  let sizeStr;
  if (stockType.startsWith("Cube")) {
    sizeStr = stockType.slice(4).split("mm")[0];
  } else { // Block format
    // Extract from Block format (e.g., Block1x2Red)
    const blockMatch = stockType.match(/Block(\d+)x(\d+)/);
    if (blockMatch) {
      // For Block types, use a default size of 8mm if not specified elsewhere
      sizeStr = '8';
    } else {
      sizeStr = '16'; // Default if no size is found
    }
  }
  
  const sizeInches = parseFloat(sizeStr) / 25.4; // Convert mm to inches

  // Check for block dimensions in the type or DisplayName
  let sizeInchesXYZ = [sizeInches, sizeInches, sizeInches]; // Default cube dimensions
  
  // First try to extract from the stockType for Block format
  const blockTypeMatch = stockType.match(/Block(\d+)x(\d+)/);
  if (blockTypeMatch) {
    const xDimension = parseInt(blockTypeMatch[1]);
    const zDimension = parseInt(blockTypeMatch[2]);
    sizeInchesXYZ = [sizeInches * xDimension, sizeInches, sizeInches * zDimension];
  }
  // Then check DisplayName as a fallback
  else if (stockPartInfo.hasOwnProperty("DisplayName")) {
    const blockMatch = stockPartInfo.DisplayName.match(/Block\s+(\d+)x(\d+)/i);
    if (blockMatch) {
      const xDimension = parseInt(blockMatch[1]);
      const zDimension = parseInt(blockMatch[2]);
      sizeInchesXYZ = [sizeInches * xDimension, sizeInches, sizeInches * zDimension];
    }
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    sizeInchesXYZ: sizeInchesXYZ,
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
    quantity: componentInstructions.quantity,
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
    quantity: componentInstructions.quantity,
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
    quantity: componentInstructions.quantity,
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
    quantity: componentInstructions.quantity,
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
    quantity: componentInstructions.quantity,
    frontImageUrl: stockPartInfo.PreviewUri,
    backImageUrl: stockPartInfo.PreviewUri
  };
}

/**
 * Adapter for createCustomPDF
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createCustomPDF or null if invalid
 */
function customPDFAdapter(componentInstructions, stockPartInfo) {
  if (!stockPartInfo.hasOwnProperty("PDFUrl")) {
    console.log(chalk.red(`!!! Missing PDFUrl for custom PDF ${componentInstructions.type}`));
    return null;
  }

  return {
    name: componentInstructions.name,
    pdfUrl: stockPartInfo.PDFUrl,
    pdfPassword: stockPartInfo.PDFPassword || "",
    pdfPage: stockPartInfo.PDFPage || 0,
    pdfPageOffset: stockPartInfo.PDFPageOffset || 0
  };
}

/**
 * Adapter for createDomino
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createDomino or null if invalid
 */
function dominoAdapter(componentInstructions, stockPartInfo) {
  let colorDiffuse = null;
  
  if (stockPartInfo.hasOwnProperty("Color")) {
    colorDiffuse = getColorValueRGB(stockPartInfo.Color);
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    colorDiffuse: colorDiffuse,
    meshIndex: stockPartInfo.MeshIndex || 14,
    materialIndex: stockPartInfo.MaterialIndex || 0
  };
}

/**
 * Adapter for createBag
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createBag or null if invalid
 */
function baggieAdapter(componentInstructions, stockPartInfo) {
  let colorDiffuse = null;
  
  if (stockPartInfo.hasOwnProperty("Color")) {
    colorDiffuse = getColorValueRGB(stockPartInfo.Color);
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    colorDiffuse: colorDiffuse,
    isInfinite: stockPartInfo.IsInfinite || false
  };
}

/**
 * Adapter for createPokerChip
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createPokerChip or null if invalid
 */
function pokerChipAdapter(componentInstructions, stockPartInfo) {
  if (!stockPartInfo.hasOwnProperty("ChipValue")) {
    // Extract chip value from the type if not explicitly provided
    const typeMatch = componentInstructions.type.match(/CHIP_(\d+)/i);
    if (!typeMatch) {
      console.log(chalk.red(`!!! Missing ChipValue for poker chip ${componentInstructions.type}`));
      return null;
    }
    stockPartInfo.ChipValue = parseInt(typeMatch[1]);
  }

  let colorDiffuse = null;
  
  if (stockPartInfo.hasOwnProperty("Color")) {
    colorDiffuse = getColorValueRGB(stockPartInfo.Color);
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    chipValue: stockPartInfo.ChipValue,
    colorDiffuse: colorDiffuse
  };
}
function cylinderAdapter(componentInstructions, stockPartInfo) {
  let color = "white";
  let widthMillimeters = 10;
  let heightMillimeters = 10;
  if (stockPartInfo.hasOwnProperty("Color")) {
    color = stockPartInfo.Color;
  }
  let colorHex = getColorValueHex(color);
  if (colorHex === null) {
    console.log(chalk.yellow(`!!! Invalid color: ${color}. Using white instead.`));
    colorHex = "ffffff";
  }
  if (stockPartInfo.hasOwnProperty("DisplayName")) {
    // Example DisplayName: "Cylinder, 10mm x 10mm, Black" or "Disc, 14mm x 10mm, Blue" or "Wink, 20mm, Black"
    // The first value is width mm the second is height mm.
    // Notice that wink doesn't have a seconnd value.
    // The order of name, size, color might be randomized.
    const displayNameTokens = stockPartInfo.DisplayName.split(", ").map(token => token.trim());
    // Extract dimensions from DisplayName by looking for patterns with 'mm' and 'x'
    let dimensions = null;
    
    for (const token of displayNameTokens) {
      // Look for patterns like "10mm x 10mm" or "14mm x 10mm" or just "20mm"
      const dimensionMatch = token.match(/(\d+)mm(?:\s*x\s*(\d+)mm)?/i);
      if (dimensionMatch) {
        if (dimensionMatch[2]) {
          // Both width and height are specified (e.g., "10mm x 10mm")
          widthMillimeters = parseInt(dimensionMatch[1]);
          heightMillimeters = parseInt(dimensionMatch[2]);
        } else {
          // Only one dimension specified (e.g., "20mm")
          height = parseInt(dimensionMatch[1]);
          // For items like "Wink, 20mm, Black" we'll use a default height
          // or try to infer from the component type
        }
        dimensions = true;
        break;
      }
    }
    
    if (!dimensions) {
      console.log(chalk.yellow(`!!! Could not extract dimensions from ${stockPartInfo.DisplayName}. Using defaults.`));
    }
  }
  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    colorHex: colorHex,
    widthMillimeters: widthMillimeters,
    heightMillimeters: heightMillimeters
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
    "ThickTokenWithTransparencyBasedShape": thickTokenWithTransparencyBasedShapeAdapter,
    "CustomPDF": customPDFAdapter,
    "Domino": dominoAdapter,
    "Baggie": baggieAdapter,
    "PokerChip": pokerChipAdapter,
    "StockCylinder": cylinderAdapter
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
  customPDFAdapter,
  dominoAdapter,
  baggieAdapter,
  pokerChipAdapter,
  getAdapter
}; 