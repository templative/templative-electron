from aiohttp import web
import socketio
import aiohttp_cors
import json
import templative 
from EmitPrintStatements import EmitPrintStatements

routes = web.RouteTableDef()

@routes.post("/project") 
async def createProject(request):
  data = await request.json()
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  result = await templative.create.projectCreator.createProjectInDirectory(data["directoryPath"])
  if result != 1:
    return json.dumps({'success':False}), 500, {'ContentType':'application/json'}
  return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@routes.post("/component") 
async def createComponent(request):
  data = await request.json()
  print(data)
  if data["componentName"] == None:
    return "Missing componentName", 400
  if data["componentType"] == None:
    return "Missing componentType", 400
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  await templative.create.componentCreator.createCustomComponent(data["directoryPath"], data["componentName"], data["componentType"])

  return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

sio = socketio.AsyncServer(cors_allowed_origins="*")
app = web.Application()
app.add_routes(routes)
cors = aiohttp_cors.setup(app, defaults={
   "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*"
    )
  })
sio.attach(app)

@sio.event
def connect(sid, environ):
    # print("connect ", sid)
    pass
@sio.event
def disconnect(sid):
    # print('disconnect ', sid)
    pass



@sio.on("produceGame")
async def produceGame(sid, data):
    isDebug = data['isDebug']
    isComplex = data['isComplex']
    componentFilter = 'componentFilter' in data and data['componentFilter'] or None
    language = data['language']

    with EmitPrintStatements(sio, "printStatement"):
        await templative.produce.gameProducer.produceGame("C:/Users/User/Documents/git/nextdaygames/apcw-defines", componentFilter, not isComplex, not isDebug, language)

if __name__ == '__main__':
    web.run_app(app)

