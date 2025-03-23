#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const chalk = require('chalk');
const { clipSvgFileToClipFile } = require('../src/main/templative/lib/produce/customComponents/svgscissors/modules/imageClipper');
const { convertSvgToPng } = require('../src/main/templative/lib/produce/customComponents/svgscissors/modules/fileConversion/svgConverter');

// Hardcoded paths for testing
const SVG_SOURCE_PATH = "/Users/oliverbarnum/Documents/git/peace-of-westphalia/output/westphalia_giftVersion_0.0.0_2025-03-12_06-51-50/pawnStickersTest/pawnStickersTest-green.svg";
const CLIP_SVG_PATH = "/Users/oliverbarnum/Documents/git/templative-electron/src/assets/images/componentTemplates/PawnSticker.svg";
const CLIP_ELEMENT_ID = 'clipping';
const OUTPUT_PATH = path.join("/Users/oliverbarnum/Documents/git/templative-electron/scripts", 'clipped');

// Run tests
async function runTests() {
  console.log(chalk.bold.blue('=== SVG Clipping Test ==='));
  
  console.log(chalk.blue('\n=== Testing SVG Clipping ==='));
  console.log(chalk.blue(`Source SVG: ${SVG_SOURCE_PATH}`));
  console.log(chalk.blue(`Clip SVG: ${CLIP_SVG_PATH}`));
  console.log(chalk.blue(`Clip Element ID: ${CLIP_ELEMENT_ID}`));
  console.log(chalk.blue(`Output Path: ${OUTPUT_PATH}`));
  
  try {
    const result = await clipSvgFileToClipFile(
      SVG_SOURCE_PATH,
      CLIP_SVG_PATH,
      CLIP_ELEMENT_ID
    );
    await fs.writeFile(OUTPUT_PATH + ".svg", result);
    await convertSvgToPng(OUTPUT_PATH + ".svg", [300, 525], OUTPUT_PATH + ".png");
    
    if (result) {
      console.log(chalk.green('✓ SVG clipping completed successfully'));
      console.log(chalk.green(`Output saved to: ${OUTPUT_PATH}`));
    } else {
      console.error(chalk.red('✗ SVG clipping failed'));
    }
  } catch (error) {
    console.error(chalk.red(`✗ Error during SVG clipping: ${error.message}`));
    console.error(error);
  }
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1); 
});