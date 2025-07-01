#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const SOURCE_DIR = path.join(__dirname, '../../', 'src/main/templative/lib/componentTemplates');
const TARGET_DIR = path.join(__dirname, '../../', 'src/main/templative/lib/componentTemplateOutlines');

async function processSvgFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    
    // Find the clipping element
    const clippingElement = doc.getElementById('clipping');
    if (!clippingElement) {
      console.log(`No clipping element found in ${path.basename(filePath)}`);
      return null;
    }

    // Create new SVG document
    const newDoc = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg"></svg>', 'text/xml');
    const newSvg = newDoc.documentElement;
    
    // Copy viewBox from original SVG if it exists
    const originalSvg = doc.documentElement;
    if (originalSvg.hasAttribute('viewBox')) {
      newSvg.setAttribute('viewBox', originalSvg.getAttribute('viewBox'));
    }

    // Clone the clipping element
    const clonedElement = clippingElement.cloneNode(true);
    
    // Remove fill and add stroke
    clonedElement.removeAttribute('fill');
    clonedElement.setAttribute('fill-opacity', '0');
    // Remove fill from style attribute if it exists
    const style = clonedElement.getAttribute('style');
    if (style) {
      const newStyle = style.replace(/fill:[^;]+;?/g, '').replace(/fill-opacity:[^;]+;?/g, '');
      clonedElement.setAttribute('style', `${newStyle};fill-opacity:0`);
    }
    
    // Set stroke properties
    clonedElement.setAttribute('stroke', 'red');
    clonedElement.setAttribute('stroke-width', '5');
    // Ensure stroke is in style attribute as well
    const currentStyle = clonedElement.getAttribute('style') || '';
    const newStyle = currentStyle.replace(/stroke:[^;]+;?/g, '').replace(/stroke-width:[^;]+;?/g, '');
    clonedElement.setAttribute('style', `${newStyle};stroke:red;stroke-width:5px`);
    
    // Add the modified element to the new SVG
    newSvg.appendChild(clonedElement);
    
    // Serialize the new SVG
    const serializer = new XMLSerializer();
    return serializer.serializeToString(newDoc);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return null;
  }
}

async function processAllSvgs() {
  try {
    // Ensure target directory exists
    await fs.mkdir(TARGET_DIR, { recursive: true });
    
    // Read all files from source directory
    const files = await fs.readdir(SOURCE_DIR);
    const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
    
    console.log(`Found ${svgFiles.length} SVG files to process`);
    
    for (const file of svgFiles) {
      const sourcePath = path.join(SOURCE_DIR, file);
      const targetPath = path.join(TARGET_DIR, file);
      
      const processedContent = await processSvgFile(sourcePath);
      if (processedContent) {
        await fs.writeFile(targetPath, processedContent);
        console.log(`✓ Processed ${file}`);
      }
    }
    
    console.log('/n✓ All SVGs processed successfully');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
processAllSvgs();
