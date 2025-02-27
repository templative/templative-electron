import json
from os import path
import os
import requests
import boto3
from io import BytesIO
from templative.lib.distribute.gameCrafter.util import httpOperations
from templative.lib.stockComponentInfo import STOCK_COMPONENT_INFO
from templative.lib.componentInfo import COMPONENT_INFO
import time
import re
import asyncio
from aiohttp import ClientSession, TCPConnector

blankSvgFileContents = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg version="1.1" id="template" x="0px" y="0px" width="%s" height="%s" viewBox="0 0 %s %s" enable-background="new 0 0 270 414" xml:space="preserve" sodipodi:docname="blank.svg" inkscape:version="1.2.2 (b0a8486, 2022-12-01)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> <defs id="defs728" /> <sodipodi:namedview id="namedview726" pagecolor="#ffffff" bordercolor="#999999" borderopacity="1" showgrid="false" /></svg>'
componentsDirectoryPath = "C:/Users/User/Documents/git/nextdaygames/templative/templative/lib/create/componentTemplates"

INCH_TO_MILLIMETERS = 25.4

bannedCustomComponentTagNames = set({"and", "bi", "top", "side", "color", "custom"})

def convertVarNameIntoTagSet(varname):
    varnameTags = re.findall('[A-Z][^A-Z]*', varname)
    varNameTagSet = set()
    for varnameTag  in varnameTags:
        if len(varnameTag) == 1:
            continue
        lowercaseVarname = varnameTag.lower()
        if lowercaseVarname in bannedCustomComponentTagNames:
            continue
        if lowercaseVarname == "d6" or lowercaseVarname == "d4" or lowercaseVarname == "d8" or lowercaseVarname == "d20":
            lowercaseVarname = varNameTagSet.add(lowercaseVarname)
            continue
        lowercaseVarname = re.sub(r'[0-9]', '', lowercaseVarname)
        varNameTagSet.add(lowercaseVarname)
    return varNameTagSet

def createTemplateSvgFileAtDimensionsIfMissing(filename, widthPixels, heightPixels):
    templateFileContents = blankSvgFileContents % (widthPixels, heightPixels, widthPixels, heightPixels)
    templateFilepath = path.join(componentsDirectoryPath, "%s.svg" % filename)
    if path.exists(templateFilepath):
        return
    with open(templateFilepath, "a") as f:
        f.write(templateFileContents)  

def parseArtdataTypes(allArtdataTypes, sides):
    ardataTypes = set()
    isDie = sides[0]["label"].startswith("Side")
    if isDie:
        allArtdataTypes.add("DieFace")
        return ardataTypes
    
    for side in sides:
        ardataType = side["label"]
        isFront = ardataType == "Face" or ardataType == "Top" or ardataType == "Image" or ardataType == "Face(Exposed)" or ardataType == "Outside" or ardataType.startswith("Side")
        if isFront:
            ardataType = "Front"
        if ardataType == "Bottom" or ardataType == "Back(Reflected)" or ardataType == "Inside":
            ardataType = "Back"
        ardataTypes.add(ardataType)
        allArtdataTypes.add(ardataType)
    return ardataTypes

def parseUploadTask(uploadTasks, apiEndpoint):
    uploadTokens = path.split(apiEndpoint)
    uploadTask = uploadTokens[len(uploadTokens)-1]
    uploadTasks.add(uploadTask)
    return uploadTask

def collateTagsUsingExistingAndVarname(varnameTagSet, varname):
    tags = set()
    if varname in COMPONENT_INFO and "Tags" in COMPONENT_INFO[varname]:
        tags = set(COMPONENT_INFO[varname]["Tags"])
    for varnameTag in varnameTagSet:
        tags.add(varnameTag)
    return tags

