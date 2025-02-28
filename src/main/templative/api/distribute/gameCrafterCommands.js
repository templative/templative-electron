const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { getLastOutputFileDirectory } = require('../../lib/manage/instructionsLoader');

// Import GameCrafter client and utilities
const { uploadGame } = require('../../lib/distribute/gameCrafter/client');
const { login, logout } = require('../../lib/distribute/gameCrafter/util/gameCrafterSession');
const { 
  listGames, 
  deletePageOfGames 
} = require('../../lib/distribute/gameCrafter/accountManagement/accountManagement');
const { parseCustomStuff } = require('../../lib/distribute/gameCrafter/tgcParser');

// Create the gameCrafter command
const gameCrafter = new Command('gamecrafter')
  .description('Interact with The Game Crafter');

// Get credentials from environment variables
function getCredentialsFromEnv() {
  const publicApiKey = process.env.THEGAMECRAFTER_PUBLIC_KEY;
  if (!publicApiKey) {
    throw new Error('Could not log in. You need to set the env variable THEGAMECRAFTER_PUBLIC_KEY.');
  }

  const userName = process.env.THEGAMECRAFTER_USER;
  if (!userName) {
    throw new Error('Could not log in. You need to set the env variable THEGAMECRAFTER_USER.');
  }

  const userPassword = process.env.THEGAMECRAFTER_PASSWORD;
  if (!userPassword) {
    throw new Error('Could not log in. You need to set the env variable THEGAMECRAFTER_PASSWORD.');
  }
  
  // Print confirmation of found credentials (for debugging)
  console.log(`Found credentials - Public Key: ${publicApiKey.substring(0, 5)}... User: ${userName}`);
  
  return { publicApiKey, userName, userPassword };
}

// Upload command
gameCrafter
  .command('upload')
  .description('Upload a produced game in a directory')
  .requiredOption('-i, --input <path>', 'The directory of the game. Defaults to ./')
  .requiredOption('-r, --render <path>', 'The directory of the produced game. Defaults to last produced directory.')
  .requiredOption('-d, --designerId <id>', 'The Game Crafter Designer ID to use for this game.')
  .option('-p, --publish', 'Whether to treat this as the official release.', false)
  .option('-d, --debug', 'Debug mode (opposite of publish).', false)
  .option('-s, --stock', 'Whether stock parts are included.', true)
  .option('-n, --nostock', 'Whether stock parts are not included.', false)
  .option('-u, --proofed', 'Whether images are considered proofed already.', true)
  .action(async (options) => {
    try {
      const { publicApiKey, userName, userPassword } = getCredentialsFromEnv();
      
      const session = await login(publicApiKey, userName, userPassword);
      
      if (!session) {
        throw new Error("You must provide a Game Crafter session.");
      }
      
      let inputPath = options.input;
      let renderPath = options.render;
      const publish = options.publish || false;
      const stock = options.stock && !options.nostock;
      const isProofed = options.proofed ? 1 : 0;
      const designerId = options.designerId || null;
      
      if (!renderPath) {
        renderPath = await getLastOutputFileDirectory();
      }
      
      if (!renderPath) {
        throw new Error("Missing --render directory.");
      }
      
      const gameUrl = await uploadGame(
        session, 
        inputPath, 
        renderPath, 
        publish, 
        stock, 
  
        isProofed, 
        designerId
      );
      
      console.log(`Game uploaded successfully! Visit: ${gameUrl}`);
      
      await logout(session);
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// List command
gameCrafter
  .command('list')
  .description('List uploaded games')
  .action(async () => {
    try {
      const { publicApiKey, userName, userPassword } = getCredentialsFromEnv();
      
      const session = await login(publicApiKey, userName, userPassword);
      
      if (!session) {
        throw new Error("You must provide a Game Crafter session.");
      }
      
      await listGames(session);
      await logout(session);
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Delete games command
gameCrafter
  .command('deletegames')
  .description('Delete a page of games')
  .action(async () => {
    try {
      const { publicApiKey, userName, userPassword } = getCredentialsFromEnv();
      
      const session = await login(publicApiKey, userName, userPassword);
      
      if (!session) {
        throw new Error("You must provide a Game Crafter session.");
      }
      
      await deletePageOfGames(session);
      await logout(session);
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Custom list command
gameCrafter
  .command('customlist')
  .description('Save custom components information')
  .action(async () => {
    try {
      const { publicApiKey, userName, userPassword } = getCredentialsFromEnv();
      
      const session = await login(publicApiKey, userName, userPassword);
      
      if (!session) {
        throw new Error("You must provide a Game Crafter session.");
      }
      
      await parseCustomStuff(session);
      await logout(session);
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

module.exports = gameCrafter; 