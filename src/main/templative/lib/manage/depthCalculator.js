const { defineLoader } = require('./../manage.js');
const { COMPONENT_INFO } = require('./../componentInfo.js');

async function calculateComponentsDepth(gameRootDirectoryPath) {
  if (!gameRootDirectoryPath) {
    throw new Error("Game root directory path is invalid.");
  }

  const game = await defineLoader.loadGame(gameRootDirectoryPath);
  const gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath);
  const studioCompose = await defineLoader.loadStudio(gameRootDirectoryPath);
  const componentCompose = await defineLoader.loadComponentCompose(gameRootDirectoryPath);
  if (!gameCompose || !gameDataBlob || !studioDataBlob || !componentsCompose) {
    console.log(`!!! Malformed Templative Project. ${path.basename(gameRootDirectoryPath)} is missing: ${gameCompose ? "" : "game-compose.json "}${gameDataBlob ? "" : "game.json "}${studioDataBlob ? "" : "studio.json "}${componentsCompose ? "" : "component-compose.json "}`);
    return;
}

  console.log(`${game["name"]} by ${studioCompose["name"]}`);
  await printGameComponentDepth(gameRootDirectoryPath, gameCompose, componentCompose);
}

async function printGameComponentDepth(gameRootDirectoryPath, gameCompose, componentCompose) {
  if (!gameRootDirectoryPath) {
    throw new Error("Game root directory path is invalid.");
  }

  let depthMillimeters = 0;
  for (const component of componentCompose) {
    if (String(component["disabled"]) === true) {
      console.log(`Skipping disabled ${component["name"]} component.`);
      continue;
    }

    if (component["type"].startsWith("STOCK")) {
      console.log(`Skipping stock ${component["name"]} component.`);
      continue;
    }

    const piecesGamedata = await defineLoader.loadPiecesGamedata(
      gameRootDirectoryPath,
      gameCompose,
      component["piecesGamedataFilename"]
    );
    if (!piecesGamedata || Object.keys(piecesGamedata).length === 0) {
      console.log(`Skipping ${component["name"]} component due to missing pieces gamedata.`);
      continue;
    }

    if (!COMPONENT_INFO[component["type"]]) {
      console.log(`Missing component info for ${component["name"]}.`);
      continue;
    }

    const componentInfo = COMPONENT_INFO[component["type"]];
    if (!("GameCrafterPackagingDepthMillimeters" in componentInfo)) {
      console.log(`Skipping ${component["name"]} component as we don't have a millimeter measurement for it.`);
      continue;
    }

    const depthOfPiece = componentInfo["GameCrafterPackagingDepthMillimeters"];
    for (const piece of piecesGamedata) {
      depthMillimeters += piece["quantity"] * depthOfPiece;
    }
  }
  console.log(`${depthMillimeters.toFixed(2)}mm`);
}

module.exports = {
  calculateComponentsDepth,
  printGameComponentDepth
};
