const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the packaging command group
const packaging = new Command('packaging')
  .description('Create a new Packaging');

// Mint tin command
packaging
  .command('mint')
  .description('A Mint Tin')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MintTin");
  });

// Small stout box command
packaging
  .command('stoutBoxSmall')
  .description('Small Cardboard Box')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "SmallStoutBox");
  });

// Medium stout box command
packaging
  .command('stoutBoxMedium')
  .description('Medium Cardboard Box')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MediumStoutBox");
  });

// Large stout box command
packaging
  .command('stoutBoxLarge')
  .description('Large Cardboard Box')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "LargeStoutBox");
  });

// Poker tuck box 36 cards command
packaging
  .command('tuckBoxPoker36Cards')
  .description('Poker Tuckbox 36x Cards')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerTuckBox36");
  });

// Poker tuck box 54 cards command
packaging
  .command('tuckBoxPoker54Cards')
  .description('Poker Tuckbox 54x Cards')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerTuckBox54");
  });

// Poker tuck box 72 cards command
packaging
  .command('tuckBoxPoker72Cards')
  .description('Poker Tuckbox 72x Cards')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerTuckBox72");
  });

// Poker tuck box 90 cards command
packaging
  .command('tuckBoxPoker90Cards')
  .description('Poker Tuckbox 90x Cards')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerTuckBox90");
  });

// Poker tuck box 108 cards command
packaging
  .command('tuckBoxPoker108Cards')
  .description('Poker Tuckbox 108x Cards')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerTuckBox108");
  });

// Booster pack command
packaging
  .command('boosterPack')
  .description('Poker Booster Pack')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerBooster");
  });

module.exports = packaging; 