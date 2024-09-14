from os import path
from json import dump
from hashlib import md5
from .packageFileManagement import copyFrontImageToTextures, copyBackImageToTextures
from .playgroundTextureMaker import createCompositeImageInTextures
from templative.lib.distribute.playground.playgroundTemplates import board, card, stockModel
from templative.lib.componentInfo import COMPONENT_INFO
gameCrafterScaleToPlaygroundScale = 0.014

async def createBoard(packageDirectoryPath, componentInstructions, componentTypeInfo):
    textureDirectory = path.join(packageDirectoryPath, "Textures")
    await copyFrontImageToTextures(componentInstructions["name"], componentInstructions["frontInstructions"][0], textureDirectory)
    await copyBackImageToTextures(componentInstructions["name"], componentInstructions["backInstructions"], textureDirectory)

    componentGuid = md5(componentInstructions["name"].encode()).hexdigest()
    templateDirectory = path.join(packageDirectoryPath, "Templates")
    return await createBoardTemplateFile(templateDirectory, componentGuid, componentInstructions["name"], componentTypeInfo, componentInstructions["quantity"])

async def createBoardTemplateFile(templateDirectoryPath, guid, name, componentTypeInfo, quantity):
    frontTextureName = "%s-front.jpeg" % name
    backTextureName = "%s-back.jpeg" % name
    cardTemplateData = createBoardTemplateData(guid, name, componentTypeInfo, quantity, frontTextureName, backTextureName)
    templateFilepath = path.join(templateDirectoryPath, "%s.json" % guid)
    with open(templateFilepath, "w") as templateFile:
        dump(cardTemplateData, templateFile, indent=2)
    return cardTemplateData

def createBoardTemplateData(guid, name, componentTypeInfo, quantity, frontTextureName, backTextureName):    
    scaleDown = gameCrafterScaleToPlaygroundScale / 53 * 1.5
    dimensions = (
        componentTypeInfo["DimensionsPixels"][0] * scaleDown,
        componentTypeInfo["DimensionsPixels"][1] * scaleDown
    )
        
    return board.createBoard(guid, name, quantity, frontTextureName, backTextureName, dimensions)

async def createDeck(packageDirectoryPath, componentInstructions, componentTypeInfo):
    textureDirectory = path.join(packageDirectoryPath, "Textures")
    totalCount, cardColumnCount, cardRowCount = await createCompositeImageInTextures(componentInstructions["name"], componentTypeInfo, componentInstructions["frontInstructions"], textureDirectory)
    await copyBackImageToTextures(componentInstructions["name"], componentInstructions["backInstructions"], textureDirectory)
    componentGuid = md5(componentInstructions["name"].encode()).hexdigest()
    templateDirectory = path.join(packageDirectoryPath, "Templates")
    return await createCardTemplateFile(templateDirectory, componentGuid, componentInstructions["name"], componentTypeInfo, componentInstructions["quantity"], totalCount, cardColumnCount, cardRowCount)

async def createCardTemplateFile(templateDirectoryPath, guid, name, componentTypeInfo, componentQuantity, totalCount, cardColumnCount, cardRowCount):
    frontTextureName = "%s-front.jpeg" % name
    backTextureName = "%s-back.jpeg" % name
    cardTemplateData = createCardTemplateData(guid, name, componentTypeInfo, frontTextureName, componentQuantity, totalCount, cardColumnCount, cardRowCount, backTextureName)
    templateFilepath = path.join(templateDirectoryPath, "%s.json" % guid)
    with open(templateFilepath, "w") as templateFile:
        dump(cardTemplateData, templateFile, indent=2)
    return cardTemplateData

def createCardTemplateData(guid, name, componentTypeInfo, frontTextureName, componentQuantity, totalCount, cardColumnCount, cardRowCount, backTextureName):    
    dimensions = (
        componentTypeInfo["DimensionsPixels"][0] * gameCrafterScaleToPlaygroundScale, 
        componentTypeInfo["DimensionsPixels"][1] * gameCrafterScaleToPlaygroundScale, 
        componentTypeInfo["PlaygroundThickness"])
    
    indices = []
    for i in range(totalCount):
        indices.append(i)

    return card.createCard(guid, name, frontTextureName, backTextureName, componentQuantity, cardColumnCount, cardRowCount, dimensions, componentTypeInfo["PlaygroundModel"], indices)

async def createStock(packageDirectoryPath, componentInstructions, stockPartInfo):
    guid = md5(componentInstructions["name"].encode()).hexdigest()
    stockTemplateData = await createStockTemplateData(guid, componentInstructions, stockPartInfo)

    templateDirectory = path.join(packageDirectoryPath, "Templates")
    templateFilepath = path.join(templateDirectory, "%s.json" % guid)

    with open(templateFilepath, "w") as templateFile:
        dump(stockTemplateData, templateFile, indent=2)
    
    return stockTemplateData

async def createStockTemplateData(guid, componentInstructions, stockPartInfo):
    normalMap = stockPartInfo["PlaygroundNormalMap"] if "PlaygroundNormalMap" in stockPartInfo else ""
    extraMap = stockPartInfo["PlaygroundExtraMap"] if "PlaygroundExtraMap" in stockPartInfo else ""
    stockTemplateData = stockModel.createStockModel(componentInstructions["name"], guid, stockPartInfo["PlaygroundModelFile"], stockPartInfo["PlaygroundColor"], normalMap, extraMap, componentInstructions["quantity"])

    if "PlaygroundDieFaces" in stockPartInfo:
        stockTemplateData["Faces"] = stockPartInfo["PlaygroundDieFaces"]
    
    return stockTemplateData


