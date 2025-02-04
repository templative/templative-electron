from json import dump, dumps
from os import path
from shutil import copyfile
import sys
from templative.lib.ai import aiArtGenerator
from templative.lib.componentInfo import COMPONENT_INFO 
import re

async def addToComponentCompose(name, type, gameRootDirectoryPath, componentComposeData, componentInfo):    
    for component in componentComposeData:
        if component["name"] != name:
            continue
        componentComposeData.remove(component)
        break

    componentComposition = {
        "name": name,
        "type": type,
        "quantity": 1,
        "componentGamedataFilename": name,
        "disabled": False
    }

    if componentInfo["HasPieceData"]:
        componentComposition["piecesGamedataFilename"] = name
    
    for artDataTypeName in componentInfo["ArtDataTypeNames"]:
        componentComposition["artdata%sFilename" % artDataTypeName] = "%s%s" % (name, artDataTypeName)

    componentComposeData.append(componentComposition)
    with open(path.join(gameRootDirectoryPath, 'component-compose.json'), 'w') as componentComposeFile:
        dump(componentComposeData, componentComposeFile, indent=4)

async def addStockComponentToComponentCompose(name, stockPartId, gameRootDirectoryPath, componentComposeData):    
    for component in componentComposeData:
        if component["name"] != name:
            continue
        componentComposeData.remove(component)
        break

    componentComposeData.append({
        "name": name,
        "type": "STOCK_%s" % stockPartId,
        "quantity": 1,
        "disabled": False
    })
    with open(path.join(gameRootDirectoryPath, 'component-compose.json'), 'w') as componentComposeFile:
        dump(componentComposeData, componentComposeFile, indent=4)

async def createPiecesJson(piecesDirectoryPath, name, hasPieceQuantity, type, componentAIDescription=None, artdataFiles=None):
    pieces = [{
        "name": name,
    }]

    if type.startswith("CustomColor") or type == "CustomWoodD6":
        die_faces = {
            "CustomColorD4": 4,
            "CustomColorD6": 6, 
            "CustomWoodD6": 6,
            "CustomColorD8": 8
        }
        if type in die_faces:
            pieces = [{"name": str(i)} for i in range(1, die_faces[type] + 1)]
    elif hasPieceQuantity:
        for piece in pieces:
            piece["quantity"] = 1
    print(pieces)

    # needsContent = False
    # if "Front" in artdataFiles:
    #     artdata = artdataFiles["Front"]
    #     for section in ["textReplacements", "styleUpdates", "overlays"]:
    #         for item in artdata.get(section, []):
    #             if item["scope"] != "piece":
    #                 continue
    #             source = item["source"]
    #             if source == "name" or source == "quantity":
    #                 continue
    #             needsContent = True
    #             pieces[0][source] = "Replace with reasonable content"
    
    # if needsContent and componentAIDescription != None:
    #     pieces = await aiArtGenerator.enhancePiecesJson(pieces, componentAIDescription)

    filepath = path.join(piecesDirectoryPath, f'{name}.json')
    with open(filepath, 'w') as piecesJsonFile:
        dump(pieces, piecesJsonFile, indent=4)
    print(f"Created pieces {filepath}")
    return {
        "type": f"pieces",
        "filepath": filepath,
        "contents": dumps(pieces)
    }
    # return pieces

async def createComponentJson(componentDirectoryPath, name):#, componentAIDescription, artdataFiles):
    componentJsonData = {
        "name": name,
    }
    # needsContent = False
    # for face in artdataFiles:
    #     artdata = artdataFiles[face]
    #     for section in ["textReplacements", "styleUpdates", "overlays"]:
    #         for item in artdata.get(section, []):
    #             if item["scope"] != "component":
    #                 continue
    #             if item["source"] == "name"
    #                 continue
    #             componentJsonData[item["source"]] = "Replace with reasonable content"
    #             needsContent = True

    # if needsContent and componentAIDescription != None:
    #     componentJsonData = await aiArtGenerator.enhanceComponentJson(componentJsonData, componentAIDescription)
    
    componentJsonFilepath = path.join(componentDirectoryPath, '%s.json' % name)

    with open(componentJsonFilepath, 'w') as componentJsonFile:
        dump(componentJsonData, componentJsonFile, indent=4)
    print(componentJsonData)
    print(f"Created component json {componentJsonFilepath}")

    return {
        "type": f"component",
        "filepath": componentJsonFilepath,
        "contents": dumps(componentJsonData)
    }

    # return componentJsonData

