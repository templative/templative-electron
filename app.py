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
  await templative.produce.gameProducer.produceGame("C:/Users/User/Documents/git/nextdaygames/apcw-defines", None, False, False, "en")
  # See /src/components/App.js for frontend call
  return jsonify("Example response from Flask! Learn more in /app.py & /src/components/App.js")


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
