import json
from pprint import pprint

async def post(gameCrafterSession, url, **kwargs):
    async with gameCrafterSession.httpSession.post(url, data=kwargs) as response:
        return await handleResponse(url, response, **kwargs)

async def get(gameCrafterSession, url, **kwargs):
    async with gameCrafterSession.httpSession.get(url, params=kwargs) as response:
        return await handleResponse(url, response, **kwargs)

async def delete(gameCrafterSession, url, **kwargs):
    async with gameCrafterSession.httpSession.delete(url, params=kwargs) as response:
        return await handleResponse(url, response, **kwargs)

async def handleResponse(url, response, **kwargs):
    statusCode = str(response.status)
    responseText = await response.text()
    
    if not statusCode.startswith('2'):
        print('!!! Request Failed:', url)
        print('Status Code:', statusCode)
        print('Response Text:', responseText)
        print('Request kwargs:')
        pprint(kwargs)
        raise Exception(f'API Request Failed: {url}\nStatus: {statusCode}\nResponse: {responseText}')

    # Only try to parse JSON for successful responses
    try:
        responseJson = json.loads(responseText)
        return responseJson['result']
    except json.JSONDecodeError:
        # For non-JSON successful responses, return the raw text
        return responseText