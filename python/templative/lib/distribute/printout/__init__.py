import asyncclick as click
from PIL import Image, ImageDraw 
from os import path, walk
from json import dump, load
import math
import os
import tempfile
from pprint import pprint
from fpdf import FPDF
from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.manage.instructionsLoader import getLastOutputFileDirectory

diceTypes = [ "CustomColorD6", "CustomWoodD6"]
unsupportedDiceTypes = ["CustomColorD4", "CustomColorD8"]
marginInches = 0.5 # or 0.25
inchToPixelConversion = 96
pieceMarginInches = 0.11811 * 1/3
fpdfSizes = {
    "Letter": "letter",
    "Tabloid": "a3",
}
printoutPlayAreaChoices = {
    "Letter": (8.5-(marginInches*2), 11-(marginInches*2)),
    "Tabloid": (11-(marginInches*2), 17-(marginInches*2))
}

async def createPdfForPrinting(producedDirectoryPath, isBackIncluded, size, areMarginsIncluded):
    if not size in fpdfSizes or not size in printoutPlayAreaChoices:
        print(f"!!! Cannot create size {size}.")
        return
    print(f"Creating printout for {producedDirectoryPath} {'with backs' if isBackIncluded else 'without backs'} on {size}.")
    pdf = FPDF("P", "in", fpdfSizes[size])

    componentTypeFilepathsAndQuantity = await getDictionaryOfImageFilepathsAndQuantityGroupedByComponentType(producedDirectoryPath)
    
    printoutPlayAreaChoice = printoutPlayAreaChoices[size]

    for componentType in componentTypeFilepathsAndQuantity.keys():
        dictionaryOfImageFilepathsAndTheirQuantities = componentTypeFilepathsAndQuantity[componentType]
        createdPageImages = await createPageImagesForComponentTypeImages(componentType, dictionaryOfImageFilepathsAndTheirQuantities, isBackIncluded, printoutPlayAreaChoice, areMarginsIncluded)
        await addPageImagesToPdf(pdf, createdPageImages, printoutPlayAreaChoice)
    
    outputPath = path.abspath(path.join(producedDirectoryPath, "printout.pdf"))
    print(f"Writing printout to {outputPath}")
    pdf.output(outputPath, "F")
    return 1

def mergeDictsRecursive(dict1, dict2):
    for key, value in dict2.items():
        if key in dict1:
            if isinstance(dict1[key], dict) and isinstance(value, dict):
                mergeDictsRecursive(dict1[key], value)
            elif isinstance(dict1[key], list) and isinstance(value, list):
                dict1[key].extend(value)
            else:
                dict1[key] = value
        else:
            dict1[key] = value

    return dict1

async def getDictionaryOfImageFilepathsAndQuantityGroupedByComponentType(producedDirectoryPath):
    componentTypeFilepathAndQuantity = {}
    directoryPathsInOutputFolder = next(walk(producedDirectoryPath))[1]
    for directoryPath in directoryPathsInOutputFolder:
        directoryComponentTypeFilepathAndQuantity = await loadFilepathsForComponent(producedDirectoryPath, directoryPath)
        componentTypeFilepathAndQuantity = mergeDictsRecursive(componentTypeFilepathAndQuantity, directoryComponentTypeFilepathAndQuantity)
    return componentTypeFilepathAndQuantity

async def loadFilepathsForComponent(producedDirectoryPath, directoryPath):
    componentDirectoryPath = "%s/%s" % (producedDirectoryPath, directoryPath)
    componentInstructionsFilepath = path.join(componentDirectoryPath, "component.json")
    componentInstructionsFile = open(componentInstructionsFilepath, "r")
    componentInstructions = load(componentInstructionsFile)
    
    componentTypeFilepathAndQuantity = await collectFilepathQuantitiesForComponent(componentInstructions)
    componentInstructionsFile.close()
    return componentTypeFilepathAndQuantity

