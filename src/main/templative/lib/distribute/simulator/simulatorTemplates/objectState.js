const { createHash } = require('crypto');

function md5(str) {
  return createHash('md5').update(str).digest('hex');
}
const { SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout } = require('../structs');

const STANDARD_ATTRIBUTES = {
  LuaScript: "",
  LuaScriptState: "",
  XmlUI: "",
  Description: "",
  GMNotes: "",
  AltLookAngle: { x: 0.0, y: 0.0, z: 0.0 },
  GridProjection: false,
  IgnoreFoW: false,
  Grid: true,
  Snap: true,
  MeasureMovement: false,
  DragSelectable: true,
  Autoraise: true,
  Sticky: true,
  Tooltip: true,

}
const STANDARD_TRANSFORM = { posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0, scaleX: 1, scaleY: 1, scaleZ: 1 }

const tableLength = 7.5;
const shrinkFactor = 0.75;

function createComponentLibraryChest(componentStates, name = "ComponentLibrary", isInfinite = false, colorDiffuse = null) {
  return {
    Name: isInfinite ? "Infinite_Bag" : "Bag",
    Transform: {
      posX: 0, posY: 3, posZ: -20, 
      rotX: 0, rotY: 180, rotZ: 0, 
      scaleX: 1, scaleY: 1, scaleZ: 1
    },
    Nickname: name,
    ColorDiffuse: colorDiffuse || {
      r: 0.7132782,
      g: 0.7132782,
      b: 0.7132782
    },
    Locked: true,    
    HideWhenFaceDown: false,
    Hands: false,
    ContainedObjects: componentStates,
    GUID: "chest" + md5(name).slice(0, 6),
    ...STANDARD_ATTRIBUTES
  };
}

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
        Nickname: cardId,
        ColorDiffuse: {
          r: 0.713235259,
          g: 0.713235259,
          b: 0.713235259
        },
        LayoutGroupSortIndex: 0,
        Value: 0,
        Locked: false,
        CardID: cardId,
        SidewaysCard: false,
        HideWhenFaceDown: true,
        Hands: true,
        ContainedObjects: [],
        ...STANDARD_ATTRIBUTES
      });
      objectIndex++;
    }
  }

  const deckState = {
    Name: "DeckCustom",
    Transform: transform,
    Nickname: name,    
    ColorDiffuse: {
      r: 0.7132782,
      g: 0.7132782,
      b: 0.7132782
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    HideWhenFaceDown: true,
    Hands: false,
    Locked: false,
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
    ContainedObjects: containedObjects,
    ...STANDARD_ATTRIBUTES
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
    ColorDiffuse: {
      r: 0.713235259,
      g: 0.713235259,
      b: 0.713235259
    },
    LayoutGroupSortIndex: 0,
    Value: 0,    
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
    GUID: guid,
    States: {},
    ContainedObjects: [],
    ...STANDARD_ATTRIBUTES
  };
}

function createStandardDie(name, numberSides, sizeInches, colorRGBOutOfOne, isMetal=false) {
  const guid = md5(name).slice(0, 6);
  const colorDiffuse = {
    r: colorRGBOutOfOne.r / 255.0,
    g: colorRGBOutOfOne.g / 255.0,
    b: colorRGBOutOfOne.b / 255.0
  };
  const die = {
    Name: `Die_${numberSides}`,
    Transform: {
      posX: 0, posY: 2, posZ: 0, 
      rotX: 0, rotY: 0, rotZ: 0, 
      scaleX: sizeInches, scaleY: sizeInches, scaleZ: sizeInches
    },
    Nickname: name,
    ColorDiffuse: colorDiffuse,
    MaterialIndex: -1,
    MaterialType: 0,
    HideWhenFaceDown: false,
    Locked: false,    
    Hands: true,
    GUID: guid,
    AltSound: isMetal,
    RotationValues: getDieRotationValues(numberSides),
    ...STANDARD_ATTRIBUTES
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
      posX: 0, posY: 2, posZ: 0, 
      rotX: 0, rotY: 0, rotZ: 0, 
      scaleX: sizeInches, scaleY: sizeInches, scaleZ: sizeInches
    },
    Nickname: name,
    ColorDiffuse: colorDiffuse,
    Locked: false,    
    HideWhenFaceDown: false,
    Hands: true,
    GUID: guid,
    ...STANDARD_ATTRIBUTES
  };
  return createComponentLibraryChest([cube], `${name} Bag`, true, colorDiffuse);
}

