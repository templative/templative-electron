from ..structs import SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout

tableLength = 7.5

def createDeckObjectState(guid: str, deckPrefix: int, name: str, imageUrls: SimulatorTilesetUrls, simulatorComponentPlacement: SimulatorComponentPlacement, dimensions: SimulatorDimensions, layout: SimulatorTilesetLayout, cardQuantities: list[int], isHexagonal: bool = False):
    
    deckIds = []
    cardIndex = 0
    
    # Create deck IDs based on quantities of each card
    for cardPosition, quantity in enumerate(cardQuantities):
        for _ in range(quantity):
            leadingZero = "0" if cardPosition < 10 else ""
            deckIds.append(int(f"{deckPrefix}{leadingZero}{cardPosition}"))
            cardIndex += 1
    
    positionX = (-tableLength/2) + (simulatorComponentPlacement.boxPositionIndexX * tableLength/simulatorComponentPlacement.boxColumnCount*2)
    positionZ = (-tableLength/2) + (simulatorComponentPlacement.boxPositionIndexZ * tableLength/simulatorComponentPlacement.boxRowCount*2)
    
    print(name, deckPrefix, layout.count)

    transform = {
        "posX": positionX,
        "posY": simulatorComponentPlacement.height,
        "posZ": positionZ, 
        "rotX": 1.46591833E-06,
        "rotY": 180.0,
        "rotZ": 180.0,
        "scaleX": 1.0, #dimensions.width,
        "scaleY": 1.0, #dimensions.thickness,
        "scaleZ": 1.0 #dimensions.height
    }

    containedObjects = []
    objectIndex = 0
    
    # Create contained objects based on quantities of each card
    for cardPosition, quantity in enumerate(cardQuantities):
        for _ in range(quantity):
            leadingZero = "0" if cardPosition < 10 else ""
            cardId = int(f"{deckPrefix}{leadingZero}{cardPosition}")
            containedObjects.append({
                "GUID": f"{guid}_{objectIndex}",
                "Name": "Card",
                "Transform": transform,
                "Nickname": "",
                "Description": "",
                "GMNotes": "",
                "AltLookAngle": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0
                },
                "ColorDiffuse": {
                    "r": 0.713235259,
                    "g": 0.713235259,
                    "b": 0.713235259
                },
                "LayoutGroupSortIndex": 0,
                "Value": 0,
                "Locked": False,
                "Grid": True,
                "Snap": True,
                "IgnoreFoW": False,
                "MeasureMovement": False,
                "DragSelectable": True,
                "Autoraise": True,
                "Sticky": True,
                "Tooltip": True,
                "GridProjection": False,
                "CardID": cardId,
                "SidewaysCard": False,
                "XmlUI": "",
                "HideWhenFaceDown": True,
                "Hands": True,  
                "ContainedObjects": []
            })
            objectIndex += 1
    
    deckState = {
        "Name": "DeckCustom",
        "Transform": transform,
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
        "DeckIDs": deckIds,
        "CustomDeck": {
            deckPrefix: {
                "FaceURL": imageUrls.face,
                "BackURL": imageUrls.back,
                "NumWidth": layout.columns,
                "NumHeight": layout.rows,
                "BackIsHidden": False,
                "UniqueBack": False,
                "Type": 3 if isHexagonal else 0  # 3 for hexagonal components, 0 for regular decks
            }
        },
        "GUID": guid,
        "LuaScript": "",
        "LuaScriptState": "",
        "XmlUI": "",
        "ContainedObjects": containedObjects
    }
    
    return deckState

      
      