async def parseCustomStuff (gameCrafterSession):
    productInfo = await httpOperations.getCustomPartInfo(gameCrafterSession)
        
    componentInfo = COMPONENT_INFO
    uploadTasks = set()
    allArtdataTypes = set()

    componentInfo = COMPONENT_INFO
    for component in productInfo:
        print(component)
        break
        varname = component["identity"]
        varnameTagSet = convertVarNameIntoTagSet(varname)
        widthInches = float(component["size"]["finished_inches"][0])
        heightInches = float(component["size"]["finished_inches"][1])
        widthPixels = component["size"]["pixels"][0]
        heightPixels = component["size"]["pixels"][1]

        # createTemplateSvgFileAtDimensionsIfMissing(varname, widthPixels, heightPixels)
        ardataTypes = parseArtdataTypes(allArtdataTypes, component["sides"])
        uploadTask = parseUploadTask(uploadTasks, component["create_api"])
        
        millimeterDepthIsDefined = len(component["size"]["finished_inches"]) == 3
        millimeterDepth = float(component["size"]["finished_inches"][2])*INCH_TO_MILLIMETERS if millimeterDepthIsDefined else 0 
                
        tags = collateTagsUsingExistingAndVarname(varnameTagSet, varname)
        isDie = component["sides"][0]["label"].startswith("Side")
            
        componentInfo[varname] = COMPONENT_INFO[varname] if varname in COMPONENT_INFO else {}
        componentInfo[varname]["DisplayName"] = varname
        componentInfo[varname]["DimensionsPixels"] = [widthPixels, heightPixels]
        componentInfo[varname]["DimensionsInches"] = [widthInches, heightInches]
        componentInfo[varname]["GameCrafterUploadTask"] = uploadTask
        componentInfo[varname]["GameCrafterPackagingDepthMillimeters"] = millimeterDepth
        componentInfo[varname]["HasPieceData"] = True
        componentInfo[varname]["HasPieceQuantity"] = not isDie
        componentInfo[varname]["ArtDataTypeNames"] = list(ardataTypes)
        componentInfo[varname]["Tags"] = list(tags)
        if "preview_uri" in component and component["preview_uri"]:
            componentInfo[varname]["PreviewUri"] = component["preview_uri"]
            
    for key in componentInfo:
        if not "DisplayName" in componentInfo[key]:
            componentInfo[key]["DisplayName"] = key
        if not "Tags" in componentInfo[key]:
            componentInfo[key]["Tags"] = []
    for componentKey in COMPONENT_INFO:
        if componentKey in componentInfo:
            continue
        print("%s is missing" % componentKey)
    with open('./customComponents.json', 'w') as f:
        json.dump(componentInfo, f, indent=4)


def tagListHasColor(tagList, possibleColor): 
    for tag in tagList:
        if tag.lower() == possibleColor.lower():
            return True
    return False

async def download_preview_image(preview_url, component_name):
    """Download the preview image from TheGameCrafter"""
    if not preview_url:
        return None
    
    # Make sure the URL is absolute
    if preview_url.startswith('//'):
        preview_url = 'https:' + preview_url
        
    try:
        response = requests.get(preview_url)
        if response.status_code == 200:
            # Create a directory for preview images if it doesn't exist
            os.makedirs('preview_images', exist_ok=True)
            
            # Save the image locally
            file_path = f'preview_images/{component_name}.png'
            with open(file_path, 'wb') as f:
                f.write(response.content)
            
            return file_path
        else:
            print(f"Failed to download preview image for {component_name}: HTTP {response.status_code}")
            return None
    except Exception as e:
        print(f"Error downloading preview image for {component_name}: {str(e)}")
        return None

