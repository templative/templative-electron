import os
import asyncclick as click
from templative.lib.distribute.gameCrafter.client import uploadGame
from templative.lib.distribute.gameCrafter.accountManagement import listGames, deletePageOfGames
from templative.lib.distribute.gameCrafter.tgcParser import parseStockStuff, parseCustomStuff, download_preview_image, download_all_preview_images, convert_image_to_3d, upload_to_s3,generate_3d_models_for_components, upload_3d_models_to_s3
from templative.lib.distribute.gameCrafter.util.gameCrafterSession import login, logout
from templative.lib.manage.instructionsLoader import getLastOutputFileDirectory
import json
import asyncio

baseUrl = "https://www.thegamecrafter.com"

def getCredentialsFromEnv():
    publicApiKey = os.environ.get('THEGAMECRAFTER_PUBLIC_KEY')
    if not publicApiKey:
        raise Exception('Could not log in. You need to set the env variable THEGAMECRAFTER_PUBLIC_KEY.')

    userName = os.environ.get('THEGAMECRAFTER_USER')
    if not userName:
        raise Exception('Could not log in. You need to set the env variable THEGAMECRAFTER_USER.')

    userPassword = os.environ.get('THEGAMECRAFTER_PASSWORD')
    if not userPassword:
        raise Exception('Could not log in. You need to set the env variable THEGAMECRAFTER_PASSWORD.')
    
    # Print confirmation of found credentials (for debugging)
    print(f"Found credentials - Public Key: {publicApiKey[:5]}... User: {userName}")
    
    return publicApiKey, userName, userPassword

@click.command()
@click.option('-i', '--input', default=None, help='The directory of the game. Defaults to ./')
@click.option('-r', '--render', default=None, help='The directory of the produced game. Defaults to last produced directory.')
@click.option('-p/-d', '--publish/--debug', default=False, required=False, type=bool, help='Whether to treat this as the official release.')
@click.option('-s/-n', '--stock/--nostock', default=True, required=False, type=bool, help='Whether stock parts are included -s or not -n.')
@click.option('-a/-y', '--asynchronous/--synchronous', default=True, required=False, type=bool, help='Whether upload requests happen all at once -a or one after the other -y.')
@click.option('-u/-o', '--proofed/--proof', default=True, required=False, type=bool, help='Whether images are considered proofed already -u or not -o.')
@click.option('-d', '--designerId', default=None, required=False, type=str, help='The Game Crafter Designer ID to use for this game.')
async def upload(input, render, publish, stock, asynchronous, proofed, designerId):
    """Upload a produced game in a directory"""
    publicApiKey, userName, userPassword = getCredentialsFromEnv()
    session = await login(publicApiKey, userName, userPassword)

    if session is None:
        raise Exception("You must provide a Game Crafter session.")

    if input is None:
        input = "./"

    if render is None:
        render = await getLastOutputFileDirectory()
    
    if render is None:
        raise Exception("Missing --render directory.")
    
    await uploadGame(session, input, render, publish, stock, asynchronous, 1 if proofed else 0, designerId)
    await logout(session)

@click.command()
async def list():
    """List uploaded games"""
    publicApiKey, userName, userPassword = getCredentialsFromEnv()
    session = await login(publicApiKey, userName, userPassword)

    if session is None:
        raise Exception("You must provide a Game Crafter session.")

    await listGames(session)
    await logout(session)

