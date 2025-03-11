const chalk = require('chalk');
const { extractFontSize, estimateLineHeight, extractNumericPropertyFromStyle, fontCache, extractFontAttributes, calculateLineHeightForLine } = require('./fontHandler');
const { wrapText, estimateContainerWidth } = require('./textWrapper');
const { getShapeBounds } = require('./shapeProcessor');
/**
 * Process text elements in the document
 * @param {Document} document - DOM document
 * @param {boolean} force_rewrap - Force rewrapping of text
 */
function processTextElements(document) {
  // Find all rect, path, etc. elements that might be referenced
  const shapeMap = new Map();
  const shapeElements = document.querySelectorAll('rect, path, circle, ellipse, polygon, polyline');
  shapeElements.forEach(shape => {
    if (shape.id) {
      shapeMap.set(shape.id, shape);
    }
  });
  
  // Find and process all text elements with shape-inside
  let textElements = document.querySelectorAll('text');
  
  textElements.forEach(textElement => {
    processTextElementForShapeInside(textElement, shapeMap);
  });
}

function processTextElementForShapeInside(textElement, shapeMap) {
  // Skip text elements that have already been processed
  if (textElement.getAttribute('data-processed') === 'true') {
    // console.log(chalk.blue('Skipping already processed text element'));
    return;
  }
  
  // Check if this text element has shape-inside
  let styleAttr = textElement.getAttribute('style') || '';
  const shapeInsideMatch = styleAttr.match(/shape-inside\s*:\s*url\(#([^)]+)\)/);
  
  try {
    if (!shapeInsideMatch) {
      return;
    }
    const shapeId = shapeInsideMatch[1];
    const shapeElement = shapeMap.get(shapeId);
    if (!shapeElement) {
      // console.log(chalk.yellow(`Shape element not found for shape-inside reference to #${shapeId}`));
      return;
    }
    processShapeInsideText(textElement, shapeElement, styleAttr);  
  }
  catch(error) {
    console.log(chalk.red(error))
    return;
  }
  finally {
    textElement.setAttribute('data-processed', 'true');
  }
}

/**
 * Process text with shape-inside attribute
 * @param {Element} textElement - Text element to process
 * @param {Element} shapeElement - Shape element
 * @param {string} styleAttr - Style attribute of text element
 */
function processShapeInsideText(textElement, shapeElement, styleAttr) {
  if (shouldPreserveLayout(textElement, styleAttr)) {
    return;
  }
  // console.log(`Processing text with shape-inside reference to #${shapeElement.id}`);
  const shapeBounds = getShapeBounds(shapeElement);
  
  if (!shapeBounds) {
    // console.log(chalk.yellow(`Shape bounds not found for shape-inside reference to #${shapeElement.id}`));
    return;
  }
  const textData = initializeTextContent(textElement);

  const textBounds = calculateTextBounds(shapeBounds, styleAttr);
  const { hasStructuredLines, topLevelTspans } = analyzeTextStructure(textElement);
  
  const formattingData = extractFormattingFromElement(
    textElement, 
    textData.plainContent, 
    textData.formattingRanges, 
    hasStructuredLines, 
    topLevelTspans, 
    textData.rootTextContent
  );
  
  // console.log("formattingData")  
  // console.log(formattingData)  
  textData.plainContent = formattingData.plainContent;
  textData.formattingRanges = formattingData.formattingRanges;
  
  const textTransform = textElement.hasAttribute('transform') ? textElement.getAttribute('transform') : '';
  createWrappedTextElement(textElement, textBounds, textData.plainContent, textData.formattingRanges, textTransform);
}

function initializeTextContent(textElement) {
  let plainContent = '';
  let formattingRanges = [];
  let rootTextContent = '';
  
  // First check for direct text content in the text element
  for (let node of textElement.childNodes) {
    if (node.nodeType === 3) { // Text node
      rootTextContent += node.nodeValue;
    }
  }
  
  // Track processed tspans to avoid duplicates
  const processedTspans = new Set();
  
  // Then check for tspan elements and their content
  const tspans = textElement.querySelectorAll('tspan');
  if (tspans.length > 0) {
    // First identify top-level tspans (direct children of the text element)
    const topLevelTspans = Array.from(tspans).filter(tspan => 
      tspan.parentNode === textElement
    );
    
    // Process only top-level tspans to avoid duplication
    for (const tspan of topLevelTspans) {
      if (!processedTspans.has(tspan)) {
        processedTspans.add(tspan);
        if (tspan.textContent.trim() === '') {
          continue
        }
        plainContent += tspan.textContent + '';
        // console.log(chalk.cyan("Tspan"))
        // console.log(chalk.cyan(tspan.textContent))
        
        // Capture formatting information if available
        const fontWeight = tspan.getAttribute('font-weight') || 
                          (tspan.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1] || 'normal';
        const fontStyle = tspan.getAttribute('font-style') || 
                         (tspan.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1] || 'normal';
        const fontFamily = tspan.getAttribute('font-family') || 
                          (tspan.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1] || '';
        
        const startIndex = plainContent.length - tspan.textContent.length - 1;
        const endIndex = plainContent.length - 1;
        
        if (startIndex >= 0 && endIndex > startIndex) {
          formattingRanges.push({
            start: startIndex,
            end: endIndex,
            fontWeight,
            fontStyle,
            fontFamily
          });
        }
      }
    }
    plainContent = plainContent.trim();
  }
  
  // If no content found in tspans, use the root text content
  if (plainContent.length === 0 && rootTextContent.length > 0) {
    plainContent = rootTextContent.trim();
  }
  
  // If still no content, try to get the full textContent as a fallback
  if (plainContent.length === 0) {
    plainContent = textElement.textContent.trim();
  }
  
  rootTextContent = rootTextContent.trim();
  if (rootTextContent.length > 0) {
    // console.log(`Text element has direct content: "${rootTextContent}"`);
  }
  // console.log(chalk.yellow("Plain content"))
  // console.log(chalk.yellow(plainContent))
  
  return { plainContent, formattingRanges, rootTextContent };
}

function analyzeTextStructure(textElement) {
  const topLevelTspans = Array.from(textElement.children).filter(child => 
    child.tagName.toLowerCase() === 'tspan' && !child.parentNode.tagName.toLowerCase().includes('tspan')
  );
  
  let hasStructuredLines = topLevelTspans.length > 0 && 
                         topLevelTspans.filter(tspan => tspan.hasAttribute('y')).length === topLevelTspans.length;
  
  if (textElement.getAttribute('style')?.includes('shape-inside')) {
    // console.log('Forcing text rewrap due to shape-inside attribute');
    hasStructuredLines = false;
  }
  
  if (hasStructuredLines) {
    // console.log(`Text appears to have ${topLevelTspans.length} structured lines with y-coordinates`);
  }
  
  return { hasStructuredLines, topLevelTspans };
}

function shouldPreserveLayout(textElement, styleAttr) {
  const existingTspans = textElement.querySelectorAll('tspan');
  const positionedTspans = Array.from(existingTspans).filter(
    tspan => tspan.hasAttribute('x') && tspan.hasAttribute('y')
  );
  
  const yValues = new Set();
  positionedTspans.forEach(tspan => {
    if (tspan.hasAttribute('y')) {
      yValues.add(tspan.getAttribute('y'));
    }
  });
  
  const hasPositionedTspans = 
    (yValues.size > 1) && 
    (positionedTspans.length / existingTspans.length > 0.7);
  
  if (hasPositionedTspans && (!textElement.getAttribute('style')?.includes('shape-inside'))) {
    // console.log('Text already has properly positioned tspans, preserving layout...');
    // console.log(`Found ${positionedTspans.length} of ${existingTspans.length} tspans with x and y attributes.`);
    // console.log(`Y values found: ${Array.from(yValues).join(', ')}`);
    
    styleAttr = styleAttr.replace(/shape-inside\s*:\s*url\([^)]+\)\s*;?/g, '');
    styleAttr = styleAttr.replace(/white-space\s*:\s*[^;]+\s*;?/g, '');
    textElement.setAttribute('style', styleAttr);
    return true;
  }
  
  return false;
}

function calculateTextBounds(shapeBounds, styleAttr) {
  const shapePadding = extractNumericPropertyFromStyle(styleAttr, 'shape-padding') || 0;
  
  return {
    x: shapeBounds.x + shapePadding,
    y: shapeBounds.y + shapePadding,
    width: shapeBounds.width - (shapePadding * 2),
    height: shapeBounds.height - (shapePadding * 2)
  };
}

/**
 * Extract formatting from a text element
 * @param {Element} textElement - Text element
 * @param {string} plainContent - Plain text content
 * @param {Array} formattingRanges - Array of formatting ranges
 * @param {boolean} hasStructuredLines - Whether text has structured lines
 * @param {Array} topLevelTspans - Array of top-level tspan elements
 * @param {string} rootTextContent - Root text content
 */
function extractFormattingFromElement(textElement, plainContent, formattingRanges, hasStructuredLines, topLevelTspans, rootTextContent) {  
  // Clear existing formatting ranges
  formattingRanges.length = 0;
  
  // Process the text to extract formatting information
  const seenElements = new Set();
  
  // First, check for any direct tspans with font-size attributes or italic style
  const allTspans = textElement.querySelectorAll('tspan');
  for (const tspan of allTspans) {
    // Check for font-size in style attribute or as a direct attribute
    const fontSizeStyle = (tspan.getAttribute('style') || '').match(/font-size\s*:\s*([^;]+)/)?.[1];
    const fontSizeAttr = tspan.getAttribute('font-size');
    
    // Check for italic style
    const fontStyleStyle = (tspan.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1];
    const fontStyleAttr = tspan.getAttribute('font-style');
    const fontStyle = fontStyleAttr || fontStyleStyle || 'normal';
    
    if (fontSizeStyle || fontSizeAttr || fontStyle === 'italic') {
      const fontSize = fontSizeStyle || fontSizeAttr || '';
      // console.log(`Found tspan with font-size: ${fontSize} or font-style: ${fontStyle} for text: "${tspan.textContent}"`);
      
      // Extract numeric value from string like "90px"
      let fontSizeValue = fontSize;
      if (typeof fontSize === 'string') {
        const fontSizeMatch = fontSize.match(/(\d+(\.\d+)?)/);
        if (fontSizeMatch) {
          fontSizeValue = parseFloat(fontSizeMatch[1]);
        }
      }
      
      // Find this tspan's text within the plainContent
      const tspanText = tspan.textContent;
      if (tspanText && tspanText.trim().length > 0) {
        const position = plainContent.indexOf(tspanText);
        if (position >= 0) {
          formattingRanges.push({
            start: position,
            end: position + tspanText.length,
            fontFamily: tspan.getAttribute('font-family') || 
                       (tspan.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1] || '',
            fontWeight: tspan.getAttribute('font-weight') || 
                       (tspan.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1] || 'normal',
            fontStyle: fontStyle,
            fontSize: fontSizeValue
          });
        }
      }
    }
  }
  
  if (hasStructuredLines) {
    // For structured multi-line text, process each top-level tspan for formatting
    let currentPosition = 0;
    for (const tspan of topLevelTspans) {
      // Find this tspan's text within the plainContent
      const tspanText = tspan.textContent;
      const position = plainContent.indexOf(tspanText, currentPosition);
      
      if (position >= 0) {
        // Add formatting for this tspan
        addFormattingForElement(tspan, position, position + tspanText.length, formattingRanges);
        currentPosition = position + tspanText.length;
        
        // Process nested tspans for additional formatting
        processNestedTspansForFormatting(tspan, plainContent, formattingRanges, seenElements);
      }
    }
  } else {
    // For unstructured text, just extract formatting from all tspans
    for (const tspan of allTspans) {
      if (!seenElements.has(tspan)) {
        seenElements.add(tspan);
        const tspanText = tspan.textContent;
        const position = plainContent.indexOf(tspanText);
        
        if (position >= 0) {
          addFormattingForElement(tspan, position, position + tspanText.length, formattingRanges);
        }
      }
    }
  }
  
  // If no formatting was found, add default formatting for the entire text
  if (formattingRanges.length === 0 && plainContent.length > 0) {
    formattingRanges.push({
      start: 0,
      end: plainContent.length,
      fontWeight: textElement.style.fontWeight || textElement.getAttribute('font-weight') || 'normal',
      fontStyle: textElement.style.fontStyle || textElement.getAttribute('font-style') || 'normal',
      fontFamily: textElement.style.fontFamily || textElement.getAttribute('font-family') || ''
    });
  }
  
  return { plainContent, formattingRanges };
}

/**
 * Add formatting information for an element
 * @param {Element} element - Element to extract formatting from
 * @param {number} start - Start index in the plain content
 * @param {number} end - End index in the plain content
 * @param {Array} formattingRanges - Array of formatting ranges
 */
function addFormattingForElement(element, start, end, formattingRanges) {
  const fontWeight = element.getAttribute('font-weight') || 
                    (element.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1] || 'normal';
  const fontStyle = element.getAttribute('font-style') || 
                   (element.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1] || 'normal';
  const fontFamily = element.getAttribute('font-family') || 
                    (element.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1] || '';
  
  // Extract font-size attribute
  let fontSize = element.getAttribute('font-size') || 
                (element.getAttribute('style') || '').match(/font-size\s*:\s*([^;]+)/)?.[1] || '';
  
  // If fontSize is a string with units, convert to a number
  if (fontSize && typeof fontSize === 'string') {
    // Extract numeric value from string like "90px"
    const fontSizeMatch = fontSize.match(/(\d+(\.\d+)?)/);
    if (fontSizeMatch) {
      fontSize = parseFloat(fontSizeMatch[1]);
    }
  }
  
  // Log if we found italic style
  if (fontStyle === 'italic') {
    // console.log(`Found italic style for text from position ${start} to ${end}`);
  }
  
  // Only add formatting if there's something special about this element
  if (fontWeight !== 'normal' || fontStyle !== 'normal' || fontFamily || fontSize) {
    // Check if we already have a formatting range for this exact range with the same style
    let existingRange = formattingRanges.find(range => 
      range.start === start && 
      range.end === end && 
      range.fontStyle === fontStyle && 
      range.fontWeight === fontWeight && 
      range.fontFamily === fontFamily && 
      range.fontSize === fontSize
    );
    
    if (!existingRange) {
      formattingRanges.push({
        start,
        end,
        fontWeight,
        fontStyle,
        fontFamily,
        fontSize
      });
    }
  }
}

/**
 * Process nested tspans for formatting
 * @param {Element} parentElement - Parent element
 * @param {string} plainContent - Plain text content
 * @param {Array} formattingRanges - Array of formatting ranges
 * @param {Set} seenElements - Set of seen elements
 */
function processNestedTspansForFormatting(parentElement, plainContent, formattingRanges, seenElements) {
  const nestedTspans = parentElement.querySelectorAll('tspan');
  for (const tspan of nestedTspans) {
    if (!seenElements.has(tspan)) {
      seenElements.add(tspan);
      
      // Find this tspan's text within the plainContent
      const tspanText = tspan.textContent;
      if (tspanText.trim().length === 0) continue;
      
      // Try to find the text in the plainContent
      const position = plainContent.indexOf(tspanText);
      if (position >= 0) {
        // Add formatting for this tspan
        addFormattingForElement(tspan, position, position + tspanText.length, formattingRanges);
        
        // Check for special font-size attributes in the tspan
        const fontSize = tspan.getAttribute('font-size') || 
                        (tspan.getAttribute('style') || '').match(/font-size\s*:\s*([^;]+)/)?.[1];
        
        // Check for italic style
        const fontStyle = tspan.getAttribute('font-style') || 
                         (tspan.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1];
        
        if (fontSize) {
          // console.log(`Found nested tspan with font-size: ${fontSize} for text: "${tspanText}"`);
        }
        
        if (fontStyle === 'italic') {
          // console.log(`Found nested tspan with italic style for text: "${tspanText}"`);
          
          // Ensure the italic formatting is properly added to the formatting ranges
          let italicFormatFound = false;
          for (const range of formattingRanges) {
            if (range.start === position && range.end === position + tspanText.length && range.fontStyle === 'italic') {
              italicFormatFound = true;
              break;
            }
          }
          
          if (!italicFormatFound) {
            formattingRanges.push({
              start: position,
              end: position + tspanText.length,
              fontStyle: 'italic',
              fontWeight: tspan.getAttribute('font-weight') || 'normal',
              fontFamily: tspan.getAttribute('font-family') || '',
              fontSize: fontSize ? parseFloat(fontSize.match(/(\d+(\.\d+)?)/)?.[1] || 0) : ''
            });
          }
        }
      }
    }
  }
}

/**
 * Create a wrapped text element
 * @param {Element} textElement - Text element
 * @param {Object} textBounds - Text bounds
 * @param {string} plainContent - Plain text content
 * @param {Array} formattingRanges - Formatting ranges
 * @param {string} textTransform - Text transform
 * @returns {Element} - New text element
 */
function createWrappedTextElement(textElement, textBounds, plainContent, formattingRanges, textTransform) {
  const svgNS = 'http://www.w3.org/2000/svg';
  let newTextElement = textElement.ownerDocument.createElementNS(svgNS, 'text');
  
  // Set attributes on the new text element
  if (textTransform) {
    newTextElement.setAttribute('transform', textTransform);
  }
  
  // Copy attributes from original text element
  copyPreservedAttributes(textElement, newTextElement);
  
  // Add font attributes to the text element
  addFontAttributes(newTextElement, textElement, formattingRanges);
  
  // Get font size for line wrapping calculation
  const fontSize = extractFontSize(textElement);
  
  // Get font attributes for the text element
  const fontAttrs = extractFontAttributes(textElement);
  
  // Initialize fontkit if not already initialized
  if (!fontCache.initialized) {
    try {
      fontCache.initialize();
    } catch (err) {
      console.error('Error initializing font cache:', err);
    }
  }
  
  const hasExplicitNewlines = plainContent.includes('\n');
  // First, split by explicit newlines
  let contentLines = plainContent.split(/\r?\n/);
  // console.log("Lines")
  // console.log(contentLines)
  // Then wrap each line to fit the bounds
  let wrappedLines = [];
  for (const line of contentLines) {
    // Skip empty lines but preserve them in output
    if (!line.trim()) {
      wrappedLines.push('');
      continue;
    }
    
    // Always wrap each line to fit the width, regardless of whether there are explicit newlines
    // console.log(chalk.green(hasExplicitNewlines ? "Has explicit newlines, wrapping each line" : "No explicit newlines, wrapping text"))
    
    // Create font info object
    const fontInfo = {
      fontFamily: fontAttrs.fontFamily,
      fontSize: fontAttrs.fontSize,
      fontWeight: fontAttrs.fontWeight,
      fontStyle: fontAttrs.fontStyle
    };
    
    try {
      // Pass formatting ranges to wrapText
      const wrapped = wrapText(line, fontSize, textBounds.width, fontInfo, formattingRanges);
      wrappedLines.push(...wrapped);
    } catch (err) {
      console.error('Error wrapping text:', err);
      // Fallback to simple wrapping
      const words = line.split(/\s+/);
      const charsPerLine = Math.floor(textBounds.width / (fontSize * 0.6));
      let currentLine = '';
      
      for (const word of words) {
        if (currentLine.length + word.length + 1 > charsPerLine && currentLine.length > 0) {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
        }
      }
      
      if (currentLine.length > 0) {
        wrappedLines.push(currentLine);
      }
    }
  }
  
  // Add wrapped text as tspan elements
  addWrappedTextAsTspans(newTextElement, wrappedLines, textBounds, fontSize, formattingRanges);
  
  // Replace the original text element with the new one
  textElement.parentNode.replaceChild(newTextElement, textElement);
}

/**
 * Copy preserved attributes from original text element to new text element
 * @param {Element} sourceElement - Source element to copy attributes from
 * @param {Element} targetElement - Target element to copy attributes to
 */
function copyPreservedAttributes(sourceElement, targetElement) {
  const preserveAttrs = ['style', 'class', 'id', 'fill', 'font-family', 'font-size', 'font-weight'];
  preserveAttrs.forEach(attr => {
    if (sourceElement.hasAttribute(attr)) {
      let value = sourceElement.getAttribute(attr);
      // Remove shape-inside and related properties from style
      if (attr === 'style') {
        value = value.replace(/shape-inside\s*:\s*url\([^)]+\)\s*;?/g, '')
                     .replace(/shape-padding\s*:\s*[^;]+\s*;?/g, '')
                     .replace(/white-space\s*:\s*[^;]+\s*;?/g, '')
                     .replace(/inline-size\s*:\s*[^;]+\s*;?/g, '');
      }
      targetElement.setAttribute(attr, value);
    }
  });
}

