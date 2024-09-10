from os import path, mkdir
from json import dump
from shutil import copyfile
from hashlib import md5

async def createPackageDirectories(gameName, packagesDirectoryPath):
    packageDirectoryPath = path.join(packagesDirectoryPath, gameName)
    if not path.exists(packageDirectoryPath):
        mkdir(packageDirectoryPath)

    subDirectoryNames = [
        "Fonts", "Models", "Scripts", "Sounds", "States", "Templates", "Textures", "Thumbnails"
    ]

    for subDirectoryName in subDirectoryNames:
        subDirectoryPath = path.join(packageDirectoryPath, subDirectoryName)
        if path.exists(subDirectoryPath):
            continue
        mkdir(subDirectoryPath)

    return packageDirectoryPath

async def copyFrontImageToTextures(componentName, frontInstructions, textureDirectoryFilepath):
    frontImageName = "%s-front.jpeg" % componentName
    frontImageFilepath = path.join(textureDirectoryFilepath, frontImageName)
    copyfile(frontInstructions["filepath"], frontImageFilepath)

async def copyBackImageToTextures(componentName, backInstructions, textureDirectoryFilepath):
    backImageName = "%s-back.jpeg" % componentName
    backImageFilepath = path.join(textureDirectoryFilepath, backImageName)
    copyfile(backInstructions["filepath"], backImageFilepath)
    
async def createManifest(gameName, packageDirectoryPath):
    packageGuid = md5(gameName.encode()).hexdigest()
    manifestData = {
        "Name": gameName,
        "Version": "1",
        "GUID": packageGuid
    }
    manifestFilepath = path.join(packageDirectoryPath, "manifest.json")
    with open(manifestFilepath, "w") as manifestFile:
        dump(manifestData, manifestFile, indent=2)
    return packageGuid