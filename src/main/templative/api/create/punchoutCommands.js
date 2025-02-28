const { Command } = require('commander');
const { createCustomComponent } = require('../../lib/create/componentCreator');

// Create the punchout command group
const punchout = new Command('punchout')
  .description('Create a new Punchout');

// Custom punchout subcommand group
const custom = new Command('custom')
  .description('Create a new Custom Punchout');

// Custom small punchout command
custom
  .command('customsmall')
  .description('Create a Small Custom Punchout')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "PunchoutCustomSmall");
  });

punchout.addCommand(custom);

// Chit subcommand group
const chit = new Command('chit')
  .description('Create a new Chit');

// Ring large chit command
chit
  .command('ringLarge')
  .description('Create a Large Ring')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "LargeRingChit");
  });

// Ring medium chit command
chit
  .command('ringMedium')
  .description('Create a Medium Ring')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MediumRingChit");
  });

// Ring small chit command
chit
  .command('ringSmall')
  .description('Create a Small Ring')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "SmallRingChit");
  });

// Square large chit command
chit
  .command('squareLarge')
  .description('Create a Large Square')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "LargeSquareChit");
  });

// Square medium chit command
chit
  .command('squareMedium')
  .description('Create a Medium Square')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MediumSquareChit");
  });

// Square small chit command
chit
  .command('squareSmall')
  .description('Create a Small Square')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "SmallSquareChit");
  });

// Circle large chit command
chit
  .command('circleLarge')
  .description('Create a Large Circle')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "LargeCircleChit");
  });

// Circle medium chit command
chit
  .command('circleMedium')
  .description('Create a Medium Circle')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MediumCircleChit");
  });

// Circle small chit command
chit
  .command('circleSmall')
  .description('Create a Small Circle')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "SmallCircleChit");
  });

// Hex large chit command
chit
  .command('hexLarge')
  .description('Create a Large Hex')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "LargeHexTile");
  });

// Hex medium chit command
chit
  .command('hexMedium')
  .description('Create a Medium Hex')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MediumHexTile");
  });

// Hex small chit command
chit
  .command('hexSmall')
  .description('Create a Small Hex')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "SmallHexTile");
  });

// Hex mini chit command
chit
  .command('hexMini')
  .description('Create a Mini Hex')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "MiniHexTile");
  });

punchout.addCommand(chit);

// Shard subcommand group
const shard = new Command('shard')
  .description('Create a new Shard');

// Hex shard command
shard
  .command('hex')
  .description('Create a Hex Shard')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "HexShard");
  });

// Circle shard command
shard
  .command('circle')
  .description('Create a Circle Shard')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "CircleShard");
  });

// Square shard command
shard
  .command('square')
  .description('Create a Square Shard')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    await createCustomComponent(options.input, options.name, "SquareShard");
  });

punchout.addCommand(shard);

module.exports = punchout; 