/**
 * Add font attributes to the text element
 * @param {Element} newTextElement - New text element
 * @param {Element} originalTextElement - Original text element
 * @param {Array} formattingRanges - Array of formatting ranges
 */
function addFontAttributes(newTextElement, originalTextElement, formattingRanges) {
  // First, extract font attributes from the original text element
  const fontFamily = originalTextElement.getAttribute('font-family') || 
                    (originalTextElement.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1];
  
  const fontWeight = originalTextElement.getAttribute('font-weight') || 
                    (originalTextElement.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1];
  
  const fontStyle = originalTextElement.getAttribute('font-style') || 
                   (originalTextElement.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1];
  
  // Set font attributes on the new text element
  if (fontFamily) {
    newTextElement.setAttribute('font-family', fontFamily);
    
    // Also add to style attribute for better compatibility
    let style = newTextElement.getAttribute('style') || '';
    if (!style.includes('font-family')) {
      style += `; font-family: ${fontFamily};`;
      newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
    }
  }
  
  if (fontWeight) {
    newTextElement.setAttribute('font-weight', fontWeight);
    
    // Also add to style attribute
    let style = newTextElement.getAttribute('style') || '';
    if (!style.includes('font-weight')) {
      style += `; font-weight: ${fontWeight};`;
      newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
    }
  }
  
  if (fontStyle) {
    newTextElement.setAttribute('font-style', fontStyle);
    
    // Also add to style attribute
    let style = newTextElement.getAttribute('style') || '';
    if (!style.includes('font-style')) {
      style += `; font-style: ${fontStyle};`;
      newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
    }
  }
  
  // Also check all tspans in the original element for font attributes
  const tspans = originalTextElement.querySelectorAll('tspan');
  if (tspans.length > 0) {
    // Collect all unique font families, weights, and styles
    const fontFamilies = new Set();
    const fontWeights = new Set();
    const fontStyles = new Set();
    
    tspans.forEach(tspan => {
      const tspanFontFamily = tspan.getAttribute('font-family') || 
                             (tspan.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1];
      
      const tspanFontWeight = tspan.getAttribute('font-weight') || 
                             (tspan.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1];
      
      const tspanFontStyle = tspan.getAttribute('font-style') || 
                            (tspan.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1];
      
      if (tspanFontFamily) fontFamilies.add(tspanFontFamily);
      if (tspanFontWeight) fontWeights.add(tspanFontWeight);
      if (tspanFontStyle) fontStyles.add(tspanFontStyle);
    });
    
    // If we found any font families in tspans, add them to the text element
    if (fontFamilies.size > 0) {
      // Use the first font family as the default
      const defaultFontFamily = Array.from(fontFamilies)[0];
      if (!fontFamily) {
        newTextElement.setAttribute('font-family', defaultFontFamily);
        
        // Also add to style attribute
        let style = newTextElement.getAttribute('style') || '';
        if (!style.includes('font-family')) {
          style += `; font-family: ${defaultFontFamily};`;
          newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
        }
      }
    }
  }
  
  // Finally, check formatting ranges for any additional font information
  if (formattingRanges && formattingRanges.length > 0) {
    // Use the first formatting range as a fallback if no font attributes were found
    const firstRange = formattingRanges[0];
    
    if (!fontFamily && firstRange.fontFamily) {
      newTextElement.setAttribute('font-family', firstRange.fontFamily);
      
      // Also add to style attribute
      let style = newTextElement.getAttribute('style') || '';
      if (!style.includes('font-family')) {
        style += `; font-family: ${firstRange.fontFamily};`;
        newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
      }
    }
    
    if (!fontWeight && firstRange.fontWeight) {
      newTextElement.setAttribute('font-weight', firstRange.fontWeight);
      
      // Also add to style attribute
      let style = newTextElement.getAttribute('style') || '';
      if (!style.includes('font-weight')) {
        style += `; font-weight: ${firstRange.fontWeight};`;
        newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
      }
    }
    
    if (!fontStyle && firstRange.fontStyle) {
      newTextElement.setAttribute('font-style', firstRange.fontStyle);
      
      // Also add to style attribute
      let style = newTextElement.getAttribute('style') || '';
      if (!style.includes('font-style')) {
        style += `; font-style: ${firstRange.fontStyle};`;
        newTextElement.setAttribute('style', style.replace(/^;\s*/, ''));
      }
    }
  }
}

