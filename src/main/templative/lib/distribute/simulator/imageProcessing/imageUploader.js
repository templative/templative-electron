const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const chalk = require('chalk');

/**
 * Upload an image to the server
 * @param {Image} image - The image to upload
 * @returns {Promise<string|null>} - The URL of the uploaded image or null if upload failed
 */
async function uploadToS3(image) {
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
      console.log(chalk.red(`!!! Failed to upload image to server: ${errorData}`));
      return null;
    }
  } catch (error) {
    console.log(chalk.red(`!!! Error uploading image: ${error}`));
    return null;
  }
}

module.exports = {
  uploadToS3
}; 