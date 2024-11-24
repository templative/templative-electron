from aiohttp import web
import aiohttp_cors
import asyncclick as click
from .httpRoutes import routes
from .socketRoutes import sio, printStatements
import sys
import os

@click.command()
@click.option('--port', default=8080, required=False, help='The port of the local server.')
async def serve(port):
    """Serve Templative as a socket and http server"""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    
    print(f"Serving template files from {base_path}")
    app = web.Application()
    
    # Configure CORS and socket.io with more robust settings
    sio.attach(app, socketio_path='socket.io')
    
    # Add routes after socket.io attachment
    app.add_routes(routes)
    
    # Add cleanup handler
    async def cleanup(app):
        for sid in list(printStatements.keys()):
            await printStatements[sid].__aexit__(None, None, None)
            del printStatements[sid]
    
    app.on_cleanup.append(cleanup)
    
    # Setup CORS, excluding socket.io routes
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
            max_age=3600
        )
    })

    # Apply CORS to all routes except socket.io
    for route in list(app.router.routes()):
        if not str(route.resource.canonical).startswith('/socket.io/'):
            cors.add(route)

    try:
        await web._run_app(app, host="localhost", port=port)
    except Exception as e:
        print(f"Server error: {e}")
        raise