async def convert_image_to_3d(image_path, component_name):
    """Convert the image to a 3D model using an external API service"""
    # This is a placeholder - you would replace this with your actual API call
    # to your preferred 3D conversion service
    try:
        print(f"Converting {component_name} image to 3D model...")
        # Placeholder for 3D conversion API call
        # Example API call might look like:
        # response = requests.post(
        #     "https://your-3d-conversion-api.com/convert",
        #     files={"image": open(image_path, "rb")},
        #     data={"name": component_name}
        # )
        
        # For now, let's return placeholder paths for the output files
        obj_path = f"3d_models/{component_name}/{component_name}.obj"
        texture_path = f"3d_models/{component_name}/{component_name}_texture.png"
        normal_path = f"3d_models/{component_name}/{component_name}_normal.png"
        
        # Create the directory structure
        os.makedirs(f"3d_models/{component_name}", exist_ok=True)
        
        return {
            "obj_path": obj_path,
            "texture_path": texture_path,
            "normal_path": normal_path
        }
    except Exception as e:
        print(f"Error converting image to 3D for {component_name}: {str(e)}")
        return None

async def upload_to_s3(file_paths, component_name):
    """Upload the 3D model files to S3"""
    try:
        # Get S3 credentials from environment variables
        aws_access_key = os.environ.get('AWS_ACCESS_KEY')
        aws_secret_key = os.environ.get('AWS_SECRET')
        s3_bucket = "templative-simulator-images"
        
        if not all([aws_access_key, aws_secret_key, s3_bucket]):
            print("Missing AWS credentials or bucket name")
            return None
        
        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        s3_urls = {}
        
        # Upload each file
        for file_type, file_path in file_paths.items():
            if os.path.exists(file_path):
                key = f"game_components_3d/{component_name}/{os.path.basename(file_path)}"
                s3_client.upload_file(file_path, s3_bucket, key)
                s3_urls[file_type] = f"https://{s3_bucket}.s3.amazonaws.com/{key}"
                print(f"Uploaded {file_type} to S3: {s3_urls[file_type]}")
            else:
                print(f"File not found: {file_path}")
        
        return {
            "obj_url": s3_urls.get("obj_path"),
            "texture_url": s3_urls.get("texture_path"),
            "normal_url": s3_urls.get("normal_path")
        }
    except Exception as e:
        print(f"Error uploading to S3 for {component_name}: {str(e)}")
        return None

async def download_all_preview_images(stockInfo, concurrency_limit=5, rate_limit_per_minute=30):
    """
    Download all preview images for components with PreviewUri
    
    Args:
        stockInfo: Dictionary containing stock component information
        concurrency_limit: Number of concurrent downloads allowed
        rate_limit_per_minute: Maximum number of requests per minute
    """
    components_with_preview = [(name, info["PreviewUri"]) for name, info in stockInfo.items() 
                              if "PreviewUri" in info and info["PreviewUri"]]
    
    if not components_with_preview:
        print("No components with preview URIs found.")
        return
    
    # Create preview_images directory if it doesn't exist
    os.makedirs('preview_images', exist_ok=True)
    
    # Calculate delay between requests to maintain rate limit
    delay = 60 / rate_limit_per_minute
    
    # Create a semaphore to limit concurrency
    semaphore = asyncio.Semaphore(concurrency_limit)
    
    # Keep track of downloaded components for progress saving
    downloaded_components = {}
    progress_file = './download_progress.json'
    
    # Try to load existing progress
    if os.path.exists(progress_file):
        try:
            with open(progress_file, 'r') as f:
                downloaded_components = json.load(f)
            print(f"Resuming from previous download progress ({len(downloaded_components)} already downloaded)")
        except:
            print("Could not load download progress, starting fresh")
    
    async def download_with_rate_limit(component_name, preview_url):
        nonlocal downloaded_components
        
        async with semaphore:
            if preview_url.startswith('//'):
                preview_url = 'https:' + preview_url
                
            file_path = f'preview_images/{component_name}.png'
            
            # Skip if already downloaded
            if component_name in downloaded_components or path.exists(file_path):
                print(f"Image for {component_name} already exists, skipping.")
                if component_name not in downloaded_components:
                    downloaded_components[component_name] = file_path
                    # Save progress after each download
                    with open(progress_file, 'w') as f:
                        json.dump(downloaded_components, f, indent=2)
                return file_path
                
            try:
                async with ClientSession(connector=TCPConnector(ssl=False)) as session:
                    async with session.get(preview_url) as response:
                        if response.status == 200:
                            content = await response.read()
                            with open(file_path, 'wb') as f:
                                f.write(content)
                            print(f"Downloaded image for {component_name}")
                            
                            # Record progress
                            downloaded_components[component_name] = file_path
                            
                            # Save progress after each download
                            with open(progress_file, 'w') as f:
                                json.dump(downloaded_components, f, indent=2)
                            
                            # Apply rate limiting
                            await asyncio.sleep(delay)
                            return file_path
                        else:
                            print(f"Failed to download image for {component_name}: HTTP {response.status}")
                            return None
            except Exception as e:
                print(f"Error downloading image for {component_name}: {str(e)}")
                return None
    
    # Create tasks for downloading all images
    tasks = [download_with_rate_limit(name, url) for name, url in components_with_preview]
    results = await asyncio.gather(*tasks)
    
    # Count successful downloads
    successful = sum(1 for result in results if result is not None)
    print(f"Downloaded {successful} of {len(components_with_preview)} images")
    
    # Clean up the progress file when complete
    if os.path.exists(progress_file):
        os.remove(progress_file)
        print("Removed progress tracking file after successful completion")
    
    return {components_with_preview[i][0]: results[i] for i in range(len(components_with_preview)) if results[i] is not None}

