const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the board command group
const board = new Command('board')
  .description('Create a new Board');

// Standard board command
board
  .command('standard')
  .description('Standard Board')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "StandardBoard");
  });

module.exports = board; 