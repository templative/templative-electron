import asyncio, os
from templative.lib.manage import instructionsLoader
from templative.lib.distribute.gameCrafter import advertisementCreator
from templative.lib.distribute.gameCrafter.componentCreator import createComponents, createRules
from templative.lib.distribute.gameCrafter.fileFolderManager import createGame, createFolderAtRoot

gameCrafterBaseUrl = "https://www.thegamecrafter.com"

async def uploadGame(gameCrafterSession, gameRootDirectoryPath, outputDirectory, isPublish, isStock, isAsynchronous, isProofed):
    if not gameRootDirectoryPath:
        raise Exception("Game root directory path cannot be None")

    game = await instructionsLoader.loadGameInstructions(outputDirectory)
    studio = await instructionsLoader.loadStudioInstructions(outputDirectory)

    if not "gameCrafterDesignerId" in studio or studio["gameCrafterDesignerId"] == "":
        print("!!! Missing 'gameCrafterDesignerId' in outputted studio.json.", studio)
        return

    print("Uploading %s for %s." % (game["displayName"], studio["displayName"]))

    uniqueGameName = os.path.basename(outputDirectory)

    cloudGameFolder = await createFolderAtRoot(gameCrafterSession, uniqueGameName)
    
    logoImageFileId, backdropImageFileId, advertisementImageFileId, actionShotImageFileId = await createAdvertisments(gameCrafterSession, gameRootDirectoryPath, cloudGameFolder["id"])

    shortDescription = await pullAdvertDataFromGameJsonButAllowDefault(game, "shortDescription", "It was a good game.")
    longDescription = await pullAdvertDataFromGameJsonButAllowDefault(game, "longDescription", "Generated using templative.lib.")
    coolFactors = await pullAdvertDataFromGameJsonButAllowDefault(game, "coolFactors", ["Mechanically Built", "Humans Need Not Apply", "Auto-generated"])
    category = await pullAdvertDataFromGameJsonButAllowDefault(game, "category", "Board Games")
    websiteUrl = await pullAdvertDataFromGameJsonButAllowDefault(game, "websiteUrl", "")
    minAge = await pullAdvertDataFromGameJsonButAllowDefault(game, "minAge", "12+")
    playTime = await pullAdvertDataFromGameJsonButAllowDefault(game, "playTime", "30-60")
    minPlayers = await pullAdvertDataFromGameJsonButAllowDefault(game, "minPlayers", "4")
    maxPlayers = await pullAdvertDataFromGameJsonButAllowDefault(game, "maxPlayers", "4")

    cloudGame = await createGame(gameCrafterSession, uniqueGameName, game, studio["gameCrafterDesignerId"], isPublish, shortDescription, longDescription, coolFactors, logoImageFileId, backdropImageFileId, advertisementImageFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers)

    await advertisementCreator.createActionShot(gameCrafterSession, cloudGame["id"], actionShotImageFileId)

    await createRules(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolder["id"])
    await createComponents(gameCrafterSession, outputDirectory, cloudGame, cloudGameFolder["id"], isPublish, isStock, isAsynchronous, isProofed)

    gameUrl = "%s%s%s"%(gameCrafterBaseUrl, "/make/games/", cloudGame["id"])
    print("Uploads finished for %s, visit %s" % (cloudGame["name"], gameUrl))
    return gameUrl

async def pullAdvertDataFromGameJsonButAllowDefault(gameData, key, defaultValue):
    if key in gameData:
        return gameData[key]
    
    print("!!! Missing \"%s\" in game.json. Using default value of \"%s\"." % (key, defaultValue))
    return defaultValue

async def createAdvertisments(gameCrafterSession, gameRootDirectoryPath, cloudGameFolderId):
    advertismentFolderId = await advertisementCreator.createAdvertisementFolder(gameCrafterSession, cloudGameFolderId)
    "testImages/actionShot.png",

    backupFilesDirectoryPath = os.path.join(os.path.dirname(__file__),"testImages")
    
    logoImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        os.path.abspath(os.path.join(gameRootDirectoryPath, "gamecrafter/logo.png")), 
        os.path.join(backupFilesDirectoryPath, "logo.png"), 
        advertismentFolderId)
    
    backdropImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        os.path.abspath(os.path.join(gameRootDirectoryPath, "./gamecrafter/backdrop.png")),
        os.path.join(backupFilesDirectoryPath, "backdrop.png"), 
        advertismentFolderId)

    advertisementImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        os.path.abspath(os.path.join(gameRootDirectoryPath, "./gamecrafter/advertisement.png")),
        os.path.join(backupFilesDirectoryPath, "advertisement.png"), 
        advertismentFolderId)

    actionShotImageFileId = await advertisementCreator.createAdvertismentImageInFolder(gameCrafterSession, 
        os.path.abspath(os.path.join(gameRootDirectoryPath, "./gamecrafter/actionShot.png")),
        os.path.join(backupFilesDirectoryPath, "actionShot.png"), 
        advertismentFolderId)
    
    return logoImageFileId, backdropImageFileId, advertisementImageFileId, actionShotImageFileId



