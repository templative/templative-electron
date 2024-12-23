from templative.lib.produce.customComponents.producer import Producer

from .. import outputWriter
from . import svgscissors
import os 

from templative.lib.manage.models.produceProperties import ProduceProperties, PreviewProperties
from templative.lib.manage.models.gamedata import StudioData, GameData, ComponentData, ComponentBackData, PieceData
from templative.lib.manage.models.composition import ComponentComposition
from templative.lib.manage.models.artdata import ComponentArtdata
from templative.lib.manage import defineLoader
from templative.lib.produce.customComponents.svgscissors.fontCache import FontCache

from templative.lib.componentInfo import COMPONENT_INFO

class FrontOnlyProducer(Producer):
    @staticmethod
    async def createPiecePreview(previewProperties:PreviewProperties, componentComposition:ComponentComposition, componentData:ComponentData, componentArtdata:ComponentArtdata):
        piecesDataBlob = await defineLoader.loadPiecesGamedata(previewProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"])
        if not piecesDataBlob or piecesDataBlob == {}:
            print("Skipping %s component due to missing pieces gamedata." % componentComposition.componentCompose["name"])
            return
        await FrontOnlyProducer.createPiece(previewProperties, componentComposition, componentData, componentArtdata, piecesDataBlob)
    
    @staticmethod
    async def createPiece(previewProperties:PreviewProperties, componentComposition:ComponentComposition, componentData:ComponentData, componentArtdata:ComponentArtdata, piecesDataBlob: [any]):        
        componentBackData = ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob)
        await svgscissors.createArtFileForPiece(componentComposition, componentArtdata, componentBackData, piecesDataBlob, previewProperties)

    @staticmethod
    async def createComponent(produceProperties:ProduceProperties, componentComposition:ComponentComposition, componentData:ComponentData, componentArtdata:ComponentArtdata, fontCache:FontCache):
        piecesDataBlob = await defineLoader.loadPiecesGamedata(produceProperties.inputDirectoryPath, componentComposition.gameCompose, componentComposition.componentCompose["piecesGamedataFilename"])
        if not piecesDataBlob or piecesDataBlob == {}:
            print("Skipping %s component due to missing pieces gamedata." % componentComposition.componentCompose["name"])
            return

        await FrontOnlyProducer.createComponentPieces(produceProperties, componentComposition, componentData, componentArtdata, piecesDataBlob, fontCache)

    @staticmethod
    async def createComponentPieces(produceProperties:ProduceProperties, componentComposition:ComponentComposition, componentData:ComponentData, componentArtdata:ComponentArtdata, piecesDataBlob: [any], fontCache:FontCache):
        componentFolderName = componentComposition.componentCompose["name"]
        
        componentBackOutputDirectory = await outputWriter.createComponentFolder(componentFolderName, produceProperties.outputDirectoryPath)
        await FrontOnlyProducer.writeComponentInstructions(componentComposition, componentBackOutputDirectory, componentFolderName, piecesDataBlob)
        
        # We use a component back that has no unique data. It has the same info within it as a componentData.
        componentBackData = ComponentBackData(componentData.studioDataBlob, componentData.gameDataBlob, componentData.componentDataBlob)
        await svgscissors.createArtFilesForComponent(componentComposition, componentArtdata, componentBackData, piecesDataBlob, componentBackOutputDirectory, produceProperties, fontCache)

    @staticmethod
    async def writeComponentInstructions(compositions: ComponentComposition, componentBackOutputDirectory: str, componentFolderName: str, piecesGamedata: any) -> None:
        componentInstructionFilepath = os.path.join(componentBackOutputDirectory, "component.json")
        frontInstructions = await FrontOnlyProducer.getInstructionSetsForFilesForBackArtdataHash(componentFolderName, piecesGamedata, componentBackOutputDirectory)
        
        componentInstructions = {
            "name": componentFolderName,
            "isDebugInfo": False if not "isDebugInfo" in compositions.componentCompose else compositions.componentCompose["isDebugInfo"],
            "type": compositions.componentCompose["type"],
            "quantity": compositions.componentCompose["quantity"],
            "frontInstructions": frontInstructions
        }
        await outputWriter.dumpInstructions(componentInstructionFilepath, componentInstructions)

    @staticmethod
    async def getInstructionSetsForFilesForBackArtdataHash(componentName:str, piecesGamedataBlog:[any], componentFilepath:str):
        instructionSets = []
        for pieceGamedata in piecesGamedataBlog:
            if pieceGamedata["quantity"] == 0:
                continue
            filename = "%s-%s.png" % (componentName, pieceGamedata["name"])
            artFilepath = os.path.abspath(os.path.join(componentFilepath, filename))
            instructionSets.append({"name": pieceGamedata["name"], "filepath": artFilepath, "quantity": pieceGamedata["quantity"]})

        return instructionSets