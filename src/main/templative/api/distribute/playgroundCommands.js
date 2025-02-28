const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { getLastOutputFileDirectory } = require('../../lib/manage/instructionsLoader');
const { convertToTabletopPlayground } = require('../../lib/distribute/playground/playground');
const { writePlaygroundFile, getPlaygroundDirectory } = require('../../lib/distribute/playground/playgroundSettingsManagement');

// Create the playground command
const playground = new Command('playground')
  .description('Convert a produced game into a tabletop playground game')
  .requiredOption('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.')
  .requiredOption('-o, --output <path>', 'The Tabletop Playground packages directory. Such as "~/Library/Application Support/Epic/TabletopPlayground/Packages" or "C:\\Program Files (x86)\\Steam\\steamapps\\common\\TabletopPlayground\\TabletopPlayground\\PersistentDownloadDir"')
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
    
    const playgroundDirectory = await getPlaygroundDirectory(outputPath);
    if (!playgroundDirectory) {
      console.error("Missing --output directory.");
      return;
    }
    
    await writePlaygroundFile(playgroundDirectory);
    return await convertToTabletopPlayground(inputPath, playgroundDirectory);
  });

module.exports = playground; 