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
    connector = aiohttp.TCPConnector(
        verify_ssl=False,
        enable_cleanup_closed=True
    )
    
    gameCrafterSession = GameCrafterSession(
        aiohttp.ClientSession(
            connector=connector,
            timeout=aiohttp.ClientTimeout(total=30)
        )
    )
    
    try:
        login = await httpOperations.login(gameCrafterSession, publicApiKey, userName, userPassword)
        gameCrafterSession.login(sessionId=login["id"], userId=login["user_id"])
        return gameCrafterSession
    except Exception as e:
        await gameCrafterSession.httpSession.close()
        raise e

async def logout(gameCrafterSession):
    await httpOperations.logout(gameCrafterSession)