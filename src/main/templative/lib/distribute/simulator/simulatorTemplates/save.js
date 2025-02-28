const { randomUUID } = require('crypto');

function createSave(name, objectStates, playerCount = 8, rulesMd = "") {
  const hands = [];
  const colors = ["White", "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink"];
  const colorDiffuses = [
    { r: 1.0, g: 1.0, b: 1.0, a: 0.5 }, // White
    { r: 0.856, g: 0.1, b: 0.094, a: 0.5 }, // Red 
    { r: 0.882, g: 0.517, b: 0.219, a: 0.5 }, // Orange
    { r: 0.905, g: 0.898, b: 0.172, a: 0.5 }, // Yellow
    { r: 0.192, g: 0.701, b: 0.168, a: 0.5 }, // Green
    { r: 0.118, g: 0.53, b: 1.0, a: 0.5 }, // Blue
    { r: 0.627, g: 0.125, b: 0.941, a: 0.5 }, // Purple
    { r: 0.96, g: 0.439, b: 0.807, a: 0.5 } // Pink
  ];

  const radius = 40;
  for (let i = 0; i < playerCount; i++) {
    const angleIncrement = 360 / playerCount;
    const angle = -Math.PI / 180 * (i * angleIncrement);
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    let rotation = (angle * 180 / Math.PI - 90);
    if (i % 2 === 1) {
      rotation -= 90;
    }

    hands.push({
      GUID: randomUUID,
      Name: "HandTrigger",
      Nickname: `${colors[i]} Hand`,
      Description: "",
      GMNotes: "",
      AltLookAngle: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      ColorDiffuse: colorDiffuses[i],
      Transform: {
        posX: x,
        posY: 3, // Slight elevation
        posZ: z,
        rotX: 0,
        rotY: rotation,
        rotZ: 0,
        scaleX: 15.3268814,
        scaleY: 11.8970528,
        scaleZ: 6.35014772
      },
      LayoutGroupSortIndex: 0,
      Value: 0,
      Locked: true,
      Grid: false,
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
      FogColor: colors[i],
      LuaScript: "",
      LuaScriptState: "",
      XmlUI: ""
    });
  }
  objectStates.push(...hands);
  return {
    EpochTime: Math.floor(Date.now() / 1000),
    VersionNumber: "v13.3",
    GameType: "",
    GameComplexity: "",
    Tags: [],
    Gravity: 0.5,
    PlayArea: 2,

    SaveName: name,
    GameMode: name,
    Date: "12/28/2015 3:50:33 AM",
    Table: "Table_RPG",
    Sky: "Sky_Forest", 
    Note: "",
    Rules: "",
    PlayerTurn: "",

    Grid: {
      Type: 0,
      Lines: false,
      Color: {
        r: 0.0,
        g: 0.0,
        b: 0.0
      },
      Opacity: 0.75,
      ThickLines: false,
      Snapping: false,
      Offset: false,
      BothSnapping: false,
      xSize: 2.0,
      ySize: 2.0,
      PosOffset: {
        x: 0.0,
        y: 1.0,
        z: 0.0
      }
    },

    Lighting: {
      LightIntensity: 0.54,
      LightColor: {
        r: 1.0,
        g: 0.9804,
        b: 0.8902
      },
      AmbientIntensity: 1.3,
      AmbientType: 0,
      AmbientSkyColor: {
        r: 0.5,
        g: 0.5,
        b: 0.5
      },
      AmbientEquatorColor: {
        r: 0.5,
        g: 0.5,
        b: 0.5
      },
      AmbientGroundColor: {
        r: 0.5,
        g: 0.5,
        b: 0.5
      },
      ReflectionIntensity: 1.0,
      LutIndex: 0,
      LutContribution: 1.0
    },

    Hands: {
      Enable: true,
      DisableUnused: false,
      Hiding: 0
    },

    ComponentTags: {
      labels: []
    },
    Turns: {
      Enable: false,
      Type: 0,
      TurnOrder: [],
      Reverse: false,
      SkipEmpty: false,
      DisableInteractions: false,
      PassTurns: true,
      TurnColor: ""
    },
    DecalPallet: [],
    LuaScript: "--[[ Lua code. See documentation: https://api.tabletopsimulator.com/ --]]\n\n--[[ The onLoad event is called after the game save finishes loading. --]]\nfunction onLoad()\n    --[[ print('onLoad!') --]]\nend\n\n--[[ The onUpdate event is called once per frame. --]]\nfunction onUpdate()\n    --[[ print('onUpdate loop!') --]]\nend",
    LuaScriptState: "",
    XmlUI: "<!-- Xml UI. See documentation: https://api.tabletopsimulator.com/ui/introUI/ -->",

    DrawImage: "iVBORw0KGgoAAAANSUhEUgAAAWAAAADQCAYAAAA53LuNAAAFFElEQVR4Ae3QgQAAAADDoPlTH+SFUGHAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgy8DQx5DAABHyNK3wAAAABJRU5ErkJggg==",
    VectorLines: [],
    ObjectStates: objectStates,
    TabStates: {
      "0": {
        title: "Rules",
        body: rulesMd,
        visibleColor: {
          r: 0.5,
          g: 0.5,
          b: 0.5
        },
        id: 0
      },
      "1": {
        title: "White",
        body: "",
        visibleColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        id: 1
      },
      "2": {
        title: "Red",
        body: "",
        visibleColor: {
          r: 0.856,
          g: 0.1,
          b: 0.094
        },
        id: 2
      },
      "3": {
        title: "Orange",
        body: "",
        visibleColor: {
          r: 0.882,
          g: 0.517,
          b: 0.219
        },
        id: 3
      },
      "4": {
        title: "Yellow",
        body: "",
        visibleColor: {
          r: 0.905,
          g: 0.898,
          b: 0.172
        },
        id: 4
      },
      "5": {
        title: "Green",
        body: "",
        visibleColor: {
          r: 0.192,
          g: 0.701,
          b: 0.168
        },
        id: 5
      },
      "6": {
        title: "Blue",
        body: "",
        visibleColor: {
          r: 0.118,
          g: 0.53,
          b: 1.0
        },
        id: 6
      },
      "7": {
        title: "Purple",
        body: "",
        visibleColor: {
          r: 0.627,
          g: 0.125,
          b: 0.941
        },
        id: 7
      },
      "8": {
        title: "Pink",
        body: "",
        visibleColor: {
          r: 0.96,
          g: 0.439,
          b: 0.807
        },
        id: 8
      },
      "9": {
        title: "Black",
        body: "",
        visibleColor: {
          r: 0.1,
          g: 0.1,
          b: 0.1
        },
        id: 9
      }
    }
  };
}

module.exports = {
  createSave
};