function createStockModel(name, objUrl, textureUrl, normalMapUrl) {
  const guid = md5(name).slice(0, 6);
  return {
    GUID: guid,
    Name: "Custom_Model",
    Transform: STANDARD_TRANSFORM,
    Nickname: name,
    ColorDiffuse: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    LayoutGroupSortIndex: 0,
    Value: 0,    
    HideWhenFaceDown: false,
    Hands: false,
    CustomMesh: {
      MeshURL: objUrl,
      DiffuseURL: textureUrl,
      NormalURL: normalMapUrl,
      ColliderURL: "",
      Convex: true,
      MaterialIndex: 0,
      TypeIndex: 0,
      CastShadows: true
    },
    ...STANDARD_ATTRIBUTES
  }
}

function createStandee(name, frontImageUrl, backImageUrl) {
  const guid = md5(name).slice(0, 6);
  const scale = 0.750000238;
  return {
    GUID: guid,
    Name: "Figurine_Custom",
    Transform: {
      posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0,
      scaleX: scale, scaleY: scale, scaleZ: scale
    },
    Nickname: name,
    ColorDiffuse: {
      r: 0.0,
      g: 0.0,
      b: 0.0,
      a: 0.0
    },
    LayoutGroupSortIndex: 0,
    Value: 0,    
    HideWhenFaceDown: false,
    Hands: false,
    CustomImage: {
      ImageURL: frontImageUrl,
      ImageSecondaryURL: backImageUrl,
      ImageScalar: 2.0,
      WidthScale: 0.0
    },
    ...STANDARD_ATTRIBUTES
  }
}

function createTokenWithDefinedShape(name, frontImageUrl, backImageUrl, shape) {
  const guid = md5(name).slice(0, 6);
  const shapeIndex = {
    "Box": 0,
    "Hex": 1,
    "Circle": 2,
    "Rounded": 3
  }
  const customTileShapeType = shapeIndex[shape]
  return {
    GUID: guid,
    Name: "Custom_Tile",
    Transform: STANDARD_TRANSFORM,
    Nickname: name,
    ColorDiffuse: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    HideWhenFaceDown: false,
    Hands: false,
    CustomImage: {
      ImageURL: frontImageUrl,
      ImageSecondaryURL: backImageUrl,
      ImageScalar: 1.0,
      WidthScale: 0.0,
      CustomTile: {
        Type: customTileShapeType,
        Thickness: 0.2,
        Stackable: true,
        Stretch: true
      }
    },
    ...STANDARD_ATTRIBUTES
  }
}

function createFlatTokenWithTransparencyBasedShape(name, frontImageUrl, backImageUrl) {
  return createTokenWithTransparencyBasedShape(name, frontImageUrl, backImageUrl, 0.2, false);
}
function createThickTokenWithTransparencyBasedShape(name, frontImageUrl, backImageUrl) {
  return createTokenWithTransparencyBasedShape(name, frontImageUrl, backImageUrl, 1.0, true);
}


function createTokenWithTransparencyBasedShape(name, frontImageUrl, backImageUrl, thickness = 0.2, isStandUp = false) {
  const guid = md5(name).slice(0, 6);
  const scale = 0.25
  return {
    GUID: guid,
    Name: "Custom_Token",
    Transform: {
      posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0,
      scaleX: scale, scaleY: scale, scaleZ: scale
    },
    Nickname: name,
    ColorDiffuse: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,    
    HideWhenFaceDown: false,
    Hands: false,
    CustomImage: {
      ImageURL: frontImageUrl,
      ImageSecondaryURL: backImageUrl,
      ImageScalar: 1.0,
      WidthScale: 0.0,
      CustomToken: {
        Thickness: thickness,
        MergeDistancePixels: 15.0,
        StandUp: isStandUp,
        Stackable: true
      }
    },
    ...STANDARD_ATTRIBUTES
  }
}

