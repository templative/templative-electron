import asyncio, os
from templative.lib.distribute.gameCrafter.util import httpOperations
from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO
from templative.lib.manage import instructionsLoader
from templative.lib.distribute.gameCrafter import fileFolderManager

async def createRules(gameCrafterSession, gameRootDirectoryPath, cloudGame, folderId):
    filepath = os.path.join(gameRootDirectoryPath, "rules.pdf")
    if not os.path.exists(filepath):
        print("!!! Rules file does not exist at %s" % filepath)
        return
    print("Uploading %s" % (filepath))
    cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, folderId)
    document = await httpOperations.postDownloadableDocument(gameCrafterSession, cloudGame["id"], cloudFile["id"])

async def createComponents(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolderId, isPublish, isStock, isAsynchronous, isProofed):
    if not outputDirectory:
        raise Exception("outputDirectory cannot be None")

    for directoryPath in next(os.walk(outputDirectory))[1]:
        componentDirectoryPath = "%s/%s" % (outputDirectory, directoryPath)
        try:
            await createComponent(gameCrafterSession, componentDirectoryPath, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed)
        except Exception as e:
            print(f"!!! Error creating component in {componentDirectoryPath}: {str(e)}")

async def createComponent(gameCrafterSession, componentDirectoryPath, cloudGame, cloudGameFolderId, isPublish, isStock, isProofed):
    if not componentDirectoryPath:
        raise Exception("componentDirectoryPath cannot be None")

    try:
        componentFile = await instructionsLoader.loadComponentInstructions(componentDirectoryPath)

        isDebugInfo = False if not "isDebugInfo" in componentFile else componentFile["isDebugInfo"]
        if isDebugInfo and isPublish:
            print("!!! Skipping %s. It is debug only and we are publishing." % (componentFile["name"]))
            return
        
        componentType = componentFile["type"]
        if componentFile["quantity"] == 0:
            print("%s has 0 quantity, skipping." % componentFile["name"])
            return
        
        componentTypeTokens = componentType.split("_")
        isStockComponent = componentTypeTokens[0].upper() == "STOCK" 

        if isStockComponent:
            if not isStock:
                return
            try:
                await createStockPart(gameCrafterSession, componentFile, cloudGame["id"])
            except Exception as e:
                print(f"!!! Error creating stock part {componentFile['name']}: {str(e)}")
            return

        try:
            await createCustomComponent(gameCrafterSession, componentType, componentFile, cloudGame["id"], cloudGameFolderId, isProofed)
        except Exception as e:
            print(f"!!! Error creating custom component {componentFile['name']}: {str(e)}")
            
    except Exception as e:
        print(f"!!! Error processing component in {componentDirectoryPath}: {str(e)}")

async def createCustomComponent(gameCrafterSession, componentType, componentFile, cloudGameId, cloudGameFolderId, isProofed):
    if not componentType in COMPONENT_INFO:
        print("!!! Missing component info for %s." % componentType)
        return
    
    component = COMPONENT_INFO[componentType]
    componentTasks = {        
        "deck": createDeck,
        "twosidedbox": createTwoSidedBox,
        "twosidedsluggedset": createTwoSidedSlugged,
        "tuckbox": createTuckBox,
        "twosidedset": createTwoSided,
        "hookbox": createHookbox,
        "boxface": createBoxface,
        "customcolord6": createCustomPlasticDie,
        "customcolord4": createCustomPlasticDie,
        "customcolord8": createCustomPlasticDie,
        "customwoodd6": createCustomWoodDie,
        "onesidedsluggedset": createOneSidedSlugged,
        "twosidedboxgloss": createTwoSidedBoxGloss,
        "scorepad": createScorePad,
        "onesided": createOneSided,
        "onesidedgloss": createOneSided, #createOneSidedGloss
        "dial": createDial,
        "customprintedmeeple": createCustomPrintedMeeple,
        "boxtop": createBoxTop,
        "boxtopgloss": createBoxTop, #createBoxTopGloss
        # "perfectboundbook": createPerfectBoundBook,
        # "coilbook": createCoilBook,
    }

    if not "GameCrafterUploadTask" in component:
        print("Skipping %s with undefined 'GameCrafterUploadTask'"% componentType)
        return

    if not component["GameCrafterUploadTask"] in componentTasks:
        print("!!! Skipping %s since we don't know how to upload it yet." % componentType)
        return
    
    uploadTask = componentTasks[component["GameCrafterUploadTask"]]
    await uploadTask(gameCrafterSession, componentFile, componentType, cloudGameId, cloudGameFolderId, isProofed)

