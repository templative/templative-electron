import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import templative
import os, signal
import time, json

app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}

# Developer mode uses app.py
if "app.py" in sys.argv[0]:
  # Update app config
  app_config["debug"] = True

  # CORS settings
  cors = CORS(
    app,
    resources={r"/*": {"origins": "http://localhost*"}},
  )

  # CORS headers
  app.config["CORS_HEADERS"] = "Content-Type"

@app.route("/project", methods = ['POST']) 
async def createProject():
  data = request.json
  if data["directoryPath"] == None:
    return "Missing directoryPath", 400
  
  result = await templative.create.projectCreator.createProjectInDirectory(data["directoryPath"])
  if result != 1:
    return json.dumps({'success':False}), 500, {'ContentType':'application/json'}
  return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
  
@app.route("/render", methods = ['POST']) 
async def render():
  isDebug = request.args.get('isDebug')
  isComplex = request.args.get('isComplex')
  componentFilter = request.args.get('componentFilter')
  language = request.args.get('language')
  await templative.produce.gameProducer.produceGame("C:/Users/User/Documents/git/nextdaygames/apcw-defines", componentFilter, not isComplex, not isDebug, language)
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

# Quits Flask on Electron exit
@app.route("/quit")
def quit():
  # shutdown = request.environ.get("werkzeug.server.shutdown")
  # if shutdown is None:
  #   raise RuntimeError('Not running with the Werkzeug Server')
  # shutdown()
  print("Killing")
  os.kill(os.getpid(), signal.SIGINT)
  return "Killed server"

if __name__ == "__main__":
  app.run(**app_config)
