const { extractFontSizeAsync, DEFAULT_FONT_SIZE } = require('./svgElementIntepretaton/styleExtraction');
const {fontCache} = require('./fontCache'); 


async function estimateLineHeightAsync(textElement) {
  const fontSize = await extractFontSizeAsync(textElement) || DEFAULT_FONT_SIZE;
  const style = textElement.getAttribute('style') || '';
  const lineHeightMatch = style.match(/line-height:([^;]+)/);
  
  if (lineHeightMatch) {
    const lineHeightStr = lineHeightMatch[1].trim();
    if (lineHeightStr.endsWith('px')) {
      return parseFloat(lineHeightStr.slice(0, -2));
    } else if (lineHeightStr.endsWith('%')) {
      return fontSize * parseFloat(lineHeightStr.slice(0, -1)) / 100;
    }
    return parseFloat(lineHeightStr) * fontSize;
  }
  
  // Default line height is 1.2 times the font size
  // This is a minimum - actual line height may be larger based on tallest character
  return fontSize * 1.2;
}

/**
 * Calculate line height based on the tallest character in the line
 * @param {string} line - Line of text
 * @param {number} fontSize - Base font size
 * @param {Array} formattingRanges - Formatting ranges
 * @param {Object} fontInfo - Font information
 * @param {number} offset - Starting position of the line within the full content
 * @returns {number} - Line height based on tallest character
 */
async function calculateLineHeightForLineAsync(line, fontSize, formattingRanges = [], fontInfo = {}, offset = 0) {
  if (!line || line.trim().length === 0) {
    return fontSize * (fontInfo.lineHeight || 1.2); // Default for empty lines
  }
  
  // Get the maximum character height in the line
  const maxCharHeight = await fontCache.calculateMaxCharHeightAsync(
    line,
    formattingRanges,
    fontSize,
    fontInfo.fontFamily || 'Arial',
    offset // Pass the offset to calculateMaxCharHeightAsync
  );
  
  // For lines with normal text, use the line-height parameter from the SVG
  // For lines with very large text (like 90px "End"), adjust the spacing
  // to prevent excessive line heights
  let lineHeightMultiplier = fontInfo.lineHeight || 1.25; // Use the extracted line-height or default to 1.25
  lineHeightMultiplier *= 0.8;
  // For very large text, we might need to adjust the line height multiplier
  // to prevent excessive spacing
  // if (maxCharHeight > fontSize * 2) {
  //   // For lines with very large text, use a slightly reduced line height
  //   // but still respect the original line-height parameter
  //   lineHeightMultiplier = Math.max(0.9, lineHeightMultiplier * 0.9);
  // }
  
  // console.log(`Using line-height multiplier: ${lineHeightMultiplier} for line: "${line}" at offset ${offset}`);
  
  return maxCharHeight * lineHeightMultiplier;
}

/**
 * Extract font attributes from a text element or tspan
 * @param {Element} element - Text element or tspan
 * @returns {Object} - Font attributes
 */


module.exports = {
  estimateLineHeightAsync,
  calculateLineHeightForLineAsync,
}; 