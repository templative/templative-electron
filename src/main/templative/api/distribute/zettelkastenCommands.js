const { Command } = require('commander');

// Create the zettelkasten command
const zettelkasten = new Command('zk')
  .description('Zettelkasten Commands');

// To CSV command
zettelkasten
  .command('toCsv')
  .description('Convert the perma files here to csv')
  .action(async () => {
    // Call the function to convert files to CSV
    convertFilesToCsv();
  });

// This function would be imported from the lib directory
function convertFilesToCsv() {
  // TODO: Implement this function to match Python version
  console.log('Converting perma files to CSV');
}

module.exports = zettelkasten; 