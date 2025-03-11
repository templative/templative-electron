const fs = require('fs-extra');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { preprocessSvgText } = require('./textWrapping/index.js');

// Simple locking mechanism to prevent multiple rendering processes from conflicting
const activeTasks = new Map();

/**
 * Convert SVG to PNG
 * @param {string} svgFilepath - Path to SVG file
 * @param {number[]} imageSizePixels - Width and height in pixels
 * @param {string} outputFilepath - Path to output PNG file
 * @returns {Promise<string>} - Path to output PNG file
 */
async function convertSvgToPng(svgFilepath, imageSizePixels, outputFilepath) {
  try {
    // Read SVG file
    const svgData = await fs.readFile(svgFilepath, 'utf8');
    
    // Preprocess SVG to handle text wrapping and other issues
    const processedSvgData = preprocessSvgText(svgData);
    // Write processed SVG data to a debug file for inspection
    try {
      const debugFilePath = `${outputFilepath}.debug.svg`;
      await fs.writeFile(debugFilePath, processedSvgData, 'utf8');
      // console.log(`Wrote processed SVG data to ${debugFilePath}`);
    } catch (debugWriteError) {
      console.error(`Error writing debug SVG file: ${debugWriteError.message}`);
      // Continue with conversion even if debug file writing fails
    }
    // Create Resvg instance
    let resvg;
    try {
      resvg = new Resvg(processedSvgData, {
        font: {
          loadSystemFonts: true
        },
        fitTo: {
          mode: 'width',
          value: imageSizePixels[0]
        }
      });
    } catch (resvgError) {
      console.error(`Error creating Resvg instance: ${resvgError.message}`);
      
      // Try to create a fallback image
      try {
        console.log('⚠️ Creating fallback image...');
        
        // Create a minimal SVG as a fallback
        const minimalSvg = createFallbackSvg(imageSizePixels);
        
        resvg = new Resvg(minimalSvg, {
          font: {
            loadSystemFonts: true
          },
          fitTo: {
            mode: 'width',
            value: imageSizePixels[0]
          }
        });
        
        console.log('🆘 Created fallback placeholder image');
      } catch (finalError) {
        console.error('❌ All conversion attempts failed');
        throw resvgError; // Throw the original error
      }
    }
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputFilepath));
    
    // Save PNG file
    await fs.writeFile(outputFilepath, pngBuffer);
    
    return outputFilepath;
  } catch (err) {
    console.error(`Error converting SVG to PNG: ${err.message}`);
    throw err;
  }
}

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
      <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="24" text-anchor="middle">Error rendering SVG</text>
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
    
    // Check if PNG file exists before attempting to load it
    if (!await fs.pathExists(pngFilepath)) {
      throw new Error(`PNG file does not exist: ${pngFilepath}`);
    }
    
    // Load PNG image
    const image = await Image.load(pngFilepath);
    
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

/**
 * Export SVG to image (PNG and optionally JPG)
 * @param {string} artFileOutputFilepath - Path to the SVG file
 * @param {number[]} imageSizePixels - Width and height in pixels
 * @param {string} name - Base name for the output files
 * @param {string} outputDirectory - Directory to save the output files
 * @returns {Promise<void>}
 */
async function exportSvgToImage(artFileOutputFilepath, imageSizePixels, name, outputDirectory) {
  // Create a unique key for this task
  const taskKey = `${outputDirectory}_${name}`;
  
  // Check if there's already a task running for this file
  if (activeTasks.has(taskKey)) {
    try {
      // Wait for the existing task to complete
      await activeTasks.get(taskKey);
      return;
    } catch (error) {
      console.error(`Previous rendering process for ${name} failed: ${error.message}`);
      // Continue with our own attempt
    }
  }
  
  // Create a promise that will be resolved or rejected when this task completes
  let resolveTask, rejectTask;
  const taskPromise = new Promise((resolve, reject) => {
    resolveTask = resolve;
    rejectTask = reject;
  });
  
  // Register this task
  activeTasks.set(taskKey, taskPromise);
  
  try {
    const absoluteSvgFilepath = path.normalize(path.resolve(artFileOutputFilepath));
    const absoluteOutputDirectory = path.normalize(path.resolve(outputDirectory));
    const pngFinalFilepath = path.normalize(path.join(absoluteOutputDirectory, `${name}.png`));

    // Ensure output directory exists
    await fs.ensureDir(absoluteOutputDirectory);

    // Check if the SVG file exists
    if (!await fs.pathExists(absoluteSvgFilepath)) {
      throw new Error(`SVG file does not exist: ${absoluteSvgFilepath}`);
    }

    // Convert SVG to PNG
    await convertSvgToPng(absoluteSvgFilepath, imageSizePixels, pngFinalFilepath);
    
    resolveTask();
  } catch (error) {
    rejectTask(error);
    throw error;
  } finally {
    // Clean up the task after a delay
    setTimeout(() => {
      activeTasks.delete(taskKey);
    }, 1000);
  }
}

module.exports = {
  convertSvgToPng,
  createFallbackSvg,
  convertToJpg,
  exportSvgToImage
}; 