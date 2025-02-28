const path = require('path');
const { Image } = require('image-js');
const chalk = require('chalk');
const { safeLoadImage, createPlaceholderImage } = require('./imageUtils');
const { uploadToS3 } = require('./imageUploader');
const { fileExists } = require('../utils/fileUtils');
const { findBoxiestShape } = require('../utils/geometryUtils');
const { copyFile } = require('../utils/fileUtils');

/**
 * Paint one image onto another at the specified position
 * @param {Image} targetImage - The target image to paint onto
 * @param {Image} sourceImage - The source image to paint
 * @param {number} x - The x position to paint at
 * @param {number} y - The y position to paint at
 */
function paintImageOnto(targetImage, sourceImage, x, y) {
  // For each pixel in the source image
  for (let i = 0; i < sourceImage.width; i++) {
    for (let j = 0; j < sourceImage.height; j++) {
      // Calculate the target position
      const targetX = x + i;
      const targetY = y + j;
      
      // Skip if outside the target image bounds
      if (targetX < 0 || targetX >= targetImage.width || targetY < 0 || targetY >= targetImage.height) {
        continue;
      }
      
      // Get the source pixel
      const sourcePixel = sourceImage.getPixelXY(i, j);
      
      // Set the target pixel
      targetImage.setPixelXY(targetX, targetY, sourcePixel);
    }
  }
}

/**
 * Create a composite image for a deck of cards
 * @param {string} componentName - Name of the component
 * @param {string} componentType - Type of the component
 * @param {number} quantity - Quantity of the component
 * @param {Array} frontInstructions - Instructions for front images
 * @param {Object} backInstructions - Instructions for back image
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to the TTS image directory
 * @param {Object} componentInfo - Component information
 * @returns {Promise<Array|null>} - [imgurUrl, totalCount, cardColumnCount, cardRowCount] or null if failed
 */
