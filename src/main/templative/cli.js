const { program } = require('commander');
const { version } = require('../../../../templative-js/package.json');
// Add dotenv to load environment variables from .env file
require('dotenv').config();

// Import templative commands
const { create, produce, manage, distribute } = require('./api/index');

program
  .name('templative')
  .description('Templative game development toolkit')
  .version(version);


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
