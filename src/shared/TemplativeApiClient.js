const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const crypto = require('crypto');

// Configuration
const BASE_URL = "https://templative.net/api";
const IS_DEV = false;
// const BASE_URL = "http://127.0.0.1:5000"; // Uncomment for local development
// const IS_DEV = true;

// ========================
// AUTH FUNCTIONS
// ========================

async function loginUsingEmailAndPassword(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/electron/login`, { 
            email: email, 
            password: password 
        });
        
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
    } catch (error) {
        if (error.response) {
            console.error(`Error status code: ${error.response.status}`);
            console.error(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.error("No response was received from the server.");
        } else {
            console.error('Error', error.message);
        }
        return { 
            statusCode: error.response ? error.response.status : 500, 
            token: null, 
            ownership: { hasProduct: false } 
        };
    }
}

async function logout() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/electron/logout`);
        return { 
            success: response.data.success,
            statusCode: response.status
        };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, statusCode: error.response ? error.response.status : 500 };
    }
}

async function isTokenValid(token) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/electron/validate-token`, { token });
        
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
        return { 
            isValid: false, 
            statusCode: error.response ? error.response.status : 500, 
            ownership: { hasProduct: false } 
        };
    }
}

async function refreshToken(token) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/electron/refresh-token`, { token });
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

async function initiateGoogleOAuth() {
    try {
        const response = await axios.get(`${BASE_URL}/auth/electron/oauth/google/initiate`);
        return { 
            statusCode: response.status, 
            authUrl: response.data.authUrl,
            state: response.data.state
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
        return { statusCode: error.response ? error.response.status : 500, authUrl: null };
    }
}

// ========================
// PRODUCT & OWNERSHIP FUNCTIONS
// ========================

async function checkProductOwnership(email, productGuid, token) {
    if (!email) {
        console.error("email cannot be undefined");
        return { hasProduct: false, statusCode: 400 };
    }
    if (!token) {
        console.error("token cannot be undefined");
        return { hasProduct: false, statusCode: 400 };
    }

    try {
        const response = await axios.get(`${BASE_URL}/product`, {
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

async function doesUserOwnTemplative(email, token) {
    return await checkProductOwnership(email, "TEMPLATIVE", token);
}

// ========================
// PUBLISHER FUNCTIONS
// ========================

async function searchForPublisher(email, token, gameInformation) {
    if (!email) {
        console.error("email cannot be undefined");
        return false;
    }
    if (!token) {
        console.error("token cannot be undefined");
        return false;
    }
    if (!gameInformation) {
        console.error("gameInformation cannot be undefined");
        return false;
    }

    try {
        const response = await axios.post(`${BASE_URL}/publishers`, {
            email: email,
            gameInformation: gameInformation
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.message;
    } catch (error) {
        if (error.response) {
            console.log(`Error status code: ${error.response.status}`);
            console.log(`Error details: ${error.response.data}`);
        } else if (error.request) {
            console.log("No response was received from the server.");
        } else {
            console.log('Error', error.message);
        }
        return false;
    }
}

// ========================
// AI FUNCTIONS
// ========================

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
        const response = await axios.post(`${BASE_URL}/ai/generate`, payload, { headers });
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
        const response = await axios.post(`${BASE_URL}/prompt`, payload, { headers });
        return [response.data, response.status];
    } catch (error) {
        console.error('Error:', error);
        return [error.response.data, error.response.status];
    }
}

// ========================
// SIMULATOR FUNCTIONS
// ========================

/**
 * Calculate MD5 hash from image buffer
 * @param {Buffer} buffer - Image buffer
 * @returns {string} - MD5 hash
 */
function calculateMd5Hash(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * Upload an image directly to S3 using presigned URL
 * @param {Image} image - The image to upload
 * @param {string} token - The authentication token
 * @returns {Promise<string|null>} - The URL of the uploaded image or null if upload failed
 */
async function uploadImageToS3(image, token) {
    try {
        // Validate token before proceeding
        if (!token) {
            console.log('!!! No token provided for image upload');
            return null;
        }
        
        if (typeof token !== 'string') {
            console.log(`!!! Token is not a string, got ${typeof token}: ${token}`);
            return null;
        }
        
        if (token.trim() === '') {
            console.log('!!! Token is empty string');
            return null;
        }
        
        // Convert image to buffer
        const buffer = await image.toBuffer({ format: 'png' });
        
        // Calculate MD5 hash locally
        const md5Hash = calculateMd5Hash(buffer);
        
        console.log(`DEBUG: Token being sent (first 20 chars): ${token ? token.substring(0, 20) : 'undefined'}...`);
        console.log(`DEBUG: Token type: ${typeof token}`);
        console.log(`DEBUG: Token length: ${token ? token.length : 'N/A'}`);
        
        // Request a presigned URL from the server with auth token
        const presignedResponse = await fetch(`${BASE_URL}/simulator/image/presigned-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                md5_hash: md5Hash
            })
        });
        
        console.log(`DEBUG: Response status: ${presignedResponse.status}`);
        console.log(`DEBUG: Response status text: ${presignedResponse.statusText}`);
        
        if (!presignedResponse.ok) {
            const errorData = await presignedResponse.text();
            console.log(`!!! Failed to get presigned URL: ${errorData}`);
            console.log(`DEBUG: Full error response: ${errorData}`);
            return null;
        }
        
        const presignedData = await presignedResponse.json();
        
        // If the image already exists, just return the URL
        if (presignedData.exists) {
            // console.log(`Image already exists, no need to upload`);
            return presignedData.url;
        }
        
        // Upload directly to S3 using the presigned URL
        const uploadResponse = await fetch(presignedData.presigned_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'image/png'
            },
            body: buffer
        });
        
        if (!uploadResponse.ok) {
            console.log(`!!! Failed to upload to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
            return null;
        }
        return presignedData.final_url;
    } catch (error) {
        console.log(`!!! Error uploading image: ${error}`);
        return null;
    }
}

// ========================
// GAME CRAFTER FUNCTIONS
// ========================

async function loginIntoGameCrafter(sso) {
    try {
        const response = await axios.get(`${BASE_URL}/auth/the-game-crafter/sso`, {
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

// Export all functions
module.exports = {
    // Configuration
    BASE_URL,
    IS_DEV,
    
    // Auth functions
    loginUsingEmailAndPassword,
    logout,
    isTokenValid,
    refreshToken,
    initiateGoogleOAuth,
    
    // Product & ownership functions
    checkProductOwnership,
    doesUserOwnTemplative,
    
    // Publisher functions
    searchForPublisher,
    
    // AI functions
    updateTemplativeFileForDescription,
    promptChatGPT,
    
    // Simulator functions
    calculateMd5Hash,
    uploadImageToS3,
    
    // Game Crafter functions
    loginIntoGameCrafter
}; 