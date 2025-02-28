const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { getLastOutputFileDirectory } = require('../../lib/manage/instructionsLoader');
const { lookForSimulatorFile, writeSimulatorFile, getSimulatorDirectory, convertToTabletopSimulator } = require('../../lib/distribute/simulator/simulator');

// Create the simulator command
const simulator = new Command('simulator')
  .description('Convert a produced game into a tabletop simulator game')
  .requiredOption('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.')
  .requiredOption('-o, --output <path>', 'The Tabletop Simulator packages directory. Such as "~/Library/Documents/My Games/Tabletop Simulator" or "C:/Users/User/Documents/My Games/Tabletop Simulator"')
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
    console.log(inputPath);
    
    const simulatorDirectory = await getSimulatorDirectory(outputPath);
    if (!simulatorDirectory) {
      console.error("Missing --output directory.");
      return;
    }
    
    await writeSimulatorFile(simulatorDirectory);
    return await convertToTabletopSimulator(inputPath, simulatorDirectory);
  });


module.exports = simulator; 