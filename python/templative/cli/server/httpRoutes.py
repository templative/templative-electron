from aiohttp import web
from templative.lib.create import projectCreator, componentCreator
from templative.lib.distribute.printout import createPdfForPrinting
from templative.lib.distribute.playground import convertToTabletopPlayground
from templative.lib.distribute.simulator import convertToTabletopSimulator
from templative.lib.distribute.gameCrafter.accountManagement import listDesigners
from templative.lib.componentInfo import COMPONENT_INFO
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO
from templative.lib.produce import gameProducer
from templative.lib.distribute.gameCrafter.util.gameCrafterSession import createSessionFromLogin
from templative.lib.distribute.gameCrafter.client import uploadGame
from .errorHandler import error_collector
import uuid

routes = web.RouteTableDef()

def wrap_route(handler):
    async def wrapper(request):
        request_id = str(uuid.uuid4())
        try:
            return await handler(request)
        except Exception as e:
            route_name = handler.__name__
            await error_collector.collect_error(
                e, 
                f"HTTP_{route_name}", 
                {
                    "method": request.method, 
                    "path": request.path,
                    "request_id": request_id
                }
            )
            return web.Response(
                text=f"Internal server error: {str(e)}", 
                status=500,
                headers={"X-Request-ID": request_id}
            )
    return wrapper

@routes.get("/status")
async def getStatus(_):
  return web.Response(status=200)

@routes.post("/project") 
@wrap_route
async def createProject(request):
  data = await request.json()
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  result = projectCreator.createProjectInDirectory(data["directoryPath"])
  if result != 1:
    return web.Response(status=500)
  return web.Response(status=200)

@routes.post("/printout") 
@wrap_route
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
@wrap_route
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
@wrap_route
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
@wrap_route
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
@wrap_route
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
    
@routes.get("/the-game-crafter/designers")
async def getDesigners(request):
    id = request.query.get('id')
    if id == None:
        print("Missing id")
        return web.Response(text="Missing id.", status=400)
    
    userId = request.query.get('userId')
    if userId == None:
        print("Missing userId")
        return web.Response(text="Missing userId.", status=400)
    
    try:
        gameCrafterSession = await createSessionFromLogin(id, userId)
        if gameCrafterSession is None:
            print("Unable to log in.")
            return web.Response(text="Unable to log in.", status=400)
        
        designers = await listDesigners(gameCrafterSession)
        return web.json_response({"designers": designers})
    finally:
        if gameCrafterSession:
            await gameCrafterSession.httpSession.close()
    
@routes.post("/the-game-crafter/upload")
@wrap_route
async def upload(request):
    data = await request.json()
    
    # Validate required fields
    required_fields = ['sessionId', 'userId', 'gameDirectoryRootPath', 'outputDirectorypath', 
                      'isPublish', 'isIncludingStock', 'isAsync', 'isProofed', 'designerId']
    
    for field in required_fields:
        if field not in data:
            return web.Response(text=f"Missing {field}", status=400)
    
    try:
        gameCrafterSession = await createSessionFromLogin(data['sessionId'], data['userId'])
        if gameCrafterSession is None:
            return web.Response(text="Unable to log in.", status=400)
        
        try:
            await uploadGame(
                gameCrafterSession, 
                data['gameDirectoryRootPath'],
                data['outputDirectorypath'],
                data['isPublish'],
                data['isIncludingStock'],
                data['isAsync'],
                data['isProofed'],
                data['designerId']
            )
            return web.Response(status=200)
        except Exception as e:
            print(f"Error during upload: {str(e)}")
            return web.Response(text=str(e), status=500)
    finally:
        if gameCrafterSession:
            await gameCrafterSession.httpSession.close()
    