/**
 * Add wrapped text as tspans to a text element
 * @param {Element} textElement - Text element
 * @param {Array} wrappedLines - Array of wrapped lines
 * @param {Object} textBounds - Text bounds
 * @param {number} fontSize - Font size
 * @param {Array} formattingRanges - Array of formatting ranges
 */
function addWrappedTextAsTspans(textElement, wrappedLines, textBounds, fontSize, formattingRanges = []) {
  const document = textElement.ownerDocument;
  
  // Extract font info for line height calculations
  const fontAttrs = extractFontAttributes(textElement);
  const fontInfo = {
    fontFamily: fontAttrs.fontFamily,
    fontSize: fontAttrs.fontSize,
    fontWeight: fontAttrs.fontWeight,
    fontStyle: fontAttrs.fontStyle,
    lineHeight: fontAttrs.lineHeight
  };
  
  // console.log(`Font info for text element:`, fontInfo);
  
  // Track the current position in the original text to calculate offsets
  let currentPosition = 0;
  
  // Calculate line heights for each line based on the tallest character in that line
  // and the absolute position of each line within the full text
  const lineHeights = [];
  for (const line of wrappedLines) {
    const lineHeight = calculateLineHeightForLine(
      line, 
      fontSize, 
      formattingRanges, 
      fontInfo,
      currentPosition // Pass the current position as the offset
    );
    lineHeights.push(lineHeight);
    
    // Update the current position for the next line
    currentPosition += line.length + 1; // +1 for the newline
  }
  
  // console.log(`Line heights for each line:`, lineHeights);
  
  // Calculate y positions for each line based on the tallest character in each line
  const yPositions = [];
  
  if (lineHeights.length > 0) {
    // For SVG text, the y-coordinate specifies the position of the text baseline
    
    // First line positioning - the baseline should be at textBounds.y + the height of the tallest character
    // This ensures text with larger font sizes (like 90px "End") is properly positioned within the bounds
    let currentY = textBounds.y + lineHeights[0];
    yPositions.push(currentY);
    
    // For subsequent lines, position based on the previous line's height and the line-height parameter
    let accumulatedY = currentY;
    
    for (let i = 1; i < lineHeights.length; i++) {
      // Use the line-height parameter from the SVG to determine spacing
      // This ensures proper spacing that respects the original line-height
      const lineHeightMultiplier = fontInfo.lineHeight || 1.25; // Use extracted line-height or default
      
      // Calculate spacing based on the previous line's height and the line-height parameter
      // For lines after a line with very large text (like 90px "End"), adjust the spacing
      // to create a more balanced transition
      let spacingAdjustment = 1.0; // Default - no adjustment
      
      if (lineHeights[i-1] > fontSize * 2) {
        // For the line immediately after a line with very large text,
        // use a slightly reduced spacing to create a more balanced transition
        spacingAdjustment = 0.85;
      }
      
      // Calculate the spacing between lines based on the previous line's height
      // and the line-height parameter
      const lineSpacing = lineHeights[i-1] * lineHeightMultiplier * spacingAdjustment;
      
      // Position the next line
      accumulatedY += lineSpacing;
      yPositions.push(accumulatedY);
    }
  }
  
  // console.log(`Calculated y positions:`, yPositions);
  
  // Reset current position for processing the lines
  currentPosition = 0;  
  wrappedLines.forEach((line, index) => {
    // console.log(`Processing line ${index}: "${line}" (current position: ${currentPosition})`);
    
    if (!line.trim()) {
      // Skip empty lines but increment position
      currentPosition += 1; // For the newline
      // console.log(`Skipping empty line ${index}`);
      return;
    }
    
    // Create a tspan for the line
    const lineTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    lineTspan.setAttribute('x', textBounds.x.toString());
    lineTspan.setAttribute('y', yPositions[index].toString());
    textElement.appendChild(lineTspan);
    
    // If no formatting ranges or simple formatting, just add the text content
    if (!formattingRanges || formattingRanges.length === 0) {
      lineTspan.textContent = line;
      currentPosition += line.length + 1; // +1 for the newline
      return;
    }
    
    // Process character by character for complex formatting
    let currentCharPosition = 0;
    let currentFormatTspan = null;
    let currentFormat = null;
    
    // Process each character in the line
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const absolutePosition = currentPosition + i;
      
      // Find the formatting range for this character
      let newFormat = null;
      for (const range of formattingRanges) {
        if (absolutePosition >= range.start && absolutePosition < range.end) {
          newFormat = range;
          break;
        }
      }
      
      // If format changed or no current tspan, create a new one
      if (!currentFormatTspan || 
          (newFormat !== currentFormat && 
           (newFormat === null || currentFormat === null || 
            newFormat.fontFamily !== currentFormat.fontFamily || 
            newFormat.fontSize !== currentFormat.fontSize || 
            newFormat.fontWeight !== currentFormat.fontWeight || 
            newFormat.fontStyle !== currentFormat.fontStyle))) {
        
        // Create a new tspan for this format
        currentFormatTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        
        // Apply formatting attributes
        if (newFormat) {
          if (newFormat.fontFamily) currentFormatTspan.setAttribute('font-family', newFormat.fontFamily);
          if (newFormat.fontSize) currentFormatTspan.setAttribute('font-size', newFormat.fontSize + 'px');
          if (newFormat.fontWeight) currentFormatTspan.setAttribute('font-weight', newFormat.fontWeight);
          if (newFormat.fontStyle && newFormat.fontStyle !== 'normal') {
            currentFormatTspan.setAttribute('font-style', newFormat.fontStyle);
            // console.log(`Applied font-style: ${newFormat.fontStyle} to text at position ${absolutePosition}`);
          }
        }
        
        lineTspan.appendChild(currentFormatTspan);
        currentFormat = newFormat;
        currentCharPosition = 0;
      }
      
      // Add the character to the current format tspan
      currentFormatTspan.textContent = (currentFormatTspan.textContent || '') + char;
      currentCharPosition++;
    }
    
    currentPosition += line.length + 1; // +1 for the newline
  });
}