function createCustomDie(name, imageUrl, numberSides) {
  const guid = md5(name).slice(0, 6);
  const dieTypes = {
    4: 0,  // d4 - tetrahedron
    6: 1,  // d6 - cube
    8: 2,  // d8 - octahedron
    10: 3, // d10 - pentagonal trapezohedron
    12: 4, // d12 - dodecahedron
    20: 5  // d20 - icosahedron
  };
  
  // Get rotation values based on die type
  const rotationValues = getDieRotationValues(numberSides);
  
  if (!rotationValues) {
    throw new Error(`Unsupported die type: d${numberSides}. Only d4, d6, d8, d10, d12, and d20 are supported.`);
  }
  
  return {
    GUID: guid,
    Name: "Custom_Dice",
    Transform: STANDARD_TRANSFORM,
    Nickname: name,
    ColorDiffuse: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    HideWhenFaceDown: false,
    Hands: false,
    CustomImage: {
      ImageURL: imageUrl,
      ImageSecondaryURL: "",
      ImageScalar: 1.0,
      WidthScale: 0.0,
      CustomDice: {
        Type: dieTypes[numberSides]
      }
    },
    RotationValues: rotationValues,
    ...STANDARD_ATTRIBUTES
  };
}

function getDieRotationValues(numberSides) {
  switch (numberSides) {
    case 4: // d4 - tetrahedron
      return [
        { Value: "1", Rotation: { x: 18.0, y: -241.0, z: -120.0 } },
        { Value: "2", Rotation: { x: -90.0, y: -60.0, z: 0.0 } },
        { Value: "3", Rotation: { x: 18.0, y: -121.0, z: 0.0 } },
        { Value: "4", Rotation: { x: 18.0, y: 0.0, z: -240.0 } }
      ];
    
    case 6: // d6 - cube
      return [
        { Value: "1", Rotation: { x: -90.0, y: 0.0, z: 0.0 } },
        { Value: "2", Rotation: { x: 0.0, y: 0.0, z: 0.0 } },
        { Value: "3", Rotation: { x: 0.0, y: 0.0, z: -90.0 } },
        { Value: "4", Rotation: { x: 0.0, y: 0.0, z: 90.0 } },
        { Value: "5", Rotation: { x: 0.0, y: 0.0, z: -180.0 } },
        { Value: "6", Rotation: { x: 90.0, y: 0.0, z: 0.0 } }
      ];
    
    case 8: // d8 - octahedron
      return [
        { Value: "1", Rotation: { x: -33.0, y: 0.0, z: 90.0 } },
        { Value: "2", Rotation: { x: -33.0, y: 0.0, z: 180.0 } },
        { Value: "3", Rotation: { x: 33.0, y: 180.0, z: -180.0 } },
        { Value: "4", Rotation: { x: 33.0, y: 180.0, z: 90.0 } },
        { Value: "5", Rotation: { x: 33.0, y: 180.0, z: -90.0 } },
        { Value: "6", Rotation: { x: 33.0, y: 180.0, z: 0.0 } },
        { Value: "7", Rotation: { x: -33.0, y: 0.0, z: 0.0 } },
        { Value: "8", Rotation: { x: -33.0, y: 0.0, z: -90.0 } }
      ];
    
    case 10: // d10 - pentagonal trapezohedron
      return [
        { Value: "1", Rotation: { x: -38.0, y: 0.0, z: 234.0 } },
        { Value: "2", Rotation: { x: 38.0, y: 180.0, z: -233.0 } },
        { Value: "3", Rotation: { x: -38.0, y: 0.0, z: 20.0 } },
        { Value: "4", Rotation: { x: 38.0, y: 180.0, z: -17.0 } },
        { Value: "5", Rotation: { x: -38.0, y: 0.0, z: 90.0 } },
        { Value: "6", Rotation: { x: 38.0, y: 180.0, z: -161.0 } },
        { Value: "7", Rotation: { x: -38.0, y: 0.0, z: 307.0 } },
        { Value: "8", Rotation: { x: 38.0, y: 180.0, z: -304.0 } },
        { Value: "9", Rotation: { x: -38.0, y: 0.0, z: 163.0 } },
        { Value: "10", Rotation: { x: 38.0, y: 180.0, z: -90.0 } }
      ];
    
    case 12: // d12 - dodecahedron
      return [
        { Value: "1", Rotation: { x: 27.0, y: 0.0, z: 72.0 } },
        { Value: "2", Rotation: { x: 27.0, y: 0.0, z: 144.0 } },
        { Value: "3", Rotation: { x: 27.0, y: 0.0, z: -72.0 } },
        { Value: "4", Rotation: { x: -27.0, y: 180.0, z: 180.0 } },
        { Value: "5", Rotation: { x: 90.0, y: 180.0, z: 0.0 } },
        { Value: "6", Rotation: { x: 27.0, y: 0.0, z: -144.0 } },
        { Value: "7", Rotation: { x: -27.0, y: 180.0, z: 36.0 } },
        { Value: "8", Rotation: { x: -90.0, y: 180.0, z: 0.0 } },
        { Value: "9", Rotation: { x: 27.0, y: 0.0, z: 0.0 } },
        { Value: "10", Rotation: { x: -27.0, y: 180.0, z: 108.0 } },
        { Value: "11", Rotation: { x: -27.0, y: 108.0, z: -36.0 } },
        { Value: "12", Rotation: { x: -27.0, y: 36.0, z: -108.0 } }
      ];
    
    case 20: // d20 - icosahedron
      return [
        { Value: "1", Rotation: { x: -11.0, y: 60.0, z: 17.0 } },
        { Value: "2", Rotation: { x: 52.0, y: -60.0, z: -17.0 } },
        { Value: "3", Rotation: { x: -11.0, y: -180.0, z: 90.0 } },
        { Value: "4", Rotation: { x: -11.0, y: -180.0, z: 162.0 } },
        { Value: "5", Rotation: { x: -11.0, y: -60.0, z: 234.0 } },
        { Value: "6", Rotation: { x: -11.0, y: -180.0, z: 306.0 } },
        { Value: "7", Rotation: { x: 52.0, y: -60.0, z: 55.0 } },
        { Value: "8", Rotation: { x: 52.0, y: -60.0, z: 198.0 } },
        { Value: "9", Rotation: { x: 52.0, y: -60.0, z: 127.0 } },
        { Value: "10", Rotation: { x: 52.0, y: -180.0, z: -90.0 } },
        { Value: "11", Rotation: { x: 308.0, y: 0.0, z: 90.0 } },
        { Value: "12", Rotation: { x: 306.0, y: -240.0, z: -52.0 } },
        { Value: "13", Rotation: { x: -52.0, y: -240.0, z: 18.0 } },
        { Value: "14", Rotation: { x: 307.0, y: 120.0, z: 233.0 } },
        { Value: "15", Rotation: { x: 11.0, y: 120.0, z: -234.0 } },
        { Value: "16", Rotation: { x: 11.0, y: 0.0, z: 54.0 } },
        { Value: "17", Rotation: { x: 11.0, y: -120.0, z: -17.0 } },
        { Value: "18", Rotation: { x: 11.0, y: 0.0, z: -90.0 } },
        { Value: "19", Rotation: { x: -52.0, y: -240.0, z: -198.0 } },
        { Value: "20", Rotation: { x: 11.0, y: 0.0, z: -162.0 } }
      ];
      
    default:
      return null;
  }
}

module.exports = { 
  createDeckObjectState, 
  createCardObjectState, 
  createComponentLibraryChest, 
  createStandardDie, 
  createCustomDie,
  createStockCube, 
  createStockModel, 
  createStandee, 
  createTokenWithDefinedShape, 
  createFlatTokenWithTransparencyBasedShape,
  createThickTokenWithTransparencyBasedShape
};
