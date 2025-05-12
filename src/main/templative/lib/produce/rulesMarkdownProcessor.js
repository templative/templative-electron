const { writeFile } = require('fs/promises');
const { join } = require('path');
const fsPromises = require('fs').promises;
const path = require('path');
const {captureMessage, captureException } = require("../sentryElectronWrapper");
const { markdownToPdf } = require('./markdownToPdf');

async function produceRulebook(rulesMdContent, gameFolderPath) {
  if (!rulesMdContent) {
    console.log("!!! rulesMdContent is blank.");
    return;
  }
  if (!gameFolderPath) {
    throw new Error("gameFolderPath is blank.");
  }
  try {
    const outputFilepath = join(gameFolderPath, 'rules.pdf');
    
    const pdfBuffer = await markdownToPdf(rulesMdContent);

    if (!pdfBuffer) {
      throw new Error('Failed to produce rulebook: No PDF content generated');
    }
    
    // Write the PDF buffer directly - no need to access .content
    await writeFile(outputFilepath, pdfBuffer);
    return outputFilepath;
    
  } catch (error) {
    console.error(`Error in produceRulebook: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    captureException(error);
    return null;
  }
}

module.exports = { produceRulebook };
