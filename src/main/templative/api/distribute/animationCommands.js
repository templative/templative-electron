const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { getLastOutputFileDirectory } = require('../../lib/manage/instructionsLoader');
const { getAnimationDirectory, writeAnimationFile } = require('../../lib/distribute/animation/animation');
const { createPackage } = require('../../lib/distribute/animation/packageBuilder');

// Create the animation command
const animation = new Command('animation')
  .description('Create a typescript module for your board game')
  .requiredOption('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.')
  .requiredOption('-o, --output <path>', 'The output directory.')
  .action(async (options) => {
    let inputPath = options.input;
    const outputPath = options.output;
    
    if (!inputPath) {
      inputPath = await getLastOutputFileDirectory();
    }
    
    if (!inputPath) {
      console.error("Missing --input directory.");
      process.exit(1);
    }
    
    const animationDirectory = await getAnimationDirectory(outputPath);
    if (!animationDirectory) {
      console.error("Missing --output directory.");
      return;
    }
    
    await writeAnimationFile(animationDirectory);
    await createPackage(inputPath, animationDirectory);
  });

module.exports = animation; 