async def createStockPart(gameCrafterSession, component, cloudGameId):
    componentName = component["name"]
    componentType = component["type"]
    componentTypeTokens = componentType.split("_")
    isStockComponent = componentTypeTokens[0].upper() == "STOCK" 
    if not isStockComponent:
        print("!!! %s is not a stock part!" % componentName)
        return
    stockPartId = componentTypeTokens[1]
    quantity = component["quantity"]

    if not stockPartId in STOCK_COMPONENT_INFO:
        print("!!! Skipping missing stock component %s." % stockPartId)
        return
    stockComponentInfo = STOCK_COMPONENT_INFO[stockPartId]

    if not "GameCrafterGuid" in stockComponentInfo:
        print("!!! Skipping stock part %s with missing GameCrafterGuid." % stockPartId)
        return
    gameCrafterGuid = stockComponentInfo["GameCrafterGuid"]

    await httpOperations.postStockPart(gameCrafterSession, gameCrafterGuid, quantity, cloudGameId)

async def createTwoSided(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]
    backInstructions = component["backInstructions"]
    if not os.path.isfile(backInstructions["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {backInstructions['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, identity))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    
    backImageId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"])
    cloudPokerDeck = await httpOperations.postTwoSidedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed)

    tasks = []
    for instructions in frontInstructions:
        tasks.append(asyncio.create_task(createTwoSidedPiece(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed)))

    res = await asyncio.gather(*tasks, return_exceptions=True)


async def createTwoSidedPiece(gameCrafterSession, instructions, setId, cloudComponentFolderId, isProofed):
    name = instructions["name"]
    filepath = instructions["filepath"]
    quantity = instructions["quantity"]
    if int(quantity) == 0:
        return
    if not os.path.isfile(filepath):
        print(f"!!! Cannot create two sided piece, no file at {filepath}")
        return
    print("Uploading %s" % (filepath))
    cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId)
    twoSided = await httpOperations.postTwoSided(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed)

async def createTwoSidedSlugged(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]
    backInstructions = component["backInstructions"]

    if not os.path.isfile(backInstructions["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {backInstructions['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, identity))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    
    backImageId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"])
    cloudPokerDeck = await httpOperations.postTwoSidedSluggedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed)

    tasks = []
    for instructions in frontInstructions:
        tasks.append(asyncio.create_task(createTwoSidedSluggedPiece(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed)))

    res = await asyncio.gather(*tasks, return_exceptions=True)

async def createTwoSidedSluggedPiece(gameCrafterSession, instructions, setId, cloudComponentFolderId, isProofed):
    name = instructions["name"]
    filepath = instructions["filepath"]
    quantity = instructions["quantity"]
    if int(quantity) == 0:
        return
    if not os.path.isfile(filepath):
        print(f"!!! Cannot create two sided slugged piece, no file at {filepath}")
        raise
    print("Uploading %s" % (filepath))
    cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId)
    twoSidedSlugged = await httpOperations.postTwoSidedSlugged(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed)

async def createTwoSidedBox(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]
    backInstructions = component["backInstructions"]
    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {frontInstructions[0]['filepath']}")
        return
    if not os.path.isfile(backInstructions["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {backInstructions['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    topImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"])
    bottomImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"])

    cloudTwoSidedBox = await httpOperations.postTwoSidedBox(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed)


async def createHookbox(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]  # Outside
    backInstructions = component["backInstructions"]    # Inside

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing outside image {frontInstructions[0]['filepath']}")
        return
    if not os.path.isfile(backInstructions["filepath"]):
        print(f"!!! Cannot create {componentName}, missing inside image {backInstructions['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    outsideImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )
    insideImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        backInstructions["name"], 
        backInstructions["filepath"], 
        cloudComponentFolder["id"]
    )

    cloudHookbox = await httpOperations.postHookBox(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        outsideImageId,
        insideImageId,
        identity,  # This will be something like "JumboHookBox36"
        isProofed
    )


