from templative.lib.distribute.gameCrafter.util import httpOperations
from os import path
from templative.lib.distribute.gameCrafter.fileFolderManager import createFileInFolder
import pathlib

async def createAdvertisementFolder(gameCrafterSession, rootFolderId):
    folder = await httpOperations.postFolder(gameCrafterSession, "Advertisements", rootFolderId)
    return folder["id"]
    
async def createAdvertismentImageInFolder(gameCrafterSession, filepath, backupFilepath, folderId):
    filepathUsed = filepath
    if not path.exists(filepath):
        filepathUsed = backupFilepath
        print("!!! Advertising file %s doesn't exist, using default %s" % (filepath, backupFilepath))
    filenameWithoutExtension = pathlib.Path(filepathUsed).stem
    fileId = await createFileInFolder(gameCrafterSession, filenameWithoutExtension, filepathUsed, folderId)
    return fileId

async def createActionShot(gameCrafterSession, gameId, fileId):
    if fileId == "" or fileId == None:
        raise Exception("File id invalid.")
    await httpOperations.createActionShot(gameCrafterSession, gameId, fileId)