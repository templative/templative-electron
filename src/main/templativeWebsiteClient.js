const axios = require("axios");

var baseurl = "https://templative.net/api/"
// baseurl = "http://localhost:3001/api/"

const verifyCredentials = async (email, password) => {
    try {
        var response = await axios.post(`${baseurl}electron-auth/login`, { email: email, password: password })
        
        // If login successful, also check ownership in the same response
        let ownershipInfo = { hasProduct: false };
        if (response.status === 200 && response.data.token) {
            try {
                const ownershipResponse = await checkProductOwnership(email, "TEMPLATIVE", response.data.token);
                ownershipInfo = { hasProduct: ownershipResponse.hasProduct };
            } catch (ownershipError) {
                console.error('Error checking ownership during login:', ownershipError);
                // Don't fail login if ownership check fails, just assume no ownership
            }
        }
        
        return { 
            statusCode: response.status, 
            error: response.data.error, 
            token: response.data.token,
            user: response.data.user,
            ownership: ownershipInfo
        };
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
        return { statusCode: error.response ? error.response.status : 500, token: null, ownership: { hasProduct: false } };
    }
}

const loginIntoGameCrafter = async (sso) => {
    try {
        const response = await axios.get(`${baseurl}the-game-crafter/sso`, {
            params: { sso },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || response.status !== 200) {
            console.error('Failed to login into Game Crafter:', response.status);
            throw new Error('Failed to login into Game Crafter');
        }

        return response.data;
    } catch (error) {
        console.error('Error logging into Game Crafter:', error);
        throw error;
    }
}

const initiateGoogleOAuth = async () => {
    try {
        var response = await axios.get(`${baseurl}electron-auth/oauth/google/initiate`)
        return { 
            statusCode: response.status, 
            authUrl: response.data.authUrl,
            state: response.data.state
        };
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
        return { statusCode: error.response ? error.response.status : 500, authUrl: null };
    }
}

const isTokenValid = async (token) => {
    try {
        const response = await axios.post(`${baseurl}electron-auth/validate-token`, { token });
        
        // If token is valid, also check ownership
        let ownershipInfo = { hasProduct: false };
        if (response.data.valid && response.data.user) {
            try {
                const ownershipResponse = await checkProductOwnership(response.data.user.email, "TEMPLATIVE", token);
                ownershipInfo = { hasProduct: ownershipResponse.hasProduct };
            } catch (ownershipError) {
                console.error('Error checking ownership during token validation:', ownershipError);
                // Don't fail token validation if ownership check fails
            }
        }
        
        return { 
            isValid: response.data.valid, 
            statusCode: response.status,
            user: response.data.user,
            ownership: ownershipInfo
        };
    } catch (error) {
        if (error.response) {
            console.error(`Error status code: ${error.response.status}`);
            console.error(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
        return { isValid: false, statusCode: error.response ? error.response.status : 500, ownership: { hasProduct: false } };
    }
}

const refreshToken = async (token) => {
    try {
        const response = await axios.post(`${baseurl}electron-auth/refresh-token`, { token });
        return { 
            success: response.data.success,
            statusCode: response.status,
            token: response.data.token,
            user: response.data.user
        };
    } catch (error) {
        if (error.response) {
            console.error(`Error status code: ${error.response.status}`);
            console.error(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
        return { success: false, statusCode: error.response ? error.response.status : 500 };
    }
}

const logout = async () => {
    try {
        const response = await axios.post(`${baseurl}electron-auth/logout`);
        return { 
            success: response.data.success,
            statusCode: response.status
        };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, statusCode: error.response ? error.response.status : 500 };
    }
}

const checkProductOwnership = async (email, productGuid, token) => {
    try {
        const response = await axios.get(`${baseurl}product`, {
            params: { 
                email: email, 
                productGuid: productGuid 
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return { 
            hasProduct: response.data.hasProduct,
            statusCode: response.status
        };
    } catch (error) {
        if (error.response) {
            console.error(`Error checking product ownership - status code: ${error.response.status}`);
            console.error(error.response.data);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
        return { hasProduct: false, statusCode: error.response ? error.response.status : 500 };
    }
}

module.exports = {
    verifyCredentials, 
    isTokenValid, 
    initiateGoogleOAuth, 
    refreshToken,
    logout,
    loginIntoGameCrafter,
    checkProductOwnership
}