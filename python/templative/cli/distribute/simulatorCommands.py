from templative.lib.manage import instructionsLoader
from templative.lib.distribute.simulator import getSimulatorDirectory, writeSimulatorFile, convertToTabletopSimulator
import asyncclick as click

@click.command()
@click.option('-i', '--input', default=None, help='The directory of the produced game. Defaults to last produced directory.')
@click.option('-o', '--output', default=None, help='The Tabletop Simulator packages directory. Such as "~/Library/Documents/My Games/Tabletop Simulator" or "C:/Users/User/Documents/My Games/Tabletop Simulator"')
async def simulator(input, output):
    """Convert a produced game into a tabletop simulator game"""    
    if input is None:
        input = await instructionsLoader.getLastOutputFileDirectory()
    
    if input is None:
        raise Exception("Missing --input directory.")

    simulatorDirectory = await getSimulatorDirectory(output)
    if simulatorDirectory == None:
        print("Missing --output directory.")
        return
    await writeSimulatorFile(simulatorDirectory)

    return await convertToTabletopSimulator(input, simulatorDirectory)
