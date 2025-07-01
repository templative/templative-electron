#!/usr/bin/env node

/**
 * Meeple Designer Script
 * 
 * This script takes an SVG outline of a meeple and fills it with a graphic
 * representing a given prompt (e.g., "Medic"), then color swaps the clothing
 * while preserving skin tones.
 * 
 * Usage: node meepleDesigner.js --prompt "Medic" --output "./output.svg" --color "#FF0000"
 */

// THIS SCRIPT RELIES ON CANVAS WHICH BREAKS THE CI/CD

const fs = require('fs-extra');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { Anthropic } = require('@anthropic-ai/sdk');
// Use a try-catch for canvas to handle potential compatibility issues
let createCanvas, loadImage;
try {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
} catch (error) {
  console.warn('Canvas module not available or incompatible with current Node.js version.');
  console.warn('Using fallback methods for image processing.');
  // Provide fallback implementations
  createCanvas = (width, height) => {
    return {
      width,
      height,
      getContext: () => ({
        fillStyle: '',
        fillRect: () => {},
        fillText: () => {},
        font: '',
        textAlign: '',
        drawImage: () => {}
      }),
      createPNGStream: () => {
        const { Readable } = require('stream');
        return new Readable({
          read() {
            this.push(null);
          }
        });
      },
      toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    };
  };
  loadImage = async () => createCanvas(1, 1);
}
const { program } = require('commander');
const { Resvg } = require('@resvg/resvg-js');
const Image = require('image-js').Image;

// Define command line options
program
  .option('-p, --prompt <prompt>', 'Prompt describing the meeple design (e.g., "Medic")')
  .option('-o, --output <output>', 'Output SVG file path', './output-meeple.svg')
  .option('-c, --color <color>', 'Main color for the meeple clothing (hex code)', '#3366CC')
  .option('-i, --input <input>', 'Input meeple SVG file path', './meeple.svg')
  .option('-s, --skin-tone <skinTone>', 'Skin tone to preserve (hex code)', '#874a22')
  .option('-t, --temp-dir <tempDir>', 'Temporary directory for intermediate files', './temp')
  .parse(process.argv);

const options = program.opts();

// Create temp directory if it doesn't exist
fs.ensureDirSync(options.tempDir);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set. Using placeholder image generation.');
    throw new Error('ANTHROPIC_API_KEY not set. Please set the ANTHROPIC_API_KEY environment variable.');
}

// Configure Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Simple DOM setup for XML parsing
const parser = new DOMParser();

/**
 * Generate an image based on the prompt using Anthropic's API
 * @param {string} prompt - The prompt describing the design
 * @returns {Promise<string>} - Path to the generated image
 */
async function generateImageFromPrompt(prompt) {
  console.log(`Generating image for prompt: "${prompt}"...`);
  
  // If Anthropic API key is not set, use a placeholder image
  
  
  // Use Anthropic to generate an image
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      system: "You are an expert at creating simple, iconic designs for board game pieces. Create a simple, clean design that represents the prompt. The design should be suitable for a small game token.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a simple, iconic design for a board game piece representing: ${prompt}. The design should be clean, recognizable, and work well at small sizes.`
            }
          ]
        }
      ],
      stream: false
    });
    
    console.log('API response received');
    console.log('Response content types:', message.content.map(item => item.type).join(', '));
    
    // Extract image data from response
    const imageContent = message.content.find(item => item.type === 'image');
    if (!imageContent) {
      throw new Error('No image was generated');
    }
    
    // Save the image to a file
    const imageData = imageContent.source.data;
    const buffer = Buffer.from(imageData, 'base64');
    const outputPath = path.join(options.tempDir, 'generated.png');
    fs.writeFileSync(outputPath, buffer);
    
    return outputPath;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Apply the generated design to the meeple SVG
 * @param {string} meepleFilePath - Path to the meeple SVG
 * @param {string} designImagePath - Path to the design image
 * @param {string} outputFilePath - Path to save the output SVG
 * @param {string} mainColor - Main color for the meeple clothing
 * @param {string} skinTone - Skin tone to preserve
 * @returns {Promise<string>} - Path to the output SVG
 */
async function applyDesignToMeeple(meepleFilePath, designImagePath, outputFilePath, mainColor, skinTone) {
  console.log('Applying design to meeple...');
  
  // Read the meeple SVG
  const meepleData = fs.readFileSync(meepleFilePath, 'utf8');
  const meepleDoc = parser.parseFromString(meepleData, 'image/svg+xml');
  
  // Extract the path from the meeple SVG
  const meeplePath = meepleDoc.getElementsByTagName('path')[0];
  const pathData = meeplePath.getAttribute('d');
  
  // Load the design image
  const designImage = await loadImage(designImagePath);
  
  // Create a canvas to manipulate the image
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');
  
  // Draw the design image on the canvas
  ctx.drawImage(designImage, 0, 0, 500, 500);
  
  // Create a pattern from the design image
  const patternCanvas = createCanvas(500, 500);
  const patternCtx = patternCanvas.getContext('2d');
  patternCtx.drawImage(designImage, 0, 0, 500, 500);
  
  // Convert the pattern to a data URL
  const patternDataUrl = patternCanvas.toDataURL('image/png');
  
  // Create a new SVG with the meeple path directly as a string
  const newSvg = `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="26.458342mm" 
      height="26.155607mm" 
      viewBox="0 0 26.458342 26.155607">
      <defs>
        <pattern id="designPattern" patternUnits="userSpaceOnUse" width="500" height="500">
          <image xlink:href="${patternDataUrl}" width="500" height="500" />
        </pattern>
      </defs>
      <g>
        <path 
          d="${pathData}" 
          style="fill:${mainColor};stroke-width:0.0625717;stroke-linecap:round;stroke-linejoin:round;paint-order:markers stroke fill" />
        <path 
          d="${pathData}" 
          style="fill:url(#designPattern);fill-opacity:0.7;stroke-width:0.0625717;stroke-linecap:round;stroke-linejoin:round;paint-order:markers stroke fill" />
      </g>
    </svg>
  `;
  
  // Save the new SVG
  fs.writeFileSync(outputFilePath, newSvg);
  
  // Now apply color swapping while preserving skin tones
  await colorSwapPreservingSkinTone(outputFilePath, outputFilePath, mainColor, skinTone);
  
  return outputFilePath;
}

