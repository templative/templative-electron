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

    print(f"Converting {game['displayName']} into a Tabletop Simulator save.")

    uniqueGameName = path.basename(producedDirectoryPath)

    objectStates = await createObjectStates(producedDirectoryPath, tabletopSimulatorDirectoryPath)
    
    # Read rules.md if it exists
    rulesContent = ""
    rulesPath = path.join(producedDirectoryPath, "rules.md")
    if path.exists(rulesPath):
        async with AIOFile(rulesPath, "r") as rulesFile:
            rulesContent = await rulesFile.read()   
    
    playerCount = 8

    componentLibraryChest = objectState.createComponentLibraryChest(objectStates)
    await createSave(uniqueGameName, [componentLibraryChest], tabletopSimulatorDirectoryPath, playerCount, rulesContent)
    return 1

async def createSave(uniqueGameName, objectStates, tabletopSimulatorDirectoryPath, playerCount=8, rulesMd=""):
    gameSave = save.createSave(uniqueGameName, objectStates, playerCount, rulesMd)
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
        if objectState is None:
            print(f"!!! Skipping {directoryPath} due to errors.")
            continue
        objectStates.append(objectState)
        
    return objectStates

async def createObjectState(componentDirectoryPath, tabletopSimulatorDirectoryPath, componentIndex, componentCountTotal):
    componentInstructions = None
    componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json")
    with open(componentInstructionsFilepath, "r") as componentInstructionsFile:
        componentInstructions = load(componentInstructionsFile)
    
    supportedInstructionTypes = {
        "DECK": createDeck,
        "BOARD": createDeck,
    }

    componentTypeTokens = componentInstructions["type"].split("_")
    isStockComponent = componentTypeTokens[0].upper() == "STOCK" 
    if isStockComponent:
        if not componentTypeTokens[1] in STOCK_COMPONENT_INFO:
            print("!!! Missing stock info for %s." % componentTypeTokens[1])
            return None
        stockComponentInfo = STOCK_COMPONENT_INFO[componentTypeTokens[1]]
        # if not "SimulatorModelFile" in stockComponentInfo:
        #     print("Skipping %s as it doesn't have a SimulatorModelFile." % componentTypeTokens[1])
        #     return None
        return await createStock(componentInstructions, stockComponentInfo)

    if not componentInstructions["type"] in COMPONENT_INFO:
        print("!!! Missing component info for %s." % componentInstructions["type"])
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
        print("!!! Skipping unsupported %s." % simulatorTask)
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
    # Check if this is a single card
    totalUniqueCards = len(componentInstructions["frontInstructions"])
    isSingleCard = totalUniqueCards == 1 and (componentInstructions["frontInstructions"][0]["quantity"] * componentInstructions["quantity"]) == 1
    
    if isSingleCard:
        return await createSingleCard(tabletopSimulatorDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal)
    
    # Determine component type based on tags
    deckType = 0  # default type
    if "hex" in componentInfo["Tags"]:
        deckType = 3
    elif "circle" in componentInfo["Tags"]:
        deckType = 4

    tabletopSimulatorImageDirectoryPath = path.join(tabletopSimulatorDirectoryPath, "Mods/Images")

    componentUniqueName = componentInstructions["uniqueName"]

    result = await createCompositeImage(componentUniqueName, componentInstructions["type"],componentInstructions["quantity"], componentInstructions["frontInstructions"],componentInstructions["backInstructions"], tabletopSimulatorImageDirectoryPath)
    if result is None:
        print(f"!!! Failed to create composite image for {componentUniqueName}")
        return None
        
    imgurUrl, totalCount, cardColumnCount, cardRowCount = result
    
    backImageImgurUrl = await placeAndUploadBackImage(componentUniqueName, componentInstructions["type"], componentInstructions["backInstructions"], tabletopSimulatorImageDirectoryPath)
    if backImageImgurUrl is None:
        print(f"!!! Failed to upload back image for {componentUniqueName}")
        return None
        
    componentGuid = md5(componentInstructions["uniqueName"].encode()).hexdigest()[:6]
    
    relativeWidth = componentInfo["DimensionsInches"][0] / 2.5
    relativeHeight = relativeWidth# componentInfo["DimensionsInches"][1] / 3.5
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
        deckType
    )

async def createStock(componentInstructions, stockPartInfo):
    componentTypeTokens = componentInstructions["type"].split("_")
    stockType = componentTypeTokens[1]
    
    # Skip if no color info available
    if not "PlaygroundColor" in stockPartInfo:
        print(f"!!! Missing PlaygroundColor for {stockType}")
        return None
        
    # Determine if this is a die or cube
    isDie = stockType.startswith("D6")
    isCube = stockType.startswith("Cube")
    
    if not (isDie or isCube):
        print(f"!!! Unsupported stock type: {stockType}")
        return None
    
    # Get color from stock info
    color = stockPartInfo["PlaygroundColor"]
    
    # Parse size from type name (e.g. "16mm" from "D616mm" or "8mm" from "Cube8mm")
    sizeStr = ""
    if isDie:
        sizeStr = stockType[2:].split("mm")[0]
    elif isCube:
        sizeStr = stockType[4:].split("mm")[0]
    
    size = float(sizeStr) / 25.4  # Convert mm to inches
    
    # Create appropriate object state
    if isDie:
        return objectState.createStockDie(
            componentInstructions["name"],
            size,
            color
        )
    else:
        return objectState.createStockCube(
            componentInstructions["name"],
            size, 
            color
        )