async def collectFilepathQuantitiesForComponent(componentInstructions):    
    componentTypeFilepathAndQuantity = {}
    if not componentInstructions["type"] in componentTypeFilepathAndQuantity:
        componentTypeFilepathAndQuantity[componentInstructions["type"]] = []
    
    if "STOCK_" in componentInstructions["type"]:
        return componentTypeFilepathAndQuantity

    # Special handling for dice
    isDie = componentInstructions["type"] in diceTypes or componentInstructions["type"] in unsupportedDiceTypes
    if isDie:
        # Skip unsupported dice types
        if componentInstructions["type"] in unsupportedDiceTypes:
            print(f"!!! Skipping {componentInstructions['name']} because {componentInstructions['type']} is not supported for printing due to it's complexity.")
            return componentTypeFilepathAndQuantity
            
        if not "dieFaceFilepaths" in componentInstructions:
            print(f"!!! Skipping {componentInstructions['name']} because it lacks 'dieFaceFilepaths'.")
            return componentTypeFilepathAndQuantity
        
        dieLayout = {
            "filepath": componentInstructions["dieFaceFilepaths"],  # Pass all filepaths
            "quantity": componentInstructions["quantity"],
            "isDie": isDie
        }
        componentTypeFilepathAndQuantity[componentInstructions["type"]].append(dieLayout)
        return componentTypeFilepathAndQuantity

    # Original code for non-dice components
    if not "frontInstructions" in componentInstructions:
        print(f"!!! Skipping {componentInstructions['name']} because it lacks 'frontInstructions'.")
        return componentTypeFilepathAndQuantity
    
    for instruction in componentInstructions["frontInstructions"]:
        frontBack = {
            "filepath": instruction["filepath"],
            "quantity":  instruction["quantity"] * componentInstructions["quantity"],
            "isDie": isDie
        }
        if "backInstructions" in componentInstructions:
            frontBack["backFilepath"] = componentInstructions["backInstructions"]["filepath"]
        
        componentTypeFilepathAndQuantity[componentInstructions["type"]].append(frontBack)

    return componentTypeFilepathAndQuantity

async def addPageImagesToPdf(pdf, pageImages, printoutPlayAreaInches):
    for image in pageImages:
        pdf.add_page()
        pdf.line(1,0,1,1)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmpfile:
            image.save(tmpfile, format='PNG')
            tmpfile_path = tmpfile.name
        try:
            pdf.image(tmpfile_path, marginInches, marginInches, printoutPlayAreaInches[0], printoutPlayAreaInches[1])
        finally:
            os.remove(tmpfile_path)

async def createPageImagesForComponentTypeImages(componentType, componentTypeImageList, printBack, printoutPlayAreaInches, areMarginsIncluded):
    if "STOCK_" in componentType:
        return []

    if not componentType in COMPONENT_INFO:
        print(f"!!! Missing {componentType} type description, skipping.")
        return []
    componentInfo = COMPONENT_INFO[componentType]

    if not "DimensionsInches" in componentInfo:
        print(f"!!! Skipping {componentType} because it's inch size isn't defined.")
        return []
    
    dimensionsPixels = componentInfo["DimensionsPixels"]
    componentSizeInches = componentInfo["DimensionsInches"]

    marginsPixels = componentInfo["MarginsPixels"] if (areMarginsIncluded and "MarginsPixels" in componentInfo) else None
    if marginsPixels != None:
        sizeOfContentPixels = (dimensionsPixels[0]-(marginsPixels[0]*2), dimensionsPixels[1]-(marginsPixels[1]*2))
        accountForMarginsFactor = (dimensionsPixels[0]/sizeOfContentPixels[0], dimensionsPixels[1]/sizeOfContentPixels[1])
        componentSizeInches = (componentSizeInches[0] * accountForMarginsFactor[0], componentSizeInches[1] * accountForMarginsFactor[1])

    # Special handling for dice - adjust piece size for layout while keeping component size the same
    isDie = componentType in diceTypes
    if isDie:
        flangeSize = componentSizeInches[1] * 0.15  # Match the flange size ratio
        pieceSizeInches = (
            (componentSizeInches[0] * 3) + pieceMarginInches + (flangeSize*2),      # 3 faces wide + left & right flanges
            (componentSizeInches[1] * 4 + flangeSize * 2) + pieceMarginInches   # 4 faces tall + top & bottom flanges
        )
    else:
        pieceSizeInches = (componentSizeInches[0] + pieceMarginInches, componentSizeInches[1] + pieceMarginInches)

    columns = math.floor(printoutPlayAreaInches[0] / pieceSizeInches[0])
    rows = math.floor(printoutPlayAreaInches[1] / pieceSizeInches[1])
    
    # Only try rotation for non-dice pieces
    if not isDie:
        rotatedColumns = math.floor(printoutPlayAreaInches[0] / pieceSizeInches[1])
        rotatedRows = math.floor(printoutPlayAreaInches[1] / pieceSizeInches[0])
        isImageRotated = rotatedColumns*rotatedRows > columns*rows
        if isImageRotated:
            columns = rotatedColumns
            rows = rotatedRows
            pieceSizeInches = (pieceSizeInches[1], pieceSizeInches[0])
            componentSizeInches = (componentSizeInches[1], componentSizeInches[0])
    else:
        isImageRotated = False

    if rows == 0 or columns == 0:
        print(f"Skipping the {pieceSizeInches[0]}x{pieceSizeInches[1]}inch {componentType} as it's too large for a {printoutPlayAreaInches[0]}x{printoutPlayAreaInches[1]}inch print space.")
        return []
    
    halfAreaPixels = (
        int((printoutPlayAreaInches[0] - (pieceSizeInches[0] * columns)) / 2 * inchToPixelConversion), 
        int((printoutPlayAreaInches[1] - (pieceSizeInches[1] * rows)) / 2 * inchToPixelConversion)
    )

    pageImages = await createBlankImagesForComponent(componentTypeImageList, columns, rows, printBack, printoutPlayAreaInches)
    
    resizedSizePixels = (
        int(componentSizeInches[0] * inchToPixelConversion), 
        int(componentSizeInches[1] * inchToPixelConversion)
    )

    totalImagesDrawn = 0
    for f in range(len(componentTypeImageList)):
        instruction = componentTypeImageList[f]
        imagesDrawnCount = await drawPieceForQuantities(pageImages, instruction, totalImagesDrawn, printBack, columns, rows, isImageRotated, resizedSizePixels, halfAreaPixels, pieceSizeInches, dimensionsPixels, marginsPixels)
        totalImagesDrawn += imagesDrawnCount

    return pageImages

