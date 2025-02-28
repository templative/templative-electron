const { createHash } = require('crypto');
const chalk = require('chalk');
const { createDeckObjectState, createCardObjectState } = require('../simulatorTemplates/objectState');
const { createCompositeImage, placeAndUploadBackImage } = require('../imageProcessing/compositeImageCreator');
const { safeLoadImage } = require('../imageProcessing/imageUtils');
const { uploadToS3 } = require('../imageProcessing/imageUploader');
const { findBoxiestShape } = require('../utils/geometryUtils');
const { SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout } = require('../structs');

/**
 * Create a deck object
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Deck object state or null if failed
 */
async function createDeck(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal) {
  const totalUniqueCards = componentInstructions.frontInstructions.length;
  const isSingleCard = totalUniqueCards === 1 && (componentInstructions.frontInstructions[0].quantity * componentInstructions.quantity) === 1;

  if (isSingleCard) {
    return await createSingleCard(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal);
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
  
  if (result === null) {
    console.log(chalk.red(`!!! Failed to create composite image for ${componentUniqueName}`));
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
    console.log(chalk.red(`!!! Failed to upload back image for ${componentUniqueName}`));
    return null;
  }

  const componentGuid = createHash('md5').update(componentInstructions.uniqueName).digest('hex').slice(0, 6);

  const relativeWidth = componentInfo.DimensionsInches[0] / 2.5;
  const relativeHeight = relativeWidth;
  const thickness = 1.0;

  const imageUrls = new SimulatorTilesetUrls(imgurUrl, backImageImgurUrl);

  const [columns, rows] = findBoxiestShape(componentCountTotal);
  const boxPositionIndexX = componentIndex % columns;
  const boxPositionIndexZ = Math.floor(componentIndex / columns);
  const height = 1.5;

  const simulatorComponentPlacement = new SimulatorComponentPlacement(boxPositionIndexX, height, boxPositionIndexZ, columns, rows);
  const dimensions = new SimulatorDimensions(relativeWidth, relativeHeight, thickness);
  const layout = new SimulatorTilesetLayout(totalCount, cardColumnCount, cardRowCount);

  const cardQuantities = componentInstructions.frontInstructions.map(instruction => instruction.quantity * componentInstructions.quantity);

  return createDeckObjectState(
    componentGuid,
    componentIndex + 1,
    componentInstructions.uniqueName,
    imageUrls,
    simulatorComponentPlacement,
    dimensions,
    layout,
    cardQuantities,
    deckType
  );
}

/**
 * Create a single card object
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Card object state or null if failed
 */
async function createSingleCard(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal) {
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
    return null;
  }

  const backImage = await safeLoadImage(
    componentInstructions.backInstructions ? componentInstructions.backInstructions.filepath : null, 
    componentInfo.DimensionsPixels
  );
  if (!backImage) {
    return null;
  }
  
  const frontImgurUrl = await uploadToS3(frontImage);
  const backImgurUrl = await uploadToS3(backImage);
  
  const componentGuid = createHash('md5').update(componentInstructions.uniqueName).digest('hex').slice(0, 6);
  
  const relativeWidth = componentInfo.DimensionsInches[0] / 2.5;
  const relativeHeight = componentInfo.DimensionsInches[1] / 3.5;
  const thickness = 1.0;
  
  const imageUrls = new SimulatorTilesetUrls(frontImgurUrl, backImgurUrl);
  
  const [columns, rows] = findBoxiestShape(componentCountTotal);
  const boxPositionIndexX = componentIndex % columns;
  const boxPositionIndexZ = Math.floor(componentIndex / columns);
  const height = 1.5;
  
  const simulatorComponentPlacement = new SimulatorComponentPlacement(boxPositionIndexX, height, boxPositionIndexZ, columns, rows);
  const dimensions = new SimulatorDimensions(relativeWidth, relativeHeight, thickness);
  
  return createCardObjectState(
    componentGuid,
    componentIndex + 1,
    componentInstructions.uniqueName,
    imageUrls,
    simulatorComponentPlacement,
    dimensions,
    deckType
  );
}

module.exports = {
  createDeck,
  createSingleCard
}; 