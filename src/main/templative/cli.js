const { program } = require('commander');
// Add dotenv to load environment variables from .env file
require('dotenv').config();

// Import templative commands
const { create, produce, manage, distribute } = require('./api/index');

program
  .name('Templative')


// Add templative commands
program.addCommand(create);
program.addCommand(produce.produce);
program.addCommand(produce.preview);
program.addCommand(manage);
program.addCommand(distribute);

program.parse(process.argv);

// Show help when no arguments provided
if (process.argv.length <= 2) {
  program.help();
}