async def drawPieceForQuantities(pageImages, instruction, totalImagesDrawn, printBack, columns, rows, isImageRotated, resizedSizePixels, halfAreaPixels, pieceSizeInches, dimensionsPixels, marginsPixels):
    if instruction.get("isDie"):
        # For dice, create cross layout
        dieImage = await createDieCrossLayout(instruction["filepath"], resizedSizePixels)
        
        pieceIndex = totalImagesDrawn
        for _ in range(instruction["quantity"]):
            await drawPiece(pageImages, dieImage, dieImage, pieceIndex, False, columns, rows, 
                          (resizedSizePixels[0] * 3, resizedSizePixels[1] * 4), 
                          halfAreaPixels, pieceSizeInches, isImageRotated, None)
            pieceIndex += 1
        
        dieImage.close()
        return instruction["quantity"]
    
    try:
        frontImage = Image.open(instruction["filepath"])
    except (FileNotFoundError, IOError):
        frontImage = createMissingImage(resizedSizePixels, instruction["filepath"])
    
    try:
        backImage = Image.open(instruction["backFilepath"]) if "backFilepath" in instruction else frontImage
    except (FileNotFoundError, IOError):
        backFilepath = instruction.get("backFilepath", "No back filepath specified")
        backImage = createMissingImage(resizedSizePixels, backFilepath)

    if isImageRotated:
        frontImage = frontImage.rotate(-90, expand=True)
        backImage = backImage.rotate(-90, expand=True)
    
    frontImage = frontImage.resize(resizedSizePixels)
    backImage = backImage.resize(resizedSizePixels)

    pieceIndex = totalImagesDrawn
    marginsToDimensionsRatio = (marginsPixels[0]/dimensionsPixels[0], marginsPixels[1]/dimensionsPixels[1]) if marginsPixels != None else None

    for _ in range(instruction["quantity"]):
        await drawPiece(pageImages, frontImage, backImage, pieceIndex, printBack, columns, rows, resizedSizePixels, halfAreaPixels, pieceSizeInches, isImageRotated, marginsToDimensionsRatio)
        pieceIndex += 1

    frontImage.close()
    backImage.close()
    imagesDrawnCount = instruction["quantity"]
    return imagesDrawnCount

