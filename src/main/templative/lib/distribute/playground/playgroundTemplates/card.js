function createCard(guid, name, frontTextureName, backTextureName, quantity, cardColumnCount, cardRowCount, dimensions, model, indices) {
  return {
    Type: "Card",
    GUID: guid,
    Name: name,
    Quantity: quantity,
    Metadata: "",
    CollisionType: "Regular",
    Friction: 0.7,
    Restitution: 0,
    Density: 0.5,
    SurfaceType: "Cardboard",
    Roughness: 1,
    Metallic: 0,
    PrimaryColor: {
      R: 255,
      G: 255,
      B: 255
    },
    SecondaryColor: {
      R: 0,
      G: 0,
      B: 0
    },
    Flippable: true,
    AutoStraighten: false,
    ShouldSnap: true,
    ScriptName: "",
    Blueprint: "",
    Models: [],
    Collision: [],
    SnapPointsGlobal: false,
    SnapPoints: [],
    ZoomViewDirection: {
      X: 0,
      Y: 0,
      Z: 0
    },
    Tags: [],
    FrontTexture: frontTextureName,
    BackTexture: backTextureName,
    HiddenTexture: "",
    BackIndex: -2,
    HiddenIndex: -1,
    NumHorizontal: cardColumnCount,
    NumVertical: cardRowCount,
    Width: dimensions[0],
    Height: dimensions[1],
    Thickness: dimensions[2],
    HiddenInHand: true,
    UsedWithCardHolders: true,
    CanStack: true,
    UsePrimaryColorForSide: false,
    FrontTextureOverrideExposed: false,
    AllowFlippedInStack: false,
    MirrorBack: true,
    EmissiveFront: false,
    Model: model,
    Indices: indices,
    CardNames: {},
    CardMetadata: {},
    CardTags: {}
  };
}

module.exports = {
  createCard
};