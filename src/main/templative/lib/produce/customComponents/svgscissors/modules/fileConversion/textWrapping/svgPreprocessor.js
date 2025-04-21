const { processTextElements } = require('./textProcessor');
/**
 * Preprocess SVG text to remove SVG 2.0 features that aren't compatible with resvg-js
 * @param {string} svgData - SVG content as string
 * @param {boolean} force_rewrap - Force rewrapping of text even if it has positioned tspans
 * @returns {string} - Processed SVG data
 */


/**
 * Clean up SVG namespaces and remove problematic attributes
 * @param {string} svgData - SVG content as string
 * @returns {string} - Cleaned SVG data
 */
function cleanupSvgNamespaces(svgData) {
  // Ensure we have the SVG namespace defined in the root element
  if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgData = svgData.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  
  // Ensure any SVG prefix is properly namespaced
  if (svgData.includes('<svg:')) {
    // If we have svg: prefixes but no namespace, add it
    if (!svgData.includes('xmlns:svg="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace(/<svg/i, '<svg xmlns:svg="http://www.w3.org/2000/svg"');
    }
  }
  
  // Fix duplicate namespaces if they exist
  svgData = svgData.replace(/xmlns:svg="http:\/\/www.w3.org\/2000\/svg"\s+xmlns:svg="http:\/\/www.w3.org\/2000\/svg"/g, 
                          'xmlns:svg="http://www.w3.org/2000/svg"');
  
  // Remove namespace declarations that might cause problems
  svgData = svgData.replace(/xmlns:sodipodi="[^"]*"/g, '')
             .replace(/xmlns:inkscape="[^"]*"/g, '');
  
  // IMPORTANT: Remove all sodipodi and inkscape elements
  svgData = svgData.replace(/<sodipodi:[^>]*\/>|<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/g, '')
             .replace(/<inkscape:[^>]*\/>|<inkscape:[^>]*>[\s\S]*?<\/inkscape:[^>]*>/g, '');
  
  // Remove all sodipodi and inkscape attributes
  svgData = svgData.replace(/sodipodi:[a-zA-Z0-9\-_]+="[^"]*"/g, '')
             .replace(/inkscape:[a-zA-Z0-9\-_]+="[^"]*"/g, '');
             
  return svgData;
}

/**
 * Fallback preprocessing for SVGs that don't need special handling
 * @param {string} svgData - SVG content as string
 * @param {boolean} force_rewrap - Force rewrapping of text
 * @returns {string} - Processed SVG data
 */
async function fallbackPreprocessing(svgData, force_rewrap) {
  try {
    // Parse the SVG using JSDOM
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(svgData, { contentType: 'image/svg+xml' });
    const document = dom.window.document;
    
    // Process text elements
    await processTextElements(document, force_rewrap);
    
    // Add font styles
    const { addFontStyles } = require('./fontHandler');
    svgData = addFontStyles(dom.serialize());
    
    return svgData;
  } catch (error) {
    console.error(`Error in fallbackPreprocessing: ${error.message}`);
    return svgData;
  }
}

/**
 * Clean up unused definitions in SVG
 * @param {string} svgData - SVG content as string
 * @returns {string} - Cleaned SVG data
 */
function cleanupUnusedDefs(svgData) {
  try {
    // Parse the SVG
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(svgData, { contentType: 'image/svg+xml' });
    const document = dom.window.document;
    
    // Find all defs elements
    const defsElements = document.querySelectorAll('defs');
    
    // Find all elements with id attributes
    const allElements = document.querySelectorAll('[id]');
    const usedIds = new Set();
    
    // Find all url() references in the document
    const allElementsWithAttrs = document.querySelectorAll('*');
    allElementsWithAttrs.forEach(el => {
      // Check all attributes for url() references
      Array.from(el.attributes).forEach(attr => {
        const value = attr.value;
        const urlMatches = value.match(/url\(#([^)]+)\)/g);
        if (urlMatches) {
          urlMatches.forEach(match => {
            const idMatch = match.match(/url\(#([^)]+)\)/);
            if (idMatch && idMatch[1]) {
              usedIds.add(idMatch[1]);
            }
          });
        }
      });
    });
    
    // Check for elements that are referenced by id but not used in url()
    let removedElements = 0;
    defsElements.forEach(defs => {
      const children = Array.from(defs.children);
      children.forEach(child => {
        if (child.id && !usedIds.has(child.id)) {
          // This element is not referenced anywhere
          child.parentNode.removeChild(child);
          removedElements++;
        }
      });
    });
    
    if (removedElements > 0) {
      // console.log(`Removed ${removedElements} unused elements from defs`);
    }
    
    return dom.serialize();
  } catch (error) {
    console.error(`Error cleaning up unused defs: ${error.message}`);
    return svgData;
  }
}

module.exports = {
  cleanupSvgNamespaces,
  fallbackPreprocessing,
  cleanupUnusedDefs
}; 