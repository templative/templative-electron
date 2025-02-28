const { Command } = require('commander');
const { createProjectInDirectory } = require('../../lib/create/projectCreator');
const accordion = require('./accordionCommands');
const deck = require('./deckCommands');
const board = require('./boardCommands');
const die = require('./dieCommands');
const packaging = require('./packagingCommands');
const punchout = require('./punchoutCommands');
const stock = require('./stockpartCommands');
const mat = require('./matCommands');

// Create the main command group
const create = new Command('create')
  .description('Component Creation Commands');

// Init command
create
  .command('init')
  .description('Create the default game project here')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    return createProjectInDirectory(options.input);
  });

// Add all subcommands
create.addCommand(accordion);
create.addCommand(deck);
create.addCommand(board);
create.addCommand(die);
create.addCommand(packaging);
create.addCommand(punchout);
create.addCommand(stock);
create.addCommand(mat);

module.exports = create; 