async def parseStockStuff(gameCrafterSession, rate_limit_per_minute=20):
    """
    Parse stock component information from The Game Crafter with rate limiting
    
    Args:
        gameCrafterSession: The Game Crafter session
        rate_limit_per_minute: Maximum number of requests per minute
    """
    pageNumber = 1
    stockInfo = STOCK_COMPONENT_INFO
    allTags = set()
    
    # Calculate delay between requests to maintain rate limit
    delay = 60 / rate_limit_per_minute
    
    print(f"Rate limiting API requests to {rate_limit_per_minute} per minute (delay: {delay:.2f}s)")
    total_processed = 0
    
    try:
        # Check if we can resume from a temporary file
        if os.path.exists('./stockComponents_partial.json'):
            try:
                with open('./stockComponents_partial.json', 'r') as f:
                    stockInfo = json.load(f)
                print(f"Resumed from partial data with {len(stockInfo)} components")
            except:
                print("Could not load partial data, starting fresh")
    except:
        print("Error checking for partial data, starting fresh")
    
    while True:
        print(f"Fetching page {pageNumber}...")
        stockPartInfoPage = await httpOperations.getStockPartInfo(gameCrafterSession, pageNumber=pageNumber)
        print("Reading page %s of %s." % (stockPartInfoPage["paging"]["page_number"], stockPartInfoPage["paging"]["total_pages"]))
        
        components_on_page = 0
        for component in stockPartInfoPage["items"]:
            varname = "".join(component["name"].replace(",", "").split(" "))
            components_on_page += 1
            total_processed += 1
            
            tags = []
            if "keywords" in component and component["keywords"] != None:
                tags = component["keywords"].split(", ")

            for index, item in enumerate(tags):
                tags[index] = item.lower()
                if item == "":
                    del tags[index]
            for tag in tags:
                allTags.add(tag)
            if "color" in component and component["color"] != None:
                color = component["color"].lower()
                if not tagListHasColor(tags, color):
                    tags.append(color)
            stockInfo[varname] = STOCK_COMPONENT_INFO[varname] if varname in STOCK_COMPONENT_INFO else {}
            description = component["description"] if ("description" in component and component["description"] != None) else ""
            stockInfo[varname]["DisplayName"] = component["name"]
            stockInfo[varname]["Description"] = description
            stockInfo[varname]["GameCrafterGuid"] = component["id"]
            stockInfo[varname]["GameCrafterSkuId"] = component["sku_id"]
            stockInfo[varname]["Tags"] = tags
            if "preview_uri" in component and component["preview_uri"]:
                stockInfo[varname]["PreviewUri"] = component["preview_uri"]
        
        # Save progress after each page
        print(f"Saving progress after page {pageNumber} ({components_on_page} components, {total_processed} total)...")
        with open('./stockComponents_partial.json', 'w') as f:
            json.dump(stockInfo, f, indent=2)
            
        if int(stockPartInfoPage["paging"]["page_number"]) >= int(stockPartInfoPage["paging"]["total_pages"]):
            break
            
        pageNumber = pageNumber + 1
        
        # Apply rate limiting before next request
        print(f"Waiting {delay:.2f}s before next request...")
        await asyncio.sleep(delay)
        
        # Comment out this break in production to fetch all pages
        # break 

    gameCrafterIds = {}
    for key in stockInfo:
        if not "DisplayName" in stockInfo[key]:
            stockInfo[key]["DisplayName"] = key
        if stockInfo[key]["GameCrafterGuid"] in gameCrafterIds:
            print("Duplicate part: %s" % key)
        gameCrafterIds[stockInfo[key]["GameCrafterGuid"]] = True

    print(f"Found {len(stockInfo)} stock components")
    with open('./stockComponents.json', 'w') as f:
        json.dump(stockInfo, f, indent=2)
    
    # Remove partial file once complete
    if os.path.exists('./stockComponents_partial.json'):
        os.remove('./stockComponents_partial.json')
        print("Removed partial data file after successful completion")
    
    return stockInfo