async function createCompositeImage(componentName, componentType, quantity, frontInstructions, backInstructions, tabletopSimulatorImageDirectoryPath, componentInfo) {
  const uniqueCardCount = frontInstructions.length;

  if (uniqueCardCount > 69) {
    console.log(chalk.red("!!! Components larger than 69 unique cards aren't parsed correctly at the moment."));
    return [null, 0, 0, 0];
  }

  const totalCards = uniqueCardCount + 1;
  let [columns, rows] = findBoxiestShape(totalCards);

  columns = Math.max(columns, 2);
  rows = Math.max(rows, 2);

  if (!componentInfo.hasOwnProperty("DimensionsPixels")) {
    console.log(chalk.red(`!!! Skipping ${componentType} that has no DimensionsPixels.`));
    return [null, 0, 0, 0];
  }
  const pixelDimensions = componentInfo.DimensionsPixels;

  let totalWidth = pixelDimensions[0] * columns;
  let totalHeight = pixelDimensions[1] * rows;

  const MAX_DIMENSION = 10000;
  let scaleFactor = 1.0;

  if (totalWidth > MAX_DIMENSION || totalHeight > MAX_DIMENSION) {
    const aspectRatio = pixelDimensions[0] / pixelDimensions[1];
    const maxColumns = Math.floor(MAX_DIMENSION / pixelDimensions[0]);
    const maxRows = Math.floor(MAX_DIMENSION / pixelDimensions[1]);

    if (totalCards <= maxColumns * maxRows) {
      columns = Math.min(columns, maxColumns);
      rows = Math.ceil(totalCards / columns);

      if (rows > maxRows) {
        rows = maxRows;
        columns = Math.ceil(totalCards / rows);
      }
    }

    totalWidth = pixelDimensions[0] * columns;
    totalHeight = pixelDimensions[1] * rows;
    if (totalWidth > MAX_DIMENSION || totalHeight > MAX_DIMENSION) {
      const widthScale = totalWidth > MAX_DIMENSION ? MAX_DIMENSION / totalWidth : 1;
      const heightScale = totalHeight > MAX_DIMENSION ? MAX_DIMENSION / totalHeight : 1;
      scaleFactor = Math.min(widthScale, heightScale);
    }
  }

  const scaledWidth = Math.floor(pixelDimensions[0] * columns * scaleFactor);
  const scaledHeight = Math.floor(pixelDimensions[1] * rows * scaleFactor);
  const tiledImage = new Image(scaledWidth, scaledHeight, {kind: 'RGB'});

  let cardIndex = 0;
  for (const instruction of frontInstructions) {
    const xIndex = cardIndex % columns;
    const yIndex = Math.floor(cardIndex / columns);
    try {
      let image;
      if (!await fileExists(instruction.filepath)) {
        console.log(chalk.red(`!!! Image file not found: ${instruction.filepath}`));
        image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
      } else {
        image = await Image.load(instruction.filepath);
      }
      if (scaleFactor !== 1.0) {
        const newSize = [Math.floor(pixelDimensions[0] * scaleFactor), Math.floor(pixelDimensions[1] * scaleFactor)];
        image = image.resize(newSize);
      }
      
      // Use our custom paintImageOnto function instead of drawImage
      paintImageOnto(
        tiledImage, 
        image, 
        Math.floor(xIndex * pixelDimensions[0] * scaleFactor), 
        Math.floor(yIndex * pixelDimensions[1] * scaleFactor)
      );
      
      cardIndex += 1;
    } catch (error) {
      console.log(chalk.red(`!!! Error loading image ${instruction.filepath}: ${error}`));
      let placeholderImage = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
      if (scaleFactor !== 1.0) {
        const newSize = [Math.floor(pixelDimensions[0] * scaleFactor), Math.floor(pixelDimensions[1] * scaleFactor)];
        placeholderImage = placeholderImage.resize(newSize);
      }
      
      // Use our custom paintImageOnto function instead of drawImage
      paintImageOnto(
        tiledImage, 
        placeholderImage, 
        Math.floor(xIndex * pixelDimensions[0] * scaleFactor), 
        Math.floor(yIndex * pixelDimensions[1] * scaleFactor)
      );
    }
  }

  // Handle back image
  let backImage;
  if (backInstructions) {
    try {
      if (!await fileExists(backInstructions.filepath)) {
        console.log(chalk.red(`!!! Back image file not found: ${backInstructions.filepath}`));
        backImage = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
      } else {
        backImage = await Image.load(backInstructions.filepath);
      }
    } catch (error) {
      console.log(chalk.red(`!!! Error loading back image ${backInstructions.filepath}: ${error}`));
      backImage = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
    }
  } else {
    // Create a black image with the same dimensions as the front cards
    backImage = new Image(pixelDimensions[0], pixelDimensions[1], {kind: 'RGB'});
  }

  if (scaleFactor !== 1.0) {
    const newSize = [Math.floor(pixelDimensions[0] * scaleFactor), Math.floor(pixelDimensions[1] * scaleFactor)];
    backImage = backImage.resize(newSize);
  }

  // Place back image in bottom right corner
  const xIndex = columns - 1;  // Rightmost column
  const yIndex = rows - 1;     // Bottom row
  
  // Use our custom paintImageOnto function instead of drawImage
  paintImageOnto(
    tiledImage, 
    backImage, 
    Math.floor(xIndex * pixelDimensions[0] * scaleFactor),
    Math.floor(yIndex * pixelDimensions[1] * scaleFactor)
  );

  // Save the composite image
  const frontImageName = `${componentName}-front.png`;
  const frontImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, frontImageName);
  await tiledImage.save(frontImageFilepath);
  const imgurUrl = await uploadToS3(tiledImage);

  // Calculate total cards including duplicates
  const totalCount = frontInstructions.reduce((sum, instruction) => sum + instruction.quantity * quantity, 0);
  
  return [imgurUrl, totalCount, columns, rows];
}

/**
 * Place and upload a back image
 * @param {string} name - Component name
 * @param {string} componentType - Component type
 * @param {Object} backInstructions - Back image instructions
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInfo - Component information
 * @returns {Promise<string|null>} - URL of the uploaded image or null if failed
 */
async function placeAndUploadBackImage(name, componentType, backInstructions, tabletopSimulatorImageDirectoryPath, componentInfo) {
  if (!componentInfo.hasOwnProperty("DimensionsPixels")) {
    console.log(chalk.red(`!!! Skipping ${componentType} that has no DimensionsPixels.`));
    return null;
  }
  
  const pixelDimensions = componentInfo.DimensionsPixels;
  let image;
  
  if (backInstructions) {
    try {
      if (!await fileExists(backInstructions.filepath)) {
        console.log(chalk.red(`!!! Back image file not found: ${backInstructions.filepath}`));
        image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
      } else {
        await copyBackImageToImages(name, backInstructions, tabletopSimulatorImageDirectoryPath);
        image = await Image.load(backInstructions.filepath);
      }
    } catch (error) {
      console.log(chalk.red(`!!! Error loading back image ${backInstructions.filepath}: ${error}`));
      image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
    }
  } else {
    image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1]);
  }
  
  return await uploadToS3(image);
}

/**
 * Copy a back image to the TTS images directory
 * @param {string} componentName - Component name
 * @param {Object} backInstructions - Back image instructions
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @returns {Promise<void>}
 */
async function copyBackImageToImages(componentName, backInstructions, tabletopSimulatorImageDirectoryPath) {
  const backImageName = `${componentName}-back.jpeg`;
  const backImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, backImageName);
  await copyFile(backInstructions.filepath, backImageFilepath);
}

module.exports = {
  createCompositeImage,
  placeAndUploadBackImage
}; 