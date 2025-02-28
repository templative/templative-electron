const { Command } = require('commander');
const { getLastOutputFileDirectory } = require('../../lib/manage/instructionsLoader');
const { createPdfForPrinting } = require('../../lib/distribute/printout/printout');

const printout = new Command('printout')
  .description('Create a prototyping printout of the game')
  .option('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.')
  .option('-s, --size <size>', 'The size of the file, either `Letter` or `Tabloid`.', 'Letter')
  .option('-m, --margins', 'Whether to include margins.', false)
  .option('-d, --double-sided', 'Print on both front and back.', true)
  .action(async (options) => {
    let inputPath = options.input;
    const size = options.size;
    const margins = options.margins;
    const doubleSided = options.doubleSided;
    
    if (!inputPath) {
      inputPath = await getLastOutputFileDirectory();
    }
    
    if (!inputPath) {
      console.error("Missing --input directory.");
      process.exit(1);
    }
    
    if (size !== "Letter" && size !== "Tabloid") {
      console.error("You must choose either `Letter` or `Tabloid` for size.");
      return;
    }
    
    await createPdfForPrinting(inputPath, doubleSided, size, margins);
  });

module.exports = printout; 