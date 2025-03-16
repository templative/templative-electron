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
  try {
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
        let image = await safeLoadImage(instruction.filepath, pixelDimensions);
        
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
        console.log(chalk.red(`!!! Error processing image ${instruction.filepath}: ${error}`));
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
        
        cardIndex += 1;
      }
    }

    // Handle back image
    let backImage = await safeLoadImage(
      backInstructions ? backInstructions.filepath : null, 
      pixelDimensions
    );

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

    // Upload the image to S3
    var url = await uploadToS3(tiledImage);
    if (!url) {
      console.log(chalk.red(`!!! Failed to upload composite image for ${componentName}, falling back to local file.`));
      url = frontImageFilepath
    }

    // Calculate total cards including duplicates
    const totalCount = frontInstructions.reduce((sum, instruction) => sum + instruction.quantity * quantity, 0);
    
    return [url, totalCount, columns, rows];
  } catch (error) {
    console.log(chalk.red(`!!! Error creating composite image for ${componentName}: ${error}`));
    return [null, 0, 0, 0];
  }
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
  try {
    if (!componentInfo.hasOwnProperty("DimensionsPixels")) {
      console.log(chalk.red(`!!! Skipping ${componentType} that has no DimensionsPixels.`));
      return null;
    }
    
    const pixelDimensions = componentInfo.DimensionsPixels;
    
    // Use safeLoadImage to handle errors gracefully
    const image = await safeLoadImage(
      backInstructions ? backInstructions.filepath : null, 
      pixelDimensions
    );
    
    if (backInstructions && await fileExists(backInstructions.filepath)) {
      await copyBackImageToImages(name, backInstructions, tabletopSimulatorImageDirectoryPath);
    }
    
    // Upload the image to S3
    const url = await uploadToS3(image);
    if (!url) {
      console.log(chalk.red(`!!! Failed to upload back image for ${name}, falling back to local file.`));
      return backInstructions.filepath;
    }
    
    return url;
  } catch (error) {
    console.log(chalk.red(`!!! Error processing back image for ${name}: ${error}`));
    return null;
  }
}

/**
 * Copy a back image to the TTS images directory
 * @param {string} componentName - Component name
 * @param {Object} backInstructions - Back image instructions
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @returns {Promise<void>}
 */
async function copyBackImageToImages(componentName, backInstructions, tabletopSimulatorImageDirectoryPath) {
  try {
    const backImageName = `${componentName}-back.png`;
    const backImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, backImageName);
    await copyFile(backInstructions.filepath, backImageFilepath);
  } catch (error) {
    console.log(chalk.red(`!!! Error copying back image for ${componentName}: ${error}`));
  }
}

async function createD6CompositeImage(name, color, filepaths, tabletopSimulatorImageDirectoryPath) {
  try {
    // Create a square image 2048x2048px with the specified color
    const imageSize = 2048;
    const cellSize = Math.floor(imageSize / 3);
    
    // Create base image with the specified color
    const baseImage = new Image(imageSize, imageSize, {kind: 'RGB'});
    
    // Parse the hex color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Fill the image with the color
    for (let x = 0; x < imageSize; x++) {
      for (let y = 0; y < imageSize; y++) {
        baseImage.setPixelXY(x, y, [r, g, b]);
      }
    }
    
    // Position mappings for die faces (grid coordinates)
    const positions = [
      [0, 2], // Face 1 (position 0)
      [0, 1], // Face 2 (position 1)
      [1, 2], // Face 3 (position 2)
      [1, 1], // Face 4 (position 3)
      [2, 1], // Face 5 (position 4)
      [2, 2]  // Face 6 (position 5)
    ];
    
    
    // Process each die face image
    for (let i = 0; i < 6; i++) {
      if (i < filepaths.length) {
        try {
          // Load the die face image
          const faceImage = await safeLoadImage(filepaths[i], [cellSize, cellSize]);
          
          // Resize the image to fit the cell size
          let resizedFaceImage = faceImage.resize({
            width: cellSize,
            height: cellSize
          });
          
          // Rotate the image 180 degrees for faces 1 and 6 (index 0 and 5)
          if (i === 0 || i === 5) {
            resizedFaceImage = resizedFaceImage.rotate(180);
          }
          
          // Calculate position
          const [col, row] = positions[i];
          const x = col * cellSize;
          const y = row * cellSize;
          
          // Paint the resized face onto the base image
          paintImageOnto(baseImage, resizedFaceImage, x, y);
        } catch (error) {
          console.log(chalk.yellow(`Warning: Could not load die face ${i+1} from ${filepaths[i]}: ${error}`));
          // Continue with other faces
        }
      }
    }
    const localImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, `${name}-d6.png`);
    await baseImage.save(localImageFilepath);
    const imageUrl = await uploadToS3(baseImage);
    if (!imageUrl) {
      console.log(chalk.red(`!!! Failed to upload die image for ${name}, falling back to local file.`));
      return localImageFilepath;
    }
    return imageUrl;
  } catch (error) {
    console.log(chalk.red(`!!! Error creating D6 composite image for ${name}: ${error}`));
    return null;
  }
}

module.exports = {
  createCompositeImage,
  placeAndUploadBackImage,
  createD6CompositeImage
}; 