async def createCompositeImage(componentName, componentType, quantity, frontInstructions, backInstructions, tabletopSimulatorImageDirectoryPath):
    # Calculate total unique cards (not including duplicates)
    uniqueCardCount = len(frontInstructions)
    
    if uniqueCardCount > 69:
        print("!!! Components larger than 69 unique cards aren't parsed correctly at the moment.")
        return None, 0, 0, 0

    # Calculate optimal grid size based on card count (including 1 back card)
    total_cards = uniqueCardCount + 1  # Add 1 for the back card
    columns, rows = findBoxiestShape(total_cards)
    
    # Ensure minimum dimensions for TTS compatibility
    columns = max(columns, 2)  # Minimum 2 columns for TTS
    rows = max(rows, 2)    # Minimum 2 rows for TTS

    if not componentType in COMPONENT_INFO:
        print("!!! Missing component info for %s." % componentType)
        return None, 0, 0, 0

    component = COMPONENT_INFO[componentType]

    if not "DimensionsPixels" in component:
        print("!!! Skipping %s that has no DimensionsPixels." % componentType)
        return None, 0, 0, 0
    pixelDimensions = COMPONENT_INFO[componentType]["DimensionsPixels"]

    # Calculate initial dimensions
    total_width = pixelDimensions[0] * columns
    total_height = pixelDimensions[1] * rows
    
    # If dimensions exceed 10k pixels, adjust the layout or resize
    MAX_DIMENSION = 10000
    scale_factor = 1.0
    
    if total_width > MAX_DIMENSION or total_height > MAX_DIMENSION:
        # First try to adjust columns and rows while maintaining total cells
        aspect_ratio = pixelDimensions[0] / pixelDimensions[1]
        max_columns = math.floor(MAX_DIMENSION / pixelDimensions[0])
        max_rows = math.floor(MAX_DIMENSION / pixelDimensions[1])
        
        # Recalculate columns and rows within limits
        if total_cards <= max_columns * max_rows:
            columns = min(columns, max_columns)
            rows = math.ceil(total_cards / columns)
            
            # Adjust if rows exceed max
            if rows > max_rows:
                rows = max_rows
                columns = math.ceil(total_cards / rows)
        
        # If still too large, need to scale the image
        total_width = pixelDimensions[0] * columns
        total_height = pixelDimensions[1] * rows
        if total_width > MAX_DIMENSION or total_height > MAX_DIMENSION:
            width_scale = MAX_DIMENSION / total_width if total_width > MAX_DIMENSION else 1
            height_scale = MAX_DIMENSION / total_height if total_height > MAX_DIMENSION else 1
            scale_factor = min(width_scale, height_scale)
            
    # Create the composite image with potentially scaled dimensions
    scaled_width = int(pixelDimensions[0] * columns * scale_factor)
    scaled_height = int(pixelDimensions[1] * rows * scale_factor)
    tiledImage = Image.new('RGB', (scaled_width, scaled_height))

    # Place each unique card image with scaling if necessary
    cardIndex = 0
    for instruction in frontInstructions:
        xIndex = cardIndex % columns
        yIndex = cardIndex // columns
        try:
            if not path.exists(instruction["filepath"]):
                print(f"!!! Image file not found: {instruction['filepath']}")
                image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
            else:
                image = Image.open(instruction["filepath"])
        except Exception as e:
            print(f"!!! Error loading image {instruction['filepath']}: {e}")
            image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
            
        if scale_factor != 1.0:
            new_size = (int(pixelDimensions[0] * scale_factor), int(pixelDimensions[1] * scale_factor))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        tiledImage.paste(image, (
            int(xIndex * pixelDimensions[0] * scale_factor), 
            int(yIndex * pixelDimensions[1] * scale_factor)
        ))
        cardIndex += 1

    # Create or use back image
    if backInstructions:
        try:
            if not path.exists(backInstructions["filepath"]):
                print(f"!!! Back image file not found: {backInstructions['filepath']}")
                backImage = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
            else:
                backImage = Image.open(backInstructions["filepath"])
        except Exception as e:
            print(f"!!! Error loading back image {backInstructions['filepath']}: {e}")
            backImage = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
    else:
        # Create a black image with the same dimensions as the front cards
        backImage = Image.new('RGB', (pixelDimensions[0], pixelDimensions[1]), 'black')

    if scale_factor != 1.0:
        new_size = (int(pixelDimensions[0] * scale_factor), int(pixelDimensions[1] * scale_factor))
        backImage = backImage.resize(new_size, Image.Resampling.LANCZOS)

    # Place back image in bottom right corner
    xIndex = columns - 1  # Rightmost column
    yIndex = rows - 1     # Bottom row
    tiledImage.paste(backImage, (
        int(xIndex * pixelDimensions[0] * scale_factor),
        int(yIndex * pixelDimensions[1] * scale_factor)
    ))

    # Ensure image is in RGB mode
    if tiledImage.mode == 'RGBA':
        tiledImage = tiledImage.convert('RGB')
    
    frontImageName = "%s-front.png" % componentName
    frontImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, frontImageName)
    tiledImage.save(frontImageFilepath, "PNG", optimize=False, quality=100)
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
    baseUrl = "http://127.0.0.1:5000" if isDev else "https://api.templative.net/"
    response = requests.post('%s/simulator/image' % baseUrl, files=files)
    
    if response.status_code == 200:
        return response.json()['url']
    else:
        print("!!! Failed to upload image to server.")
        return None
    
