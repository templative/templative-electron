from os import path, mkdir, walk
import math
from PIL import Image
import requests
from io import BytesIO
from json import dump, load
from shutil import copyfile
from templative.lib.manage import instructionsLoader
# from templative.lib.distribute.simulator.simulatorTemplates import stockModel
from . simulatorTemplates import save, objectState
from PIL import Image
from hashlib import md5
import math
from aiofile import AIOFile
from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO
from .structs import SimulatorTilesetUrls, SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetLayout

IMGUR_CLIENT_ID = 'your_client_id_here'

async def lookForSimulatorFile():
    simulatorFileLocation = "./.simulator"
    if not path.exists(simulatorFileLocation):
        return None
    
    async with AIOFile(simulatorFileLocation, mode="r") as simulator:
        return await simulator.read()
    
async def writeSimulatorFile(outputPath):
    simulatorFileLocation = path.join("./", ".simulator")
    async with AIOFile(simulatorFileLocation, mode="w") as simulator:
        await simulator.write(outputPath)

async def getSimulatorDirectory(inputedSimulatorDirectory):
    if inputedSimulatorDirectory != None:
        return inputedSimulatorDirectory
    
    return await lookForSimulatorFile()  

async def convertToTabletopSimulator(producedDirectoryPath, tabletopSimulatorDirectoryPath):
    # Expand the tilde to the user's home directory
    producedDirectoryPath = path.expanduser(producedDirectoryPath)
    tabletopSimulatorDirectoryPath = path.expanduser(tabletopSimulatorDirectoryPath)
    
    game = await instructionsLoader.loadGameInstructions(producedDirectoryPath)
    studio = await instructionsLoader.loadStudioInstructions(producedDirectoryPath)

    print("Convert %s into a Tabletop Simulator package for %s." % (game["displayName"], studio["displayName"]))

    uniqueGameName = path.basename(producedDirectoryPath)

    objectStates = await createObjectStates(producedDirectoryPath, tabletopSimulatorDirectoryPath)
    
    componentLibraryChest = createComponentLibraryChest(objectStates)
    await createSave(uniqueGameName, [componentLibraryChest], tabletopSimulatorDirectoryPath)
    return 1

