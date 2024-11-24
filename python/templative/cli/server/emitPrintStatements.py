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
        self.buffer = []
        self.pending_tasks = set()
        self.last_emit_time = 0
        self.batch_size = 3
        self.rate_limit = 0.01
        self.flush_timer = None
        self.flush_delay = 0.125

    async def emit_batch(self, messages):
        try:
            current_time = asyncio.get_event_loop().time()
            time_since_last = current_time - self.last_emit_time
            
            if time_since_last < self.rate_limit:
                await asyncio.sleep(self.rate_limit - time_since_last)
            
            await self.sio.emit(self.emitTarget, '\n'.join(messages))
            self.last_emit_time = asyncio.get_event_loop().time()
        except Exception as e:
            print(f"Error sending batch: {e}")

    async def flush_buffer(self):
        if self.buffer:
            messages_to_send = self.buffer[:]
            self.buffer.clear()
            task = asyncio.create_task(self.emit_batch(messages_to_send))
            self.pending_tasks.add(task)
            task.add_done_callback(self.pending_tasks.discard)

    async def __aenter__(self):
        self.oldStdOutWrite = sys.stdout.write
        
        def printAndPushToArray(message):
            self.oldStdOutWrite(message)
            self.buffer.append(message)
            
            # Cancel existing timer if there is one
            if self.flush_timer:
                self.flush_timer.cancel()
            
            if len(self.buffer) >= self.batch_size:
                # Immediate flush for full batches
                asyncio.create_task(self.flush_buffer())
            else:
                # Set timer for partial batches
                self.flush_timer = asyncio.create_task(self.delayed_flush())
            
        sys.stdout.write = printAndPushToArray
        return self

    async def delayed_flush(self):
        await asyncio.sleep(self.flush_delay)
        await self.flush_buffer()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Cancel any pending flush timer
        if self.flush_timer:
            self.flush_timer.cancel()
            
        # Final flush of any remaining messages
        await self.flush_buffer()
            
        # Wait for all pending tasks to complete
        if self.pending_tasks:
            await asyncio.gather(*self.pending_tasks)
            
        sys.stdout.write = self.oldStdOutWrite
