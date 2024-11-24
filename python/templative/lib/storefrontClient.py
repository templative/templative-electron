import aiohttp
import json
from typing import Optional, Tuple, Union

# baseUrl = "https://templative.net"
baseUrl = "http://127.0.0.1:5000"

async def updateTemplativeFileForDescription(
    file_contents: str,
    system_prompt: str,
    description: str,
) -> Tuple[Union[dict, str], int]:
    """
    Async client function to generate components using the component generation endpoint.
    
    Args:
        base_url (str): The base URL of the API
        email (str): User's email address
        file_contents (str): Contents of the file to process
        system_prompt (str): The system prompt for component generation
        description (str): The description for component generation
        auth_token (str): Authentication token
        
    Returns:
        Tuple[Union[dict, str], int]: Response data and status code
    """
    headers = {
        'Content-Type': 'application/json'
    }
    
    payload = {
        'fileContents': file_contents,
        'systemPrompt': system_prompt,
        'description': description
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f'{baseUrl}/generate',
            headers=headers,
            json=payload
        ) as response:
            response_data = await response.json()
            return response_data, response.status
        
async def promptChatGPT(
    prompt: str,
) -> Tuple[Union[dict, str], int]:

    headers = {
        'Content-Type': 'application/json'
    }
    
    payload = {
        'prompt': prompt,
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f'{baseUrl}/prompt',
            headers=headers,
            json=payload
        ) as response:
            response_data = await response.json()
            return response_data, response.status