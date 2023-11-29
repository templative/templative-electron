import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import templative
import os, signal

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


# Remove and replace with your own
@app.route("/render", methods = ['POST']) 
async def render():
  isDebug = request.args.get('isDebug')
  isComplex = request.args.get('isComplex')
  componentFilter = request.args.get('componentFilter')
  language = request.args.get('language')
  await templative.produce.gameProducer.produceGame("C:/Users/User/Documents/git/nextdaygames/apcw-defines", componentFilter, not isComplex, not isDebug, language)
  return jsonify("Render")


# Quits Flask on Electron exit
@app.route("/quit")
def quit():
  # shutdown = request.environ.get("werkzeug.server.shutdown")
  # if shutdown is None:
  #   raise RuntimeError('Not running with the Werkzeug Server')
  # shutdown()
  os.kill(os.getpid(), signal.SIGINT)
  return "Killed server"

if __name__ == "__main__":
  app.run(**app_config)
