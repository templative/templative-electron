const { createHash } = require('crypto');
const { createCompositeImage, placeAndUploadBackImage } = require('../imageProcessing/compositeImageCreator');
const { safeLoadImage } = require('../imageProcessing/imageUtils');
const { uploadImageToS3 } = require('../../../../../../shared/TemplativeApiClient');
const { findBoxiestShape } = require('../utils/geometryUtils');
const { SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout } = require('../structs');
const { createD6CompositeImage } = require('../imageProcessing/compositeImageCreator');
const { getColorValueHex } = require('../../../../../../shared/stockComponentColors');
const { captureException } = require("../../../sentryElectronWrapper");

/**
 * Adapter for creating a deck object
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Parameters for createDeckObjectState or null if invalid
 */
async function deckAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal, templativeToken) {
  if (!templativeToken) {
    console.log("!!! No templative token provided, skipping deck adapter.");
    return null;
  }
  try {
    const totalUniqueCards = componentInstructions.frontInstructions.length;
    const isSingleCard = totalUniqueCards === 1 && (componentInstructions.frontInstructions[0].quantity * componentInstructions.quantity) === 1;

    if (isSingleCard) {
      return await singleCardAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal, templativeToken);
    }

    let deckType = 0;
    if (componentInfo.Tags.includes("hex")) {
      deckType = 3;
    } else if (componentInfo.Tags.includes("circle")) {
      deckType = 4;
    }

    const componentUniqueName = componentInstructions.uniqueName;

    const result = await createCompositeImage(
      componentUniqueName, 
      componentInstructions.type, 
      componentInstructions.quantity, 
      componentInstructions.frontInstructions, 
      componentInstructions.backInstructions, 
      tabletopSimulatorImageDirectoryPath,
      componentInfo,
      templativeToken
    );
    
    if (!result || result[0] === null) {
      console.log(`!!! Failed to create composite image for ${componentUniqueName}`);
      return null;
    }

    const [imgurUrl, totalCount, cardColumnCount, cardRowCount] = result;

    const backImageImgurUrl = await placeAndUploadBackImage(
      componentUniqueName, 
      componentInstructions.type, 
      componentInstructions.backInstructions, 
      tabletopSimulatorImageDirectoryPath,
      componentInfo,
      templativeToken
    );
    
    if (backImageImgurUrl === null) {
      console.log(`!!! Failed to upload back image for ${componentUniqueName}`);
      return null;
    }
    
    const imageUrls = new SimulatorTilesetUrls(imgurUrl, backImageImgurUrl);
    
    const scale = calculateScaleBasedOnComponentHeightInInches(componentInfo.DimensionsInches[1] * componentInfo.PrintingSizeUpRatio[1]);
    const thickness = 1.0;
    const dimensions = new SimulatorDimensions(scale, scale, thickness);
    const layout = new SimulatorTilesetLayout(totalCount, cardColumnCount, cardRowCount);

    const cardQuantities = componentInstructions.frontInstructions.map(instruction => instruction.quantity * componentInstructions.quantity);
    return {
      deckPrefix: componentIndex + 1,
      name: componentInstructions.uniqueName || componentInstructions.name,
      type: componentInstructions.type,
      imageUrls: imageUrls,
      dimensions: dimensions,
      layout: layout,
      cardQuantities: cardQuantities,
      deckType: deckType,
      isSingleCard: false
    };
  } catch (error) {
    console.log(`!!! Error creating deck for ${componentInstructions.uniqueName}: ${error}`);
    captureException(error);
    return null;
  }
}

async function loadAndUploadImage(instruction, dimensions, componentName, side, templativeToken) {
  if (!instruction) return null;
  
  if (!templativeToken) {
    console.log(`!!! No templative token provided for ${side} image upload of ${componentName}`);
    return null;
  }
  
  const filepath = instruction["filepath"].replace(".png", "_clipped.png");
  const image = await safeLoadImage(filepath, dimensions);
  if (!image) {
    console.log(`!!! Failed to load ${side} image for ${componentName}`);
    return null;
  }

  const url = await uploadImageToS3(image, templativeToken);
  if (!url) {
    console.log(`!!! Failed to upload ${side} image for ${componentName}, falling back to local file.`);
    return instruction["filepath"];
  }
  return url;
}


