const fsExtra = require('fs-extra');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const Sentry = require('@sentry/electron/main');

/**
 * Create a fallback SVG
 * @param {number[]} imageSizePixels - Width and height in pixels
 * @returns {string} - Fallback SVG content
 */
function createFallbackSvg(imageSizePixels) {
  const width = imageSizePixels[0];
  const height = imageSizePixels[1];
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#f0f0f0" />
      <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle">Error rendering SVG</text>
      <text x="${width/2}" y="${height/2 + 30}" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle">Please check the console for details</text>
    </svg>
  `;
}

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
      Sentry.captureException(e);
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

async function createFallbackPng(imageSizePixels) {
  try {
    console.log('⚠️ Creating fallback image...');
    
    // Create a minimal SVG as a fallback
    const minimalSvg = createFallbackSvg(imageSizePixels);
    
    resvg = new Resvg(minimalSvg, {
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
    
    console.log('🆘 Created fallback placeholder image');
  } catch (finalError) {
    console.error('❌ All conversion attempts failed');
    Sentry.captureException(finalError);
    throw finalError; // Throw the original error
  }
  return resvg;
}

async function convertSvgContentToPng(svgString, imageSizePixels, outputFilepath) {
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
      Sentry.captureException(resvgError);
      
      // Try to create a fallback image
      resvg = await createFallbackPng(imageSizePixels);
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
  createFallbackSvg,
  convertToJpg,
  convertSvgContentToPng
}; 