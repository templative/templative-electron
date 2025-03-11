const chalk = require('chalk');
const { fontCache, extractFontAttributes } = require('./fontHandler');
/**
 * Escape special characters in a string for use in a regular expression
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



/**
 * Wrap text to fit within a container width
 * @param {string} text - Text to wrap
 * @param {number} fontSize - Font size
 * @param {number} containerWidth - Width of container
 * @param {Object} fontInfo - Font information
 * @param {Array} formattingRanges - Array of formatting ranges
 * @returns {string[]} - Array of wrapped lines
 */
function wrapText(text, fontSize, containerWidth, fontInfo = {}, formattingRanges = []) {
  if (!text) {
    // console.log(chalk.red("text is empty"))
    return [];
  }
  // Split text into paragraphs first (by newlines)
  const paragraphs = text.split(/\r?\n/);
  const lines = [];
  
  // Process each paragraph
  for (const paragraph of paragraphs) {
    if (paragraph.trim().length === 0) {
      // console.log(chalk.red("paragraph is empty"))
      lines.push(''); // Preserve empty paragraphs
      continue;
    }
    
    // Initialize fontkit if not already initialized
    if (!fontCache.initialized) {
      fontCache.initialize();
    }
    
    // Split paragraph into words
    const words = paragraph.split(/\s+/);
    let currentLine = '';
    let currentLineWidth = 0;
    
    // Process each word
    for (const word of words) {
      // console.log(chalk.cyan(`Processing word: "${word}" (length: ${word.length})`));
      
      // Calculate the width of this word with its formatting
      const wordWithSpace = currentLine.length === 0 ? word : ' ' + word;
      const wordStartPos = currentLine.length === 0 ? 0 : currentLine.length + 1;
      const wordEndPos = wordStartPos + wordWithSpace.length;
      
      // Find formatting ranges that apply to this word
      const wordFormattingRanges = formattingRanges.filter(range => 
        (range.start <= wordEndPos && range.end > wordStartPos)
      );
      
      // Calculate the width of the word with its formatting
      let wordWidth;
      try {
        wordWidth = fontCache.calculateTextWidth(
          wordWithSpace, 
          wordFormattingRanges, 
          fontSize, 
          fontInfo.fontFamily || 'Arial'
        );
      } catch (err) {
        console.error(`Error calculating text width, using fallback:`, err);
        // Fallback to a simple estimation
        wordWidth = wordWithSpace.length * fontSize * 0.6;
      }
      
      // console.log(chalk.yellow(`Word "${wordWithSpace}" width: ${wordWidth}, current line width: ${currentLineWidth}, container width: ${containerWidth}`));
      
      // If adding this word would exceed the line width
      if (currentLineWidth + wordWidth > containerWidth && currentLine.length > 0) {
        // console.log(`Line would exceed container width, creating new line`);
        lines.push(currentLine);
        // console.log(`Added line: "${currentLine}"`);
        currentLine = word;
        // Calculate the width of just the word (without space)
        try {
          currentLineWidth = fontCache.calculateTextWidth(
            word, 
            wordFormattingRanges, 
            fontSize, 
            fontInfo.fontFamily || 'Arial'
          );
        } catch (err) {
          console.error(`Error calculating text width, using fallback:`, err);
          // Fallback to a simple estimation
          currentLineWidth = word.length * fontSize * 0.6;
        }
        // console.log(`Started new line with: "${currentLine}" (width: ${currentLineWidth})`);
      } else {
        // Add word to current line
        const newLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
        currentLine = newLine;
        currentLineWidth += wordWidth;
        // console.log(`Adding word to current line: "${currentLine}" (new width: ${currentLineWidth})`);
      }
    }
    
    // Add the last line of this paragraph
    if (currentLine.length > 0) {
      // console.log(`Adding final line of paragraph: "${currentLine}"`);
      lines.push(currentLine);
    }
  }
  // console.log(chalk.green("lines"))
  // console.log(lines)
  return lines;
}




/**
 * Estimate container width for a text element
 * @param {Element} textElement - Text element
 * @returns {number} - Container width
 */
function estimateContainerWidth(textElement) {
  // Try to get width from textLength attribute
  const textLength = textElement.getAttribute('textLength');
  if (textLength) {
    return parseFloat(textLength);
  }
  
  // Try to get width from parent element
  const parent = textElement.parentElement;
  if (parent && parent.tagName.toLowerCase() !== 'svg') {
    const width = parent.getAttribute('width');
    if (width) {
      return parseFloat(width);
    }
  }
  
  // Default to a reasonable width
  return 200;
}

module.exports = {
  escapeRegExp,
  wrapText,
  estimateContainerWidth
}; 