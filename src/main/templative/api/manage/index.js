const { Command } = require('commander');
const rules = require('./rulesCommands');
const componentAnalysis = require('./componentAnalysisCommands');

// Create the manage command group
const manage = new Command('manage')
  .description('Game Management Commands');

// Add all subcommands
manage.addCommand(rules);
manage.addCommand(componentAnalysis);

module.exports = manage; 