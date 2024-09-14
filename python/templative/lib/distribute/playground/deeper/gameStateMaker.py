import math, uuid, os, json, random
from templative.lib.distribute.playground.playgroundTemplates import table, gameState, deck, cardHolder, board, stockModel, savedStockModel

playerColors = []
for i in range(20):
    playerColors.append({"r": str(random.random()*255), "g": str(random.random()*255), "b": str(random.random()*255)})


def createGameState(name, playerCount):
    slotTeams = [  ]
    slotIds = []
    for p in range(playerCount):
        slotTeams.append(p+1)
        slotIds.append(str(uuid.uuid4()))

    return gameState.createGameState(name, slotTeams, slotIds)

def getQuaternionFromEuler(roll, pitch, yaw):
  qx = math.sin(roll/2) * math.cos(pitch/2) * math.cos(yaw/2) - math.cos(roll/2) * math.sin(pitch/2) * math.sin(yaw/2)
  qy = math.cos(roll/2) * math.sin(pitch/2) * math.cos(yaw/2) + math.sin(roll/2) * math.cos(pitch/2) * math.sin(yaw/2)
  qz = math.cos(roll/2) * math.cos(pitch/2) * math.sin(yaw/2) - math.sin(roll/2) * math.sin(pitch/2) * math.cos(yaw/2)
  qw = math.cos(roll/2) * math.cos(pitch/2) * math.cos(yaw/2) + math.sin(roll/2) * math.sin(pitch/2) * math.sin(yaw/2)
 
  return [qx, qy, qz, qw]

def createCardHolder(playerIndex, totalPlayerCount):
    ownerColor = {
        "r": (playerIndex / totalPlayerCount) * 255, 
        "g": 50, 
        "b": 50, 
        "a": 255
    }

    distanceFromCenter = 120 + (max(0, totalPlayerCount - 2) * 30)
    
    angle = (playerIndex / totalPlayerCount) * math.pi * 2 + (1/180)

    locationX = math.cos(angle) * distanceFromCenter
    locationY = math.sin(angle) * distanceFromCenter

    zRotation = angle - math.pi
    rotationQuaternion = getQuaternionFromEuler(0, 0, zRotation)
    # distanceFromOrigin = math.sqrt(locationX**2 + locationY**2)
    # print(f"Player {playerIndex}: LocationX = {locationX}, LocationY = {locationY}, Distance from (0, 0) = {distanceFromOrigin}")

    return cardHolder.createCardHolder(playerIndex, ownerColor, locationX, locationY, rotationQuaternion)


def createPokerDeck(name, componentTemplateGuid, ownerIndex, translation, totalPieceQuantity):
    stackSerialization = []
    for q in range(totalPieceQuantity-1):
        piece = {
            "index": q+1,
            "templateId": componentTemplateGuid,
            "frontTextureOverride": "",
            "flipped": False
        }
        stackSerialization.append(piece)
    return deck.createDeck(name, componentTemplateGuid, ownerIndex, translation, stackSerialization)

def createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions):
    return board.createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions)

def createGameObjects(components, totalPlayerCount):
    gameObjects = [
        # table.createTable()
    ]

    for p in range(totalPlayerCount):
        gameObjects.append(createCardHolder(p, totalPlayerCount))

    xTranslationEachComponent = 30  
    yTranslationEachComponent = 30  
    noOwnerConstant = -1
    
    totalComponents = len([c for c in components if c is not None])  
    columns = math.ceil(math.sqrt(totalComponents))  
    rows = math.ceil(totalComponents / columns)  
    halfWidth = (columns * xTranslationEachComponent) / 2
    halfHeight = (rows * yTranslationEachComponent) / 2
    skippedGameStateComponents = []
    for c, component in enumerate(components):
        if component is None:
            continue

        row = c // columns
        column = c % columns

        newXPosition = (column * xTranslationEachComponent) - halfWidth
        newYPosition = (row * yTranslationEachComponent) - halfHeight

        gameObjectTranslation = {"x": newXPosition, "y": newYPosition, "z": 5}
        
        if "Indices" in component:
            totalPieceQuantity = len(component["Indices"])
        elif "Quantity" in component:
            totalPieceQuantity = component["Quantity"]
        else: 
            skippedGameStateComponents.append(component["Name"])
            continue
        if component["Type"] == "Card":
            for i in range(component["Quantity"]):
                gameObjectTranslation["z"] = 5 + (i * 15)
                gameObject = createPokerDeck(component["Name"], component["GUID"], noOwnerConstant, gameObjectTranslation, totalPieceQuantity)
                gameObjects.append(gameObject)
        else: 
            # for i in range(totalPieceQuantity):
                # gameObjectTranslation["z"] = 5 + (i * 15)
            gameObject = savedStockModel.createSavedStockModel(component, noOwnerConstant, gameObjectTranslation)
            gameObjects.append(gameObject)

    if len(skippedGameStateComponents) > 0: 
        print("Skipping components for missing indices:", skippedGameStateComponents)

    return gameObjects 

