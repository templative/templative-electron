const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { convertRulesToPdf, convertRulesMdToHtml, convertRulesMdToSpans } = require('../../lib/manage/rulesMdToViewsProcessor.js');
// Create the rules command
const rules = new Command('rules')
  .description('Rules Commands');

// To PDF command
rules
  .command('toPdf')
  .description('Convert the rules markdown to pdf')
  .option('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.', './')
  .action(async (options) => {
    const inputPath = options.input;
    
    console.log(`Converting rules markdown to PDF from ${inputPath}`);
    await convertRulesToPdf(inputPath);
  });

// To HTML command
rules
  .command('toHtml')
  .description('Convert the rules markdown to html')
  .option('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.', './')
  .action(async (options) => {
    const inputPath = options.input;
    
    console.log(`Converting rules markdown to HTML from ${inputPath}`);
    await convertRulesMdToHtml(inputPath);
  });

// To Tspans command
rules
  .command('toTspans')
  .description('Convert the rules markdown to svg tspans')
  .option('-i, --input <path>', 'The directory of the produced game. Defaults to last produced directory.', './')
  .action(async (options) => {
    const inputPath = options.input;
    
    console.log(`Converting rules markdown to SVG tspans from ${inputPath}`);
    await convertRulesMdToSpans(inputPath);
  });


module.exports = rules; 