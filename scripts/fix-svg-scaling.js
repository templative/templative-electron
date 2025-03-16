#!/usr/bin/env node

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const chalk = require('chalk');
const glob = require('glob');

/**
 * Fixes SVG scaling issues by scaling content to fit the SVG dimensions
 * and removes paths with #EA222A fill (checkmarks)
 * @param {string} svgFilePath - Path to the SVG file
 * @param {string} outputPath - Path to save the fixed SVG (optional, defaults to overwriting)
 * @returns {Promise<boolean>} - Success status
 */
async function fixSvgScaling(svgFilePath, outputPath = null) {
  try {
    // Read the SVG file
    const svgContent = await fs.readFile(svgFilePath, 'utf8');
    
    // Parse the SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgRoot = svgDoc.documentElement;
    
    // Get current attributes
    const currentWidth = parseFloat(svgRoot.getAttribute('width') || 0);
    const currentHeight = parseFloat(svgRoot.getAttribute('height') || 0);
    const currentViewBox = svgRoot.getAttribute('viewBox') || '';
    
    console.log(chalk.blue(`Processing: ${path.basename(svgFilePath)}`));
    console.log(chalk.gray(`  Current dimensions: ${currentWidth}x${currentHeight}`));
    console.log(chalk.gray(`  Current viewBox: ${currentViewBox}`));
    
    // Remove paths with #EA222A fill (checkmarks)
    const pathElements = svgDoc.getElementsByTagName('path');
    let removedCount = 0;
    
    // We need to iterate backwards since we're removing elements
    for (let i = pathElements.length - 1; i >= 0; i--) {
      const path = pathElements[i];
      const fillColor = path.getAttribute('fill');
      
      if (fillColor === '#EA222A') {
        path.parentNode.removeChild(path);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(chalk.yellow(`  Removed ${removedCount} checkmark paths with #EA222A fill`));
    }
    
    // Find the largest rectangle in the SVG
    const rectElements = svgDoc.getElementsByTagName('rect');
    let largestRect = null;
    let largestArea = 0;
    
    for (let i = 0; i < rectElements.length; i++) {
      const rect = rectElements[i];
      const width = parseFloat(rect.getAttribute('width') || 0);
      const height = parseFloat(rect.getAttribute('height') || 0);
      const area = width * height;
      
      if (area > largestArea) {
        largestArea = area;
        largestRect = rect;
      }
    }
    
    if (!largestRect) {
      console.log(chalk.yellow('  No rectangles found in the SVG'));
      return false;
    }
    
    // Get the dimensions of the largest rectangle
    const rectX = parseFloat(largestRect.getAttribute('x') || 0);
    const rectY = parseFloat(largestRect.getAttribute('y') || 0);
    const rectWidth = parseFloat(largestRect.getAttribute('width') || 0);
    const rectHeight = parseFloat(largestRect.getAttribute('height') || 0);
    
    console.log(chalk.green(`  Largest rectangle: ${rectWidth}x${rectHeight} at (${rectX},${rectY})`));
    
    // Calculate scaling factors
    let scaleX = 1;
    let scaleY = 1;
    
    if (currentWidth && currentHeight && rectWidth && rectHeight) {
      // Calculate how much we need to scale the content to fit the SVG dimensions
      scaleX = currentWidth / rectWidth;
      scaleY = currentHeight / rectHeight;
      
      // Use the smaller scale to maintain aspect ratio
      const scale = Math.min(scaleX, scaleY);
      
      console.log(chalk.green(`  Scaling content by factor: ${scale.toFixed(2)}`));
      
      // Apply scaling transformation to the root SVG element
      // Create a group to wrap all content and apply the transform
      const contentGroup = svgDoc.createElement('g');
      
      // Move all child nodes to the new group
      while (svgRoot.childNodes.length > 0) {
        const child = svgRoot.childNodes[0];
        svgRoot.removeChild(child);
        contentGroup.appendChild(child);
      }
      
      // Calculate the center point for scaling
      const centerX = (currentWidth - (rectWidth * scale)) / 2;
      const centerY = (currentHeight - (rectHeight * scale)) / 2;
      
      // Apply transform to scale and center
      contentGroup.setAttribute('transform', `translate(${centerX}, ${centerY}) scale(${scale})`);
      
      // Add the group back to the SVG
      svgRoot.appendChild(contentGroup);
      
      // Set the viewBox to match the original content dimensions
      svgRoot.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);
    } else {
      console.log(chalk.yellow('  Missing width/height attributes, cannot scale'));
      return false;
    }
    
    // Serialize the modified SVG
    const serializer = new XMLSerializer();
    const fixedSvgContent = serializer.serializeToString(svgDoc);
    
    // Save the fixed SVG
    const savePath = outputPath || svgFilePath;
    await fs.writeFile(savePath, fixedSvgContent, 'utf8');
    
    console.log(chalk.green(`  Saved to: ${path.basename(savePath)}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`Error fixing SVG scaling for ${svgFilePath}:`), error);
    return false;
  }
}

/**
 * Process multiple SVG files
 * @param {string} globPattern - Glob pattern to match SVG files
 * @param {string} outputDir - Directory to save fixed SVGs (optional)
 */
async function processMultipleSvgs(globPattern, outputDir = null) {
  try {
    const files = glob.sync(globPattern);
    console.log(chalk.blue(`Found ${files.length} SVG files to process`));
    
    let successCount = 0;
    
    for (const file of files) {
      let outputPath = file;
      if (outputDir) {
        outputPath = path.join(outputDir, path.basename(file));
      }
      
      const success = await fixSvgScaling(file, outputPath);
      if (success) successCount++;
    }
    
    console.log(chalk.green(`Successfully processed ${successCount} of ${files.length} files`));
  } catch (error) {
    console.error(chalk.red('Error processing multiple SVGs:'), error);
  }
}

// Run as a script
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(chalk.yellow('Usage:'));
    console.log('  node fix-svg-scaling.js <file.svg> [output.svg]');
    console.log('  node fix-svg-scaling.js --glob "path/to/*.svg" [--output-dir output/dir]');
    return;
  }
  
  if (args[0] === '--glob') {
    const globPattern = args[1];
    const outputDirIndex = args.indexOf('--output-dir');
    const outputDir = outputDirIndex > -1 ? args[outputDirIndex + 1] : null;
    
    if (outputDir && !fsSync.existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true });
    }
    
    await processMultipleSvgs(globPattern, outputDir);
  } else {
    const inputFile = args[0];
    const outputFile = args[1] || inputFile;
    await fixSvgScaling(inputFile, outputFile);
  }
}

// Run the script if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Unhandled error:'), error);
    process.exit(1);
  });
}

module.exports = { fixSvgScaling, processMultipleSvgs }; 