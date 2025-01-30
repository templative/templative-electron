const axios = require("axios");

var baseurl = "https://api.templative.net/"
// baseurl = "http://127.0.0.1:5000"
const verifyCredentials = async (email, password) => {
    try {
        var response = await axios.post(`${baseurl}/login`, { email: email, password: password })
        return { statusCode: response.status, error: response.data.message, token: response.data.token };
    }
    catch(error) {
        if (error.response) {
            console.error(`Error status code: ${error.response.status}`);
            console.error(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
            return { statusCode: error.response ? error.response.status : 500, token: null };
        }
}
const verifyCredentialsGoogle = async (token) => {
    try {
        var response = await axios.post(`${baseurl}/login/google`, { token: token })
        return { statusCode: response.status, error: response.data.message, token: response.data.token, email: response.data.email };
    }
    catch(error) {
        if (error.response) {
            console.error(`Error status code: ${error.response.status}`);
            console.error(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
            return { statusCode: error.response ? error.response.status : 500, token: null };
        }
}
const isTokenValid = async (email, token) => {
    try {
        const response = await axios.post(`${baseurl}/validate-token`, { email }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return { isValid: response.data.isValid, statusCode: response.status };
    } catch (error) {
        if (error.response) {
            console.error(`Error status code: ${error.response.status}`);
            console.error(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
        return { isValid: false, statusCode: error.response ? error.response.status : 500 };
    }
}
module.exports = {
    verifyCredentials, isTokenValid, verifyCredentialsGoogle
}