async def drawPiece(pageImages, frontImage, backImage, pieceIndex, printBack, columns, rows, resizedSizePixels, halfAreaPixels, pieceSizeInches, isImageRotated, marginsToDimensionsRatio):
    
    pageIndex = math.floor(pieceIndex / (columns*rows))
    frontBackPageIndex = pageIndex * (2 if printBack else 1)
    
    pageImage = pageImages[frontBackPageIndex]
    pieceIndexOnPage = pieceIndex - (pageIndex * columns * rows)
    xIndex = math.floor(pieceIndexOnPage % columns)
    yIndex = math.floor(pieceIndexOnPage / columns)
    position = (
        halfAreaPixels[0] + int(xIndex * pieceSizeInches[0] * inchToPixelConversion),
        halfAreaPixels[1] + int(yIndex * pieceSizeInches[1] * inchToPixelConversion)
    )

    pageImage.paste(frontImage, position)

    if marginsToDimensionsRatio != None:
        await createGuidesForPiece(pageImage, position, resizedSizePixels, isImageRotated, marginsToDimensionsRatio)    

    if printBack:
        reversedYAxisXIndex = columns-1 - xIndex
        backPosition = (
            halfAreaPixels[0] + int(reversedYAxisXIndex * pieceSizeInches[0] * inchToPixelConversion),
            position[1]
        )
        pageImages[frontBackPageIndex+1].paste(backImage, backPosition)

async def createGuidesForPiece(pageImage, position, size, isImageRotated, marginsToDimensionsRatio):
    if isImageRotated:
        marginsToDimensionsRatio = (marginsToDimensionsRatio[1], marginsToDimensionsRatio[0])

    lineLength = 6

    topVerticalLeft = (position[0] + (size[0]*marginsToDimensionsRatio[0]), position[1])
    await drawLine(pageImage, topVerticalLeft[0], topVerticalLeft[1], topVerticalLeft[0], topVerticalLeft[1]+lineLength)

    topVerticalRight = (position[0] + size[0] - (size[0]*marginsToDimensionsRatio[0]), position[1])
    await drawLine(pageImage, topVerticalRight[0], topVerticalRight[1], topVerticalRight[0], topVerticalRight[1]+lineLength)

    leftHorizontalTop = (position[0], position[1] + (size[1]*marginsToDimensionsRatio[1]))
    await drawLine(pageImage, leftHorizontalTop[0], leftHorizontalTop[1], leftHorizontalTop[0]+lineLength, leftHorizontalTop[1])

    leftHorizontalBottom = (position[0], position[1] + size[1] - (size[1]*marginsToDimensionsRatio[1]))
    await drawLine(pageImage, leftHorizontalBottom[0], leftHorizontalBottom[1], leftHorizontalBottom[0]+lineLength, leftHorizontalBottom[1])

    bottomVerticalLeft = (position[0] + (size[0]*marginsToDimensionsRatio[0]), position[1]+ size[1])
    await drawLine(pageImage, bottomVerticalLeft[0], bottomVerticalLeft[1], bottomVerticalLeft[0], bottomVerticalLeft[1]-lineLength)

    bottomVerticalRight = (position[0] + size[0] - (size[0]*marginsToDimensionsRatio[0]), position[1] + size[1])
    await drawLine(pageImage, bottomVerticalRight[0], bottomVerticalRight[1], bottomVerticalRight[0], bottomVerticalRight[1]-lineLength)

    rightHorizontalTop = (position[0] + size[0], position[1] + (size[1]*marginsToDimensionsRatio[1]))
    await drawLine(pageImage, rightHorizontalTop[0], rightHorizontalTop[1], rightHorizontalTop[0]-lineLength, rightHorizontalTop[1])

    rightHorizontalBottom = (position[0] + size[0], position[1] + size[1] - (size[1]*marginsToDimensionsRatio[1]))
    await drawLine(pageImage, rightHorizontalBottom[0], rightHorizontalBottom[1], rightHorizontalBottom[0]-lineLength, rightHorizontalBottom[1])

async def drawLine(image, hereX, hereY, thereX, thereY):
    lineImage = ImageDraw.Draw(image)   
    lineImage.line([(hereX, hereY), (thereX, thereY)], fill ="green", width = 2)

async def createBlankImagesForComponent(imageFilepaths, columns, rows, printBack, printoutPlayAreaInches):
    whiteColorRGB = (255,255,255)

    if columns == 0 or rows == 0:
        raise Exception("Rows and columns must be non zero.")

    totalCount = 0
    for instruction in imageFilepaths:
        totalCount += instruction["quantity"]
    
    itemsPerPage = columns * rows
    totalPages = math.ceil(totalCount/itemsPerPage) * (2 if printBack else 1)
    # print("Because a page fits", columns*rows, "we need", totalPages, "(%s max)"%(columns*rows*totalPages), "to accomidate", totalCount * (2 if printBack else 1), "images", "frontback" if printBack else "")
    pageImages = []
    for _ in range(totalPages):
        imageSize = (int(printoutPlayAreaInches[0]*inchToPixelConversion), int(printoutPlayAreaInches[1]*inchToPixelConversion))
        createdImage = Image.new("RGB", imageSize, whiteColorRGB)
        pageImages.append(createdImage)

    return pageImages