def createComponentLibraryChest(componentStates):
    return {
        "Name": "Bag",
        "Transform": {
            "posX": 0,
            "posY": 3,
            "posZ": -20,
            "rotX": 0,
            "rotY": 180,
            "rotZ": 0,
            "scaleX": 3,
            "scaleY": 3,
            "scaleZ": 3
        },
        "Nickname": "Component Library",
        "Description": "Contains all game components for respawning",
        "GMNotes": "",
        "ColorDiffuse": {
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
        "GUID": "chest" + md5("ComponentLibrary".encode()).hexdigest()[:6]
    }

async def createSave(uniqueGameName, objectStates, tabletopSimulatorDirectoryPath):
    gameSave = save.createSave(uniqueGameName, objectStates)
    saveFilepath = path.join(tabletopSimulatorDirectoryPath, "Saves", "%s.json" % uniqueGameName)
    print("Saved file at %s" % saveFilepath)
    with open(saveFilepath, "w") as gameStateVtsFile:
        dump(gameSave, gameStateVtsFile, indent=2)

async def createObjectStates(producedDirectoryPath, tabletopSimulatorDirectoryPath):
    objectStates = []
    index = 0
    directories = next(walk(producedDirectoryPath))[1]
    for directoryPath in directories:
        componentDirectoryPath = path.join(producedDirectoryPath, directoryPath)
        
        objectState = await createObjectState(componentDirectoryPath, tabletopSimulatorDirectoryPath, index, len(directories))
        index = index + 1
        if objectState == None:
            continue
        objectStates.append(objectState)
        
    return objectStates

async def createObjectState(componentDirectoryPath, tabletopSimulatorDirectoryPath, componentIndex, componentCountTotal):
    componentInstructions = None
    componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json")
    with open(componentInstructionsFilepath, "r") as componentInstructionsFile:
        componentInstructions = load(componentInstructionsFile)
    
    supportedInstructionTypes = {
        "DECK": createDeck
    }

    componentTypeTokens = componentInstructions["type"].split("_")
    isStockComponent = componentTypeTokens[0].upper() == "STOCK" 
    if isStockComponent:
        if not componentTypeTokens[1] in STOCK_COMPONENT_INFO:
            print("Missing stock info for %s." % componentTypeTokens[1])
            return None
        stockComponentInfo = STOCK_COMPONENT_INFO[componentTypeTokens[1]]
        if not "SimulatorModelFile" in stockComponentInfo:
            print("Skipping %s as it doesn't have a SimulatorModelFile." % componentTypeTokens[1])
            return None
        return await createStock(tabletopSimulatorDirectoryPath, componentInstructions, stockComponentInfo)

    if not componentInstructions["type"] in COMPONENT_INFO:
        print("Missing component info for %s." % componentInstructions["type"])
        return None
    componentInfo = COMPONENT_INFO[componentInstructions["type"]]

    if not "SimulatorCreationTask" in componentInfo:
        print("Skipping %s that has no SimulatorCreationTask." % componentInstructions["type"])
        return None
    simulatorTask = componentInfo["SimulatorCreationTask"]

    totalCount = 0
    for instruction in componentInstructions["frontInstructions"]:
        totalCount += instruction["quantity"]

    if totalCount == 0:
        return None
    
    if not simulatorTask in supportedInstructionTypes:
        print("Skipping unsupported %s." % simulatorTask)
        return None
    instruction = supportedInstructionTypes[simulatorTask]
    print("Creating %s" % componentInstructions["uniqueName"])
    return await instruction(tabletopSimulatorDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal)

def findBoxiestShape(total_count):
    if total_count <= 0:
        return (0, 0)  # Handle the edge case for non-positive counts

    # Start with the square root of the total count
    side_length = int(math.sqrt(total_count))

    # Find the closest factors
    for i in range(side_length, 0, -1):
        if total_count % i == 0:
            return (i, total_count // i)

    # Fallback (should never be reached for positive integers)
    return (1, total_count)

async def createDeck(tabletopSimulatorDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal):
    # Add check for hexagonal components
    isHexagonal = "hex" in componentInfo["Tags"]
    
    tabletopSimulatorImageDirectoryPath = path.join(tabletopSimulatorDirectoryPath, "Mods/Images")

    componentUniqueName = componentInstructions["uniqueName"]

    imgurUrl, totalCount, cardColumnCount, cardRowCount = await createCompositeImage(componentUniqueName, componentInstructions["type"],componentInstructions["quantity"], componentInstructions["frontInstructions"],componentInstructions["backInstructions"], tabletopSimulatorImageDirectoryPath)

    backImageImgurUrl = await placeAndUploadBackImage(componentUniqueName, componentInstructions["backInstructions"], tabletopSimulatorImageDirectoryPath)

    componentGuid = md5(componentInstructions["uniqueName"].encode()).hexdigest()[:6]
    
    relativeWidth = componentInfo["DimensionsInches"][0] / 2.5
    relativeHeight = componentInfo["DimensionsInches"][1] / 3.5
    thickness = 1.0
    
    imageUrls = SimulatorTilesetUrls(face=imgurUrl, back=backImageImgurUrl)
    
    columns, rows = findBoxiestShape(componentCountTotal)
    boxPositionIndexX=componentIndex % columns
    boxPositionIndexZ=int(math.floor(componentIndex / columns))
    height=1.5
    
    simulatorComponentPlacement = SimulatorComponentPlacement(boxPositionIndexX,height,boxPositionIndexZ,columns, rows)
    dimensions = SimulatorDimensions(relativeWidth, relativeHeight, thickness)
    layout = SimulatorTilesetLayout(totalCount, cardColumnCount, cardRowCount)

    # Pass the quantities array to createDeckObjectState
    cardQuantities = []
    for instruction in componentInstructions["frontInstructions"]:
        cardQuantities.append(instruction["quantity"] * componentInstructions["quantity"])

    return objectState.createDeckObjectState(
        componentGuid, 
        componentIndex+1, 
        componentInstructions["uniqueName"], 
        imageUrls, 
        simulatorComponentPlacement, 
        dimensions, 
        layout, 
        cardQuantities, 
        isHexagonal
    )

async def createStock(tabletopSimulatorDirectoryPath, componentInstructions, stockPartInfo):   
    return None

async def createCompositeImage(componentName, componentType, quantity, frontInstructions, backInstructions, tabletopSimulatorImageDirectoryPath):
    # Calculate total unique cards (not including duplicates)
    uniqueCardCount = len(frontInstructions)
    
    if uniqueCardCount > 69:
        print("!!! Components larger than 69 unique cards aren't parsed correctly at the moment.")
        return None, 0, 0, 0

    columns = 10
    rows = 7

    if not componentType in COMPONENT_INFO:
        print("Missing component info for %s." % componentType)
        return None, 0, 0, 0
    component = COMPONENT_INFO[componentType]

    if not "DimensionsPixels" in component:
        print("Skipping %s that has no DimensionsPixels." % componentType)
        return None, 0, 0, 0
    pixelDimensions = COMPONENT_INFO[componentType]["DimensionsPixels"]

    tiledImage = Image.new('RGB', (pixelDimensions[0]*columns, pixelDimensions[1]*rows))
    
    # Place each unique card image only once
    xIndex = 0
    yIndex = 0
    for instruction in frontInstructions:
        image = Image.open(instruction["filepath"])
        tiledImage.paste(image, (xIndex*pixelDimensions[0], yIndex*pixelDimensions[1]))
        xIndex += 1
        if xIndex == columns:
            xIndex = 0
            yIndex += 1
                
    # Place hidden card in last spot
    backImage = Image.open(backInstructions["filepath"])
    tiledImage.paste(backImage, (9*pixelDimensions[0], 6*pixelDimensions[1]))

    max_width = 1024
    width, height = tiledImage.size
    if width > max_width:
        new_height = int((max_width / width) * height)
        tiledImage = tiledImage.resize((max_width, new_height), Image.LANCZOS)

    frontImageName = "%s-front.png" % componentName
    frontImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, frontImageName)
    if tiledImage.mode == 'RGBA':
        tiledImage = tiledImage.convert('RGB')
    tiledImage.save(frontImageFilepath, "PNG", optimize=True, quality=95)
    imgurUrl = await uploadToS3(tiledImage)

    # Calculate total cards including duplicates
    totalCount = sum(instruction["quantity"] * quantity for instruction in frontInstructions)
    
    return imgurUrl, totalCount, columns, rows

async def uploadToS3(image):
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    
    buffered = BytesIO()
    image.save(buffered, format="PNG", optimize=True, quality=95)
    buffered.seek(0)
    
    files = {'image': buffered}
    isDev = False
    baseUrl = "http://127.0.0.1:5000" if isDev else "https://www.templative.net"
    response = requests.post('%s/simulator/image' % baseUrl, files=files)
    
    if response.status_code == 200:
        return response.json()['url']
    else:
        print("Failed to upload image to server.")
        return None

async def copyFrontImageToTextures(componentName, frontInstructions, textureDirectoryFilepath):
    frontImageName = "%s-front.jpeg" % componentName
    frontImageFilepath = path.join(textureDirectoryFilepath, frontImageName)
    copyfile(frontInstructions["filepath"], frontImageFilepath)
    
async def placeAndUploadBackImage(name, backInstructions, tabletopSimulatorImageDirectoryPath):
    await copyBackImageToImages(name, backInstructions, tabletopSimulatorImageDirectoryPath)
    image = Image.open(backInstructions["filepath"])
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    return await uploadToS3(image)

async def copyBackImageToImages(componentName, backInstructions, tabletopSimulatorImageDirectoryPath):
    backImageName = "%s-back.jpeg" % componentName
    backImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, backImageName)
    copyfile(backInstructions["filepath"], backImageFilepath)
