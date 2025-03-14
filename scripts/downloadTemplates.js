import { COMPONENT_INFO } from "../src/shared/componentInfo.js";
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import https from 'https';

function downloadSvg(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download SVG: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        fs.writeFileSync(filepath, data);
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function updateSvgDimensions(svgContent, width, height) {
  const dom = new JSDOM(svgContent);
  const document = dom.window.document;
  const svgElement = document.querySelector('svg');
  
  if (svgElement) {
    svgElement.setAttribute('width', width);
    svgElement.setAttribute('height', height);
    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    return dom.serialize();
  }
  
  return svgContent; // Return original if no SVG element found
}

async function processComponents() {
  // Create the componentTemplates directory if it doesn't exist
  const templatesDir = "/Users/oliverbarnum/Documents/git/templative-electron/src/main/templative/lib/create/componentTemplates";
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  for (const [componentType, componentInfo] of Object.entries(COMPONENT_INFO)) {
    try {
      const componentTemplateFilepath = path.join(templatesDir, `${componentType}.svg`);
      
      // Convert camelCase to hyphenated format for URL
      // e.g., "AccordionBoard" becomes "Accordion-Board"
      const urlComponentType = componentType.replace(/([a-z])([A-Z])/g, '$1-$2');
      
      // Construct the URL for the template
      const templateUrl = `https://s3.amazonaws.com/www.thegamecrafter.com/templates/${urlComponentType}.svg`;
      
      console.log(`Downloading template for ${componentType} from ${templateUrl}`);
      
    //   Download the SVG
      const svgContent = await downloadSvg(templateUrl, componentTemplateFilepath);
      
      // Get dimensions from component info
      const [width, height] = componentInfo.DimensionsPixels || [0, 0];
      
      if (width && height) {
        // Update SVG dimensions
        console.log(`Updating dimensions for ${componentType} to ${width}x${height}`);
        const updatedSvg = updateSvgDimensions(svgContent, width, height);
        
        // Save the updated SVG
        fs.writeFileSync(componentTemplateFilepath, updatedSvg);
        console.log(`Saved updated template for ${componentType}`);
      } else {
        console.warn(`No dimensions found for ${componentType}, using original SVG`);
      }
    } catch (error) {
      console.error(`Error processing ${componentType}: ${error.message}`);
    }
  }
}
  
// Run the process
processComponents().catch(error => {
  console.error('Error in template download process:', error);
});