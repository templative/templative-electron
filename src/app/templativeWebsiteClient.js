const axios = require("axios");

const verifyCredentials = async (email, password) => {
    return {status: axios.HttpStatusCode.Ok, token: "493439479"} 
    try {
        var response = await axios.post(`https://www.templative.net/login`, { email, password })
        return { statusCode: response.status, token: response.data.token };
    }
    catch(error) {
        console.error(error);
        return { statusCode: error.response ? error.response.status : 500, token: null };
    }
}
const isTokenValid = async (token) => {
    // {status: axios.HttpStatusCode.BadGateway, token: "493439479"}
    return {isValid: true, status: axios.HttpStatusCode.Ok} 
    try {
        const response = await axios.post(`https://www.templative.net/validate_token`, { token }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return { isValid: response.data.isValid, statusCode: response.status };
    } catch (error) {
        console.error(error);
        return { isValid: false, statusCode: error.response ? error.response.status : 500 };
    }
}
module.exports = {
    verifyCredentials, isTokenValid
}