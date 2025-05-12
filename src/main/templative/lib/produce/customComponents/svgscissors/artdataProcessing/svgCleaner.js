/**
 * Clean up SVG namespaces and remove problematic attributes
 * @param {string} svgData - SVG content as string
 * @returns {string} - Cleaned SVG data
 */
async function cleanupSvgNamespacesAsync(svgData) {
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
 * Clean up unused definitions in SVG
 * @param {string} svgData - SVG content as string
 * @returns {string} - Cleaned SVG data
 */
async function cleanupUnusedDefs(document) {
  try {    
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
    })    
  } catch (error) {
    console.error(`Error cleaning up unused defs: ${error.message}`);
  }
}
function sanitizeSvgContent(content) {
  if (!content) return "";
  
  // Fix common XML issues
  return content
      // Ensure XML declaration is correct
      .replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8" standalone="no"?>')
      // Fix self-closing tags
      .replace(/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*)\/>/g, '<$1 $2></$1>')
      // Remove any control characters
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Fix unclosed CDATA sections
      .replace(/<!\[CDATA\[([^\]]*)(?!\]\]>)/g, '<![CDATA[$1]]>')
      // Fix unescaped ampersands
      .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
}


module.exports = {
  cleanupSvgNamespacesAsync,
  cleanupUnusedDefs,
  sanitizeSvgContent
}; 