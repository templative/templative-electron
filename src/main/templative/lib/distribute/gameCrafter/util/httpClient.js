const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
async function post(gameCrafterSession, url, data) {
  try {
    if (data.file && typeof data.file === 'string') {
      const formData = new FormData();
      
      for (const key in data) {
        if (key !== 'file') {
          formData.append(key, data[key]);
        }
      }
      
      const fileStream = fs.createReadStream(data.file);
      formData.append('file', fileStream);
      
      const response = await axios.post(url, formData, {
        headers: formData.getHeaders()
      });
      return await handleResponse(url, response, data);
    } else {
      const requestData = { ...data, session_id: gameCrafterSession.sessionId };
      const response = await axios.post(url, requestData);
      return await handleResponse(url, response, requestData);
    }
  } catch (error) {
    // console.log("FULL ERROR DETAILS:", error.message);
    // console.log("RESPONSE BODY:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

async function get(gameCrafterSession, url, params) {
  try {
    const requestParams = { ...params, session_id: gameCrafterSession.sessionId };
    const response = await axios.get(url, { params: requestParams });
    return await handleResponse(url, response, requestParams);
  } catch (error) {
    // console.log("FULL ERROR DETAILS:", error.message);
    // console.log("RESPONSE BODY:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

async function del(gameCrafterSession, url, params) {
  try {
    const requestParams = { ...params, session_id: gameCrafterSession.sessionId };
    const response = await axios.delete(url, { params: requestParams });
    return await handleResponse(url, response, requestParams);
  } catch (error) {
    // console.log("FULL ERROR DETAILS:", error.message);
    // console.log("RESPONSE BODY:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

async function handleResponse(url, response, requestData) {
  const statusCode = response.status.toString();
  const responseText = response.data;

  if (!statusCode.startsWith('2')) {
    // Create a more detailed error message
    let errorDetails = `Request Failed (${statusCode}): ${url}`;
    
    // Add response data if available
    if (responseText) {
      if (typeof responseText === 'object') {
        errorDetails += `\nResponse: ${JSON.stringify(responseText, null, 2)}`;
      } else {
        errorDetails += `\nResponse: ${responseText}`;
      }
    }
    
    // Add request data for debugging (but sanitize sensitive info)
    const sanitizedRequestData = { ...requestData };
    if (sanitizedRequestData.session_id) {
      sanitizedRequestData.session_id = '[REDACTED]';
    }
    errorDetails += `\nRequest Data: ${JSON.stringify(sanitizedRequestData, null, 2)}`;
    
    // Log the detailed error for debugging
    console.error(errorDetails);
    
    console.log("FULL ERROR DETAILS:", errorDetails);
    console.log("RESPONSE BODY:", JSON.stringify(response.data, null, 2));
    
    throw new Error(errorDetails);
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