async function singleCardAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal, templativeToken) {
  try {
    if (!templativeToken) {
      console.log("!!! No templative token provided in singleCardAdapter");
      return null;
    }

    // console.log(`DEBUG: Token in singleCardAdapter (first 20 chars): ${templativeToken.substring(0, 20)}...`);
    
    let deckType = 0;  // default type
    if (componentInfo.Tags.includes("hex")) {
      deckType = 3;
    } else if (componentInfo.Tags.includes("circle")) {
      deckType = 4;
    }

    const componentName = componentInstructions.uniqueName || componentInstructions.name;
    
    
    const frontUrl = await loadAndUploadImage(
      componentInstructions.frontInstructions[0],
      componentInfo.DimensionsPixelsClipped,
      componentName,
      'front',
      templativeToken
    );
    if (!frontUrl) {
      console.log(`!!! Failed to upload front image for ${componentName}, skipping.`);
      return null;
    };

    var backUrl = await loadAndUploadImage(
      componentInstructions.backInstructions,
      componentInfo.DimensionsPixelsClipped,
      componentName,
      'back',
      templativeToken
    );
    if (!backUrl) {
      console.log(`!!! Failed to upload back image for ${componentName}, falling back to front image.`);
      backUrl = frontUrl;
    };

    const componentGuid = createHash('md5').update(componentInstructions.uniqueName).digest('hex').slice(0, 6);
    
    const imageUrls = new SimulatorTilesetUrls(frontUrl, backUrl);
    const [columns, rows] = findBoxiestShape(componentCountTotal);
    const boxPositionIndexX = componentIndex % columns;
    const boxPositionIndexZ = Math.floor(componentIndex / columns);
    const height = 1.5;
    
    const simulatorComponentPlacement = new SimulatorComponentPlacement(boxPositionIndexX, height, boxPositionIndexZ, columns, rows);
    const scale = calculateScaleBasedOnComponentHeightInInches(componentInfo.DimensionsInches[1] * componentInfo.PrintingSizeUpRatio[1]);
    const thickness = 1.0;
    const dimensions = new SimulatorDimensions(scale, scale, thickness);
    
    return {
      guid: componentGuid,
      cardPrefix: componentIndex + 1,
      name: componentInstructions.uniqueName || componentInstructions.name,
      type: componentInstructions.type,
      imageUrls: imageUrls,
      simulatorComponentPlacement: simulatorComponentPlacement,
      dimensions: dimensions,
      deckType: deckType,
      isSingleCard: true
    };
  } catch (error) {
    console.log(`!!! Error creating single card for ${componentInstructions.uniqueName || componentInstructions.name}: ${error}`);
    captureException(error);
    return null;
  }
}

/**
 * Adapter for creating a custom die
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @returns {Promise<Object|null>} - Parameters for createCustomDie or null if invalid
 */
async function customDieAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, templativeToken) {
  try {
    let color = componentInstructions.Color || "white";
    if (!componentInstructions.Color) {
      console.log("!!! Multi colored custom dice are not currently supported. Using white.");
    }
    const colorHex = getColorValueHex(color);
    const imageUrl = await createD6CompositeImage(componentInstructions["name"], colorHex, componentInstructions["dieFaceFilepaths"], tabletopSimulatorImageDirectoryPath, templativeToken);

    return {
      name: componentInstructions["name"],
      quantity: componentInstructions["quantity"],
      type: componentInstructions.type,
      imageUrl: imageUrl,
      numberSides: 6
    };
  } catch (error) {
    console.log(`!!! Error creating dice from preview for ${componentInstructions.name}: ${error}`);
    captureException(error);
    return null;
  }
}

async function clipFrontImageAnduploadImageToS3(componentInstructions, instruction, componentInfo, templativeToken){
  const filepath = instruction["filepath"].replace(".png", "_clipped.png");
  const clippedImage = await safeLoadImage(filepath, componentInfo.DimensionsPixelsClipped)
  
  const clippedImgurUrl = await uploadImageToS3(clippedImage, templativeToken)
  if (!clippedImgurUrl) {
    console.log(`!!! Failed to upload clipped image for ${componentInstructions.uniqueName}, falling back to local file.`);
    return outputFilepath;
  }
  return clippedImgurUrl;
}