def createMissingImage(size, filepath):
    # Create a pink background
    image = Image.new("RGB", size, (255, 192, 203))
    draw = ImageDraw.Draw(image)
    
    # Get immediate parent directory and filename
    parentDir = os.path.basename(os.path.dirname(filepath))
    filename = os.path.basename(filepath)
    text = f"Missing\n{parentDir}/\n{filename}"
    
    # Calculate appropriate font size (10% of image height)
    fontSize = int(size[1] * 0.1)
    from PIL import ImageFont
    try:
        font = ImageFont.truetype("arial.ttf", fontSize)
    except:
        font = ImageFont.load_default()
    
    # Calculate text size and position for centered multiline text
    spacing = 1.5
    textBbox = draw.multiline_textbbox((0, 0), text, font=font, align="center", spacing=spacing)
    textWidth = textBbox[2] - textBbox[0]
    textHeight = textBbox[3] - textBbox[1]
    textPosition = ((size[0] - textWidth) // 2, (size[1] - textHeight) // 2)
    
    # Draw text in center
    draw.multiline_text(textPosition, text, fill=(0, 0, 0), font=font, align="center", spacing=spacing)
    
    return image

# Add new function for creating die cross layout
async def createDieCrossLayout(filepaths, size):
    """Creates a cross layout for a die using the provided face images"""
    # Create a 3x4 white canvas for the cross layout, with extra space for flanges
    flangeSize = int(size[1] * 0.15)  # 20% of face height for flange
    crossSize = (
        size[0] * 3 + flangeSize * 2,  # Add space for left and right flanges
        size[1] * 4 + flangeSize * 2    # Add space for top and bottom flanges
    )
    crossImage = Image.new("RGB", crossSize, (255, 255, 255))
    draw = ImageDraw.Draw(crossImage)
    
    # Load and resize all die faces
    faces = []
    for filepath in filepaths:
        try:
            face = Image.open(filepath)
            face = face.resize(size)
            faces.append(face)
        except (FileNotFoundError, IOError):
            faces.append(createMissingImage(size, filepath))

    # Layout positions (relative to size units), adjusted for flange space
    positions = [
        (1 + flangeSize/size[0], flangeSize/size[1]),      # Top (1)
        (1 + flangeSize/size[0], 1 + flangeSize/size[1]),  # Front (2)
        (flangeSize/size[0], 1 + flangeSize/size[1]),      # Left (3)
        (2 + flangeSize/size[0], 1 + flangeSize/size[1]),  # Right (4)
        (1 + flangeSize/size[0], 2 + flangeSize/size[1]),  # Back (5)
        (1 + flangeSize/size[0], 3 + flangeSize/size[1]),  # Bottom (6)
    ]

    # Paste faces onto cross
    # First, draw all flanges
    for i, pos in enumerate(positions):
        position = (int(pos[0] * size[0]), int(pos[1] * size[1]))
        
        if i == 0:  # Face 1 (top)
            # Add top flange
            draw.rectangle([
                position[0], position[1] - flangeSize,  # top-left
                position[0] + size[0], position[1],     # bottom-right
            ], fill="pink")

        elif i == 2:  # Face 3 (left)
            # Add top flange
            draw.rectangle([
                position[0], position[1] - flangeSize,
                position[0] + size[0], position[1]
            ], fill="pink")
            # Add left flange
            draw.rectangle([
                position[0] - flangeSize, position[1],
                position[0], position[1] + size[1]
            ], fill="pink")
            # Add bottom flange
            draw.rectangle([
                position[0], position[1] + size[1],
                position[0] + size[0], position[1] + size[1] + flangeSize
            ], fill="pink")

        elif i == 3:  # Face 4 (right)
            # Add top flange
            draw.rectangle([
                position[0], position[1] - flangeSize,
                position[0] + size[0], position[1]
            ], fill="pink")
            # Add right flange
            draw.rectangle([
                position[0] + size[0], position[1],
                position[0] + size[0] + flangeSize, position[1] + size[1]
            ], fill="pink")
            # Add bottom flange
            draw.rectangle([
                position[0], position[1] + size[1],
                position[0] + size[0], position[1] + size[1] + flangeSize
            ], fill="pink")

    # Then paste all faces
    for face, pos in zip(faces, positions):
        position = (int(pos[0] * size[0]), int(pos[1] * size[1]))
        crossImage.paste(face, position)
        face.close()

    return crossImage
