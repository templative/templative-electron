const { Command } = require('commander');
const zettelkasten = require('./zettelkastenCommands');
const printout = require('./printoutCommands');
const simulator = require('./simulatorCommands');
const gameCrafter = require('./gameCrafterCommands');
const playground = require('./playgroundCommands');
const animation = require('./animationCommands');

// Create the distribute command group
const distribute = new Command('distribute')
  .description('Game Distribution Commands');

// Add all subcommands
distribute.addCommand(zettelkasten);
distribute.addCommand(printout);
distribute.addCommand(simulator);
distribute.addCommand(gameCrafter);
distribute.addCommand(playground);
distribute.addCommand(animation);

module.exports = distribute; 