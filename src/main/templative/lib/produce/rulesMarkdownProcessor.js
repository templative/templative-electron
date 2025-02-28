const { jsPDF } = require('jspdf');
const { writeFile } = require('fs/promises');
const { join } = require('path');
const { mdToPdf } = require('md-to-pdf');

async function produceRulebook(rulesMdContent, gameFolderPath) {
  try {
    const outputFilepath = join(gameFolderPath, 'rules.pdf');
    const pdf = await mdToPdf({ 
      content: rulesMdContent,
    });

    if (pdf) {
      await writeFile(outputFilepath, pdf.content);
      return outputFilepath;
    }
    console.error('Failed to produce rulebook');
    return null;
  } catch (error) {
    console.error(`Error in produceRulebook: ${error.message}`);
    return null;
  }
}

module.exports = { produceRulebook };
