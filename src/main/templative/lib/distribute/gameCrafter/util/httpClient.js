const axios = require('axios');

async function post(gameCrafterSession, url, data) {
  try {
    const response = await axios.post(url, data);
    return await handleResponse(url, response, data);
  } catch (error) {
    throw error;
  }
}

async function get(gameCrafterSession, url, params) {
  try {
    const response = await axios.get(url, { params });
    return await handleResponse(url, response, params);
  } catch (error) {
    throw error;
  }
}

async function del(gameCrafterSession, url, params) {
  try {
    const response = await axios.delete(url, { params });
    return await handleResponse(url, response, params);
  } catch (error) {
    throw error;
  }
}

async function handleResponse(url, response, requestData) {
  const statusCode = response.status.toString();
  const responseText = response.data;

  if (!statusCode.startsWith('2')) {
    console.log('!!! Request Failed:', url);
    console.log('Status Code:', statusCode);
    console.log('Response Text:', responseText);
    console.log('Request Data:');
    console.dir(requestData, { depth: null });
    throw new Error(`API Request Failed: ${url}\nStatus: ${statusCode}\nResponse: ${responseText}`);
  }

  try {
    const responseJson = responseText;
    return responseJson.result;
  } catch (error) {
    return responseText;
  }
}

module.exports = {
  post,
  get,
  delete: del,
};