/**
 * Rewrap text in a text element
 * @param {Element} textElement - Text element to rewrap
 */
function rewrapTextElement(textElement) {
  // Get text content and formatting
  let plainContent = '';
  let formattingRanges = [];
  
  // Extract text content
  plainContent = textElement.textContent || '';
  
  // Analyze the text structure to determine if it has structured lines
  const { hasStructuredLines, topLevelTspans } = analyzeTextStructure(textElement);
  
  // Extract formatting information from the text element and its tspans
  const rootTextContent = textElement.textContent;
  extractFormattingFromElement(textElement, plainContent, formattingRanges, hasStructuredLines, topLevelTspans, rootTextContent);
  
  // Get font size and container width
  const fontSize = extractFontSize(textElement);
  const containerWidth = estimateContainerWidth(textElement);
  
  // Get position
  const x = parseFloat(textElement.getAttribute('x') || 0);
  const y = parseFloat(textElement.getAttribute('y') || 0);
  
  // Create bounds
  const textBounds = {
    x: x,
    y: y,
    width: containerWidth,
    height: 1000 // Large enough for all text
  };
  
  // Wrap text
  const wrappedLines = wrapText(plainContent, fontSize, containerWidth, {}, formattingRanges);
  
  // Clear existing content
  while (textElement.firstChild) {
    textElement.removeChild(textElement.firstChild);
  }
  
  // Add wrapped text as tspans with proper formatting
  addWrappedTextAsTspans(textElement, wrappedLines, textBounds, fontSize, formattingRanges);
  
  // Mark as processed
  textElement.setAttribute('data-processed', 'true');
}

