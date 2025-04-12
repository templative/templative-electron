const { Command } = require('commander');
const { produceGame, producePiecePreview } = require('../../lib/produce/gameProducer');
const { CachePreProducerWatcher } = require('../../lib/produce/cachePreProducerWatcher');

// Example usage:
// templative produce --name "actionCaps" --input "/Users/oliverbarnum/Documents/git/apcw-defines"
// templative preview --component "cards" --piece "ace-of-spades" --language "en" --input "./my-game"
const produceCommand = new Command('produce')
  .description('Produce the game in the current directory')
  .option('--name <name>', 'The component to produce.')
  .option('-s, --simple', 'Whether complex information is shown. Used for videos.', false)
  .option('-c, --complex', 'Show complex information.', false)
  .option('-p, --publish', 'Include publish information.', false)
  .option('-d, --debug', 'Include debug information.', false)
  .option('--language <language>', 'Target language of the output. https://developers.google.com/admin-sdk/directory/v1/languages', 'en')
  .option('--input <path>', 'The directory of the templative project.', './')
  .action(async (options) => {
    await produceGame(
      options.input,
      options.name,
      options.simple || !options.complex,
      options.publish || !options.debug,
      options.language
    );
  });

// Create the preview command
const previewCommand = new Command('preview')
  .description('Preview a specific component piece')
  .option('--component <component>', 'The component to produce.')
  .option('--piece <piece>', 'The piece to produce.')
  .option('--language <language>', 'Target language of the output. https://developers.google.com/admin-sdk/directory/v1/languages', 'en')
  .option('--input <path>', 'The directory of the templative project.', './')
  .action(async (options) => {
    await producePiecePreview(
      options.input, 
      options.component, 
      options.piece, 
      options.language
    );
  });
  
const watchCommand = new Command('watch')
  .description('Watch the game and produce it when it changes')
  .option('--input <path>', 'The directory of the templative project.', './')
  .action(async (options) => {
    var cachePreProducer = new CachePreProducerWatcher(options.input);
    await cachePreProducer.openWatchers();
  });
  

module.exports = {
  produce: produceCommand,
  preview: previewCommand,
  watch: watchCommand
}; 