async def generate_3d_models_for_components(stockInfo, batch_size=10, rate_limit_per_minute=10, resume=True):
    """
    Generate 3D models for stock components that have preview images
    
    Args:
        stockInfo: Dictionary containing stock component information
        batch_size: Number of components to process in each batch
        rate_limit_per_minute: Maximum number of requests per minute
        resume: Whether to resume from previous run
        
    Returns:
        Dictionary mapping component names to their 3D model paths
    """
    # Calculate delay between API calls for rate limiting
    delay = 60 / rate_limit_per_minute
    
    count = 0
    batch_count = 0
    processed_components = set()
    progress_file = './3d_model_generation_progress.json'
    model_paths_dict = {}
    
    # Check for existing progress if resume is enabled
    if resume and os.path.exists(progress_file):
        try:
            with open(progress_file, 'r') as f:
                processed_data = json.load(f)
                processed_components = set(processed_data.get("processed_components", []))
                model_paths_dict = processed_data.get("model_paths", {})
            print(f"Resuming from previous run - {len(processed_components)} components already processed")
        except Exception as e:
            print(f"Could not load progress file: {str(e)}. Starting fresh.")
    
    # Process components in batches
    components_with_images = []
    for varname, component in stockInfo.items():
        # Skip already processed components if resuming
        if varname in processed_components:
            continue
            
        # Check if the component has a preview image downloaded
        image_path = f'preview_images/{varname}.png'
        if os.path.exists(image_path):
            components_with_images.append((varname, component, image_path))
    
    if not components_with_images:
        print("All components have been processed already or no images found.")
        return model_paths_dict
        
    print(f"Found {len(components_with_images)} components with downloaded images to process")
    
    # Process in batches
    for i in range(0, len(components_with_images), batch_size):
        batch = components_with_images[i:i+batch_size]
        batch_count += 1
        print(f"Processing batch {batch_count} of {(len(components_with_images) + batch_size - 1) // batch_size} ({len(batch)} components)...")
        
        for varname, component, image_path in batch:
            count += 1
            print(f"[{count}/{len(components_with_images)}] Processing 3D model for {varname}...")
            
            # Convert the image to 3D model
            model_paths = await convert_image_to_3d(image_path, varname)
            
            if model_paths:
                model_paths_dict[varname] = model_paths
            
            # Mark component as processed regardless of success
            processed_components.add(varname)
            
            # Save progress after each component
            progress_data = {
                "processed_components": list(processed_components),
                "model_paths": model_paths_dict
            }
            with open(progress_file, 'w') as f:
                json.dump(progress_data, f, indent=2)
            
            # Apply rate limiting
            print(f"Waiting {delay:.2f}s before next component...")
            await asyncio.sleep(delay)
        
        # Save progress after each batch
        print(f"Batch {batch_count} complete. Progress saved.")
    
    print("3D model generation complete!")
    
    return model_paths_dict

