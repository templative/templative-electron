const { Command } = require('commander');
const rules = require('./rulesCommands');

// Create the manage command group
const manage = new Command('manage')
  .description('Game Management Commands');

// Add all subcommands
manage.addCommand(rules);

module.exports = manage; 