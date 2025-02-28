const { randomUUID } = require('crypto');

function createSavedStockModel(component, ownerIndex, translation) {
  return {
    uniqueId: randomUUID(),
    objectName: component.Name,
    objectDescription: "",
    objectType: "DynamicObject",
    transform: {
      rotation: {
        x: 0,
        y: 0, 
        z: 0,
        w: 1
      },
      translation: translation,
      scale3D: {
        x: 1,
        y: 1,
        z: 1
      }
    },
    simulatingPhysics: true,
    primaryColor: { b: component.PrimaryColor.b, g: component.PrimaryColor.g, r: component.PrimaryColor.r, a: 255 },
    secondaryColor: { b: 0, g: 0, r: 0, a: 255 },
    metallic: 0,
    roughness: 0.20000000298023224,
    friction: 0.69999998807907104,
    restitution: 0.30000001192092896,
    density: 1,
    surfaceType: "SurfaceType1",
    collisionType: "CB_Regular",
    templateId: component.GUID,
    shouldSnap: true,
    previousPosition: {
      x: 0,
      y: 0,
      z: 0
    },
    objectScriptName: "",
    persistentData: "",
    persistentKeyData: {},
    drawingLines: [],
    objectTags: [],
    objectGroupId: -1,
    ownerIndex: ownerIndex,
    lightsOn: true,
    bCanBeDamaged: false
  };
}

module.exports = { createSavedStockModel };