async function clipAndGatherUrls(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, templativeToken) {
  try {
    const standeesNameQuantityUrls = []
    let clippedBackUrl = null
    if (componentInstructions.backInstructions) {
      console.log("Has back instructions!")
      clippedBackUrl = await clipFrontImageAnduploadImageToS3(componentInstructions, componentInstructions.backInstructions, componentInfo, templativeToken)
    }
    
    const tasks = componentInstructions.frontInstructions.map(async (instruction) => {
      const frontClippedS3Url = await clipFrontImageAnduploadImageToS3(componentInstructions, instruction, componentInfo, templativeToken)
      
      standeesNameQuantityUrls.push({
        name: instruction.name,
        frontImageUrl: frontClippedS3Url,
        backImageUrl: clippedBackUrl ? clippedBackUrl : frontClippedS3Url,
        quantity: instruction.quantity
      })
    })
    
    await Promise.all(tasks)
    
    return {
      name: componentInstructions["name"],
      type: componentInstructions.type,
      standeesNameQuantityUrls
    };
  } catch (error) {
    console.log(`!!! Error creating standees for ${componentInstructions.name}: ${error}`);
    captureException(error);
    return null;
  }
}
function standardDieAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, templativeToken) {
  // First let's extract size if present
  const sizeMillimeters = 12
  const millimetersToInches = 25.4
  const sizeInches = sizeMillimeters / millimetersToInches; // Convert mm to inches

  // Extract die type with improved regex that handles D4, D6, D8, D10, D12, D20 
  // regardless of what follows (color, dimensions, etc.)
  const dieTypeMatch = componentInstructions.type.match(/D(4|6|8|10|12|20)/);
  
  // Parse the number of sides or default to 6
  let numberSides = 6;
  if (dieTypeMatch) {
    numberSides = parseInt(dieTypeMatch[1]);
  } else {
    console.log(`Could not detect die type from ${componentInstructions.type}, defaulting to D6`);
  }
  const whiteColorOutOfOne = [1,1,1]
  return {
    name: componentInstructions.name,
    quantity: componentInstructions.quantity,
    type: componentInstructions.type,
    numberSides: numberSides,
    sizeInches: sizeInches,
    colorRGBOutOfOne: whiteColorOutOfOne,
    isMetal: false
  };
}

const calculateScaleBasedOnComponentHeightInInches = (heightInches) => {  
  // Component          | Pixels WxH    | Inches WxH | Scale        | Scale/Width | Scale/Height
  // Spinner            | 2475x2475     | 8x8        | 2.61136246   | 0.326       | 0.326
  // Poker card         | 825x1125      | 2.5x3.5    | 1.1523807    | 0.461       | 0.329
  // Poker Folio        | 3075x1125     | 10x3.5     | 1.1523807    | 0.115       | 0.329
  // Small Hex Tile     | 675x600       | 2x1.75     | 0.547053337  | 0.274       | 0.313
  
  // The consistent pattern appears to be with the height dimension:
  // Scale / Height(inches) is consistently around 0.32-0.33
  const scaleFactor = 0.33;
  return scaleFactor * heightInches;
}

/**
 * Get the appropriate adapter function based on the simulator creation task
 * @param {string} simulatorCreationTask - The simulator creation task
 * @returns {Function|null} - The adapter function or null if not supported
 */
function getAdapter(simulatorCreationTask) {
  const adapters = {
    "DECK": deckAdapter,
    "BOARD": deckAdapter,
    "CustomDie": customDieAdapter,
    "StandardDie": standardDieAdapter,
    "CustomStandee": clipAndGatherUrls,
    "CustomToken": clipAndGatherUrls
  };

  return adapters[simulatorCreationTask] || null;
}

module.exports = {
  deckAdapter,
  singleCardAdapter,
  customDieAdapter,
  getAdapter,
  calculateScaleBasedOnComponentHeightInInches
}; 