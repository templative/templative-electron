const { createHash } = require('crypto');
const chalk = require('chalk');

function md5(str) {
  return createHash('md5').update(str).digest('hex');
}
const { getColorValueRGB, getColorValueHex } = require('../../../../../../shared/stockComponentColors');
const WHITE_COLOR_DIFFUSE = { r: 1.0, g: 1.0, b: 1.0}

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

function createBagForObject(object, quantity, name, colorDiffuse = WHITE_COLOR_DIFFUSE) {
  if (quantity == 1) {
    return object;
  }
  return {
    Name: "Bag",
    Transform: {
      posX: 0, posY: 3, posZ: -20, 
      rotX: 0, rotY: 180, rotZ: 0, 
      scaleX: 1, scaleY: 1, scaleZ: 1
    },
    Nickname: name,
    ColorDiffuse: colorDiffuse,
    Locked: true,    
    HideWhenFaceDown: false,
    Hands: false,
    ContainedObjects: Array(quantity).fill().map(() => ({...object, GUID: md5(name + Math.random()).slice(0, 6)})),
    GUID: "chest" + md5(name).slice(0, 6),
    ...STANDARD_ATTRIBUTES
  }
}

function createComponentLibraryChest(componentStates, name = "ComponentLibrary", isInfinite = false, colorDiffuse = null) {
  // console.log(`Creating a component library chest ${name} isInfinite: ${isInfinite} colorDiffuse: ${colorDiffuse}`);
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
  console.log('createDeckObjectState params:', { guid, deckPrefix, name, imageUrls, simulatorComponentPlacement, dimensions, layout, cardQuantities, deckType });
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
  console.log('createCardObjectState params:', { guid, cardPrefix, name, imageUrls, simulatorComponentPlacement, dimensions, deckType });
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

function createStandardDie(name, quantity, numberSides, sizeInches, colorRGBOutOfOne, isMetal=false) {
  console.log(`Creating a standard d${numberSides} die: ${name} color: ${colorRGBOutOfOne[0]}, ${colorRGBOutOfOne[1]}, ${colorRGBOutOfOne[2]} isMetal: ${isMetal}`);
  const guid = md5(name).slice(0, 6);
  
  const colorDiffuse = {
    r: colorRGBOutOfOne[0],
    g: colorRGBOutOfOne[1],
    b: colorRGBOutOfOne[2]
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
  return createBagForObject(die, quantity, `${name} Bag`, colorDiffuse);
}

function createStockCube(name, quantity, sizeInchesXYZ, colorRGBOutOfOne) {
  console.log(`Creating a stock cube ${name} size: ${sizeInchesXYZ} color: ${colorRGBOutOfOne[0]}, ${colorRGBOutOfOne[1]}, ${colorRGBOutOfOne[2]}`);
  const guid = md5(name).slice(0, 6);
  const colorDiffuse = {
    r: colorRGBOutOfOne[0],
    g: colorRGBOutOfOne[1],
    b: colorRGBOutOfOne[2]
  };
  const cube = {
    Name: "BlockSquare",
    Transform: {
      posX: 0, posY: 2, posZ: 0, 
      rotX: 0, rotY: 0, rotZ: 0, 
      scaleX: sizeInchesXYZ[0], scaleY: sizeInchesXYZ[1], scaleZ: sizeInchesXYZ[2]
    },
    Nickname: name,
    ColorDiffuse: colorDiffuse,
    Locked: false,    
    HideWhenFaceDown: false,
    Hands: true,
    GUID: guid,
    ...STANDARD_ATTRIBUTES
  };
  return createBagForObject(cube, quantity, `${name} Bag`, colorDiffuse);
}

function createStockModel(name, quantity, objUrl, textureUrl, normalMapUrl) {
  console.log(`Creating a stock model ${name} objUrl: ${objUrl} textureUrl: ${textureUrl} normalMapUrl: ${normalMapUrl}`);
  const guid = md5(name).slice(0, 6);
  const model =  {
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
  return createBagForObject(model, quantity, `${name} Bag`, WHITE_COLOR_DIFFUSE);
}

function createStandee(name, quantity, frontImageUrl, backImageUrl) {
  console.log(`Creating a standee ${name} frontImageUrl: ${frontImageUrl}`);
  const guid = md5(name).slice(0, 6);
  const scale = 0.750000238;
  const model = {
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
  return createBagForObject(model, quantity, `${name} Bag`, WHITE_COLOR_DIFFUSE);
}

function createTokenWithDefinedShape(name, quantity, frontImageUrl, backImageUrl, shape) {
  console.log(`Creating a token with a defined shape ${name} frontImageUrl: ${frontImageUrl} shape: ${shape}`);
  const guid = md5(name).slice(0, 6);
  const shapeIndex = {
    "Box": 0,
    "Hex": 1,
    "Circle": 2,
    "Rounded": 3
  }
  const customTileShapeType = shapeIndex[shape]
  const model = {
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
  return createBagForObject(model, quantity, `${name} Bag`, WHITE_COLOR_DIFFUSE);
}

function createFlatTokenWithTransparencyBasedShape(name, quantity, frontImageUrl, backImageUrl) {
  return createTokenWithTransparencyBasedShape(name, quantity, frontImageUrl, backImageUrl, 0.2, false, true);
}
function createThickTokenWithTransparencyBasedShape(name, quantity, frontImageUrl, backImageUrl) {
  return createTokenWithTransparencyBasedShape(name, quantity, frontImageUrl, backImageUrl, 1.0, true, false);
}
function createStockCylinder(name, quantity, colorHex, widthMillimeters, heightMillimeters) {
  const guid = md5(name).slice(0, 6);
  const longName = `${name} ${colorHex} ${widthMillimeters}x${heightMillimeters}mm`;
  console.log(`Creating a cylinder ${longName}`);
  const colors = getColorValueRGB(colorHex);
  const colorDiffuse = {
    r: colors[0],
    g: colors[1],
    b: colors[2]
  };
  const model = {
    GUID: guid,
    Name: "Custom_Model",
    Transform: {
      posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0,
      scaleX: 1, scaleY: 1, scaleZ: 1
    },
    Nickname: longName,
    ColorDiffuse: WHITE_COLOR_DIFFUSE,
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,    
    HideWhenFaceDown: false,
    Hands: false,
    CustomMesh: {
      MeshURL: `https://templative-simulator-images.s3.amazonaws.com/${widthMillimeters}mm_${heightMillimeters}mm.obj`,
      DiffuseURL: `https://templative-simulator-images.s3.amazonaws.com/texture_${colorHex.replace("#", "")}.png`,
      NormalURL: `https://templative-simulator-images.s3.amazonaws.com/cylinder_normal.png`,
      ColliderURL: "",
      Convex: true,
      MaterialIndex: 1,
      TypeIndex: 5,
      CastShadows: true
      },
    ...STANDARD_ATTRIBUTES
  }
  return createBagForObject(model, quantity, `${longName} Bag`, colorDiffuse);
}

function createTokenWithTransparencyBasedShape(name, quantity, frontImageUrl, backImageUrl, thickness = 0.2, isStandUp = false, isStackable = true) {
  console.log(`Creating a token with a transparency based shape ${name} frontImageUrl: ${frontImageUrl} thickness: ${thickness} isStandUp: ${isStandUp} isStackable: ${isStackable}`);
  const guid = md5(name).slice(0, 6);
  const scale = 0.25
  const model = {
    GUID: guid,
    Name: "Custom_Token",
    Transform: {
      posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0,
      scaleX: scale, scaleY: scale, scaleZ: scale
    },
    Nickname: name,
    ColorDiffuse: WHITE_COLOR_DIFFUSE,
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
        Stackable: isStackable
      }
    },
    ...STANDARD_ATTRIBUTES
  }
  return createBagForObject(model, quantity, `${name} Bag`, WHITE_COLOR_DIFFUSE);
}

function createCustomDie(name, quantity, imageUrl, numberSides) {
  console.log(`Creating a custom die ${name} imageUrl: ${imageUrl} numberSides: ${numberSides}`);
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
  
  const model = {
    GUID: guid,
    Name: "Custom_Dice",
    Transform: STANDARD_TRANSFORM,
    Nickname: name,
    ColorDiffuse: WHITE_COLOR_DIFFUSE,
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
  return createBagForObject(model, quantity, `${name} Bag`, WHITE_COLOR_DIFFUSE);
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

function createCustomPDF(name, pdfUrl) {
  console.log(`Creating a custom PDF ${name} pdfUrl: ${pdfUrl}`);
  const guid = md5(name).slice(0, 6);
  return {
    GUID: guid,
    Name: "Custom_PDF",
    Transform: {
      posX: 0, posY: 1, posZ: 0, 
      rotX: 0, rotY: 180, rotZ: 0, 
      scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0
    },
    Nickname: name,
    ColorDiffuse: WHITE_COLOR_DIFFUSE,
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    HideWhenFaceDown: false,
    Hands: false,
    CustomPDF: {
      PDFUrl: pdfUrl,
      PDFPassword: "",
      PDFPage: 0,
      PDFPageOffset: 0
    },
    ...STANDARD_ATTRIBUTES
  };
}

function createDomino(name) {
  console.log(`Creating a domino ${name}`);
  const guid = md5(name).slice(0, 6);
  const model = {
    GUID: guid,
    Name: "Domino",
    Transform: {
      posX: 0, posY: 1, posZ: 0, 
      rotX: 0, rotY: 0, rotZ: 0, 
      scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0
    },
    Nickname: name,
    ColorDiffuse: WHITE_COLOR_DIFFUSE,
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    HideWhenFaceDown: true,
    Hands: true,
    ...STANDARD_ATTRIBUTES
  };
  return createBagForObject(model, quantity, `${name} Bag`, WHITE_COLOR_DIFFUSE);
}

function createBaggie(name, quantity, colorDiffuse = null, isInfinite = false) {
  const guid = md5(name).slice(0, 6);
  const bag = {
    GUID: guid,
    Name: "Bag",
    Transform: {
      posX: 0, posY: 1, posZ: 0, 
      rotX: 0, rotY: 0, rotZ: 0, 
      scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0
    },
    Nickname: name,
    ColorDiffuse: colorDiffuse || {
      r: 0.7058823,
      g: 0.366520882,
      b: 0.0
    },
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    HideWhenFaceDown: false,
    Hands: false,
    Bag: {
      Order: 0
    },
    ...STANDARD_ATTRIBUTES
  };
  return createBagForObject(bag, quantity, `${name} Bag`, colorDiffuse);
}
function createPokerChip(name, quantity, chipValue, colorDiffuse = null) {
  const guid = md5(name).slice(0, 6);
  const diffuse = colorDiffuse || {
    r: 1.0,
    g: 1.0,
    b: 1.0
  }
  const model = {
    GUID: guid,
    Name: `Chip_${chipValue}`,
    Transform: {
      posX: 0, posY: 1, posZ: 0, 
      rotX: 0, rotY: 90, rotZ: 0, 
      scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0
    },
    Nickname: name,
    ColorDiffuse: diffuse,
    LayoutGroupSortIndex: 0,
    Value: 0,
    Locked: false,
    HideWhenFaceDown: false,
    Hands: false,
    ...STANDARD_ATTRIBUTES
  };
  return createBagForObject(model, quantity, `${name} Bag`, diffuse);
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
  createThickTokenWithTransparencyBasedShape,
  createCustomPDF,
  createStockCylinder,
  createDomino,
  createBaggie,
  createPokerChip
};
