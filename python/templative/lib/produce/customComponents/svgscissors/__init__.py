import asyncio
import hashlib

from .svgScissors import createArtFileOfPiece

from templative.lib.manage.models.produceProperties import ProduceProperties, PreviewProperties
from templative.lib.manage.models.gamedata import ComponentBackData, PieceData
from templative.lib.manage.models.composition import ComponentComposition
from templative.lib.manage.models.artdata import ComponentArtdata
from templative.lib.produce.customComponents.backProducer import BackProducer
from templative.lib.produce.customComponents.svgscissors.fontCache import FontCache

async def createArtFileForPiece(compositions:ComponentComposition, componentArtdata:ComponentArtdata, uniqueComponentBackData:ComponentBackData, piecesDataBlob:[any], componentBackOutputDirectory:str, previewProperties:PreviewProperties, fontCache:FontCache):
    tasks = []
    for pieceGamedata in piecesDataBlob:
        if pieceGamedata["name"] != previewProperties.pieceName:
            continue
        
        pieceData = PieceData(uniqueComponentBackData.studioDataBlob, uniqueComponentBackData.gameDataBlob, uniqueComponentBackData.componentDataBlob, uniqueComponentBackData.componentBackDataBlob, uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData, uniqueComponentBackData.pieceUniqueBackHash, pieceGamedata)

        if "Front" in componentArtdata.artDataBlobDictionary:
            task = asyncio.create_task(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Front"], pieceData, componentBackOutputDirectory, previewProperties, fontCache))
            tasks.append(task)
        if "DieFace" in componentArtdata.artDataBlobDictionary:
            task = asyncio.create_task(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, previewProperties, fontCache))
            tasks.append(task)
            
    uniqueComponentBackData.componentBackDataBlob["name"] = "back"
    if "Back" in componentArtdata.artDataBlobDictionary:
        tasks.append(asyncio.create_task(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Back"], uniqueComponentBackData, componentBackOutputDirectory, previewProperties, fontCache)))

    await asyncio.gather(*tasks)   
        
async def createArtFilesForComponent(compositions:ComponentComposition, componentArtdata:ComponentArtdata, uniqueComponentBackData:ComponentBackData, piecesDataBlob:[any], componentBackOutputDirectory:str, produceProperties:ProduceProperties, fontCache:FontCache):
    tasks = []
    for pieceGamedata in piecesDataBlob:
        pieceHash = BackProducer.createUniqueBackHashForPiece(uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData, pieceGamedata)
        if pieceHash != uniqueComponentBackData.pieceUniqueBackHash:
            continue
        pieceData = PieceData(uniqueComponentBackData.studioDataBlob, uniqueComponentBackData.gameDataBlob, uniqueComponentBackData.componentDataBlob, uniqueComponentBackData.componentBackDataBlob, uniqueComponentBackData.sourcedVariableNamesSpecificToPieceOnBackArtData, uniqueComponentBackData.pieceUniqueBackHash, pieceGamedata)

        if "Front" in componentArtdata.artDataBlobDictionary:
            task = asyncio.create_task(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Front"], pieceData, componentBackOutputDirectory, produceProperties, fontCache))
            tasks.append(task)
        if "DieFace" in componentArtdata.artDataBlobDictionary:
            task = asyncio.create_task(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["DieFace"], pieceData, componentBackOutputDirectory, produceProperties, fontCache))
            tasks.append(task)

    uniqueComponentBackData.componentBackDataBlob["name"] = "back"
    if "Back" in componentArtdata.artDataBlobDictionary:
        tasks.append(asyncio.create_task(createArtFileOfPiece(compositions, componentArtdata.artDataBlobDictionary["Back"], uniqueComponentBackData, componentBackOutputDirectory, produceProperties, fontCache)))

    await asyncio.gather(*tasks)