async def placeAndUploadBackImage(name, componentType, backInstructions, tabletopSimulatorImageDirectoryPath):
    if not componentType in COMPONENT_INFO:
        print("!!! Missing component info for %s." % componentType)
        return None
        
    component = COMPONENT_INFO[componentType]
    if not "DimensionsPixels" in component:
        print("!!! Skipping %s that has no DimensionsPixels." % componentType)
        return None
        
    pixelDimensions = COMPONENT_INFO[componentType]["DimensionsPixels"]
    if backInstructions:
        try:
            if not path.exists(backInstructions["filepath"]):
                print(f"!!! Back image file not found: {backInstructions['filepath']}")
                image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
            else:
                await copyBackImageToImages(name, backInstructions, tabletopSimulatorImageDirectoryPath)
                image = Image.open(backInstructions["filepath"])
        except Exception as e:
            print(f"!!! Error loading back image {backInstructions['filepath']}: {e}")
            image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
    else:
        image = createPlaceholderImage(pixelDimensions[0], pixelDimensions[1])
    
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    return await uploadToS3(image)

async def copyBackImageToImages(componentName, backInstructions, tabletopSimulatorImageDirectoryPath):
    backImageName = "%s-back.jpeg" % componentName
    backImageFilepath = path.join(tabletopSimulatorImageDirectoryPath, backImageName)
    copyfile(backInstructions["filepath"], backImageFilepath)

async def createSingleCard(tabletopSimulatorDirectoryPath, componentInstructions, componentInfo, componentIndex, componentCountTotal):
    # Determine component type based on tags
    deckType = 0  # default type
    if "hex" in componentInfo["Tags"]:
        deckType = 3
    elif "circle" in componentInfo["Tags"]:
        deckType = 4

    tabletopSimulatorImageDirectoryPath = path.join(tabletopSimulatorDirectoryPath, "Mods/Images")
    
    # Upload front and back images directly without tiling
    frontImage = safeLoadImage(componentInstructions["frontInstructions"][0]["filepath"])
    if not frontImage:
        return None

    backImage = safeLoadImage(componentInstructions["backInstructions"]["filepath"])
    if not backImage:
        return None
    
    frontImgurUrl = await uploadToS3(frontImage)
    backImgurUrl = await uploadToS3(backImage)
    
    componentGuid = md5(componentInstructions["uniqueName"].encode()).hexdigest()[:6]
    
    relativeWidth = componentInfo["DimensionsInches"][0] / 2.5
    relativeHeight = componentInfo["DimensionsInches"][1] / 3.5
    thickness = 1.0
    
    imageUrls = SimulatorTilesetUrls(face=frontImgurUrl, back=backImgurUrl)
    
    columns, rows = findBoxiestShape(componentCountTotal)
    boxPositionIndexX = componentIndex % columns
    boxPositionIndexZ = int(math.floor(componentIndex / columns))
    height = 1.5
    
    simulatorComponentPlacement = SimulatorComponentPlacement(boxPositionIndexX, height, boxPositionIndexZ, columns, rows)
    dimensions = SimulatorDimensions(relativeWidth, relativeHeight, thickness)
    
    return objectState.createCardObjectState(
        componentGuid,
        componentIndex+1,
        componentInstructions["uniqueName"],
        imageUrls,
        simulatorComponentPlacement,
        dimensions,
        deckType
    )

def safeLoadImage(filepath):
    if not path.exists(filepath):
        print(f"!!! Image file not found: {filepath}")
        return None
    try:
        return Image.open(filepath)
    except Exception as e:
        print(f"!!! Error loading image {filepath}: {e}")
        return None

def createPlaceholderImage(width, height):
    # Create a solid pink image
    return Image.new('RGB', (width, height), 'pink')
