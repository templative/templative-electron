function createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions) {
  return {
    "Type": "Generic",
    "GUID": guid,
    "Name": name,
    "Metadata": "",
    "CollisionType": "Ground",
    "Friction": 0.7,
    "Restitution": 0.3,
    "Density": 1,
    "SurfaceType": "Wood",
    "Roughness": 0.34,
    "Metallic": 1,
    "PrimaryColor": {
      "R": 255,
      "G": 255,
      "B": 255
    },
    "SecondaryColor": {
      "R": 0,
      "G": 0,
      "B": 0
    },
    "Flippable": true,
    "AutoStraighten": false,
    "ShouldSnap": true,
    "ScriptName": "",
    "Blueprint": "Blueprints/Board.json",
    "Models": [
      {
        "Model": "StaticMesh'/Game/Meshes/Generic/BoardSurface.BoardSurface'",
        "Offset": {
          "X": 0,
          "Y": 0,
          "Z": 0
        },
        "Scale": {
          "X": dimensions[0],
          "Y": dimensions[1],
          "Z": 1
        },
        "Rotation": {
          "X": 0,
          "Y": 0,
          "Z": 0
        },
        "Texture": frontTextureName,
        "NormalMap": "",
        "ExtraMap": "",
        "ExtraMap2": "",
        "IsTransparent": false,
        "CastShadow": true,
        "IsTwoSided": false,
        "UseOverrides": true,
        "SurfaceType": "Plastic"
      },
      {
        "Model": "StaticMesh'/Game/Meshes/Generic/BoardBody.BoardBody'",
        "Offset": {
          "X": 0,
          "Y": 0,
          "Z": 0
        },
        "Scale": {
          "X": dimensions[0],
          "Y": dimensions[1],
          "Z": 1
        },
        "Rotation": {
          "X": 0,
          "Y": 0,
          "Z": 0
        },
        "Texture": "Texture2D'/Game/Textures/Boards/BoardWood_Diffuse.BoardWood_Diffuse'",
        "NormalMap": "Texture2D'/Game/Textures/Boards/BoardWood_Normal.BoardWood_Normal'",
        "ExtraMap": "Texture2D'/Game/Textures/Boards/BoardWood_Extra.BoardWood_Extra'",
        "ExtraMap2": "",
        "IsTransparent": false,
        "CastShadow": true,
        "IsTwoSided": false,
        "UseOverrides": false,
        "Roughness": 0.8,
        "Metallic": 0,
        "PrimaryColor": {
          "R": 255,
          "G": 255,
          "B": 255
        },
        "SecondaryColor": {
          "R": 0,
          "G": 0,
          "B": 0
        },
        "SurfaceType": "Plastic"
      },
      {
        "Model": "StaticMesh'/Game/Meshes/Generic/BoardSurface.BoardSurface'",
        "Offset": {
          "X": 0,
          "Y": 0,
          "Z": -1
        },
        "Scale": {
          "X": dimensions[0],
          "Y": dimensions[1],
          "Z": 1
        },
        "Rotation": {
          "X": 0,
          "Y": 0,
          "Z": 0
        },
        "Texture": backTextureName,
        "NormalMap": "",
        "ExtraMap": "",
        "ExtraMap2": "",
        "IsTransparent": false,
        "CastShadow": true,
        "IsTwoSided": false,
        "UseOverrides": true,
        "SurfaceType": "Plastic"
      }
    ],
    "Collision": [],
    "Quantity": quantity,
    "SnapPointsGlobal": false,
    "SnapPoints": [],
    "ZoomViewDirection": {
      "X": 0,
      "Y": 0,
      "Z": 0
    },
    "Tags": []
  };
}

module.exports = {
  createBoard
};