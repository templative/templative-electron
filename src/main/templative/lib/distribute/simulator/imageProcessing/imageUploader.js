const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const crypto = require('crypto');
const {captureMessage, captureException } = require("../../../sentryElectronWrapper");

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
async function uploadToS3(image, token) {
  try {
    // Convert image to buffer
    const buffer = await image.toBuffer({ format: 'png' });
    
    // Calculate MD5 hash locally
    const md5Hash = calculateMd5Hash(buffer);
    
    const isDev = false;
    const baseUrl = isDev ? "http://127.0.0.1:5000" : "https://api.templative.net/";
    
    // Request a presigned URL from the server with auth token
    const presignedResponse = await fetch(`${baseUrl}/simulator/image/presigned-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        md5_hash: md5Hash
      })
    });
    
    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.text();
      console.log(`!!! Failed to get presigned URL: ${errorData}`);
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
    captureException(error);
    console.log(`!!! Error uploading image: ${error}`);
    return null;
  }
}

/**
 * Legacy method that uploads through the server
 * @param {Image} image - The image to upload
 * @returns {Promise<string|null>} - The URL of the uploaded image or null if upload failed
 */
async function uploadThroughServer(image) {
  try {
    // Convert image to buffer
    const buffer = await image.toBuffer({ format: 'png' });
    
    const isDev = false;
    const baseUrl = isDev ? "http://127.0.0.1:5000" : "https://api.templative.net/";
    
    // Create a simple fetch request with the buffer as the body
    const response = await fetch(`${baseUrl}/simulator/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: buffer
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.url;
    } else {
      const errorData = await response.text();
      console.log(`!!! Failed to upload image to server: ${errorData}`);
      return null;
    }
  } catch (error) {
    captureException(error);
    console.log(`!!! Error uploading image: ${error}`);
    return null;
  }
}

module.exports = {
  uploadToS3
}; 