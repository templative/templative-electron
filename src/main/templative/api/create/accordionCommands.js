const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the accordion command group
const accordion = new Command('accordion')
  .description('Create a new Accordion');


// Poker Folio command
accordion
  .command('folioPoker')
  .description('Poker Folio')
  .option('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PokerFolio");
  });

// Mint Tin Folio command
accordion
  .command('folioMint')
  .description('Mint Tin Folio')
  .option('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MintTinFolio");
  });

// Mint Tin Accordion 4 Panels command
accordion
  .command('mint4')
  .description('Mint Tin Accordion 4 Panels')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MintTinAccordion4");
  });

// Mint Tin Accordion 6 Panels command
accordion
  .command('mint6')
  .description('Mint Tin Accordion 6 Panels')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MintTinAccordion6");
  });

// Mint Tin Accordion 8 Panels command
accordion
  .command('mint8')
  .description('Mint Tin Accordion 8 Panels')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MintTinAccordion8");
  });

module.exports = accordion; 