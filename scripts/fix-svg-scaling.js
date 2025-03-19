#!/usr/bin/env node

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { DOMParser } = require('@xmldom/xmldom');
const chalk = require('chalk');
const glob = require('glob');

/**
 * Checks if an SVG file has an element named "clipping"
 * @param {string} svgFilePath - Path to the SVG file
 * @returns {Promise<boolean>} - Whether the file has a "clipping" element
 */
async function checkForClippingElement(svgFilePath) {
  try {
    // Read the SVG file
    const svgContent = await fs.readFile(svgFilePath, 'utf8');
    
    // Parse the SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    
    // Look for elements with id="clipping"
    const elementsWithId = svgDoc.getElementsByTagName('*');
    for (let i = 0; i < elementsWithId.length; i++) {
      if (elementsWithId[i].getAttribute('id') === 'clipping') {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(chalk.red(`Error checking SVG file ${svgFilePath}:`), error);
    return false;
  }
}

/**
 * Process multiple SVG files to check for "clipping" elements
 * @param {string} globPattern - Glob pattern to match SVG files
 */
async function processMultipleSvgs(globPattern) {
  try {
    // Get all SVG files
    const svgFiles = glob.sync(globPattern);
    console.log(chalk.blue(`Found ${svgFiles.length} SVG files to check`));
    
    let missingClippingCount = 0;
    
    console.log("Clipping files:")
    for (const file of svgFiles) {
      const hasClipping = await checkForClippingElement(file);
      if (!hasClipping) {
        console.log(chalk.yellow(file));
        missingClippingCount++;
      }
    }
    
    console.log(chalk.green(`Found ${missingClippingCount} files without a "clipping" element out of ${svgFiles.length} total SVG files`));
    
    // Check for PNG files without corresponding SVG files
    const pngGlobPattern = globPattern.replace(/\.svg$/, '.png');
    const pngFiles = glob.sync(pngGlobPattern);
    console.log(chalk.blue(`Found ${pngFiles.length} PNG files to check`));
    
    let pngWithoutSvgCount = 0;
    
    console.log("PNG files without SVG files:")
    for (const pngFile of pngFiles) {
      const svgFile = pngFile.replace(/\.png$/, '.svg');
      if (!fsSync.existsSync(svgFile)) {
        console.log(chalk.magenta(pngFile));
        pngWithoutSvgCount++;
      }
    }
    
    console.log(chalk.green(`Found ${pngWithoutSvgCount} PNG files without corresponding SVG files out of ${pngFiles.length} total PNG files`));
  } catch (error) {
    console.error(chalk.red('Error processing files:'), error);
  }
}

// Run as a script
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(chalk.yellow('Usage:'));
    console.log('  node fix-svg-scaling.js --glob "path/to/*.svg"');
    return;
  }
  
  if (args[0] === '--glob') {
    const globPattern = args[1];
    await processMultipleSvgs(globPattern);
  } else {
    console.log(chalk.yellow('Please use --glob to specify SVG files to check'));
  }
}

// Run the script if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Unhandled error:'), error);
    process.exit(1);
  });
}

module.exports = { checkForClippingElement, processMultipleSvgs }; 