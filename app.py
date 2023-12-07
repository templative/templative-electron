import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import templative
import os, signal
import time, json
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, async_mode='threading',cors_allowed_origins="*")

@app.route("/project", methods = ['POST']) 
async def createProject():
  data = request.json
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  result = await templative.create.projectCreator.createProjectInDirectory(data["directoryPath"])
  if result != 1:
    return json.dumps({'success':False}), 500, {'ContentType':'application/json'}
  return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/component", methods = ['POST']) 
async def createComponent():
  data = request.json
  if data["componentName"] == None:
    return "Missing componentName", 400
  if data["componentType"] == None:
    return "Missing componentType", 400
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  await templative.create.componentCreator.createCustomComponent(data["directoryPath"], data["componentName"], data["componentType"])

  return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")

@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ",str(data))
    emit("data",{'data':data,'id':request.sid},broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    # emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

@socketio.on('produceGame')
def produceGame(renderData):
  isDebug = renderData['isDebug']
  isComplex = renderData['isComplex']
  componentFilter = 'componentFilter' in renderData and renderData['componentFilter'] or None
  language = renderData['language']
  print(isDebug, isComplex, componentFilter, language)
  # await templative.produce.gameProducer.produceGame("C:/Users/User/Documents/git/nextdaygames/apcw-defines", componentFilter, not isComplex, not isDebug, language)
  for thing in range(0,10):
    time.sleep(1)
    emit("data", {'data': 'Hello!'}, broadcast=True)

@app.route("/quit")
def quit():
  print("Killing")
  os.kill(os.getpid(), signal.SIGINT)
  return "Killed server"

if __name__ == "__main__":    
  socketio.run(app, host="localhost", port=3001, debug=False)
