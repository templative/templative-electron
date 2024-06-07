from json import dump
from os import path
from shutil import copyfile
import sys

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

async def createPiecesJson(piecesDirectoryPath, name, hasPieceQuantity):
    piecesJsonData = """[
    { "name": "%s", "displayName": "%s"%s }   
]""" % (name, name, """, "quantity": 1""" if hasPieceQuantity else "")
    
    with open(path.join(piecesDirectoryPath, '%s.json' % name), 'w') as piecesJsonFile:
        piecesJsonFile.write(piecesJsonData)

async def createComponentJson(componentDirectoryPath, name):
    componentJsonData = {
        "displayName": name,
        "pieceDisplayName": name
    }   
    with open(path.join(componentDirectoryPath, '%s.json' % name), 'w') as componentJsonFile:
        dump(componentJsonData, componentJsonFile, indent=4)

async def createArtDataFiles(artDataDirectoryPath, name, artDataTypeNames):
    for artDataTypeName in artDataTypeNames:
        await createBlankArtDataFile(artDataDirectoryPath, name, artDataTypeName)
        
async def createBlankArtDataFile(artDataDirectoryPath, name, artDataTypeName):
    artDataNameAndSide = '%s%s' % (name,artDataTypeName)
    with open(path.join(artDataDirectoryPath, '%s.json' % (artDataNameAndSide)), 'w') as artDataJsonFile:
        dump({
        "name": name,
        "templateFilename": artDataNameAndSide,
        "textReplacements": [
        ],
        "styleUpdates":[
        ],
        "overlays": [
        ]
    }, artDataJsonFile, indent=4)

def resource_path(relative_path):
    """ Get absolute path to resource, works for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = path.abspath(".")

    return path.join(base_path, relative_path)

async def createArtFiles(artTemplatesDirectoryPath, name, type, artDataTypeNames):
    componentTemplateFilepath = resource_path(f"templative/lib/create/componentTemplates/{type}.svg")
    print("Grabbed template from %s" % componentTemplateFilepath)
    for artDataTypeName in artDataTypeNames:
        artSideName = '%s%s' % (name,artDataTypeName)
        artSideNameFilepath = path.join(artTemplatesDirectoryPath, "%s.svg" % artSideName)
        copyfile(componentTemplateFilepath, artSideNameFilepath)
   
