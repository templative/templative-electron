const { Command } = require('commander');
const { createCustomComponent, createStockComponent } = require('../../lib/create/componentCreator');
const { STOCK_COMPONENT_INFO } = require('../../../../shared/stockComponentInfo');

// Create the stock command group
const stock = new Command('stock')
  .description('Create a Stock Part');

// Part command - create a stock part by ID
stock
  .command('part')
  .description('Create a Stock Part by ID')
  .requiredOption('-n, --name <name>', 'The name of the new component.')
  .option('-i, --id <id>', 'The ID of the stockpart.')
  .option('-i, --input <path>', 'The path to the Templative Project.', './')
  .action(async (options) => {
    if (!options.name) {
      console.log("Missing --name or -n defining the component name.");
      return;
    }

    if (!options.id) {
      console.log("Missing --id or -i defining the stock part id.");
      return;
    }

    await createStockComponent(options.input, options.name, options.id);
  });

// Options command - show available stock parts
stock
  .command('options')
  .description('Show available stock parts')
  .action(() => {
    let partNames = "";
    for (const key in STOCK_COMPONENT_INFO) {
      partNames = partNames + key + "\n";
    }
    console.log(partNames);
  });

module.exports = stock; 