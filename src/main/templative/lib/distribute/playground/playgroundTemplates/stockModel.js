function createStockModel(name, guid, mesh, color, normalMap, extraMap, quantity) {
  return {
    "Name": name,
    "GUID": guid,
    "Type": "Generic",
    "Quantity": quantity,
    "Metadata": "",
    "CollisionType": "Regular",
    "Friction": 0.7,
    "Restitution": 0.3,
    "Density": 1,
    "SurfaceType": "Plastic",
    "Roughness": 0.2,
    "Metallic": 0,
    "PrimaryColor": color,
    "SecondaryColor": { "r": 0, "g": 0, "b": 0, "a": 255 },
    "Flippable": false,
    "AutoStraighten": false,
    "ShouldSnap": true,
    "ScriptName": "",
    "Blueprint": "",
    "Models": [
      {
        "Model": mesh,
        "Offset": { "X": 0, "Y": 0, "Z": 0 },
        "Scale": { "X": 1, "Y": 1, "Z": 1 },
        "Rotation": { "X": 0, "Y": 0, "Z": 0 },
        "Texture": "",
        "NormalMap": normalMap,
        "ExtraMap": extraMap,
        "ExtraMap2": "",
        "IsTransparent": false,
        "CastShadow": true,
        "IsTwoSided": false,
        "UseOverrides": true,
        "SurfaceType": "Plastic"
      }
    ],
    "Collision": [],
    "SnapPointsGlobal": false,
    "SnapPoints": [],
    "ZoomViewDirection": { "X": 0, "Y": 0, "Z": 0 },
    "Tags": []
  };
}

module.exports = {
  createStockModel
};