async def upload_3d_models_to_s3(model_paths_dict, stockInfo, batch_size=10, rate_limit_per_minute=10, resume=True):
    """
    Upload generated 3D models to S3
    
    Args:
        model_paths_dict: Dictionary mapping component names to their 3D model paths
        stockInfo: Dictionary containing stock component information
        batch_size: Number of components to process in each batch
        rate_limit_per_minute: Maximum number of requests per minute
        resume: Whether to resume from previous run
        
    Returns:
        Updated stockInfo dictionary with S3 URLs
    """
    # Calculate delay between API calls for rate limiting
    delay = 60 / rate_limit_per_minute
    
    count = 0
    batch_count = 0
    processed_components = set()
    progress_file = './s3_upload_progress.json'
    
    # Check for existing progress if resume is enabled
    if resume and os.path.exists(progress_file):
        try:
            with open(progress_file, 'r') as f:
                processed_components = set(json.load(f))
            print(f"Resuming from previous upload run - {len(processed_components)} components already uploaded")
        except:
            print("Could not load upload progress file, starting fresh")
    
    # Get components to upload
    components_to_upload = []
    for varname, model_paths in model_paths_dict.items():
        # Skip already processed components if resuming
        if varname in processed_components:
            continue
        
        components_to_upload.append((varname, model_paths))
    
    if not components_to_upload:
        print("All components have been uploaded already or no models found.")
        return stockInfo
        
    print(f"Found {len(components_to_upload)} components with 3D models to upload")
    
    # Process in batches
    for i in range(0, len(components_to_upload), batch_size):
        batch = components_to_upload[i:i+batch_size]
        batch_count += 1
        print(f"Processing upload batch {batch_count} of {(len(components_to_upload) + batch_size - 1) // batch_size} ({len(batch)} components)...")
        
        for varname, model_paths in batch:
            count += 1
            print(f"[{count}/{len(components_to_upload)}] Uploading 3D model for {varname} to S3...")
            
            # Upload 3D model files to S3
            s3_urls = await upload_to_s3(model_paths, varname)
            
            if s3_urls:
                # Add S3 URLs to the stock info
                stockInfo[varname]["3DModel"] = {
                    "ObjUrl": s3_urls.get("obj_url"),
                    "TextureUrl": s3_urls.get("texture_url"),
                    "NormalMapUrl": s3_urls.get("normal_url")
                }
            
            # Mark component as processed regardless of success
            processed_components.add(varname)
            
            # Save progress after each component
            with open(progress_file, 'w') as f:
                json.dump(list(processed_components), f, indent=2)
            
            # Save the updated stockInfo after each component
            with open('./stockComponents.json', 'w') as f:
                json.dump(stockInfo, f, indent=2)
            
            # Apply rate limiting
            print(f"Waiting {delay:.2f}s before next upload...")
            await asyncio.sleep(delay)
        
        # Save progress after each batch
        print(f"Upload batch {batch_count} complete. Progress saved.")
    
    print("3D model upload to S3 complete!")
    
    # Clean up progress file when done
    if os.path.exists(progress_file):
        os.remove(progress_file)
        print("Removed upload progress tracking file after successful completion")
    
    return stockInfo
