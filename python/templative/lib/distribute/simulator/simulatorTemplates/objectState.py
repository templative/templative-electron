
from ..structs import SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout

tableLength = 7.5

def createDeckObjectState(guid: str, name: str, imageUrls: SimulatorTilesetUrls, simulatorComponentPlacement: SimulatorComponentPlacement, dimensions: SimulatorDimensions, layout: SimulatorTilesetLayout):
    deckIds = []
    for i in range(0, layout.count):
        leadingZero = "0" if i< 10 else ""
        deckIds.append(("2%s%s" % (leadingZero, i)))
    
    positionX = (-tableLength/2) + (simulatorComponentPlacement.boxPositionIndexX * tableLength/simulatorComponentPlacement.boxColumnCount*2)
    positionZ = (-tableLength/2) + (simulatorComponentPlacement.boxPositionIndexZ * tableLength/simulatorComponentPlacement.boxRowCount*2)
    return {
      "Name": "DeckCustom",
      "Transform": {
        "posX": positionZ,
        "posY": simulatorComponentPlacement.height,
        "posZ": positionX, 
        "rotX": 0.0,
        "rotY": 0.0,
        "rotZ": 0.0,
        "scaleX": dimensions.width,
        "scaleY": dimensions.thickness,
        "scaleZ": dimensions.height
      },
      "Nickname": name,
      "AltLookAngle": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "GMNotes": "",
      "Description": "",
      "ColorDiffuse": {
        "r": 0.7132782,
        "g": 0.7132782,
        "b": 0.7132782
      },
      "LayoutGroupSortIndex": 0,
      "Value": 0,
      "IgnoreFoW": False,
      "MeasureMovement": False,
      "DragSelectable": True,
      "Tooltip": True,
      "GridProjection": False,
      "HideWhenFaceDown": True,
      "Hands": False,
      "Locked": False,
      "Grid": True,
      "Snap": True,
      "Autoraise": True,
      "Sticky": True,
      "SidewaysCard": False,
      "LuaScript": "",
      "LuaScriptState": "",
      "XmlUI": "",
      "DeckIDs": deckIds,
      "CustomDeck": {
        "2": {
          "FaceURL": imageUrls.face,
          "BackURL": imageUrls.back,
          "NumWidth": layout.columns,
          "NumHeight": layout.rows,
          "BackIsHidden": False,
          "UniqueBack": False,
          "Type": 0
        }
      },
      "GUID": guid
    }

      
      