const fsExtra = require('fs-extra');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const {captureMessage, captureException } = require("../../../../sentryElectronWrapper");

/**
 * Convert PNG to JPG
 * @param {string} absoluteOutputDirectory - Output directory
 * @param {string} name - Base name for the output file
 * @param {string} pngFilepath - Path to PNG file
 * @returns {Promise<string>} - Path to output JPG file
 */
async function convertToJpg(absoluteOutputDirectory, name, pngFilepath) {
  try {
    const { Image } = require('image-js');
    
    // Load PNG image
    
    let image;
    try {
      image = await Image.load(pngFilepath);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
      console.log(`!!! PNG file ${pngFilepath} does not exist.`);
      captureException(e);
      return null;
    }
    

    // Convert to JPG
    const jpgImage = image.rgba8().background({ r: 255, g: 255, b: 255 });
    
    // Save JPG file
    const jpgFilepath = path.join(absoluteOutputDirectory, `${name}.jpg`);
    await jpgImage.save(jpgFilepath, { format: 'jpg', quality: 90 });
    
    return jpgFilepath;
  } catch (err) {
    console.error(`Error converting PNG to JPG: ${err.message}`);
    throw err;
  }
}

async function convertSvgContentToPngUsingResvg(svgString, imageSizePixels, outputFilepath) {
  try {
    let resvg;
    try {
      resvg = new Resvg(svgString, {
        font: {
          loadSystemFonts: true,
          defaultFontFamily: 'Arial',
          fallbackFamilies: ['Helvetica', 'sans-serif']
        },
        fitTo: {
          mode: 'width',
          value: imageSizePixels[0]
        }
      });      
    } catch (resvgError) {
      console.error(`Error creating Resvg instance: ${resvgError.message}`);
      console.error(resvgError.stack);
      captureException(resvgError);
    }
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    await fsExtra.outputFile(outputFilepath, pngBuffer);
    
    return outputFilepath;
  } catch (err) {
    console.error(`Error converting SVG string to PNG: ${err.message}`);
    throw err;
  }
}

module.exports = {
  convertToJpg,
  convertSvgContentToPngUsingResvg
}; 