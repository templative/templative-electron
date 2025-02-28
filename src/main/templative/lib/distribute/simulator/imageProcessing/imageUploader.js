const fetch = require('node-fetch');
const FormData = require('form-data');
const { Readable } = require('stream');
const chalk = require('chalk');

/**
 * Upload an image to the server
 * @param {Image} image - The image to upload
 * @returns {Promise<string|null>} - The URL of the uploaded image or null if upload failed
 */
async function uploadToS3(image) {
  // Convert image to buffer
  const buffer = await image.toBuffer({ format: 'png' });
  
  const isDev = false;
  const baseUrl = isDev ? "http://127.0.0.1:5000" : "https://api.templative.net/";
  
  try {
    // Create multipart form data
    const formData = new FormData();
    
    // Create a readable stream from buffer for form-data
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Signal end of stream
    
    formData.append('image', stream, {
      filename: 'image.png',
      contentType: 'image/png'
    });
    
    const response = await fetch(`${baseUrl}/simulator/image`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders ? formData.getHeaders() : {}
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