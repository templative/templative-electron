const { Command } = require('commander');
const { getLastOutputFileDirectory } = require('../../lib/manage/instructionsLoader');
const { createPdfForPrinting } = require('../../lib/distribute/printout/printout');

const printout = new Command('printout')
  .description('Create a prototyping printout of the game')
  .option('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.')
  .option('-s, --size <size>', 'The size of the file, either `Letter` or `Tabloid`.', 'Letter')
  .option('-f, --front-only', 'Print on front side only.')
  .option('-fb, --front-back', 'Print on both front and back.', true)
  .option('-b, --borders', 'Draw borders on the printout.', false)
  .option('-r, --render-program <renderProgram>', 'The render program to use. Defaults to `TEMPLATIVE`.', 'TEMPLATIVE')
  .action(async (options) => {
    let inputPath = options.input;
    const size = options.size;
    const doubleSided = options.frontBack && !options.frontOnly;
    
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
    
    await createPdfForPrinting(inputPath, doubleSided, size, options.borders, options.renderProgram);
  });

module.exports = printout; 