// /**
//  * Extract text content from a text element
//  * @param {Element} textElement - Text element
//  * @returns {Object} - Object with plainContent, formattingRanges, and rootTextContent
//  */
// function extractTextContent(textElement) {
//   let plainContent = '';
//   let formattingRanges = [];
//   let rootTextContent = '';
  
//   // First check for direct text content in the text element
//   for (let node of textElement.childNodes) {
//     if (node.nodeType === 3) { // Text node
//       rootTextContent += node.nodeValue;
//     }
//   }
  
//   // Track the current position in the text
//   let currentPosition = 0;
//   // Keep track of processed nodes to avoid duplicates
//   const processedNodes = new Set();
  
//   // Process all tspans recursively
//   function processTspan(tspan, parentFormatting = {}) {
//     // Skip if already processed
//     if (processedNodes.has(tspan)) {
//       return;
//     }
//     processedNodes.add(tspan);
    
//     // Get the text content
//     let text = '';
    
//     // Check for direct text content
//     for (let node of tspan.childNodes) {
//       if (node.nodeType === 3) { // Text node
//         text += node.nodeValue;
//       }
//     }
    
//     // Get formatting attributes
//     const fontWeight = tspan.getAttribute('font-weight') || 
//                       (tspan.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1] || 
//                       parentFormatting.fontWeight || 'normal';
    