async def createBoxface(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]  # Face image

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing face image {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    faceImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )

    cloudBoxface = await httpOperations.postBoxFace(
        gameCrafterSession,
        componentName,
        cloudGameId, 
        quantity,
        faceImageId,
        identity,  # This will be something like "PokerBooster"
        isProofed
    )


async def createTuckBox(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    imageId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"])
    cloudPokerDeck = await httpOperations.postTuckBox(gameCrafterSession, componentName, identity, quantity, cloudGameId, imageId, isProofed)

async def createDeck(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        print("!!! Deck has no quantity, skipping.")
        return
    frontInstructions = component["frontInstructions"]
    backInstructions = component["backInstructions"]

    if not os.path.isfile(backInstructions["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {backInstructions['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    
    backImageId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"])
    cloudPokerDeck = await httpOperations.postDeck(gameCrafterSession, componentName, identity, quantity, cloudGameId, backImageId, isProofed)

    tasks = []
    for instructions in frontInstructions:
        tasks.append(asyncio.create_task(createDeckCard(gameCrafterSession, instructions, cloudPokerDeck["id"], cloudComponentFolder["id"], isProofed)))

    res = await asyncio.gather(*tasks, return_exceptions=True)

async def createDeckCard(gameCrafterSession, instructions, deckId, cloudComponentFolderId, isProofed):
    name = instructions["name"]
    filepath = instructions["filepath"]
    quantity = instructions["quantity"]
    if int(quantity) == 0:
        return
    if not os.path.isfile(filepath):
        print(f"!!! Cannot create deck card, no file at {filepath}")
        return
    print("Uploading %s" % (filepath))
    cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId)
    pokerCard = await httpOperations.postDeckCard(gameCrafterSession, name, deckId, quantity, cloudFile["id"], isProofed)

async def createCustomPlasticDie(gameCrafterSession, componentInstructionsOutput, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = componentInstructionsOutput["name"]
    quantity = componentInstructionsOutput["quantity"]
    if int(quantity) == 0:
        return
    dieFaceFilepaths = componentInstructionsOutput["dieFaceFilepaths"]

    for dieFaceFilepath in dieFaceFilepaths:
        if not os.path.isfile(dieFaceFilepath):
            print(f"!!! Cannot create {componentName}, missing {dieFaceFilepath}")
            return
    print("Uploading %s %s %s(s)" % (quantity, componentName, identity))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    imageFileIds = []
    for dieFaceFilepath in dieFaceFilepaths:
        fileId = await fileFolderManager.createFileInFolder(gameCrafterSession, os.path.basename(dieFaceFilepath), dieFaceFilepath, cloudComponentFolder["id"])
        imageFileIds.append(fileId)
    
    dieCreationFunctions = {
        "4": httpOperations.postCustomD4,
        "6": httpOperations.postCustomD6,
        "8": httpOperations.postCustomD8,
    }
    
    if not str(len(dieFaceFilepaths)) in dieCreationFunctions:
        raise Exception("Cannot create %s sided die for %s." % (len(dieFaceFilepaths), componentName))
    
    dieCreationFunction = dieCreationFunctions[str(len(dieFaceFilepaths))]
    await dieCreationFunction(gameCrafterSession,componentName, cloudGameId, quantity, "white", imageFileIds, isProofed)

async def createOneSidedSlugged(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]
    
    print("Uploading %s %s %s(s)" % (quantity, componentName, identity))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    cloudOneSidedSluggedSet = await httpOperations.postOneSidedSluggedSet(gameCrafterSession, componentName, identity, quantity, cloudGameId, isProofed)

    tasks = []
    for instructions in frontInstructions:
        tasks.append(asyncio.create_task(createOneSidedSluggedPiece(gameCrafterSession, instructions, cloudOneSidedSluggedSet["id"], cloudComponentFolder["id"], isProofed)))

    res = await asyncio.gather(*tasks, return_exceptions=True)

async def createOneSidedSluggedPiece(gameCrafterSession, instructions, setId, cloudComponentFolderId, isProofed):
    name = instructions["name"]
    filepath = instructions["filepath"]
    quantity = instructions["quantity"]
    if int(quantity) == 0:
        return
    if not os.path.isfile(filepath):
        print(f"!!! Cannot create one sided slugged piece, no file at {filepath}")
        return
    print("Uploading %s" % (filepath))
    cloudFile = await fileFolderManager.postFile(gameCrafterSession, filepath, cloudComponentFolderId)
    oneSidedSlugged = await httpOperations.postOneSidedSlugged(gameCrafterSession, name, setId, quantity, cloudFile["id"], isProofed)

async def createCustomWoodDie(gameCrafterSession, componentInstructionsOutput, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = componentInstructionsOutput["name"]
    quantity = componentInstructionsOutput["quantity"]
    if int(quantity) == 0:
        return
    dieFaceFilepaths = componentInstructionsOutput["dieFaceFilepaths"]

    for dieFaceFilepath in dieFaceFilepaths:
        if not os.path.isfile(dieFaceFilepath):
            print(f"!!! Cannot create {componentName}, missing {dieFaceFilepath}")
            return
    print("Uploading %s %s %s(s)" % (quantity, componentName, identity))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    imageFileIds = []
    for dieFaceFilepath in dieFaceFilepaths:
        fileId = await fileFolderManager.createFileInFolder(gameCrafterSession, os.path.basename(dieFaceFilepath), dieFaceFilepath, cloudComponentFolder["id"])
        imageFileIds.append(fileId)
    
    await httpOperations.postCustomWoodD6(gameCrafterSession, componentName, cloudGameId, quantity, imageFileIds, isProofed)

async def createTwoSidedBoxGloss(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]
    backInstructions = component["backInstructions"]

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {frontInstructions[0]['filepath']}")
        return
    if not os.path.isfile(backInstructions["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {backInstructions['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)

    topImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"])
    bottomImageFileId = await fileFolderManager.createFileInFolder(gameCrafterSession, backInstructions["name"], backInstructions["filepath"], cloudComponentFolder["id"])

    cloudTwoSidedBoxGloss = await httpOperations.postTwoSidedBoxGloss(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed)

async def createScorePad(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    imageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )
    
    pageCount = component.get("pageCount", 40)
    
    cloudScorePad = await httpOperations.postScorePad(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        imageId,
        pageCount,
        identity,
        isProofed
    )

async def createOneSided(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    imageId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"])
    
    cloudOneSided = await httpOperations.postOneSided(
        gameCrafterSession, 
        componentName, 
        cloudGameId, 
        quantity, 
        imageId,
        identity,  # This will be something like "MediumGameMat"
        isProofed
    )

async def createOneSidedGloss(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]
    spotGlossInstructions = component.get("spotGlossInstructions", None)

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    imageId = await fileFolderManager.createFileInFolder(gameCrafterSession, frontInstructions[0]["name"], frontInstructions[0]["filepath"], cloudComponentFolder["id"])
    
    spotGlossId = None
    if spotGlossInstructions and os.path.isfile(spotGlossInstructions["filepath"]):
        spotGlossId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            spotGlossInstructions["name"], 
            spotGlossInstructions["filepath"], 
            cloudComponentFolder["id"]
        )
    
    cloudOneSidedGloss = await httpOperations.postOneSidedGloss(
        gameCrafterSession, 
        componentName, 
        cloudGameId, 
        quantity, 
        imageId,
        identity,  # This will be something like "QuadFoldBoard"
        isProofed,
        spotGlossId
    )

async def createDial(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]  # Outside image

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing outside image {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    outsideImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )
    
    cloudDial = await httpOperations.postDial(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        outsideImageId,
        identity,  # This will be something like "SmallDial"
        isProofed
    )

async def createCustomPrintedMeeple(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]  # Side 1
    backInstructions = component.get("backInstructions", None)  # Side 2 (optional)
    diecolor = component.get("diecolor", "white")  # Optional color specification

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing side 1 image {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    # Upload side 1 image
    side1ImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )
    
    # Upload side 2 image if provided
    side2ImageId = None
    if backInstructions and os.path.isfile(backInstructions["filepath"]):
        side2ImageId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            backInstructions["name"], 
            backInstructions["filepath"], 
            cloudComponentFolder["id"]
        )
    
    cloudMeeple = await httpOperations.postCustomPrintedMeeple(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        side1ImageId,
        side2ImageId,
        diecolor,
        isProofed
    )

async def createBoxTop(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]  # Top image

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing top image {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    topImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )
    
    cloudBoxTop = await httpOperations.postBoxTop(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        topImageId,
        identity,  # This will be something like "DeckBoxTopAndSide"
        isProofed
    )

async def createBoxTopGloss(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    frontInstructions = component["frontInstructions"]  # Top image
    spotGlossInstructions = component.get("spotGlossInstructions", None)

    if not os.path.isfile(frontInstructions[0]["filepath"]):
        print(f"!!! Cannot create {componentName}, missing top image {frontInstructions[0]['filepath']}")
        return
    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    topImageId = await fileFolderManager.createFileInFolder(
        gameCrafterSession, 
        frontInstructions[0]["name"], 
        frontInstructions[0]["filepath"], 
        cloudComponentFolder["id"]
    )
    
    spotGlossId = None
    if spotGlossInstructions and os.path.isfile(spotGlossInstructions["filepath"]):
        spotGlossId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            spotGlossInstructions["name"], 
            spotGlossInstructions["filepath"], 
            cloudComponentFolder["id"]
        )
    
    cloudBoxTopGloss = await httpOperations.postBoxTopGloss(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        topImageId,
        identity,  # This will be something like "LargeStoutBoxTopAndSide"
        isProofed,
        spotGlossId
    )

async def createPerfectBoundBook(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    pageInstructions = component["pageInstructions"]  # List of page images
    spineInstructions = component.get("spineInstructions", None)  # Optional spine image

    if not pageInstructions:
        print(f"!!! Cannot create {componentName}, no pages specified")
        return

    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    # Upload spine image if provided
    spineImageId = None
    if spineInstructions and os.path.isfile(spineInstructions["filepath"]):
        spineImageId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            spineInstructions["name"], 
            spineInstructions["filepath"], 
            cloudComponentFolder["id"]
        )
    
    # Create the book
    cloudBook = await httpOperations.postPerfectBoundBook(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        identity,  # This will be something like "DigestPerfectBoundBook"
        len(pageInstructions),
        spineImageId,
        isProofed
    )
    
    # Upload and create each page
    for i, pageInstruction in enumerate(pageInstructions, 1):  # Start counting at 1
        if not os.path.isfile(pageInstruction["filepath"]):
            print(f"!!! Cannot create page {i}, missing image {pageInstruction['filepath']}")
            continue
            
        pageImageId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            pageInstruction["name"], 
            pageInstruction["filepath"], 
            cloudComponentFolder["id"]
        )
        
        await httpOperations.postPerfectBoundBookPage(
            gameCrafterSession,
            f"{componentName} Page {i}",
            cloudBook["id"],
            i,  # sequence_number
            pageImageId,
            isProofed
        )

async def createCoilBook(gameCrafterSession, component, identity, cloudGameId, cloudGameFolderId, isProofed):
    componentName = component["name"]
    quantity = component["quantity"]
    if int(quantity) == 0:
        return
    pageInstructions = component["pageInstructions"]  # List of page images

    if not pageInstructions:
        print(f"!!! Cannot create {componentName}, no pages specified")
        return

    print("Uploading %s %s %s(s)" % (quantity, componentName, component["type"]))

    cloudComponentFolder = await httpOperations.postFolder(gameCrafterSession, componentName, cloudGameFolderId)
    
    # Create the book
    cloudBook = await httpOperations.postCoilBook(
        gameCrafterSession,
        componentName, 
        cloudGameId, 
        quantity,
        identity,  # This will be something like "JumboCoilBook"
        len(pageInstructions),
        isProofed
    )
    
    # Upload and create each page
    for i, pageInstruction in enumerate(pageInstructions, 1):  # Start counting at 1
        if not os.path.isfile(pageInstruction["filepath"]):
            print(f"!!! Cannot create page {i}, missing image {pageInstruction['filepath']}")
            continue
            
        pageImageId = await fileFolderManager.createFileInFolder(
            gameCrafterSession, 
            pageInstruction["name"], 
            pageInstruction["filepath"], 
            cloudComponentFolder["id"]
        )
        
        await httpOperations.postCoilBookPage(
            gameCrafterSession,
            f"{componentName} Page {i}",
            cloudBook["id"],
            i,  # sequence_number
            pageImageId,
            isProofed
        )