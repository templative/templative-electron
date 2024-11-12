from templative.lib.create import templateComponentProjectUpdater
from templative.lib.manage import defineLoader
from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO
from os.path import join

async def createComponentByType(gameRootDirectoryPath, name, type, componentAIDescription):
    if type in COMPONENT_INFO:
        await createCustomComponent(gameRootDirectoryPath, name, type, componentAIDescription)
        return
    
    if type in STOCK_COMPONENT_INFO:
        await createStockComponent(gameRootDirectoryPath, name, type)
        return
    
    print("Skipping %s component as we don't have component info on %s" % (name, type))

async def createCustomComponent(gameRootDirectoryPath, name, type, componentAIDescription):
    if name == None or name == "":
        print("Must include a name.")
        return
    
    if type == None or type == "":
        raise Exception("Must include a type.")

    if not type in COMPONENT_INFO:
        print("Skipping %s component as we don't have component info on %s" % (name, type))
        return
    
    componentInfo = COMPONENT_INFO[type]

    gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath)
    componentComposeData = await defineLoader.loadComponentCompose(gameRootDirectoryPath)
    await templateComponentProjectUpdater.addToComponentCompose(name, type, gameRootDirectoryPath, componentComposeData, componentInfo)

    piecesDirectoryPath = join(gameRootDirectoryPath, gameCompose["piecesGamedataDirectory"])
    componentGamedataDirectoryPath = join(gameRootDirectoryPath, gameCompose["componentGamedataDirectory"])
    artdataDirectoryPath = join(gameRootDirectoryPath, gameCompose["artdataDirectory"])
    artTemplatesDirectoryPath = join(gameRootDirectoryPath, gameCompose["artTemplatesDirectory"])
    artOverlaysDirectoryPath = join(gameRootDirectoryPath, gameCompose["artInsertsDirectory"])
    print(name)
    artdataFiles = await templateComponentProjectUpdater.createArtDataFiles(artdataDirectoryPath, name, componentInfo["ArtDataTypeNames"], componentAIDescription)
    # artdataFiles = {'Front': {'name': 'envoys', 'templateFilename': 'envoysFront', 'textReplacements': [{'key': 'name', 'scope': 'piece', 'source': 'name'}, {'key': 'rules', 'scope': 'component', 'source': 'rules'}], 'styleUpdates': [{'id': 'background', 'cssValue': 'fill', 'scope': 'piece', 'source': 'countryColor'}], 'overlays': [{'scope': 'piece', 'source': 'diplomatImage', 'positionX': 0, 'positionY': 0}]}}
    componentData = await templateComponentProjectUpdater.createComponentJson(componentGamedataDirectoryPath, name, componentAIDescription, artdataFiles)
    # componentData = {
    #     "displayName": "Foreign Envoys",
    #     "pieceDisplayName": "Envoy Card",
    #     "rules": "Each card represents an envoy from Russia, Italy, France, Britain, or Sweden. Each card contains a name and rules text. The background of the card matches the color of the country it represents. Each card also features an overlay of a famous diplomat from the respective country."
    # }
    # piecesData = [{"name": "russianenvoy", "displayName": "Russian Envoy", "quantity": 1, "rules": "Replace with reasonable content", "countryColor": "Red", "diplomatImage": "russianDiplomat"},
    # {"name": "italianenvoy", "displayName": "Italian Envoy", "quantity": 1, "rules": "Replace with reasonable content", "countryColor": "Green", "diplomatImage": "italianDiplomat"},
    # {"name": "frenchenvoy", "displayName": "French Envoy", "quantity": 1, "rules": "Replace with reasonable content", "countryColor": "Blue", "diplomatImage": "frenchDiplomat"},
    # {"name": "britishenvoy", "displayName": "British Envoy", "quantity": 1, "rules": "Replace with reasonable content", "countryColor": "Red", "diplomatImage": "britishDiplomat"},
    # {"name": "swedishenvoy", "displayName": "Swedish Envoy", "quantity": 1, "rules": "Replace with reasonable content", "countryColor": "Blue", "diplomatImage": "swedishDiplomat"}]
    piecesData = []
    if componentInfo["HasPieceData"]:
        hasPieceQuantity = componentInfo["HasPieceQuantity"]
        piecesData = await templateComponentProjectUpdater.createPiecesJson(
            piecesDirectoryPath, 
            name, 
            hasPieceQuantity, 
            componentAIDescription,  
            artdataFiles
        )

    await templateComponentProjectUpdater.createArtFiles(
        artTemplatesDirectoryPath, 
        name, 
        type, 
        componentInfo["ArtDataTypeNames"], 
        componentAIDescription, 
        artdataFiles
    )
    await templateComponentProjectUpdater.createOverlayFiles(artOverlaysDirectoryPath, type, componentData, piecesData)

async def createStockComponent(gameRootDirectoryPath, name, stockPartId):
    if name == None or name == "":
        print("Must include a name.")
        return
    
    if stockPartId == None or stockPartId == "":
        raise Exception("Must include a type.")
    
    if not stockPartId in STOCK_COMPONENT_INFO:
        print("Skipping %s component as we don't have component info on %s" % (name, stockPartId))
        return
    gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath)
    componentComposeData = await defineLoader.loadComponentCompose(gameRootDirectoryPath)
    await templateComponentProjectUpdater.addStockComponentToComponentCompose(name, stockPartId, gameRootDirectoryPath, componentComposeData)


