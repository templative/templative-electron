const axios = require('axios');

const baseUrl = "https://api.templative.net/";
// const baseUrl = "http://127.0.0.1:5000";

async function updateTemplativeFileForDescription(fileContents, systemPrompt, description) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const payload = {
        fileContents,
        systemPrompt,
        description
    };
    
    try {
        const response = await axios.post(`${baseUrl}/generate`, payload, { headers });
        return [response.data, response.status];
    } catch (error) {
        console.error('Error:', error);
        return [error.response.data, error.response.status];
    }
}

async function promptChatGPT(prompt) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const payload = {
        prompt,
    };
    
    try {
        const response = await axios.post(`${baseUrl}/prompt`, payload, { headers });
        return [response.data, response.status];
    } catch (error) {
        console.error('Error:', error);
        return [error.response.data, error.response.status];
    }
}

module.exports = { updateTemplativeFileForDescription, promptChatGPT };
