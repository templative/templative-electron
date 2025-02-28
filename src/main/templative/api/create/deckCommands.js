const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the deck command group
const deck = new Command('deck')
  .description('Create a new Decks');

// Poker deck command
deck
  .command('poker')
  .description('Poker Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerDeck");
  });

// Jumbo deck command
deck
  .command('jumbo')
  .description('Jumbo Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "JumboDeck");
  });

// Business deck command
deck
  .command('business')
  .description('Business Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "BusinessDeck");
  });

// Mint tin deck command
deck
  .command('mint')
  .description('Mint Tin Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MintTinDeck");
  });

// Hex deck command
deck
  .command('hex')
  .description('Hex Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "HexDeck");
  });

// Micro deck command
deck
  .command('micro')
  .description('Micro Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MicroDeck");
  });

// Mini deck command
deck
  .command('mini')
  .description('Mini Deck')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MiniDeck");
  });

module.exports = deck; 