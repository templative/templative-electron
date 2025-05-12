const axios = require("axios")

const doesUserOwnTemplative = async(email, token) => {
    // if (process.env.NODE_ENV === 'development') {
    //     return true
    // }
    
    if (email === undefined) {
        console.error("email cannot be undefined")
        return false
    }
    if (token === undefined) {
        console.error("token cannot be undefined")
        return false
    }
    try {
        const baseurl = "https://api.templative.net/"
        var response = await axios.get(`${baseurl}/product`, {
            params: {
                email: email,
                productGuid: "TEMPLATIVE"
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data.hasProduct
    }
    catch(error) {
        if (error.response) {
            console.log(`Error status code: ${error.response.status}`);
            console.log(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.log("No response was received from the server.");
        } else {
            console.log('Error', error.message);
        }
    }
    return false
}

const searchForAPublisher = async(email, token, gameInformation) => {
    if (email === undefined) {
        console.error("email cannot be undefined")
        return false
    }
    if (token === undefined) {
        console.error("token cannot be undefined")
        return false
    }
    if (gameInformation === undefined) {
        console.error("gameInformation cannot be undefined")
        return false
    }
    try {
        const baseurl = "https://api.templative.net/"
        var response = await axios.post(`${baseurl}/publishers`, {
            email: email,
            gameInformation: gameInformation
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data.message
    }
    catch(error) {
        if (error.response) {
            console.log(`Error status code: ${error.response.status}`);
            console.log(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.log("No response was received from the server.");
        } else {
            console.log('Error', error.message);
        }
    }
    return false
}
const TemplativeClient = { doesUserOwnTemplative: doesUserOwnTemplative, searchForAPublisher: searchForAPublisher }
export default TemplativeClient;
