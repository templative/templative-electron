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
    // const templativeToken = await getSessionToken();
    // if (!templativeToken) {
    //   return { success: false, error: 'You must be logged into Templative to create a Tabletop Simulator save.' };
    // }
    const templativeToken = null;
    return await convertToTabletopSimulator(inputPath, simulatorDirectory, templativeToken);
  });


module.exports = simulator; 