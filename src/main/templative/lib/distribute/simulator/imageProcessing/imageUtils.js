const { Image } = require('image-js');
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
function createPlaceholderImage(width, height, errorMessage) {
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
  try {
    if (!filepath || filepath === null || filepath === undefined) {
      throw new Error(`No image file provided.`);
    }
    if (!await fileExists(filepath)) {
      throw new Error(`Image file not found: ${filepath}`);
    }
    return await Image.load(filepath);
  }
  catch(error) {
    console.log(`Error loading image: ${error.message}, creating placeholder image.`);
    return createPlaceholderImage(dimensions[0], dimensions[1], error.message);
  }
}

module.exports = {
  createPlaceholderImage,
  safeLoadImage,
  loadSvg
}; 