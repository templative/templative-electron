from ..structs import SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout
from hashlib import md5

tableLength = 7.5

shrinkFactor = 0.75

def createDeckObjectState(guid: str, deckPrefix: int, name: str, imageUrls: SimulatorTilesetUrls, simulatorComponentPlacement: SimulatorComponentPlacement, dimensions: SimulatorDimensions, layout: SimulatorTilesetLayout, cardQuantities: list[int], deckType: int = 0):
    
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

    transform = {
        "posX": positionX,
        "posY": simulatorComponentPlacement.height,
        "posZ": positionZ, 
        "rotX": 1.46591833E-06,
        "rotY": 180.0,
        "rotZ": 180.0,
        "scaleX": dimensions.width * shrinkFactor,
        "scaleY": dimensions.thickness,
        "scaleZ": dimensions.height * shrinkFactor
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
            int(deckPrefix): {
                "FaceURL": imageUrls.face,
                "BackURL": imageUrls.back,
                "NumWidth": layout.columns,
                "NumHeight": layout.rows,
                "BackIsHidden": False,
                "UniqueBack": False,
                "Type": deckType
            }
        },
        "GUID": guid,
        "LuaScript": "",
        "LuaScriptState": "",
        "XmlUI": "",
        "ContainedObjects": containedObjects
    }
    
    return deckState

def createCardObjectState(guid: str, cardPrefix: int, name: str, imageUrls: SimulatorTilesetUrls, simulatorComponentPlacement: SimulatorComponentPlacement, dimensions: SimulatorDimensions, deckType: int = 0):
    positionX = (-tableLength/2) + (simulatorComponentPlacement.boxPositionIndexX * tableLength/simulatorComponentPlacement.boxColumnCount*2)
    positionZ = (-tableLength/2) + (simulatorComponentPlacement.boxPositionIndexZ * tableLength/simulatorComponentPlacement.boxRowCount*2)
    transform = {
        "posX": positionX,
        "posY": simulatorComponentPlacement.height,
        "posZ": positionZ,
        "rotX": 1.46591833E-06,
        "rotY": 180.0,
        "rotZ": 180.0,
        "scaleX": dimensions.width,
        "scaleY": dimensions.thickness,
        "scaleZ": dimensions.height
    }
    
    return {
        "Name": "CardCustom",
        "Transform": transform,
        "Nickname": name,
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
        "HideWhenFaceDown": True,
        "Hands": True,
        "CardID": int(f"{cardPrefix}00"),
        "SidewaysCard": False,
        "CustomDeck": {
            cardPrefix: {
                "FaceURL": imageUrls.face,
                "BackURL": imageUrls.back,
                "NumWidth": 1,
                "NumHeight": 1,
                "BackIsHidden": False,
                "UniqueBack": False,
                "Type": deckType
            }
        },
        "XmlUI": "",
        "GUID": guid,
        "States": {},
        "ContainedObjects": [],
        "LuaScript": "",
        "LuaScriptState": ""
    }

      
def createComponentLibraryChest(componentStates, name="ComponentLibrary", isInfinite=False, colorDiffuse=None):
    return {
        "Name": "Infinite_Bag" if isInfinite else "Bag",
        "Transform": {
            "posX": 0,
            "posY": 3,
            "posZ": -20,
            "rotX": 0,
            "rotY": 180,
            "rotZ": 0,
            "scaleX": 1,
            "scaleY": 1,
            "scaleZ": 1
        },
        "Nickname": name,
        "Description": "Contains all game components for respawning",
        "GMNotes": "",
        "ColorDiffuse": colorDiffuse if colorDiffuse else {
            "r": 0.7132782,
            "g": 0.7132782,
            "b": 0.7132782
        },
        "Locked": True,
        "Grid": True,
        "Snap": True,
        "IgnoreFoW": False,
        "MeasureMovement": False,
        "DragSelectable": True,
        "Autoraise": True,
        "Sticky": True,
        "Tooltip": True,
        "GridProjection": False,
        "HideWhenFaceDown": False,
        "Hands": False,
        "ContainedObjects": componentStates,
        "GUID": "chest" + md5(name.encode()).hexdigest()[:6],
    }

def createStockDie(name: str, sizeInches: float, color: dict):
    """Creates a TTS die object with specified size and color"""
    guid = md5(name.encode()).hexdigest()[:6]
    colorDiffuse = {
        "r": color["r"] / 255.0,
        "g": color["g"] / 255.0,
        "b": color["b"] / 255.0
    }
    die = {
        "Name": "Die_6",
        "Transform": {
            "posX": 0,
            "posY": 2,
            "posZ": 0,
            "rotX": 0,
            "rotY": 0,
            "rotZ": 0,
            "scaleX": sizeInches,
            "scaleY": sizeInches,
            "scaleZ": sizeInches
        },
        "Nickname": name,
        "Description": "",
        "ColorDiffuse": colorDiffuse,
        "DieType": 0,  # Regular D6
        "MaterialIndex": -1,
        "MaterialType": 0,
        "HideWhenFaceDown": False,
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
        "Hands": True,
        "GUID": guid
    }
    return createComponentLibraryChest([die], f"{name} Bag",True, colorDiffuse)

def createStockCube(name: str, sizeInches: float, color: dict):
    """Creates a TTS cube object with specified size and color"""
    guid = md5(name.encode()).hexdigest()[:6]
    colorDiffuse = {
        "r": color["r"] / 255.0,
        "g": color["g"] / 255.0,
        "b": color["b"] / 255.0
    }
    cube = {
        "Name": "BlockSquare",
        "Transform": {
            "posX": 0,
            "posY": 2,
            "posZ": 0,
            "rotX": 0,
            "rotY": 0,
            "rotZ": 0,
            "scaleX": sizeInches,
            "scaleY": sizeInches,
            "scaleZ": sizeInches
        },
        "Nickname": name,
        "Description": "",
        "ColorDiffuse": colorDiffuse,
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
        "HideWhenFaceDown": False,
        "Hands": True,
        "GUID": guid
    }
    return createComponentLibraryChest([cube], f"{name} Bag", True, colorDiffuse)