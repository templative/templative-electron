const axios = require("axios")

const doesUserOwnTemplative = async(email, token) => {
    if (email === undefined) {
        console.error("email cannot be undefined")
        return false
    }
    if (token === undefined) {
        console.error("token cannot be undefined")
        return false
    }
    try {
        const baseurl = "https://www.templative.net"
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
const TemplativeClient = { doesUserOwnTemplative: doesUserOwnTemplative }
export default TemplativeClient;
