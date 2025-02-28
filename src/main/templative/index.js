#!/usr/bin/env node

const { Command } = require('commander');
const gameCrafterCommands = require('./api/distribute/gameCrafterCommands');

const program = new Command();

program
  .name('templative-js')
  .description('Templative.js - A tool for board game creation and distribution')
  .version('0.1.0');

// Add GameCrafter commands
program.addCommand(gameCrafterCommands);

// Parse command line arguments
program.parse(process.argv);
