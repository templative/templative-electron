const { createHash } = require('crypto');
const chalk = require('chalk');
const fs = require('fs').promises;
const { clipSvgFileToClipFile } = require('../../../produce/customComponents/svgscissors/modules/imageClipper');
const { convertSvgContentToPng } = require('../../../produce/customComponents/svgscissors/modules/fileConversion/svgConverter');
const { createCompositeImage, placeAndUploadBackImage } = require('../imageProcessing/compositeImageCreator');
const { safeLoadImage } = require('../imageProcessing/imageUtils');
const { uploadToS3 } = require('../imageProcessing/imageUploader');
const { findBoxiestShape } = require('../utils/geometryUtils');
const { SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout } = require('../structs');
const { createD6CompositeImage } = require('../imageProcessing/compositeImageCreator');
const { getColorValueHex } = require('../../../../../../shared/stockComponentColors');
const path = require('path');

/**
 * Adapter for creating a deck object
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Parameters for createDeckObjectState or null if invalid
 */
async function deckAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal) {
  try {
    const totalUniqueCards = componentInstructions.frontInstructions.length;
    const isSingleCard = totalUniqueCards === 1 && (componentInstructions.frontInstructions[0].quantity * componentInstructions.quantity) === 1;

    if (isSingleCard) {
      return await singleCardAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal);
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
      componentInfo
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
      componentInfo
    );
    
    if (backImageImgurUrl === null) {
      console.log(`!!! Failed to upload back image for ${componentUniqueName}`);
      return null;
    }
    
    const imageUrls = new SimulatorTilesetUrls(imgurUrl, backImageImgurUrl);
    
    const scale = calculateScaleBasedOnComponentHeightInInches(componentInfo.DimensionsInches[1]);
    const thickness = 1.0;
    const dimensions = new SimulatorDimensions(scale, scale, thickness);
    const layout = new SimulatorTilesetLayout(totalCount, cardColumnCount, cardRowCount);

    const cardQuantities = componentInstructions.frontInstructions.map(instruction => instruction.quantity * componentInstructions.quantity);
    return {
      deckPrefix: componentIndex + 1,
      name: componentInstructions.uniqueName || componentInstructions.name,
      imageUrls: imageUrls,
      dimensions: dimensions,
      layout: layout,
      cardQuantities: cardQuantities,
      deckType: deckType,
      isSingleCard: false
    };
  } catch (error) {
    console.log(`!!! Error creating deck for ${componentInstructions.uniqueName}: ${error}`);
    return null;
  }
}

/**
 * Adapter for creating a single card object
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Parameters for createCardObjectState or null if invalid
 */