//     const fontStyle = tspan.getAttribute('font-style') || 
//                      (tspan.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1] || 
//                      parentFormatting.fontStyle || 'normal';
    
//     const fontFamily = tspan.getAttribute('font-family') || 
//                       (tspan.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1] || 
//                       parentFormatting.fontFamily || '';
    
//     // If this tspan has direct text content, add it to the plain content
//     if (text.trim().length > 0) {
//       plainContent += text;
      
//       // Add formatting range
//       formattingRanges.push({
//         start: currentPosition,
//         end: currentPosition + text.length,
//         fontWeight,
//         fontStyle,
//         fontFamily
//       });
      
//       // Update current position
//       currentPosition += text.length;
//     }
    
//     // Process nested tspans if any, but only direct children
//     const nestedTspans = Array.from(tspan.childNodes)
//       .filter(node => node.nodeType === 1 && node.tagName.toLowerCase() === 'tspan');
    
//     for (const nestedTspan of nestedTspans) {
//       processTspan(nestedTspan, { fontWeight, fontStyle, fontFamily });
//     }
//   }
  
//   // Process all top-level tspans
//   const topLevelTspans = Array.from(textElement.childNodes)
//     .filter(node => node.nodeType === 1 && node.tagName.toLowerCase() === 'tspan');
  
