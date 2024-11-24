import os
import ssl
import aiohttp
from templative.lib.distribute.gameCrafter.util import httpOperations

class GameCrafterSession:
    def __init__(self, httpSession):
        self.httpSession = httpSession

    def login(self, sessionId, userId):
        self.sessionId = sessionId
        self.userId = userId

async def login(publicApiKey, userName, userPassword):
    # Create SSL context and explicitly tell it to use system certificates
    ssl_context = ssl.create_default_context()
    ssl_context.set_default_verify_paths()
    
    connector = aiohttp.TCPConnector(ssl=ssl_context)
    gameCrafterSession = GameCrafterSession(aiohttp.ClientSession(connector=connector))
    
    login = await httpOperations.login(gameCrafterSession, publicApiKey, userName, userPassword)
    gameCrafterSession.login(sessionId=login["id"], userId=login["user_id"])
    return gameCrafterSession

async def logout(gameCrafterSession):
    await httpOperations.logout(gameCrafterSession)