async def createArtDataFiles(artDataDirectoryPath, name, artDataTypeNames): #, componentAIDescription=None):
    artdataFiles = []
    for artDataTypeName in artDataTypeNames:
        artDataNameAndSide = f'{name}{artDataTypeName}'
        artdata = {
            "name": name,
            "templateFilename": artDataNameAndSide,
            "textReplacements": [],
            "styleUpdates": [],
            "overlays": []
        }
        # if componentAIDescription and artDataTypeName == "Front":
        #     artdata = await aiArtGenerator.enhanceArtdata(artdata, componentAIDescription)
        filepath = path.join(artDataDirectoryPath, f'{artDataNameAndSide}.json')
        with open(filepath, 'w') as artDataJsonFile:
            dump(artdata, artDataJsonFile, indent=4)
        print(artdata)
        print(f"Created artdata {artDataNameAndSide}")

        artdataFiles.append({
            "type": f"artdata_{artDataTypeName}",
            "filepath": filepath,
            "contents": dumps(artdata)
        })
    return artdataFiles


def resource_path(relative_path):
    """ Get absolute path to resource, works for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = path.abspath(".")

    return path.join(base_path, relative_path)

async def createArtFiles(artTemplatesDirectoryPath, name, type, artDataTypeNames, componentAIDescription=None, artdataFiles=None):
    componentTemplateFilepath = resource_path(f"templative/lib/create/componentTemplates/{type}.svg")
    contents = open(componentTemplateFilepath, 'r').read()

    print(f"Grabbed template from {componentTemplateFilepath}")

    artFiles = []
    for artDataTypeName in artDataTypeNames:
        artSideName = f'{name}{artDataTypeName}'
        artSideNameFilepath = path.join(artTemplatesDirectoryPath, f"{artSideName}.svg")
        
        print(f"Creating template at {artSideNameFilepath}")
        copyfile(componentTemplateFilepath, artSideNameFilepath)
        artFiles.append({
            "type": f"art_{artDataTypeName}",
            "filepath": artSideNameFilepath,
            "contents": contents
        })
        # if componentAIDescription and artDataTypeName == "Front":
        #     # Read the template SVG
        #     with open(artSideNameFilepath, 'r') as svg_file:
        #         svg_content = svg_file.read()
            
        #     # Get AI-enhanced SVG
        #     enhanced_svg = await aiArtGenerator.enhanceSvg(svg_content, componentAIDescription, artdataFiles["Front"])
            
        #     # Save the enhanced SVG
        #     with open(artSideNameFilepath, 'w') as svg_file:
        #         svg_file.write(enhanced_svg)
        #     print(enhanced_svg)
        #     print("Enhanced template svg.")
    return artFiles

async def createOverlayFiles(artOverlaysDirectoryPath, type, componentData, piecesData):
    pixelDimensions = COMPONENT_INFO[type]["DimensionsPixels"]
    width = pixelDimensions[0]
    height = pixelDimensions[1]

    blankSvg = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Generator: Adobe Illustrator 15.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg
   version="1.1"
   id="YOUR_ARTWORK_HERE"
   x="0px"
   y="0px"
   width="{width}"
   height="{height}"
   viewBox="0 0 {width} {height}"
   enable-background="new 0 0 198 270"
   xml:space="preserve"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">

</svg>"""

    allData = [componentData] + piecesData
    for thing in allData:
        for field in thing:
            if not field.endswith('Image'):
                continue
            overlayFilepath = path.join(artOverlaysDirectoryPath, f"{thing[field]}.svg")
            print(f"Creating overlay at {overlayFilepath}")
            with open(overlayFilepath, 'w') as f:
                f.write(blankSvg)
    
   