//   for (const tspan of topLevelTspans) {
//     processTspan(tspan);
    
//     // Add a space between top-level tspans if needed
//     if (plainContent.length > 0 && !plainContent.endsWith(' ') && tspan !== topLevelTspans[topLevelTspans.length - 1]) {
//       plainContent += ' ';
//       currentPosition += 1;
//     }
//   }
  
//   // If no content found in tspans, use the root text content
//   if (plainContent.trim().length === 0 && rootTextContent.trim().length > 0) {
//     plainContent = rootTextContent.trim();
    
//     // Add basic formatting for the root content
//     formattingRanges.push({
//       start: 0,
//       end: plainContent.length,
//       fontWeight: textElement.getAttribute('font-weight') || 
//                  (textElement.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1] || 'normal',
//       fontStyle: textElement.getAttribute('font-style') || 
//                 (textElement.getAttribute('style') || '').match(/font-style\s*:\s*([^;]+)/)?.[1] || 'normal',
//       fontFamily: textElement.getAttribute('font-family') || 
//                  (textElement.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1] || ''
//     });
//   }
  
//   // If still no content, try to get the full textContent as a fallback
//   if (plainContent.trim().length === 0) {
//     plainContent = textElement.textContent.trim();
//   }  
//   return { plainContent, formattingRanges, rootTextContent: rootTextContent.trim() };
// }





module.exports = {
  processTextElements,
  processShapeInsideText,
  rewrapTextElement
}; 