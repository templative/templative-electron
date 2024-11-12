import json
import os
from templative.lib.storefrontClient import updateTemplativeFileForDescription

# You might want to move these to a config file
AUTH_TOKEN = "arijaerg"
USER_EMAIL = "arijaerg@gmail.com"

async def enhanceArtdata(artdata: dict, description: str) -> dict:
    system_prompt = """
    You are an expert in creating game components. You will enhance the provided artdata JSON structure. Artdata is a json list of commands to use data to update svg art into final board game art. Follow these exact rules:

    For textReplacements array items:
    - Text replacements are commands used replace text in an svg.
    - 'key': What text string to look for in the svg to replace, suhc as name, rules or points.
    - 'scope': Must be one of: piece, component, game, studio, or global. For instance, if the data we are piping in is the health of a piece, then we'd use the piece scope. If the data is true of all peices in the component, we use component. If its true from for the entire game or studio, use game or studio respectively. If we are using a static value, we use global.
    - 'source': The specific property name within the scope to use for the replacement. If the scope is global, then this source value is the static text. Never use "name" as the source for text replacements, instead use "displayName" when referring to the name of the piece.

    For styleUpdates array items:
    - 'id': The id of the element in the svg whose style we are updating
    - 'cssValue': The CSS property to modify (e.g., "fill", "font-size")
    - 'scope': Must be one of: piece, component, game, studio, or global
    - 'source': The specific property name within the scope to use for the style. If its the rules of the envoy, it shouldn't be "envoyRules" it should be "rules". All pieces have name (no spaces), displayName (spaces and proper capitalization), and quantity fields by default.

    For overlays array items:
    - 'scope': Must be one of: piece, component, game, studio, or global
    - 'source': The specific property name within the scope containing the overlay image, the value of the overlay is the filename without extension of another svg file, assume that svg exists. It must end in Image, such as "soldierImage"
    - 'positionX': 0
    - 'positionY': 0

    Important:
    - Do not modify the 'name' or 'templateFilename' fields
    - All scope/source combinations must be realistic game component properties

    Respond only with the valid JSON structure.
    """
    
    try:
        response_data, status = await updateTemplativeFileForDescription(
            artdata,
            system_prompt,
            description
        )
        
        if status != 200:
            print(f"Error from API: {response_data.get('message', 'Unknown error')}")
            return artdata
            
        enhanced_artdata = json.loads(response_data['message'])
        return enhanced_artdata
    except Exception as e:
        print(f"Error enhancing artdata: {str(e)}")
        return artdata

async def enhanceSvg(svg_content: str, description: str, artdataFileContents) -> str:
    system_prompt = """
    You are an expert in SVG and game component design. Enhance the provided SVG by:
    1. For every textReplacement command in the artdata, add a text field with the contents of the key field wrapped in curly braces. For instance, if the "key" field has a value of "rules" then the content of the text element would be "{rules}". Make sure text replacements are last in the file so they are drawn on top of other things.
    2. For every style update, make sure to create an element fitting its name and the description with the id of the styleUpdate
    3. Ignore the overlays section.
    4. Generally create the svg content to make a mockup of a board game component.    
    Respond only with the valid SVG content without explanation.
    """
    system_prompt += f"Artdata: {artdataFileContents}"
    
    try:
        response_data, status = await updateTemplativeFileForDescription(
            svg_content,
            system_prompt,
            description
        )
        
        if status != 200:
            print(f"Error from API: {response_data.get('message', 'Unknown error')}")
            return svg_content
            
        return response_data['message']
    except Exception as e:
        print(f"Error enhancing SVG: {str(e)}")
        return svg_content

async def enhanceComponentJson(componentJson: dict, description: str) -> dict:
    system_prompt = """
    You are an expert in board game design. You will update these fields labeled `Replace with reasonable content` to describe a board game component in general. Whatever information is stored in these fields is common to all the pieces that make up this board game component.
    Use the description to update the fields reasonable values. 
    When giving a value for a color, use hexidecimal colors without alpha values, such as #ffaaff.
    Respond only with the valid JSON object without explanation. If there are no instances of `Replace with reasonable content` then just return the original content.
    """
    
    try:
        response_data, status = await updateTemplativeFileForDescription(
            componentJson,
            system_prompt,
            description
        )
        
        if status != 200:
            print(f"Error from API: {response_data.get('message', 'Unknown error')}")
            return componentJson    
            
        return json.loads(response_data['message'])
    except Exception as e:
        print(f"Error enhancing component JSON: {str(e)}")
        return componentJson

async def enhancePiecesJson(piecesJson: list, description: str) -> list:
    system_prompt = """
    You are an expert in board game design. You will enhance or create game pieces based on the description.
    If pieces already exist in the JSON, enhance them with appropriate properties.
    If no pieces exist, create new pieces based on the description.

    Rules for creating/enhancing pieces:
    1. Each piece must have these properties:
       - name: lowercase, no spaces (e.g., "germanypiece")
       - displayName: proper capitalization with spaces (e.g., "Germany Piece")
       - quantity: reasonable number for the game piece
    2. Add other properties that make sense for the game piece (e.g., points, health, attack)
    3. Keep existing piece properties unless they conflict with the description
    4. When giving a value for a color, use hexidecimal colors without alpha values, such as #ffaaff.

    5. Create multiple pieces if the description mentions more than one
    6. If a field ends in Image then the value should be the filename (without extension). For instance the key "unitImage" might get the value "soldier". All images should have the same prefix, such as soldierCalvary, soldierPikemen, etc.
    
    Respond only with the valid JSON array of pieces without explanation.
    """
    
    try:
        response_data, status = await updateTemplativeFileForDescription(
            piecesJson,
            system_prompt,
            description
        )
        
        if status != 200:
            print(f"Error from API: {response_data.get('message', 'Unknown error')}")
            return piecesJson
            
        return json.loads(response_data['message'])
    except Exception as e:
        print(f"Error enhancing pieces JSON: {str(e)}")
        return piecesJson