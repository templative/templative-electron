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
function wrapText(text, fontSize, containerWidth, fontInfo = {}, formattingRanges = [], characterPositionForFormatting = 0) {
  if (!text) {
    // console.log("text is empty")
    return [];
  }

  // Split text into paragraphs first (by newlines)
  const paragraphs = text.split(/\r?\n/);
  const lines = [];
  
  // Track absolute position in the text
  let absolutePosition = characterPositionForFormatting;
  // console.log(`absolutePosition: ${absolutePosition}`);
  
  // Process each paragraph
  for (const paragraph of paragraphs) {
    if (paragraph.trim().length === 0) {
      // console.log("paragraph is empty")
      lines.push(''); // Preserve empty paragraphs
      absolutePosition += 1; // Account for the newline
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
      // console.log(`Processing word: "${word}" (length: ${word.length}`));
      
      // Calculate the width of this word with its formatting
      const wordWithSpace = currentLine.length === 0 ? word : ' ' + word;
      const wordStartPos = currentLine.length === 0 ? 0 : currentLine.length + 1;
      const wordEndPos = wordStartPos + wordWithSpace.length;
      
      // Calculate absolute positions
      const absoluteWordStartPos = absolutePosition + wordStartPos;
      const absoluteWordEndPos = absolutePosition + wordEndPos;
      
      // Find formatting ranges that apply to this word
      const wordFormattingRanges = formattingRanges.filter(range => 
        (range.start <= absoluteWordEndPos && range.end > absoluteWordStartPos)
      );
      
      // Calculate the width of the word with its formatting
      let wordWidth;
      try {
        wordWidth = fontCache.calculateTextWidth(
          wordWithSpace, 
          wordFormattingRanges, 
          fontSize, 
          fontInfo.fontFamily || 'Arial',
          absoluteWordStartPos // Pass the absolute word start position as the offset
        );
      } catch (err) {
        console.error(`Error calculating text width, using fallback:`, err);
        // Fallback to a simple estimation
        wordWidth = wordWithSpace.length * fontSize * 0.6;
      }
      
      // console.log(`Word "${wordWithSpace}" width: ${wordWidth}, current line width: ${currentLineWidth}, container width: ${containerWidth}`);
      
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
            fontInfo.fontFamily || 'Arial',
            absolutePosition // For the first word in a new line, the offset is the current absolute position
          );
        } catch (err) {
          console.error(`Error calculating text width, using fallback:`, err);
          // Fallback to a simple estimation
          currentLineWidth = word.length * fontSize * 0.6;
        }
      } else {
        // Add the word to the current line
        currentLine += wordWithSpace;
        currentLineWidth += wordWidth;
      }
    }
    
    // Add the last line of the paragraph
    if (currentLine.length > 0) {
      lines.push(currentLine);
      // console.log(`Added last line of paragraph: "${currentLine}"`);
    }
    
    // Update absolute position for the next paragraph
    absolutePosition += paragraph.length + 1; // +1 for the newline
  }
  
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