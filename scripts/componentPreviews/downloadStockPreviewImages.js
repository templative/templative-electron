const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');
const FormData = require('form-data');
const chalk = require('chalk');
const outputPath = "/Users/oliverbarnum/Documents/git/templative-electron/src/assets/images/componentPreviewImages"

// Ensure the output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const {STOCK_COMPONENT_INFO} = require("../../src/shared/stockComponentInfo.js");


async function downloadImages() {
  let stockComponents = STOCK_COMPONENT_INFO
  for (const key in stockComponents) {
    const component = stockComponents[key];
    const officialPreviewUri = component.OfficialPreviewUri;
    if (!officialPreviewUri) {
      console.log(chalk.yellow(`Component ${key} has no OfficialPreviewUri, skipping`));
      continue;
    }
    const url = `https:${officialPreviewUri}`
    let fileName = key
    if (/[<>:"/\\|?*]/.test(fileName)) {
      fileName = fileName.replace(/[<>:"/\\|?*]/g, '_');
    }
    const outputFilePath = path.join(outputPath, `${fileName}.png`);
    
    // If you dont already have the file, download it
    if (fs.existsSync(outputFilePath)) {
      continue;
    }
    if (key != fileName) {
      console.log(chalk.red(`${key} -> ${fileName}`))
    }
    try {
      const response = await fetch(url);
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(outputFilePath, Buffer.from(imageBuffer));
      stockComponents[key].PreviewUri = `${fileName}.png`
      console.log(chalk.green(`Processed and saved ${outputFilePath}`));
    } catch (error) {
      console.error(chalk.red(`Error processing image ${key}:`), error);
    }
  }
  const contents = `const STOCK_COMPONENT_INFO = ${JSON.stringify(stockComponents, null, 2)}
  module.exports = { STOCK_COMPONENT_INFO }`
  fs.writeFileSync(path.join(__dirname, '../src/shared/stockComponentInfo.js'), contents);
  console.log(chalk.green("Done!"));
}

// Execute the function
downloadImages().catch(error => {
  console.error('Error downloading images:', error);
  process.exit(1);
});
