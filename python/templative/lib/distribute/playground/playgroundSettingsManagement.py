from os import path
from aiofile import AIOFile
    
async def writePlaygroundFile(outputPath):
    playgroundFileLocation = path.join("./", ".playground")
    async with AIOFile(playgroundFileLocation, mode="w") as playground:
        await playground.write(outputPath)

async def getPlaygroundDirectory(inputedPlaygroundDirectory):
    if inputedPlaygroundDirectory != None:
        return inputedPlaygroundDirectory
    
    playgroundFileLocation = "./.playground"
    if not path.exists(playgroundFileLocation):
        return None
    
    async with AIOFile(playgroundFileLocation, mode="r") as playground:
        return await playground.read()