@click.command()
@click.option('--rate-limit', default=30, help='Maximum number of requests per minute to Game Crafter API')
@click.option('--concurrency', default=5, help='Number of concurrent downloads allowed')
async def downloadimages(rate_limit, concurrency):
    """Download preview images for all stock components"""
    # No need for Game Crafter login if we're just working with the existing JSON file
    try:
        # Load existing stock component info
        with open('./stockComponents.json', 'r') as f:
            stockInfo = json.load(f)
        
        print(f"Loaded {len(stockInfo)} stock components from file")
        
        # Download all preview images with rate limiting
        downloaded_images = await download_all_preview_images(
            stockInfo, 
            concurrency_limit=concurrency,
            rate_limit_per_minute=rate_limit
        )
        
        print(f"Successfully downloaded {len(downloaded_images) if downloaded_images else 0} images")
    except FileNotFoundError:
        print("Error: stockComponents.json file not found. Please run 'stocklist' command first.")
    except json.JSONDecodeError:
        print("Error: stockComponents.json is not a valid JSON file.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

@click.command()
@click.option('--rate-limit', default=20, help='Maximum number of requests per minute to Game Crafter API')
async def stocklist(rate_limit):
    """Save stock components information with rate limiting"""
    publicApiKey, userName, userPassword = getCredentialsFromEnv()
    session = await login(publicApiKey, userName, userPassword)

    if session is None:
        raise Exception("You must provide a Game Crafter session.")

    await parseStockStuff(session, rate_limit_per_minute=rate_limit)
    await logout(session)

@click.command()
async def customlist():
    """Save custom components information"""
    publicApiKey, userName, userPassword = getCredentialsFromEnv()
    session = await login(publicApiKey, userName, userPassword)

    if session is None:
        raise Exception("You must provide a Game Crafter session.")

    await parseCustomStuff(session)
    await logout(session)

@click.command()
async def deletegames():
    """Delete a page of games"""
    publicApiKey, userName, userPassword = getCredentialsFromEnv()
    session = await login(publicApiKey, userName, userPassword)

    if session is None:
        raise Exception("You must provide a Game Crafter session.")

    await deletePageOfGames(session)
    await logout(session)

@click.command()
@click.option('--batch-size', default=10, help='Number of components to process in each batch')
@click.option('--rate-limit', default=10, help='Maximum number of requests per minute to 3D conversion API')
@click.option('--resume/--no-resume', default=True, help='Resume from previous run if available')
async def generate3dmodels(batch_size, rate_limit, resume):
    """Generate 3D models from stock component preview images"""
    
    try:
        # Load existing stock component info
        with open('./stockComponents.json', 'r') as f:
            stockInfo = json.load(f)
        
        print(f"Loaded {len(stockInfo)} stock components from file")
        
        # Generate 3D models, moving business logic to tgcParser module
        await generate_3d_models_for_components(
            stockInfo,
            batch_size=batch_size,
            rate_limit_per_minute=rate_limit,
            resume=resume
        )
        
        print("3D model generation complete!")
    
    except FileNotFoundError:
        print("Error: stockComponents.json file not found or preview images not downloaded.")
        print("Please run 'stocklist' and 'downloadimages' commands first.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

@click.command()
@click.option('--batch-size', default=10, help='Number of components to process in each batch')
@click.option('--rate-limit', default=10, help='Maximum number of requests per minute to S3')
@click.option('--resume/--no-resume', default=True, help='Resume from previous run if available')
async def uploads3models(batch_size, rate_limit, resume):
    """Upload generated 3D models to S3"""
    
    try:
        # Load existing stock component info
        with open('./stockComponents.json', 'r') as f:
            stockInfo = json.load(f)
        
        # Load model paths from the progress file
        try:
            with open('./3d_model_generation_progress.json', 'r') as f:
                model_data = json.load(f)
                model_paths_dict = model_data.get("model_paths", {})
        except:
            print("Could not load model data. Please run 'generate3dmodels' first.")
            return
        
        if not model_paths_dict:
            print("No 3D models found to upload. Please run 'generate3dmodels' first.")
            return
        
        print(f"Found {len(model_paths_dict)} components with 3D models to upload")
        
        # Upload 3D models to S3, moving business logic to tgcParser module
        updated_stockInfo = await upload_3d_models_to_s3(
            model_paths_dict,
            stockInfo,
            batch_size=batch_size,
            rate_limit_per_minute=rate_limit,
            resume=resume
        )
        
        # Save the updated stock component info
        with open('./stockComponents.json', 'w') as f:
            json.dump(updated_stockInfo, f, indent=2)
        
        print("3D model upload to S3 complete!")
    
    except FileNotFoundError:
        print("Error: Required files not found. Please run 'generate3dmodels' first.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")




