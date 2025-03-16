const fs = require('fs');
const path = require('path');
const { Image } = require('image-js');

function createGitIgnore(directory) {
  const gitIgnore = "output/*\nprintout.pdf\n.playground\n.animation";
  fs.writeFileSync(path.join(directory, ".gitignore"), gitIgnore);
}

function createComponentCompose(directory) {
  const componentCompose = [];
  fs.writeFileSync(path.join(directory, "component-compose.json"), JSON.stringify(componentCompose, null, 4));
}

function createGameCompose(directory) {
  const gameCompose = {
    "outputDirectory": "./output",
    "piecesGamedataDirectory": "./gamedata/piece",
    "componentGamedataDirectory": "./gamedata/component",
    "artdataDirectory": "./artdata",
    "artTemplatesDirectory": "./art",
    "artInsertsDirectory": "./art"
  };
  fs.writeFileSync(path.join(directory, "game-compose.json"), JSON.stringify(gameCompose, null, 4));
}

function createStudio(directory) {
  const studio = {
    "name": "Template Studio"
  };
  fs.writeFileSync(path.join(directory, "studio.json"), JSON.stringify(studio, null, 4));
}

function createRulesFile(directory) {
  const rules = "# Rules\n\nPlay the game.";
  fs.writeFileSync(path.join(directory, "rules.md"), rules);
}

function createLastFile(directory) {
  fs.writeFileSync(path.join(directory, "output/.last"), "");
}

function createGame(directory) {
  const game = {
    "name": "Game Name",
    "version": "0.0.0",
    "versionName": "Template",
    "shortDescription": "Tagline",
    "longDescription": "Long description.",
    "coolFactors": [
      "First",
      "Second", 
      "Third"
    ],
    "tags": [],
    "websiteUrl": "",
    "category": "Card Games",
    "minAge": "12+",
    "playTime": "30-60",
    "minPlayers": "2",
    "maxPlayers": "2"
  };
  fs.writeFileSync(path.join(directory, "game.json"), JSON.stringify(game, null, 4));
}

async function createImage(directory, name, width, height) {
  const img = new Image(width, height, { kind: 'RGB' });
  // Fill the image with white (255, 255, 255)
  for (let i = 0; i < img.size; i++) {
    img.setPixel(i, [255, 255, 255]);
  }
  await img.save(path.join(directory, `gamecrafter/${name}.png`));
}

async function createGameCrafterImage(directory) {
  await createImage(directory, "actionShot", 800, 600);
  await createImage(directory, "advertisement", 216, 150); 
  await createImage(directory, "backdrop", 1600, 600);
  await createImage(directory, "logo", 350, 150);
}

async function createProjectInDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
  createStudio(directory);
  createRulesFile(directory);
  createGame(directory);
  createGameCompose(directory);
  createComponentCompose(directory);
  createGitIgnore(directory);

  fs.mkdirSync(path.join(directory, "output"), { recursive: true });
  createLastFile(directory);

  fs.mkdirSync(path.join(directory, "gamedata/component"), { recursive: true });
  fs.mkdirSync(path.join(directory, "gamedata/piece"), { recursive: true });

  fs.mkdirSync(path.join(directory, "gamecrafter"), { recursive: true });
  createGameCrafterImage(directory);

  fs.mkdirSync(path.join(directory, "artdata"), { recursive: true });

  fs.mkdirSync(path.join(directory, "art"), { recursive: true });

  return 1;
}

module.exports = {
  createProjectInDirectory
};