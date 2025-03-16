const { Image } = require('image-js');
const chalk = require('chalk');
const { fileExists } = require('../utils/fileUtils');
const fs = require('fs/promises');

async function loadSvg(svgFilepath) {
  try {
    return await fs.readFile(svgFilepath, 'utf8');
  } catch (e) {
    console.log(`!!! Template art file ${svgFilepath} cannot be parsed. Error: ${e}`);
    return null;
  }
}

/**
 * Create a placeholder image with a solid pink color
 * @param {number} width - Width of the image in pixels
 * @param {number} height - Height of the image in pixels
 * @returns {Image} - A new Image object
 */
function createPlaceholderImage(width, height) {
  // Create a solid pink image
  const image = new Image(width, height, {kind: 'RGB'});
  // Fill with pink (255, 192, 203)
  for (let i = 0; i < image.size; i += 3) {
    image.data[i] = 255;     // R
    image.data[i + 1] = 192; // G
    image.data[i + 2] = 203; // B
  }
  return image;
}

/**
 * Safely load an image, returning a placeholder if the image cannot be loaded
 * @param {string} filepath - Path to the image file
 * @param {Array<number>} [dimensions] - Optional dimensions for the placeholder image
 * @returns {Promise<Image|null>} - The loaded image or null if it cannot be loaded
 */
async function safeLoadImage(filepath, dimensions = [400, 400]) {
  if (!filepath || filepath === null || filepath === undefined) {
    console.log(chalk.yellow(`!!! No image file provided.`));
    return createPlaceholderImage(dimensions[0], dimensions[1]);
  }
  if (!await fileExists(filepath)) {
    console.log(chalk.yellow(`!!! Image file not found: ${filepath}`));
    return createPlaceholderImage(dimensions[0], dimensions[1]);
  }
  try {
    return await Image.load(filepath);
  } catch (error) {
    console.log(chalk.red(`!!! Error loading image ${filepath}: ${error}`));
    return createPlaceholderImage(dimensions[0], dimensions[1]);
  }
}

module.exports = {
  createPlaceholderImage,
  safeLoadImage,
  loadSvg
}; 