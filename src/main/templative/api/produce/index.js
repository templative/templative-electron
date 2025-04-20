const { Command } = require('commander');
const { produceGame, producePiecePreview } = require('../../lib/produce/gameProducer');
const { CachePreProducerWatcher } = require('../../lib/produce/cachePreProducerWatcher');
const { createIconFont, getPUACharFromUnicode } = require('../../lib/produce/iconFontCreator');
const path = require('path');

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
  
const iconFontCommand = new Command('iconfont')
  .description('Create an icon font from SVG files')
  .option('--name <name>', 'The name of the icon font.', null)
  .option('--input <path>', 'The directory containing SVG files.', null)
  .option('--output <path>', 'The directory to output the icon font.', null)
  .action(async (options) => {
    if (!options.input || !options.name || !options.output) {
      console.error('Missing required options: --input, --name, and --output are required.');
      return;
    }
    const inputPath = path.resolve(options.input);
    const outputPath = path.resolve(options.output);
    await createIconFont(options.name, inputPath, outputPath);
  });

// node ./src/main/templative/cli.js pua --font "./scripts/data/stuff/gameicons.ttf" --unicode "&#xEA01;"
const getPUACharFromUnicodeCommand = new Command('pua')
  .description('Get the PUA character from a Unicode string')
  .option('--font <path>', 'The path to the font file.', null)
  .option('--unicode <unicode>', 'The Unicode string to convert.', null)
  .action(async (options) => {
    const puaChar = await getPUACharFromUnicode(options.font, options.unicode);
    console.log(puaChar);
  });

module.exports = {
  produce: produceCommand,
  preview: previewCommand,
  watch: watchCommand,
  iconfont: iconFontCommand,
  pua: getPUACharFromUnicodeCommand
}; 