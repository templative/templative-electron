#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { calculatePathBoundingBox } = require('../../src/main/templative/lib/distribute/printout/bleedScaling.js');
const SOURCE_DIR = path.join(__dirname, '../..', 'src/main/templative/lib/componentTemplates');
const { COMPONENT_INFO } = require('../../src/shared/componentInfo.js');

function getBoundingBox(fileName, clipElement) {
  const tagName = clipElement.tagName.toLowerCase();
  if (tagName === 'rect') {
    return {
      width: parseFloat(clipElement.getAttribute('width')),
      height: parseFloat(clipElement.getAttribute('height'))
    }
  } else if (tagName === 'path') {
      const pathData = clipElement.getAttribute('d');
      if (pathData) {
          var clipBox = calculatePathBoundingBox(pathData);
          return {
            width: clipBox.width,
            height: clipBox.height
          }
      }
      else {
        console.log(`No path data found in ${path.basename(sourcePath)}`);
        return 0;
      }
  } else if (tagName === 'circle') {
      return {
        width: parseFloat(clipElement.getAttribute('r')) * 2,
        height: parseFloat(clipElement.getAttribute('r')) * 2
      }
  } else if (tagName === 'ellipse') {
      const rx = parseFloat(clipElement.getAttribute('rx'));
      const ry = parseFloat(clipElement.getAttribute('ry'));
      return {
        width: rx * 2,
        height: ry * 2
      }
  }
  console.log(`Unknown element type: ${tagName} ${fileName}`);
  return null;
}

function getAspectRatio(clipElement) {
    const tagName = clipElement.tagName.toLowerCase();
    if (tagName === 'rect') {
        return parseFloat(clipElement.getAttribute('width')) / parseFloat(clipElement.getAttribute('height'));
    } else if (tagName === 'path') {
        const pathData = clipElement.getAttribute('d');
        if (pathData) {
            var clipBox = calculatePathBoundingBox(pathData);
            return clipBox.width / clipBox.height;
        }
        else {
          console.log(`No path data found in ${path.basename(sourcePath)}`);
          return 0;
        }
    } else if (tagName === 'circle') {
        return 1;
    } else if (tagName === 'ellipse') {
        const rx = parseFloat(clipElement.getAttribute('rx'));
        const ry = parseFloat(clipElement.getAttribute('ry'));
        return rx / ry;
    }
    console.log(`Unknown element type: ${tagName}`);
    return 0;
}

async function saveComponentInfo(componentInfo) {
  const componentInfoPath = path.join(__dirname, '../..', 'src/shared/componentInfo.js');
  const componentInfoContent = `const COMPONENT_INFO = ${JSON.stringify(componentInfo, null, 2)};\n\nmodule.exports = { COMPONENT_INFO };`;
  await fs.writeFile(componentInfoPath, componentInfoContent, 'utf8');  
  console.log(`Component info saved to ${componentInfoPath}`);
}

async function processAllComponents() {
  var missingTemplateFiles = []
  const componentInfo = Object.assign({}, COMPONENT_INFO);
  for (const type of Object.keys(COMPONENT_INFO)) {
    var component = COMPONENT_INFO[type];
    if (component.TemplateFiles === undefined) {
      missingTemplateFiles.push(component.Name);
      continue;
    }
    for (const templateFile of component.TemplateFiles) {
      
      const sourcePath = path.join(SOURCE_DIR, templateFile + '.svg');
      var content;
      try {
        content = await fs.readFile(sourcePath, 'utf8');
      } catch (error) {
        // console.log(`Missing ${templateFile} for ${type}`);
        continue;
      }
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');
      const clippingElement = doc.getElementById('clipping');
      componentInfo[type]["DimensionsPixelsClipped"] = componentInfo[type]["DimensionsPixels"]
      componentInfo[type]["PrintingSizeUpRatio"] = [1, 1];
      if (clippingElement === null) {
        continue;
      }
      const clippingBoundingBox = getBoundingBox(templateFile, clippingElement);
      if (clippingBoundingBox === null) {
        continue;
      }
      componentInfo[type]["DimensionsPixelsClipped"] = [Math.round(clippingBoundingBox.width), Math.round(clippingBoundingBox.height)];
      
      const actualSizeElement = doc.getElementById('actualSize');
      if (actualSizeElement === null) {
        continue;
      }
      const actualSizeBoundingBox = getBoundingBox(templateFile, actualSizeElement);
      if (actualSizeBoundingBox === null) {
        continue;
      }
      const widthRatio = clippingBoundingBox.width / actualSizeBoundingBox.width;
      const heightRatio = clippingBoundingBox.height / actualSizeBoundingBox.height;
      componentInfo[type]["PrintingSizeUpRatio"] = [widthRatio, heightRatio];
      // console.log(componentInfo[type], clippingBoundingBox.width , actualSizeBoundingBox.width, clippingBoundingBox.height , actualSizeBoundingBox.height );
      // const actualSizeAspectRatio = Math.round((actualSizeBoundingBox.width / actualSizeBoundingBox.height) * 1000) / 1000;
      // const inchesAspectRatio = Math.round((componentInfo[type]["DimensionsInches"][0] / componentInfo[type]["DimensionsInches"][1]) * 1000) / 1000;
      // if (actualSizeAspectRatio !== inchesAspectRatio) {
      //   console.log(type, actualSizeAspectRatio, inchesAspectRatio);
      // }
    }
  }
  await saveComponentInfo(componentInfo);
  // console.log(`Missing template files: ${missingTemplateFiles.join(', ')}`);
}

async function processAllSvgs() {
  try {    
    // Read all files from source directory
    const files = await fs.readdir(SOURCE_DIR);
    const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
    
    console.log(`Found ${svgFiles.length} SVG files to process`);
    
    var total = 0;
    var fuckups = 0;
    for (const file of svgFiles) {
      const sourcePath = path.join(SOURCE_DIR, file);
      const content = await fs.readFile(sourcePath, 'utf8');
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');
      
      // Find the clipping element
      const clippingElement = doc.getElementById('clipping');
      if (!clippingElement) {
        console.log(`No clipping element found in ${path.basename(sourcePath)}`);
        continue;
      }
      
      var clippingAspectRatio = getAspectRatio(clippingElement);
      const fileAspectRatio = doc.documentElement.getAttribute('width') / doc.documentElement.getAttribute('height');
      
      if (clippingAspectRatio !== fileAspectRatio) {
        console.log(`${path.basename(sourcePath)}: ${Math.round(clippingAspectRatio * 100) / 100} & ${Math.round(fileAspectRatio * 100) / 100}`);
        fuckups++;
      }
      total++;
    }
    
    console.log(`✓ All SVGs processed successfully. ${fuckups} fuckups out of ${total} files.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
// processAllSvgs();
processAllComponents();
