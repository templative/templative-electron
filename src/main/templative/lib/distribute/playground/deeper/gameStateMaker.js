const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const { table, gameState, deck, cardHolder, board, stockModel, savedStockModel } = require('../playgroundTemplates/index.js');

const playerColors = [];
for (let i = 0; i < 20; i++) {
  playerColors.push({ r: String(Math.random() * 255), g: String(Math.random() * 255), b: String(Math.random() * 255) });
}

function createGameState(name, playerCount) {
  const slotTeams = [];
  const slotIds = [];
  for (let p = 0; p < playerCount; p++) {
    slotTeams.push(p + 1);
    slotIds.push(randomUUID());
  }

  return gameState.createGameState(name, slotTeams, slotIds);
}

function getQuaternionFromEuler(roll, pitch, yaw) {
  const qx = Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) - Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
  const qy = Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2) + Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2);
  const qz = Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2) - Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2);
  const qw = Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) + Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);

  return [qx, qy, qz, qw];
}

function createCardHolder(playerIndex, totalPlayerCount) {
  const ownerColor = {
    r: (playerIndex / totalPlayerCount) * 255,
    g: 50,
    b: 50,
    a: 255,
  };

  const distanceFromCenter = 120 + (Math.max(0, totalPlayerCount - 2) * 30);

  const angle = (playerIndex / totalPlayerCount) * Math.PI * 2 + (1 / 180);

  const locationX = Math.cos(angle) * distanceFromCenter;
  const locationY = Math.sin(angle) * distanceFromCenter;

  const zRotation = angle - Math.PI;
  const rotationQuaternion = getQuaternionFromEuler(0, 0, zRotation);

  return cardHolder.createCardHolder(playerIndex, ownerColor, locationX, locationY, rotationQuaternion);
}

function createPokerDeck(name, componentTemplateGuid, ownerIndex, translation, totalPieceQuantity) {
  const stackSerialization = [];
  for (let q = 0; q < totalPieceQuantity - 1; q++) {
    const piece = {
      index: q + 1,
      templateId: componentTemplateGuid,
      frontTextureOverride: '',
      flipped: false,
    };
    stackSerialization.push(piece);
  }
  return deck.createDeck(name, componentTemplateGuid, ownerIndex, translation, stackSerialization);
}

function createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions) {
  return board.createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions);
}

function createGameObjects(components, totalPlayerCount) {
  const gameObjects = [];

  for (let p = 0; p < totalPlayerCount; p++) {
    gameObjects.push(createCardHolder(p, totalPlayerCount));
  }

  const xTranslationEachComponent = 30;
  const yTranslationEachComponent = 30;
  const noOwnerConstant = -1;

  const totalComponents = components.filter(c => c !== null).length;
  const columns = Math.ceil(Math.sqrt(totalComponents));
  const rows = Math.ceil(totalComponents / columns);
  const halfWidth = (columns * xTranslationEachComponent) / 2;
  const halfHeight = (rows * yTranslationEachComponent) / 2;
  const skippedGameStateComponents = [];

  for (let c = 0; c < components.length; c++) {
    const component = components[c];
    if (component === null) {
      continue;
    }

    const row = Math.floor(c / columns);
    const column = c % columns;

    const newXPosition = (column * xTranslationEachComponent) - halfWidth;
    const newYPosition = (row * yTranslationEachComponent) - halfHeight;

    const gameObjectTranslation = { x: newXPosition, y: newYPosition, z: 5 };

    let totalPieceQuantity;
    if ('Indices' in component) {
      totalPieceQuantity = component.Indices.length;
    } else if ('Quantity' in component) {
      totalPieceQuantity = component.Quantity;
    } else {
      skippedGameStateComponents.push(component.Name);
      continue;
    }

    if (component.Type === 'Card') {
      for (let i = 0; i < component.Quantity; i++) {
        gameObjectTranslation.z = 5 + (i * 15);
        const gameObject = createPokerDeck(component.Name, component.GUID, noOwnerConstant, gameObjectTranslation, totalPieceQuantity);
        gameObjects.push(gameObject);
      }
    } else {
      const gameObject = savedStockModel.createSavedStockModel(component, noOwnerConstant, gameObjectTranslation);
      gameObjects.push(gameObject);
    }
  }

  if (skippedGameStateComponents.length > 0) {
    console.log('Skipping components for missing indices:', skippedGameStateComponents);
  }

  return gameObjects;
}

function choosePackages(gameName, packageGuid) {
  return [
    {
      name: gameName,
      guid: packageGuid,
    },
    { name: 'Cards', guid: '8F8543D040D1C361098594A763847262' },
    { name: 'General', guid: 'D74C7D5D6745CD565913DAA5FB3E9C93' },
  ];
}

function createRoomForPlayerCount(totalPlayerCount) {
  const storedCameraSetups = [];
  const playerCameraSetups = [];
  const playerSlotNames = [];
  const customPlayerColors = [];

  for (let p = 0; p < totalPlayerCount; p++) {
    const locationX = Math.cos(p / totalPlayerCount * Math.PI * 2) * 100;
    const locationY = Math.sin(p / totalPlayerCount * Math.PI * 2) * 100;
    const controlRotationYaw = (p * 360 / totalPlayerCount) - 180;

    storedCameraSetups.push({
      location: { x: locationX, y: locationY, z: 120 },
      controlRotation: { pitch: 330, yaw: 0, roll: 0 },
      pawnRotation: { x: 0, y: 0, z: 0, w: 0 },
      playerScale: 1,
      flying: true,
    });

    playerCameraSetups.push({
      location: { x: 0, y: 0, z: 90 },
      controlRotation: { pitch: 330, yaw: controlRotationYaw, roll: 0 },
      pawnRotation: { x: 0, y: 0, z: 0, w: 0 },
      playerScale: 1,
      flying: true,
    });

    playerSlotNames.push(String(p + 1));
    customPlayerColors.push(playerColors[p]);
  }

  return {
    storedCameraSetups,
    playerCameraSetups,
    playerSlotNames,
    customPlayerColors,
  };
}

async function createGameStateVts(gameName, packageGuid, components, totalPlayerCount, packageDirectoryPath) {
  const state = {
    lighting: {
      intensity: 1,
      specular: 1,
      altitude: 90,
      azimuth: 0,
      color: { r: 255, g: 255, b: 255 },
    },
    grid: {
      type: 0,
      snapType: 0,
      visibility: 0,
      thickLines: false,
      color: { r: 0, g: 0, b: 0, a: 179 },
      offset: { x: 0, y: 0 },
      rotation: 0,
      size: { x: 5.0799999237060547, y: 5.0799999237060547 },
    },
    saveStateVersion: '1.0',
    zones: [],
    labels: [],
  };

  state.gameState = createGameState(gameName, totalPlayerCount);
  state.requiredPackages = choosePackages(gameName, packageGuid);
  state.objects = createGameObjects(components, totalPlayerCount);

  const roomData = createRoomForPlayerCount(totalPlayerCount);
  state.storedCameraSetups = roomData.storedCameraSetups;
  state.playerCameraSetups = roomData.playerCameraSetups;
  state.playerSlotNames = roomData.playerSlotNames;
  state.customPlayerColors = roomData.customPlayerColors;

  const templateDirectory = path.join(packageDirectoryPath, 'States');
  const templateFilepath = path.join(templateDirectory, `${gameName}.vts`);

  await fs.promises.writeFile(templateFilepath, JSON.stringify(state, null, 2));

  return state;
}

module.exports = {
  createGameStateVts,
};