/**
 * Color swap the clothing while preserving skin tones
 * @param {string} inputFilePath - Path to the input SVG
 * @param {string} outputFilePath - Path to save the output SVG
 * @param {string} mainColor - Main color for the meeple clothing
 * @param {string} skinTone - Skin tone to preserve
 * @returns {Promise<string>} - Path to the output SVG
 */
async function colorSwapPreservingSkinTone(inputFilePath, outputFilePath, mainColor, skinTone) {
  console.log('Applying color swap while preserving skin tones...');
  
  // Convert SVG to PNG for image processing
  const svgData = fs.readFileSync(inputFilePath);
  const resvgInstance = new Resvg(svgData, {
    background: 'transparent',
    fitTo: {
      mode: 'width',
      value: 500
    }
  });
  const pngData = resvgInstance.render();
  
  const tempPngPath = path.join(options.tempDir, 'temp.png');
  fs.writeFileSync(tempPngPath, pngData.asPng());
  
  // Load the PNG for processing
  const image = await Image.load(tempPngPath);
  
  // Convert hex colors to RGB
  const skinRGB = hexToRgb(skinTone);
  const mainRGB = hexToRgb(mainColor);
  
  // Create a mask for skin tones (with some tolerance)
  const tolerance = 50; // Adjust as needed for skin tone variation
  
  // Process the image
  const processed = image.clone();
  
  // For each pixel
  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      const pixel = image.getPixelXY(x, y);
      
      // Skip transparent pixels
      if (pixel[3] < 50) continue;
      
      // Check if pixel is close to skin tone
      const isSkinTone = isColorSimilar(pixel, skinRGB, tolerance);
      
      // If not skin tone, apply the main color with some blending
      if (!isSkinTone) {
        // Preserve some of the original color for texture
        const blendFactor = 0.7;
        processed.setPixelXY(x, y, [
          Math.round(mainRGB.r * blendFactor + pixel[0] * (1 - blendFactor)),
          Math.round(mainRGB.g * blendFactor + pixel[1] * (1 - blendFactor)),
          Math.round(mainRGB.b * blendFactor + pixel[2] * (1 - blendFactor)),
          pixel[3]
        ]);
      }
    }
  }
  
  // Save the processed image
  const processedPngPath = path.join(options.tempDir, 'processed.png');
  await processed.save(processedPngPath);
  
  // Convert back to SVG
  const processedPngData = fs.readFileSync(processedPngPath);
  const processedDataUrl = `data:image/png;base64,${processedPngData.toString('base64')}`;
  
  // Read the original SVG
  const svgContent = fs.readFileSync(inputFilePath, 'utf8');
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  
  // Update the pattern image
  const imageElement = svgDoc.getElementsByTagName('image')[0];
  imageElement.setAttribute('xlink:href', processedDataUrl);
  
  // Serialize and save the updated SVG
  const serializer = new XMLSerializer();
  const updatedSvgContent = serializer.serializeToString(svgDoc);
  fs.writeFileSync(outputFilePath, updatedSvgContent);
  
  return outputFilePath;
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object} - RGB color object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Check if two colors are similar within a tolerance
 * @param {Array} color1 - First color as [r, g, b, a]
 * @param {Object} color2 - Second color as {r, g, b}
 * @param {number} tolerance - Color difference tolerance
 * @returns {boolean} - Whether the colors are similar
 */
function isColorSimilar(color1, color2, tolerance) {
  const dr = Math.abs(color1[0] - color2.r);
  const dg = Math.abs(color1[1] - color2.g);
  const db = Math.abs(color1[2] - color2.b);
  
  return (dr + dg + db) / 3 < tolerance;
}

/**
 * Main function
 */
async function main() {
  try {
    // Validate inputs
    if (!options.prompt) {
      console.error('Error: Prompt is required. Use --prompt "Your prompt"');
      process.exit(1);
    }
    
    console.log(`
Meeple Designer
==============
Prompt: ${options.prompt}
Input: ${options.input}
Output: ${options.output}
Main Color: ${options.color}
Skin Tone: ${options.skinTone}
    `);
    
    // Generate image from prompt
    const designImagePath = await generateImageFromPrompt(options.prompt);
    
    // Apply design to meeple
    const outputPath = await applyDesignToMeeple(
      options.input,
      designImagePath,
      options.output,
      options.color,
      options.skinTone
    );
    
    console.log(`Success! Meeple design saved to: ${outputPath}`);
    
    // Clean up temp files
    // fs.removeSync(options.tempDir);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 