async function singleCardAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal) {
  try {
    // Determine component type based on tags
    let deckType = 0;  // default type
    if (componentInfo.Tags.includes("hex")) {
      deckType = 3;
    } else if (componentInfo.Tags.includes("circle")) {
      deckType = 4;
    }

    // Upload front and back images directly without tiling
    const frontImage = await safeLoadImage(componentInstructions.frontInstructions[0].filepath, componentInfo.DimensionsPixels);
    if (!frontImage) {
      console.log(`!!! Failed to load front image for ${componentInstructions.uniqueName}`);
      return null;
    }

    const backImage = await safeLoadImage(
      componentInstructions.backInstructions ? componentInstructions.backInstructions.filepath : null, 
      componentInfo.DimensionsPixels
    );
    if (!backImage) {
      console.log(`!!! Failed to load back image for ${componentInstructions.uniqueName}`);
      return null;
    }
    
    var frontUrl = await uploadToS3(frontImage);
    if (!frontUrl) {
      console.log(`!!! Failed to upload front image for ${componentInstructions.uniqueName}, falling back to local file.`);
      frontUrl = componentInstructions.frontInstructions[0].filepath;
    }
    
    var backUrl = await uploadToS3(backImage);
    if (!backUrl) {
      console.log(`!!! Failed to upload back image for ${componentInstructions.uniqueName}, falling back to local file.`);
      backUrl = componentInstructions.backInstructions.filepath;
    }
    
    const componentGuid = createHash('md5').update(componentInstructions.uniqueName).digest('hex').slice(0, 6);
    
    
    
    const imageUrls = new SimulatorTilesetUrls(frontUrl, backUrl);
    
    const [columns, rows] = findBoxiestShape(componentCountTotal);
    const boxPositionIndexX = componentIndex % columns;
    const boxPositionIndexZ = Math.floor(componentIndex / columns);
    const height = 1.5;
    
    const simulatorComponentPlacement = new SimulatorComponentPlacement(boxPositionIndexX, height, boxPositionIndexZ, columns, rows);
    const scale = calculateScaleBasedOnComponentHeightInInches(componentInfo.DimensionsInches[1]);
    const thickness = 1.0;
    const dimensions = new SimulatorDimensions(scale, scale, thickness);
    
    return {
      guid: componentGuid,
      cardPrefix: componentIndex + 1,
      name: componentInstructions.uniqueName || componentInstructions.name,
      imageUrls: imageUrls,
      simulatorComponentPlacement: simulatorComponentPlacement,
      dimensions: dimensions,
      deckType: deckType,
      isSingleCard: true
    };
  } catch (error) {
    console.log(`!!! Error creating single card for ${componentInstructions.uniqueName || componentInstructions.name}: ${error}`);
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
async function customDieAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo) {
  try {
    let color = componentInstructions.Color || "white";
    if (!componentInstructions.Color) {
      console.log("!!! Multi colored custom dice are not currently supported. Using white.");
    }
    const colorHex = getColorValueHex(color);
    const imageUrl = await createD6CompositeImage(componentInstructions["name"], colorHex, componentInstructions["dieFaceFilepaths"], tabletopSimulatorImageDirectoryPath);

    return {
      name: componentInstructions["name"],
      quantity: componentInstructions["quantity"],
      imageUrl: imageUrl,
      numberSides: 6
    };
  } catch (error) {
    console.log(`!!! Error creating dice from preview for ${componentInstructions.name}: ${error}`);
    return null;
  }
}

async function clipFrontImageAndUploadToS3(componentInstructions, instruction, componentInfo){
  
  const svgFilepath = instruction.filepath.replace(".png", ".svg")
  const clipFilepath = path.join(__dirname, `../../../create/componentTemplates/${componentInfo.Key}.svg`)
  const imageContent = await clipSvgFileToClipFile(svgFilepath, clipFilepath)

  const clippedSvgFilepath = instruction.filepath.replace(".png", "-clipped.svg")
  await fs.writeFile(clippedSvgFilepath, imageContent)
  
  const outputDirectory = path.dirname(instruction.filepath)
  const componentName = componentInstructions.uniqueName || componentInstructions.name
  const clippedPngFileName = `${componentName}-${instruction.name}-clipped`
  const outputFilepath = path.join(outputDirectory, `${clippedPngFileName}.png`)
  await convertSvgContentToPng(imageContent, componentInfo.DimensionsPixels, outputFilepath)
  const clippedImage = await safeLoadImage(outputFilepath, componentInfo.DimensionsPixels)
  
  const clippedImgurUrl = await uploadToS3(clippedImage)
  if (!clippedImgurUrl) {
    console.log(`!!! Failed to upload clipped image for ${componentInstructions.uniqueName}, falling back to local file.`);
    return outputFilepath;
  }
  return clippedImgurUrl;
}


async function clipAndGatherUrls(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo) {
  try {
    const standeesNameQuantityUrls = []
    let clippedBackUrl = null
    if (componentInstructions.backInstructions) {
      console.log("Has back instructions!")
      clippedBackUrl = await clipFrontImageAndUploadToS3(componentInstructions, componentInstructions.backInstructions, componentInfo)
    }
    
    const tasks = componentInstructions.frontInstructions.map(async (instruction) => {
      const frontClippedS3Url = await clipFrontImageAndUploadToS3(componentInstructions, instruction, componentInfo)
      
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
      standeesNameQuantityUrls
    };
  } catch (error) {
    console.log(`!!! Error creating standees for ${componentInstructions.name}: ${error}`);
    return null;
  }
}
function standardDieAdapter(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo) {
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