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

const { getColorValueRGB, getColorValueHex } = require('../../../../../../shared/stockComponentColors');
/**
 * Adapter for createStandardDie
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createStandardDie or null if invalid
 */
function standardDieAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (!stockPartInfo.hasOwnProperty("Color")) {
    console.log(`!!! Missing Color for ${componentInstructions.type}`);
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
    // console.log(`Detected die with ${numberSides} sides from type: ${stockType}`);
  } else {
    console.log(`Could not detect die type from ${stockType}, defaulting to D6`);
  }
// console.log(stockPartInfo.Color)
  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
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
function customDieAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (!stockPartInfo.hasOwnProperty("ImageUrl")) {
    console.log(`!!! Missing ImageUrl for custom die ${componentInstructions.type}`);
    return null;
  }

  const componentTypeTokens = componentInstructions.type.split("_");
  const stockType = componentTypeTokens[1];
  
  // Extract die type with improved regex
  const validSides = [4, 6, 8, 10, 12, 20];
  // Simplified pattern to just match the die type
  const dieTypeMatch = stockType.match(/D(4|6|8|10|12|20)/);
  if (!dieTypeMatch) {
    console.log(`!!! Invalid custom die type: ${stockType}. Expected D4, D6, D8, D10, D12, or D20`);
    return null;
  }

  const numberSides = parseInt(dieTypeMatch[1]);
  if (!validSides.includes(numberSides)) {
    console.log(`!!! Unsupported die type: D${numberSides}. Only D4, D6, D8, D10, D12, and D20 are supported.`);
    return null;
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
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
function stockCubeAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (!stockPartInfo.hasOwnProperty("Color")) {
    console.log(`!!! Missing Color for ${componentInstructions.type}`);
    return null;
  }

  const componentTypeTokens = componentInstructions.type.split("_");
  const stockType = componentTypeTokens[1];
  
  // Accept both Cube* and Block* formats
  if (!stockType.includes("Cube") && !stockType.includes("Block")) {
    console.log(`!!! Invalid cube/block type: ${stockType}. Expected Cube* or Block*`);
    return null;
  }

  // Extract size in mm, handling both formats
  let sizeStr;
  if (stockType.includes("Cube")) {
    sizeStr = stockType.slice(4).split("mm")[0];
    // Ensure we have a valid number for Cube types
    if (!sizeStr || isNaN(parseFloat(sizeStr))) {
      console.log(`Warning: Could not extract valid size from ${stockType}, using default 16mm`);
      sizeStr = '16'; // Default if no valid size is found
    }
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
  
  // Ensure we have a valid number before conversion
  const sizeInches = parseFloat(sizeStr) / 25.4; // Convert mm to inches
  
  if (isNaN(sizeInches)) {
    console.log(`!!! Invalid size value for ${componentInstructions.type}: ${sizeStr}`);
    return null;
  }

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
    type: componentInstructions.type,
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
function stockModelAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (
    !stockPartInfo.hasOwnProperty("3DModel") || 
    !stockPartInfo["3DModel"].hasOwnProperty("ObjUrl") || 
    !stockPartInfo["3DModel"].hasOwnProperty("TextureUrl") || 
    !stockPartInfo["3DModel"].hasOwnProperty("NormalMapUrl")
  ) {
    console.log(`!!! Missing 3D model information for ${componentInstructions.type}`);
    return null;
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
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
function standeeAdapter(componentInstructions, stockPartInfo, templativeToken) {
  let frontImageUrl = null;
  let backImageUrl = null;

  if (stockPartInfo.hasOwnProperty("PreviewUri")) {
    frontImageUrl = stockPartInfo.PreviewUri;
  } else if (stockPartInfo.hasOwnProperty("FrontImageUrl")) {
    frontImageUrl = stockPartInfo.FrontImageUrl;
  } else {
    console.log(`!!! Missing image URL for standee ${componentInstructions.type}`);
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
    type: componentInstructions.type,
    standeesNameQuantityUrls: [
      {
        quantity: componentInstructions.quantity,
        frontImageUrl: frontImageUrl,
        backImageUrl: backImageUrl,
        name: componentInstructions.name
      }
    ]
  };
}

/**
 * Adapter for createTokenWithDefinedShape
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createTokenWithDefinedShape or null if invalid
 */
function tokenWithDefinedShapeAdapter(componentInstructions, stockPartInfo, templativeToken) {

  if (!stockPartInfo.hasOwnProperty("FrontImageUrl")) {
    console.log(`!!! Missing FrontImageUrl for token ${componentInstructions.type}`);
    return null;
  }

  if (!stockPartInfo.hasOwnProperty("Shape")) {
    console.log(`!!! Missing Shape for token ${componentInstructions.type}`);
    return null;
  }

  const validShapes = ["Box", "Hex", "Circle", "Rounded"];
  if (!validShapes.includes(stockPartInfo.Shape)) {
    console.log(`!!! Invalid shape: ${stockPartInfo.Shape}. Expected one of: ${validShapes.join(", ")}`);
    return null;
  }

  const backImageUrl = stockPartInfo.hasOwnProperty("BackImageUrl") 
    ? stockPartInfo.BackImageUrl 
    : stockPartInfo.FrontImageUrl;

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
    frontImageUrl: stockPartInfo.FrontImageUrl,
    backImageUrl: backImageUrl,
    shape: stockPartInfo.Shape
  };
}

function tokenWithTransparencyBasedShapeAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (!stockPartInfo.hasOwnProperty("PreviewUri")) {
    console.log(`!!! Missing PreviewUri for token ${componentInstructions.type}`);
    return null;
  }

  return {
    componentName: componentInstructions.name, 
    type: componentInstructions.type,
    nameQuantityUrls: [
      {
        name: componentInstructions.name,
        quantity: componentInstructions.quantity,
        frontImageUrl: stockPartInfo.PreviewUri,
        backImageUrl: stockPartInfo.PreviewUri
      }
    ]
  };
}

/**
 * Adapter for createCustomPDF
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} stockPartInfo - Stock part information
 * @returns {Object|null} - Parameters for createCustomPDF or null if invalid
 */
function customPDFAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (!stockPartInfo.hasOwnProperty("PDFUrl")) {
    console.log(`!!! Missing PDFUrl for custom PDF ${componentInstructions.type}`);
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
function dominoAdapter(componentInstructions, stockPartInfo, templativeToken) {
  let colorDiffuse = null;
  
  if (stockPartInfo.hasOwnProperty("Color")) {
    colorDiffuse = getColorValueRGB(stockPartInfo.Color);
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
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
function baggieAdapter(componentInstructions, stockPartInfo, templativeToken) {
  let colorDiffuse = null;
  
  if (stockPartInfo.hasOwnProperty("Color")) {
    colorDiffuse = getColorValueRGB(stockPartInfo.Color);
  }

  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
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
function pokerChipAdapter(componentInstructions, stockPartInfo, templativeToken) {
  if (!stockPartInfo.hasOwnProperty("ChipValue")) {
    // Extract chip value from the type if not explicitly provided
    const typeMatch = componentInstructions.type.match(/CHIP_(\d+)/i);
    if (!typeMatch) {
      console.log(`!!! Missing ChipValue for poker chip ${componentInstructions.type}`);
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
    type: componentInstructions.type,
    chipValue: stockPartInfo.ChipValue,
    colorDiffuse: colorDiffuse
  };
}
function cylinderAdapter(componentInstructions, stockPartInfo, templativeToken) {
  let color = "white";
  let widthMillimeters = 10;
  let heightMillimeters = 10;
  if (stockPartInfo.hasOwnProperty("Color")) {
    color = stockPartInfo.Color;
  }
  let colorHex = getColorValueHex(color);
  if (colorHex === null) {
    console.log(`!!! Invalid color: ${color}. Using white instead.`);
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
          width = parseInt(dimensionMatch[0]);
          // For items like "Wink, 20mm, Black" we'll use a default height
          // or try to infer from the component type
        }
        dimensions = true;
        break;
      }
    }
    
    // If this is a Wink component and no height was found, set height to 3mm
    if (stockPartInfo.DisplayName.includes("Wink") && (!dimensions || heightMillimeters === 10)) {
      heightMillimeters = 3;
    }
    
    if (!dimensions) {
      console.log(`!!! Could not extract dimensions from ${stockPartInfo.DisplayName}. Using defaults.`);
    }
  }
  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
    colorHex: colorHex,
    widthMillimeters: widthMillimeters,
    heightMillimeters: heightMillimeters
  };
}
function meepleAdapter(componentInstructions, stockPartInfo, templativeToken) {
  let color = stockPartInfo.hasOwnProperty("Color") ? stockPartInfo.Color : "white";
  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    color: color,
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
    "FlatTokenWithTransparencyBasedShape": tokenWithTransparencyBasedShapeAdapter,
    "ThickTokenWithTransparencyBasedShape": tokenWithTransparencyBasedShapeAdapter,
    "CustomPDF": customPDFAdapter,
    "Domino": dominoAdapter,
    "Baggie": baggieAdapter,
    "PokerChip": pokerChipAdapter,
    "StockCylinder": cylinderAdapter,
    "StockMeeple": meepleAdapter
  };

  return adapters[simulatorCreationTask] || null;
}

module.exports = {
  getAdapter
}; 