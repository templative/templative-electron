import socketio
from templative.lib.produce import gameProducer 
from .emitPrintStatements import EmitPrintStatements

from templative.lib.distribute.gameCrafter.client import uploadGame
from templative.lib.distribute.gameCrafter.accountManagement import listGames, deletePageOfGames
from templative.lib.distribute.gameCrafter.util.gameCrafterSession import login, createSessionFromLogin

sio = socketio.AsyncServer(
    cors_allowed_origins="*",
    ping_interval=25,
    ping_timeout=60,
    max_http_buffer_size=1e8
)

printStatements = {}

@sio.event
async def connect(sid, environ):
    print("connect ", sid)
    printStatements[sid] = EmitPrintStatements(sio, "printStatement")
    await printStatements[sid].__aenter__()

@sio.event
async def disconnect(sid):
    if sid in printStatements:
        await printStatements[sid].__aexit__(None, None, None)
        del printStatements[sid]
    print('disconnect ', sid)

@sio.event
async def error_handler(sid, error):
    print(f"Socket error for {sid}: {error}")
    if sid in printStatements:
        await printStatements[sid].__aexit__(None, None, None)
        del printStatements[sid]

@sio.on("produceGame")
async def produceGame(sid, data):
    if 'isDebug' not in data:
        print("Missing isDebug")
        return False
    isDebug = data['isDebug']

    if 'isComplex' not in data:
        print("Missing isComplex") 
        return False
    isComplex = data['isComplex']

    componentFilter = 'componentFilter' in data and data['componentFilter'] or None

    if 'language' not in data:
        print("Missing language")
        return False
    language = data['language']

    if 'directoryPath' not in data:
        print("Missing directoryPath")
        return False
    directoryPath = data['directoryPath']

    await gameProducer.produceGame(directoryPath, componentFilter, not isComplex, not isDebug, language)
    return True