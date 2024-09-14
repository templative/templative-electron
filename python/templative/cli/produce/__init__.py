import asyncclick as click
import distutils.spawn
from templative.lib.produce import gameProducer
from datetime import datetime

# snakeviz "C:\Users\olive\Documents\git\templative-electron\python\profiling_data.prof"
import cProfile
import pstats
import io

@click.command()
@click.option('--name', default=None, help='The component to produce.')
@click.option('-s/-c', '--simple/--complex', default=False, required=False, type=bool, help='Whether complex information is shown. Used for videos.')
@click.option('-p/-d', '--publish/--debug', default=False, required=False, type=bool, help='Where debug information is included.')
@click.option('--language', default="en", required=False, help='Target language of the output. https://developers.google.com/admin-sdk/directory/v1/languages')
@click.option('--input', default="./", required=False, help='The directory of the templative project.')
async def produce(name, simple, publish, language, input):
    """Produce the game in the current directory"""
    # pr = cProfile.Profile()
    # pr.enable()
    await gameProducer.produceGame(input, name, simple, publish, language)
    # pr.disable()
    # pr.dump_stats('./profiling_data.prof')

@click.command()
@click.option('--component', default=None, help='The component to produce.')
@click.option('--piece', default=None, help='The piece to produce.')
@click.option('--language', default="en", required=False, help='Target language of the output. https://developers.google.com/admin-sdk/directory/v1/languages')
@click.option('--input', default="./", required=False, help='The directory of the templative project.')
async def preview(component, piece, language, input):
    """Produce the game in the current directory"""
    # pr = cProfile.Profile()
    # pr.enable()
    await gameProducer.producePiecePreview(input, component, piece, language)
    # pr.disable()
    # pr.dump_stats('./profiling_data.prof')
