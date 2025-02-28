const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the mat command group
const mat = new Command('mat')
  .description('Create a new Mat');

// Standard mat command
mat
  .command('bifold')
  .description('Bi-Fold Mat')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "BiFoldMat");
  });

// Standard mat command
mat
  .command('domino')
  .description('Domino Mat')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "DominoMat");
  });

module.exports = mat; 