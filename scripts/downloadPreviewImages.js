const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');
const FormData = require('form-data');
const chalk = require('chalk');
const outputPath = "/Users/oliverbarnum/Documents/git/templative-electron/src/main/templative/lib/componentPreviewImages";
const removeBgKey = "VH3fhy1v91iG2m6VbbBWLVy1" //process.env.REMOVE_BG_KEY;

// Ensure the output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const {COMPONENT_INFO} = require("../src/shared/componentInfo.js");

async function removeBg(imageBuffer) {
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', imageBuffer, {
    filename: 'image.png',
    contentType: 'image/png'
  });

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': removeBgKey,
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Remove.bg API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.arrayBuffer();
}

// Background removal function using color thresholds
async function removeBackground(inputBuffer) {
  // Get image metadata
  const metadata = await sharp(inputBuffer).metadata();
  
  // Convert to PNG with alpha channel
  const pngBuffer = await sharp(inputBuffer)
    .toFormat('png')
    .toBuffer();
  
  // Extract the image as raw pixels
  const { data, info } = await sharp(pngBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Create a new buffer for the image with transparency
  const newData = Buffer.alloc(data.length);
  
  // Iterate through pixels and make background transparent
  // This is a simple approach that makes light-colored pixels transparent
  // You may need to adjust the threshold based on your images
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is light colored (likely background)
    // Adjust these thresholds based on your background color
    if (r > 200 && g > 180 && b > 160) {
      // Make transparent
      newData[i] = 0;
      newData[i + 1] = 0;
      newData[i + 2] = 0;
      newData[i + 3] = 0; // Alpha = 0 (transparent)
    } else {
      // Keep original color
      newData[i] = r;
      newData[i + 1] = g;
      newData[i + 2] = b;
      newData[i + 3] = 255; // Alpha = 255 (opaque)
    }
  }
  
  // Create new image with transparency
  return sharp(newData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .toFormat('png')
  .toBuffer();
}

async function downloadImages() {
  for (const key in COMPONENT_INFO) {
    const component = COMPONENT_INFO[key];
    const previewUri = component.PreviewUri;
    if (!previewUri) {
      console.log(`Component has no previewUri, skipping`);
      continue;
    }
    
    // Get the filename from the previewUri and ensure it has .png extension
    let filename = previewUri.split("/").pop();
    const filenameWithoutExt = filename.split('.')[0];
    const outputFilePath = path.join(outputPath, `${filenameWithoutExt}.png`);
    
    // If you dont already have the file, download it
    if (!fs.existsSync(outputFilePath)) {
      console.log(chalk.gray(`Downloading and processing ${filename}...`));
      try {
        // Download the image
        const response = await fetch(previewUri);
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        
        // Process with remove.bg API
        console.log(chalk.gray(`Removing background from ${filename}...`));
        const processedBuffer = await removeBg(imageBuffer);
        
        // Save the processed image
        fs.writeFileSync(outputFilePath, Buffer.from(processedBuffer));
        console.log(chalk.green(`Processed and saved ${outputFilePath}`));
      } catch (error) {
        console.error(chalk.red(`Error processing image ${filename}:`), error);
      }
    } else {
      console.log(chalk.gray(`${filename} already exists, skipping`));
    }
  }
  console.log(chalk.green("Done!"));
}

// Execute the function
downloadImages().catch(error => {
  console.error('Error downloading images:', error);
  process.exit(1);
});
