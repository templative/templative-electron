const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the die command group
const die = new Command('die')
  .description('Create a new Die');

// D4 die command
die
  .command('d4')
  .description('D4 Die')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "CustomColorD4");
  });

// D6 die command
die
  .command('d6')
  .description('D6 Die')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "CustomColorD6");
  });

// D8 die command
die
  .command('d8')
  .description('D8 Die')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "CustomColorD8");
  });

module.exports = die; 