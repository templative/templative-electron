from io import StringIO 
import sys
import socketio
import asyncio

async def emit(sio, emitTarget, message):
    if not message or message.isspace():
        return
        
    try:
        # Add small delay to prevent overwhelming the socket
        await asyncio.sleep(0.01)
        await sio.emit(emitTarget, message)
    except socketio.exceptions.ConnectionError as e:
        print(f"ConnectionError: {e} - Attempting to reconnect...")
        # Could add reconnection logic here if needed
    except Exception as e:
        print(f"Error sending message: {e}")

class EmitPrintStatements():
    def __init__(self, sio, emitTarget):
        self.sio = sio
        self.emitTarget = emitTarget
        self.buffer = StringIO()

    def __enter__(self):
        self.oldStdOutWrite = sys.stdout.write
        
        def printAndPushToArray(message):
            self.oldStdOutWrite(message)
            # Use create_task to avoid blocking
            asyncio.create_task(emit(self.sio, self.emitTarget, message))
            
        sys.stdout.write = printAndPushToArray

    def __exit__(self, *args):
        sys.stdout.write = self.oldStdOutWrite
