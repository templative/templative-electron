const { Builder } = require('xml2js');

/**
 * Convert an XML element to a string
 * @param {Object} element - XML element
 * @returns {Promise<string>} - XML string
 */
async function convertElementToString(element) {
  const builder = new Builder();
  const xml = await builder.buildObject(element.root);
  return xml.replace(/^<\?xml.*?\?>/, '<?xml version="1.0" standalone="yes"?>');
}
/**
 * Sanitize SVG content
 * @param {string} content - SVG content
 * @returns {string} - Sanitized SVG content
 */

// Helper function to sanitize SVG content before parsing
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
  convertElementToString,
  sanitizeSvgContent,
}; 