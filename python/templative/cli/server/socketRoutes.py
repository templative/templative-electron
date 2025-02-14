import socketio
from templative.lib.produce import gameProducer 
from .emitPrintStatements import EmitPrintStatements
from .errorHandler import error_collector

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

def wrap_socket_handler(handler):
    async def wrapper(sid, data, namespace=None):
        try:
            return await handler(sid, data, namespace)
        except Exception as e:
            route_name = handler.__name__
            await error_collector.collect_error(
                e,
                f"WS_{route_name}",
                {"sid": sid, "data": data}
            )
            # Optionally emit error back to client
            await sio.emit('error', {"message": str(e)}, room=sid)
            return False
    return wrapper

@sio.on("produceGame")
@wrap_socket_handler
async def produceGame(sid, data, namespace=None):
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

    raise Exception("Test error for error handling")

    try:
        await gameProducer.produceGame(
            gameRootDirectoryPath=directoryPath,
            componentFilter=componentFilter,
            isSimple=not isComplex,
            isPublish=not isDebug,
            targetLanguage=language
        )
        return True
    except Exception as e:
        print(f"Error producing game: {str(e)}")
        return False