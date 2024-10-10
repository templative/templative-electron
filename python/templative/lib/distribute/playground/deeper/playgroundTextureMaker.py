from os import path
from PIL import Image
import math
from templative.lib.componentInfo import COMPONENT_INFO

async def createCompositeImageInTextures(componentName, componentTypeInfo, frontInstructions, textureDirectoryFilepath):
    totalCount = 0
    for instruction in frontInstructions:
        totalCount += instruction["quantity"]

    if totalCount == 0:
        return 0,0,0
    
    pixelDimensions = componentTypeInfo["DimensionsPixels"]
    columns = math.floor(math.sqrt(totalCount))
    rows = columns
    while columns * rows < totalCount:
        rows += 1

    tiledImage = Image.new('RGB',(pixelDimensions[0]*columns, pixelDimensions[1]*rows))
    
    xIndex = 0
    yIndex = 0
    for instruction in frontInstructions:
        image = Image.open(instruction["filepath"])
        for _ in range(instruction["quantity"]):
            tiledImage.paste(image,(xIndex*pixelDimensions[0],yIndex*pixelDimensions[1]))
            xIndex += 1
            if xIndex == columns:
                xIndex = 0
                yIndex +=1

    frontImageName = "%s-front.jpeg" % componentName
    frontImageFilepath = path.join(textureDirectoryFilepath, frontImageName)
    tiledImage.save(frontImageFilepath,"JPEG")
    return totalCount, columns, rows