def choosePackages(gameName, packageGuid):
    return [
        {
            "name": gameName,
            "guid": packageGuid
        },
        { "name": "Cards", "guid": "8F8543D040D1C361098594A763847262" },
        { "name": "General", "guid": "D74C7D5D6745CD565913DAA5FB3E9C93" }
    ]

def createRoomForPlayerCount(totalPlayerCount):
    storedCameraSetups = []
    playerCameraSetups = []
    playerSlotNames = []
    customPlayerColors = []
    for p in range(totalPlayerCount):
        locationX = math.cos(p/totalPlayerCount*math.pi*2) * 100
        locationY = math.sin(p/totalPlayerCount*math.pi*2) * 100
        controlRotationYaw = (p * 360 / totalPlayerCount)-180

        storedCameraSetups.append({
            "location": { "x": locationX, "y": locationY, "z": 120 },
            "controlRotation": { "pitch": 330, "yaw": 0, "roll": 0 },
            "pawnRotation": { "x": 0, "y": 0, "z": 0, "w": 0 },
            "playerScale": 1, "flying": True
        })
        playerCameraSetups.append({
            "location": { "x": 0, "y": 0, "z": 90 },
            "controlRotation": { "pitch": 330, "yaw": controlRotationYaw, "roll": 0 },
            "pawnRotation": { "x": 0, "y": 0, "z": 0, "w": 0 },
            "playerScale": 1, "flying": True
        })
        playerSlotNames.append(str(p+1))
        customPlayerColors.append(playerColors[p])

    return {
        "storedCameraSetups": storedCameraSetups,
        "playerCameraSetups": playerCameraSetups,
        "playerSlotNames": playerSlotNames,
        "customPlayerColors": customPlayerColors
    }

async def createGameStateVts(gameName, packageGuid, components, totalPlayerCount, packageDirectoryPath):
    state = {
        "lighting": {
            "intensity": 1, "specular": 1, "altitude": 90, "azimuth": 0, "color": { "r": 255, "g": 255, "b": 255 }
        },

        "grid": {
            "type": 0, "snapType": 0, 
            "visibility": 0, "thickLines": False, "color": { "r": 0, "g": 0, "b": 0, "a": 179 },
            "offset": { "x": 0, "y": 0 }, "rotation": 0, "size": { "x": 5.0799999237060547, "y": 5.0799999237060547 },
        },
        "saveStateVersion": "1.0", "zones": [], "labels": []
    }
    state["gameState"] = createGameState(gameName, totalPlayerCount)
    state["requiredPackages"] = choosePackages(gameName, packageGuid)
    state["objects"] = createGameObjects(components, totalPlayerCount)

    roomData = createRoomForPlayerCount(totalPlayerCount)
    state["storedCameraSetups"] = roomData["storedCameraSetups"]
    state["playerCameraSetups"] = roomData["playerCameraSetups"]
    state["playerSlotNames"] = roomData["playerSlotNames"]
    state["customPlayerColors"] = roomData["customPlayerColors"]

    templateDirectory = os.path.join(packageDirectoryPath, "States")
    templateFilepath = os.path.join(templateDirectory, "%s.vts" % gameName)
    with open(templateFilepath, "w") as gameStateVtsFile:
        json.dump(state, gameStateVtsFile, indent=2)

    return state
