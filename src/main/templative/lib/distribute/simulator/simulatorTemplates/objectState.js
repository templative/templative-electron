const { createHash } = require('crypto');

function md5(str) {
  return createHash('md5').update(str).digest('hex');
}
const { SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout } = require('../structs');

const tableLength = 7.5;
const shrinkFactor = 0.75;

function createDeckObjectState(guid, deckPrefix, name, imageUrls, simulatorComponentPlacement, dimensions, layout, cardQuantities, deckType = 0) {
  const deckIds = [];
  let cardIndex = 0;

  // Create deck IDs based on quantities of each card
  for (let [cardPosition, quantity] of cardQuantities.entries()) {
    for (let i = 0; i < quantity; i++) {
      const leadingZero = cardPosition < 10 ? "0" : "";
      deckIds.push(parseInt(`${deckPrefix}${leadingZero}${cardPosition}`));
      cardIndex++;
    }
  }

  const positionX = (-tableLength / 2) + (simulatorComponentPlacement.boxPositionIndexX * tableLength / simulatorComponentPlacement.boxColumnCount * 2);
  const positionZ = (-tableLength / 2) + (simulatorComponentPlacement.boxPositionIndexZ * tableLength / simulatorComponentPlacement.boxRowCount * 2);

  const transform = {
    posX: positionX,
    posY: simulatorComponentPlacement.height,
    posZ: positionZ,
    rotX: 1.46591833E-06,
    rotY: 180.0,
    rotZ: 180.0,
    scaleX: dimensions.width * shrinkFactor,
    scaleY: dimensions.thickness,
    scaleZ: dimensions.height * shrinkFactor
  };

  const containedObjects = [];
  let objectIndex = 0;

  // Create contained objects based on quantities of each card
  for (let [cardPosition, quantity] of cardQuantities.entries()) {
    for (let i = 0; i < quantity; i++) {
      const leadingZero = cardPosition < 10 ? "0" : "";
      const cardId = parseInt(`${deckPrefix}${leadingZero}${cardPosition}`);
      containedObjects.push({
        GUID: `${guid}_${objectIndex}`,
        Name: "Card",
        Transform: transform,
        Nickname: "",
        Description: "",
        GMNotes: "",
        AltLookAngle: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        ColorDiffuse: {
          r: 0.713235259,
          g: 0.713235259,
          b: 0.713235259
        },
        LayoutGroupSortIndex: 0,
        Value: 0,
        Locked: false,
        Grid: true,
        Snap: true,
        IgnoreFoW: false,
        MeasureMovement: false,
        DragSelectable: true,
        Autoraise: true,
        Sticky: true,
        Tooltip: true,
        GridProjection: false,
        CardID: cardId,
        SidewaysCard: false,
        XmlUI: "",
        HideWhenFaceDown: true,
        Hands: true,
        ContainedObjects: []
      });
      objectIndex++;
    }
  }

  const deckState = {
    Name: "DeckCustom",
    Transform: transform,
    Nickname: name,
    AltLookAngle: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    GMNotes: "",
    Description: "",
    ColorDiffuse: {
      r: 0.7132782,
      g: 0.7132782,
      b: 0.7132782
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    IgnoreFoW: false,
    MeasureMovement: false,
    DragSelectable: true,
    Tooltip: true,
    GridProjection: false,
    HideWhenFaceDown: true,
    Hands: false,
    Locked: false,
    Grid: true,
    Snap: true,
    Autoraise: true,
    Sticky: true,
    SidewaysCard: false,
    DeckIDs: deckIds,
    CustomDeck: {
      [deckPrefix]: {
        FaceURL: imageUrls.face,
        BackURL: imageUrls.back,
        NumWidth: layout.columns,
        NumHeight: layout.rows,
        BackIsHidden: false,
        UniqueBack: false,
        Type: deckType
      }
    },
    GUID: guid,
    LuaScript: "",
    LuaScriptState: "",
    XmlUI: "",
    ContainedObjects: containedObjects
  };

  return deckState;
}

function createCardObjectState(guid, cardPrefix, name, imageUrls, simulatorComponentPlacement, dimensions, deckType = 0) {
  const positionX = (-tableLength / 2) + (simulatorComponentPlacement.boxPositionIndexX * tableLength / simulatorComponentPlacement.boxColumnCount * 2);
  const positionZ = (-tableLength / 2) + (simulatorComponentPlacement.boxPositionIndexZ * tableLength / simulatorComponentPlacement.boxRowCount * 2);
  const transform = {
    posX: positionX,
    posY: simulatorComponentPlacement.height,
    posZ: positionZ,
    rotX: 1.46591833E-06,
    rotY: 180.0,
    rotZ: 180.0,
    scaleX: dimensions.width,
    scaleY: dimensions.thickness,
    scaleZ: dimensions.height
  };

  return {
    Name: "CardCustom",
    Transform: transform,
    Nickname: name,
    Description: "",
    GMNotes: "",
    AltLookAngle: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    ColorDiffuse: {
      r: 0.713235259,
      g: 0.713235259,
      b: 0.713235259
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    Grid: true,
    Snap: true,
    IgnoreFoW: false,
    MeasureMovement: false,
    DragSelectable: true,
    Autoraise: true,
    Sticky: true,
    Tooltip: true,
    GridProjection: false,
    HideWhenFaceDown: true,
    Hands: true,
    CardID: parseInt(`${cardPrefix}00`),
    SidewaysCard: false,
    CustomDeck: {
      [cardPrefix]: {
        FaceURL: imageUrls.face,
        BackURL: imageUrls.back,
        NumWidth: 1,
        NumHeight: 1,
        BackIsHidden: false,
        UniqueBack: false,
        Type: deckType
      }
    },
    XmlUI: "",
    GUID: guid,
    States: {},
    ContainedObjects: [],
    LuaScript: "",
    LuaScriptState: ""
  };
}

function createComponentLibraryChest(componentStates, name = "ComponentLibrary", isInfinite = false, colorDiffuse = null) {
  return {
    Name: isInfinite ? "Infinite_Bag" : "Bag",
    Transform: {
      posX: 0,
      posY: 3,
      posZ: -20,
      rotX: 0,
      rotY: 180,
      rotZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1
    },
    Nickname: name,
    Description: "Contains all game components for respawning",
    GMNotes: "",
    ColorDiffuse: colorDiffuse || {
      r: 0.7132782,
      g: 0.7132782,
      b: 0.7132782
    },
    Locked: true,
    Grid: true,
    Snap: true,
    IgnoreFoW: false,
    MeasureMovement: false,
    DragSelectable: true,
    Autoraise: true,
    Sticky: true,
    Tooltip: true,
    GridProjection: false,
    HideWhenFaceDown: false,
    Hands: false,
    ContainedObjects: componentStates,
    GUID: "chest" + md5(name).slice(0, 6)
  };
}

function createStockDie(name, sizeInches, color) {
  const guid = md5(name).slice(0, 6);
  const colorDiffuse = {
    r: color.r / 255.0,
    g: color.g / 255.0,
    b: color.b / 255.0
  };
  const die = {
    Name: "Die_6",
    Transform: {
      posX: 0,
      posY: 2,
      posZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scaleX: sizeInches,
      scaleY: sizeInches,
      scaleZ: sizeInches
    },
    Nickname: name,
    Description: "",
    ColorDiffuse: colorDiffuse,
    DieType: 0, // Regular D6
    MaterialIndex: -1,
    MaterialType: 0,
    HideWhenFaceDown: false,
    Locked: false,
    Grid: true,
    Snap: true,
    IgnoreFoW: false,
    MeasureMovement: false,
    DragSelectable: true,
    Autoraise: true,
    Sticky: true,
    Tooltip: true,
    GridProjection: false,
    Hands: true,
    GUID: guid
  };
  return createComponentLibraryChest([die], `${name} Bag`, true, colorDiffuse);
}

function createStockCube(name, sizeInches, color) {
  const guid = md5(name).slice(0, 6);
  const colorDiffuse = {
    r: color.r / 255.0,
    g: color.g / 255.0,
    b: color.b / 255.0
  };
  const cube = {
    Name: "BlockSquare",
    Transform: {
      posX: 0,
      posY: 2,
      posZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scaleX: sizeInches,
      scaleY: sizeInches,
      scaleZ: sizeInches
    },
    Nickname: name,
    Description: "",
    ColorDiffuse: colorDiffuse,
    Locked: false,
    Grid: true,
    Snap: true,
    IgnoreFoW: false,
    MeasureMovement: false,
    DragSelectable: true,
    Autoraise: true,
    Sticky: true,
    Tooltip: true,
    GridProjection: false,
    HideWhenFaceDown: false,
    Hands: true,
    GUID: guid
  };
  return createComponentLibraryChest([cube], `${name} Bag`, true, colorDiffuse);
}

function createStockModel(name, objUrl, textureUrl, normalMapUrl) {
  const guid = md5(name).slice(0, 6);
  return {
    "GUID": guid,
    "Name": "Custom_Model",
    "Transform": {
      "posX": 0,
      "posY": 0,
      "posZ": 0,
      "rotX": 0,
      "rotY": 0,
      "rotZ": 0,
      "scaleX": 1.0,
      "scaleY": 1.0,
      "scaleZ": 1.0
    },
    "Nickname": name,
    "Description": "",
    "GMNotes": "",
    "AltLookAngle": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "ColorDiffuse": {
      "r": 1.0,
      "g": 1.0,
      "b": 1.0
    },
    "LayoutGroupSortIndex": 0,
    "Value": 0,
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": false,
    "Hands": false,
    "CustomMesh": {
      "MeshURL": objUrl,
      "DiffuseURL": textureUrl,
      "NormalURL": normalMapUrl,
      "ColliderURL": "",
      "Convex": true,
      "MaterialIndex": 0,
      "TypeIndex": 0,
      "CastShadows": true
    },
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": ""
  }
}
module.exports = { createDeckObjectState, createCardObjectState, createComponentLibraryChest, createStockDie, createStockCube, createStockModel };
