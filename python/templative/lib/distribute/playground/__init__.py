from os import path, walk
from json import load
from .deeper.templateMaker import createBoard, createDeck, createStock
from .deeper.gameStateMaker import createGameStateVts
from .deeper.packageFileManagement import createPackageDirectories, createManifest

from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO

async def convertToTabletopPlayground(producedDirectoryPath, playgroundPackagesDirectory):
    uniqueGameName = path.basename(producedDirectoryPath)
    packageDirectoryPath = await createPackageDirectories(uniqueGameName, playgroundPackagesDirectory)
    packageGuid = await createManifest(uniqueGameName, packageDirectoryPath)
    components = await copyComponentsToPackage(producedDirectoryPath, packageDirectoryPath)
    defaultPlayerCount = 8
    await createGameStateVts(uniqueGameName, packageGuid, components, defaultPlayerCount, packageDirectoryPath)
    return 1

async def copyComponentsToPackage(producedDirectoryPath, packageDirectoryPath):
    templates = []
    for directoryPath in next(walk(producedDirectoryPath))[1]:
        componentDirectoryPath = "%s/%s" % (producedDirectoryPath, directoryPath)
        templateJson = await copyComponentToPackage(componentDirectoryPath, packageDirectoryPath)
        if templateJson == None:
            continue
        templates.append(templateJson)
    return templates

async def copyComponentToPackage(componentDirectoryPath, packageDirectoryPath):
    componentInstructions = None
    componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json")
    with open(componentInstructionsFilepath, "r") as componentInstructionsFile:
        componentInstructions = load(componentInstructionsFile)
    
    supportedInstructionTypes = {
        "DECK": createDeck,
        "BOARD": createDeck # createBoard
    }
    componentType = componentInstructions["type"]
    componentTypeTokens = componentType.split("_")
    isStockComponent = componentTypeTokens[0].upper() == "STOCK" 
    if isStockComponent:
        if not componentTypeTokens[1] in STOCK_COMPONENT_INFO:
            print("Missing stock info for %s." % componentTypeTokens[1])
            return None
        stockComponentInfo = STOCK_COMPONENT_INFO[componentTypeTokens[1]]
        if not "PlaygroundModelFile" in stockComponentInfo:
            print("Skipping %s as it doesn't have a PlaygroundModelFile." % componentTypeTokens[1])
            return None
        return await createStock(packageDirectoryPath, componentInstructions, stockComponentInfo)

    if componentType not in COMPONENT_INFO:
        print("Missing component info for %s." % componentType)
        return None
    componentTypeInfo = COMPONENT_INFO[componentType]

    if "PlaygroundCreationTask" not in componentTypeInfo:
        print("Skipping %s that has no PlaygroundCreationTask." % componentType)
        return None
    playgroundTask = componentTypeInfo["PlaygroundCreationTask"]

    totalCount = 0
    for instruction in componentInstructions["frontInstructions"]:
        totalCount += instruction["quantity"]

    if totalCount == 0:
        print(f"Skipping {componentInstructions['name']} that has 0 total pieces.")
        return None
    
    if playgroundTask not in supportedInstructionTypes:
        print("Skipping unsupported %s." % playgroundTask)
        return None
    instruction = supportedInstructionTypes[playgroundTask]

    if "DimensionsPixels" not in componentTypeInfo or "PlaygroundThickness" not in componentTypeInfo:
        print(f"Skipping {componentType} with undefined size.")
        return None
    
    return await instruction(packageDirectoryPath, componentInstructions, componentTypeInfo)
    