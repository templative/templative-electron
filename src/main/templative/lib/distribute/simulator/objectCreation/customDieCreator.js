const { createHash } = require('crypto');
const chalk = require('chalk');
const { createD6CompositeImage } = require('../imageProcessing/compositeImageCreator');
const { createCustomDie } = require('../simulatorTemplates/objectState');
const { getColorValueHex } = require('../../../../../../shared/stockComponentColors');
/**
 * Create a standee from preview
 * @param {string} tabletopSimulatorImageDirectoryPath - Path to TTS image directory
 * @param {Object} componentInstructions - Component instructions
 * @param {Object} componentInfo - Component information
 * @param {number} componentIndex - Index of the component
 * @param {number} componentCountTotal - Total number of components
 * @returns {Promise<Object|null>} - Standee from preview object state or null if failed
 */
async function createDie(tabletopSimulatorImageDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal) {
  try {
    let color = componentInstructions.Color || "white";
    if (!componentInstructions.Color) {
        console.log(chalk.yellow("!!! Multi colored custom dice are not currently supported. Using white."));
    }
    const colorHex = getColorValueHex(color);
    const imageUrl = await createD6CompositeImage(componentInstructions["name"], colorHex, componentInstructions["dieFaceFilepaths"]);

    return createCustomDie(componentInstructions["name"], componentInstructions["quantity"], imageUrl, 6);
  } catch (error) {
    console.log(chalk.red(`!!! Error creating dice from preview for ${componentInstructions.name}: ${error}`));
    return null;
  }
}


module.exports = {
    createDie
}; 