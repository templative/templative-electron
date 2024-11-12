from aiohttp import web
from templative.lib.create import projectCreator, componentCreator
from templative.lib.distribute.printout import createPdfForPrinting
from templative.lib.distribute.playground import convertToTabletopPlayground
from templative.lib.distribute.simulator import convertToTabletopSimulator
from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO
from templative.lib.produce import gameProducer
routes = web.RouteTableDef()

@routes.get("/status")
async def getStatus(_):
  return web.Response(status=200)

@routes.post("/project") 
async def createProject(request):
  data = await request.json()
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  result = projectCreator.createProjectInDirectory(data["directoryPath"])
  if result != 1:
    return web.Response(status=500)
  return web.Response(status=200)

@routes.post("/printout") 
async def printout(request):
  data = await request.json()
  if data["outputDirectorypath"] == None:
    return "Missing outputDirectorypath", 400
  if data["isBackIncluded"] == None:
    return "Missing isBackIncluded", 400
  if data["size"] == None:
    return "Missing size", 400
  if data["areMarginsIncluded"] == None:
    return "Missing areMarginsIncluded", 400
  
  result = await createPdfForPrinting(data["outputDirectorypath"], data["isBackIncluded"], data["size"], data["areMarginsIncluded"])
  if result != 1:
    return web.Response(status=500)
  return web.Response(status=200)

@routes.post("/playground")
async def playground(request):
  data = await request.json()
  if data["outputDirectorypath"] == None:
    return "Missing outputDirectorypath", 400
  if data["playgroundPackagesDirectorypath"] == None:
    return "Missing playgroundPackagesDirectorypath", 400
  result = await convertToTabletopPlayground(data["outputDirectorypath"], data["playgroundPackagesDirectorypath"])
  if result != 1:
    return web.Response(status=500)
  return web.Response(status=200)

@routes.post("/simulator")
async def simulator(request):
  data = await request.json()
  if data["outputDirectorypath"] == None:
    return "Missing outputDirectorypath", 400
  if data["tabletopSimulatorDocumentsDirectorypath"] == None:
    return "Missing tabletopSimulatorDocumentsDirectorypath", 400
  result = await convertToTabletopSimulator(data["outputDirectorypath"], data["tabletopSimulatorDocumentsDirectorypath"])
  if result != 1:
    return web.Response(status=500)
  return web.Response(status=200)

@routes.post("/component") 
async def createComponent(request):
  data = await request.json()
  if data["componentName"] == None:
    return "Missing componentName", 400
  if data["componentType"] == None:
    return "Missing componentType", 400
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  await componentCreator.createComponentByType(data["directoryPath"], data["componentName"], data["componentType"], data["componentAIDescription"])
  return web.Response(status=200)

@routes.get("/component-info")
async def getComponentInfo(request):
  return web.json_response(COMPONENT_INFO)

@routes.get("/stock-info")
async def getStockInfo(request):
  return web.json_response(STOCK_COMPONENT_INFO)

@routes.post("/preview-piece")
async def previewPiece(request):
  data = await request.json()
  if data["componentFilter"] == None:
    return "Missing componentFilter", 400
  if data["pieceFilter"] == None:
    return "Missing pieceFilter", 400
  if data["language"] == None:
    return "Missing language", 400
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400

  await gameProducer.producePiecePreview(data["directoryPath"], data["componentFilter"], data["pieceFilter"], data["language"])
  return web.Response(status=200)

@routes.get("/previews")
async def previewPiece(request):
  return web.json_response({"previewsDirectory": gameProducer.getPreviewsPath()})