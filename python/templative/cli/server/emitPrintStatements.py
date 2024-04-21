from io import StringIO 
import sys
import socketio
import asyncio

async def emit(sio, emitTarget, message):
    if message.isspace():
        return
    if message == "\n":
        return
    try:
        await sio.emit(emitTarget, message)
    except socketio.exceptions.ConnectionError as e:
        print(f"Yo! ConnectionError: {e} - Likely the client disconnected just before sending.")
    except ConnectionResetError as e:
        print(f"Yo! ConnectionResetError: {e}.")

class EmitPrintStatements():
    def __init__(self, sio, emitTarget):
        self.sio = sio
        self.emitTarget = emitTarget

    def __enter__(self):
        self.oldStdOutWrite = sys.stdout.write
        def printAndPushToArray(message):
            self.oldStdOutWrite(message)
            asyncio.run_coroutine_threadsafe(emit(self.sio, self.emitTarget, message), loop=asyncio.get_event_loop())
            
        sys.stdout.write = printAndPushToArray

    def __exit__(self, *args):
        sys.stdout.write = self.oldStdOutWrite
