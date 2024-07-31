import os
from os import path
import sys
import asyncio
import glob
import aiofiles.os
import asyncio

from . import outputWriter, rulesMarkdownProcessor
from templative.lib.manage import defineLoader
from datetime import datetime
from templative.lib.produce import customComponents

from templative.lib.manage.models.produceProperties import ProduceProperties, PreviewProperties
from templative.lib.manage.models.gamedata import GameData
from templative.lib.manage.models.composition import ComponentComposition

def getPreviewsPath():
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = path.abspath(".")

    previewsPath = path.join(base_path, "previews")
    if not os.path.exists(previewsPath):
        os.makedirs(previewsPath)
    return previewsPath

async def deleteFile(file):
    try:
        await aiofiles.os.remove(file)
    except Exception as e:
        print(f"Error deleting {file}: {e}")

async def clearPreviews(directoryPath):
    files = glob.glob(os.path.join(directoryPath, '*'))
    await asyncio.gather(*[deleteFile(file) for file in files])

async def producePiecePreview(gameRootDirectoryPath, componentName, pieceName, langauge):
    if not gameRootDirectoryPath:
        raise Exception("Game root directory path is invalid.")
    gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath)
    gameDataBlob = await defineLoader.loadGame(gameRootDirectoryPath)
    studioDataBlob = await defineLoader.loadStudio(gameRootDirectoryPath)
    componentsCompose = await defineLoader.loadComponentCompose(gameRootDirectoryPath)
    component = None
    for componentCompose in componentsCompose:
        isMatchingComponentFilter = componentCompose["name"] == componentName
        if not isMatchingComponentFilter:
            continue
        component = componentCompose
    componentComposition = ComponentComposition(gameCompose, component)
    gameData = GameData(studioDataBlob, gameDataBlob)
    outputDirectoryPath = getPreviewsPath()
    await clearPreviews(outputDirectoryPath)
    previewProperties = PreviewProperties(gameRootDirectoryPath, outputDirectoryPath, pieceName, langauge)
    await customComponents.produceCustomComponentPreview(previewProperties, gameData, componentComposition)
        
async def produceGame(gameRootDirectoryPath, componentFilter, isSimple, isPublish, targetLanguage):
    if not gameRootDirectoryPath:
        raise Exception("Game root directory path is invalid.")

    gameDataBlob = await defineLoader.loadGame(gameRootDirectoryPath)

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    uniqueGameName = ("%s_%s_%s" % (gameDataBlob["name"], gameDataBlob["version"], timestamp)).replace(" ", "")
    if (componentFilter != None):
        uniqueGameName = "%s_%s" % (uniqueGameName, componentFilter)
        gameDataBlob["componentFilter"] = componentFilter
    gameDataBlob["timestamp"] = timestamp

    gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath)

    outputDirectoryPath = await outputWriter.createGameFolder(gameRootDirectoryPath, gameCompose["outputDirectory"], uniqueGameName)
    await outputWriter.updateLastOutputFolder(gameRootDirectoryPath, gameCompose["outputDirectory"], outputDirectoryPath)
    print("Producing %s" % os.path.normpath(outputDirectoryPath))

    tasks = []
    tasks.append(asyncio.create_task(outputWriter.copyGameFromGameFolderToOutput(gameDataBlob, outputDirectoryPath)))

    studioDataBlob = await defineLoader.loadStudio(gameRootDirectoryPath)
    tasks.append(asyncio.create_task(outputWriter.copyStudioFromGameFolderToOutput(studioDataBlob, outputDirectoryPath)))

    componentsCompose = await defineLoader.loadComponentCompose(gameRootDirectoryPath)

    gameData = GameData(studioDataBlob, gameDataBlob)
    produceProperties = ProduceProperties(gameRootDirectoryPath, outputDirectoryPath, isPublish, isSimple, targetLanguage)

    for componentCompose in componentsCompose:
        isProducingOneComponent = componentFilter != None
        isMatchingComponentFilter = isProducingOneComponent and componentCompose["name"] == componentFilter
        if not isMatchingComponentFilter and componentCompose["disabled"]:
            if not isProducingOneComponent:
                print("Skipping disabled %s component." % (componentCompose["name"]))
            continue

        isDebugInfo = False if not "isDebugInfo" in componentCompose else componentCompose["isDebugInfo"]
        if isDebugInfo and isPublish:
            print("Skipping debug only %s component as we are publishing." % (componentCompose["name"]))
            continue

        if isProducingOneComponent and not isMatchingComponentFilter:
            continue

        componentComposition = ComponentComposition(gameCompose, componentCompose)

        tasks.append(asyncio.create_task(produceGameComponent(produceProperties, gameData, componentComposition)))

    rules = await defineLoader.loadRules(gameRootDirectoryPath)
    tasks.append(asyncio.create_task(rulesMarkdownProcessor.produceRulebook(rules, outputDirectoryPath)))

    await asyncio.gather(*tasks)

    print("Done producing %s" % os.path.normpath(outputDirectoryPath))

    return outputDirectoryPath

async def produceGameComponent(produceProperties: ProduceProperties, gamedata:GameData, componentComposition:ComponentComposition) -> None:

    componentType = componentComposition.componentCompose["type"]
    componentTypeTokens = componentType.split("_")
    isStockComponent = componentTypeTokens[0].upper() == "STOCK"

    if isStockComponent:
        await produceStockComponent(componentComposition.componentCompose, produceProperties.outputDirectoryPath)
        return

    await customComponents.produceCustomComponent(produceProperties, gamedata, componentComposition)

async def produceStockComponent(componentCompose, outputDirectory):
    componentName = componentCompose["name"]

    print("Outputing stock parts for %s component." % (componentName))

    componentDirectory = await outputWriter.createComponentFolder(componentName, outputDirectory)

    stockPartInstructions = {
        "name": componentCompose["name"],
        "quantity": componentCompose["quantity"],
        "type": componentCompose["type"]
    }

    componentInstructionFilepath = os.path.join(componentDirectory, "component.json")
    await outputWriter.dumpInstructions(componentInstructionFilepath, stockPartInstructions)