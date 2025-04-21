const { extractFontSizeAsync, estimateLineHeightAsync, extractNumericPropertyFromStyleAsync, fontCache, extractFontAttributesAsync, calculateLineHeightForLineAsync } = require('./fontHandler');
const { wrapTextAsync, estimateContainerWidthAsync, calculateXPositionAsync } = require('./textWrapper');
const { getShapeBoundsAsync } = require('./shapeProcessor');
/**
 * Process text elements in the document
 * @param {Document} document - DOM document
 * @param {boolean} force_rewrap - Force rewrapping of text
 */
async function processTextElementsAsync(document) {
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
  
  for (const textElement of textElements) {
    await processTextElementForShapeInsideAsync(textElement, shapeMap);
  }
}

async function processTextElementForShapeInsideAsync(textElement, shapeMap) {
  // Skip text elements that have already been processed
  if (textElement.getAttribute('data-processed') === 'true') {
    // console.log('Skipping already processed text element');
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
      // console.log(`Shape element not found for shape-inside reference to #${shapeId}`);
      return;
    }
    await processShapeInsideTextAsync(textElement, shapeElement, styleAttr);  
  }
  catch(error) {
    console.log(error)
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
async function processShapeInsideTextAsync(textElement, shapeElement, styleAttr) {
  if (await shouldPreserveLayoutAsync(textElement, styleAttr)) {
    return;
  }
  // console.log(`Processing text with shape-inside reference to #${shapeElement.id}`);
  const shapeBounds = await getShapeBoundsAsync(shapeElement);
  
  if (!shapeBounds) {
    // console.log(`Shape bounds not found for shape-inside reference to #${shapeElement.id}`);
    return;
  }
  const textData = await initializeTextContentAsync(textElement);

  const textBounds = await calculateTextBoundsAsync(shapeBounds, styleAttr);
  const { hasStructuredLines, topLevelTspans } = await analyzeTextStructureAsync(textElement);
  
  const formattingData = await extractFormattingFromElementAsync(
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
  
  await createWrappedTextElementAsync(textElement, textBounds, textData.plainContent, textData.formattingRanges, textTransform);
}

async function initializeTextContentAsync(textElement) {
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
        // console.log("Tspan")
        // console.log(tspan.textContent)
        
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
  // console.log("Plain content")
  // console.log(plainContent)
  
  return { plainContent, formattingRanges, rootTextContent };
}

async function analyzeTextStructureAsync(textElement) {
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

async function shouldPreserveLayoutAsync(textElement, styleAttr) {
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

async function calculateTextBoundsAsync(shapeBounds, styleAttr) {
  const shapePadding = await extractNumericPropertyFromStyleAsync(styleAttr, 'shape-padding') || 0;
  
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
async function extractFormattingFromElementAsync(textElement, plainContent, formattingRanges, hasStructuredLines, topLevelTspans, rootTextContent) {  
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
    
    // Check for font-weight
    const fontWeightStyle = (tspan.getAttribute('style') || '').match(/font-weight\s*:\s*([^;]+)/)?.[1];
    const fontWeightAttr = tspan.getAttribute('font-weight');
    const fontWeight = fontWeightAttr || fontWeightStyle || 'normal';
    
    // Check if this tspan has any special formatting
    if (fontSizeStyle || fontSizeAttr || fontStyle === 'italic' || fontWeight === 'bold') {
      const fontSize = fontSizeStyle || fontSizeAttr || '';
      
      // Only log if there's special formatting (bold or italic)
      if (fontStyle === 'italic' || fontWeight === 'bold') {
        // console.log(`Found tspan with font-size: ${fontSize}, font-style: ${fontStyle}, font-weight: ${fontWeight} for text: "${tspan.textContent}"`);
      }
      
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
            fontWeight: fontWeight,
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
        await addFormattingForElementAsync(tspan, position, position + tspanText.length, formattingRanges);
        currentPosition = position + tspanText.length;
        
        // Process nested tspans for additional formatting
        await processNestedTspansForFormattingAsync(tspan, plainContent, formattingRanges, seenElements);
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
          await addFormattingForElementAsync(tspan, position, position + tspanText.length, formattingRanges);
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
async function addFormattingForElementAsync(element, start, end, formattingRanges) {
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
  
  // Log if we found special formatting (only for bold or italic)
  if (fontWeight === 'bold' || fontStyle === 'italic') {
    // console.log(`Found special formatting for text from position ${start} to ${end}: fontWeight=${fontWeight}, fontStyle=${fontStyle}`);
  }
  
  // Only add formatting if there's something special about this element
  if (fontWeight !== 'normal' || fontStyle !== 'normal' || fontFamily || fontSize) {
    // Check for existing overlapping ranges with the same formatting
    let hasOverlap = false;
    
    // Check if this range is completely contained within an existing range with the same formatting
    for (const range of formattingRanges) {
      if (start >= range.start && end <= range.end && 
          range.fontWeight === fontWeight && 
          range.fontStyle === fontStyle) {
        // This range is completely contained within an existing range with the same formatting
        hasOverlap = true;
        break;
      }
    }
    
    // Only add if there's no overlap with the same formatting
    if (!hasOverlap) {
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
}

/**
 * Process nested tspans for formatting
 * @param {Element} parentElement - Parent element
 * @param {string} plainContent - Plain text content
 * @param {Array} formattingRanges - Array of formatting ranges
 * @param {Set} seenElements - Set of seen elements
 */
async function processNestedTspansForFormattingAsync(parentElement, plainContent, formattingRanges, seenElements) {
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
        await addFormattingForElementAsync(tspan, position, position + tspanText.length, formattingRanges);
        
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
async function createWrappedTextElementAsync(textElement, textBounds, plainContent, formattingRanges, textTransform) {
  const svgNS = 'http://www.w3.org/2000/svg';
  let newTextElement = textElement.ownerDocument.createElementNS(svgNS, 'text');
  
  // Set attributes on the new text element
  if (textTransform) {
    newTextElement.setAttribute('transform', textTransform);
  }
  
  // Copy attributes from original text element
  await copyPreservedAttributesAsync(textElement, newTextElement);
  
  // Add font attributes to the text element
  addFontAttributes(newTextElement, textElement, formattingRanges);
  
  // Get font size for line wrapping calculation
  const fontSize = await extractFontSizeAsync(textElement);
  
  // Get font attributes for the text element
  const fontAttrs = await extractFontAttributesAsync(textElement);
  
  // Initialize fontkit if not already initialized
  if (!fontCache.initialized) {
    try {
      await fontCache.initialize();
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
  // for (const line of contentLines) {
  //   if (formattingRanges && formattingRanges.length > 0) {      
  //     // Process each character with its formatting
  //     for (let i = 0; i < line.length; i++) {
  //       const char = line[i];
        
  //       // Find applicable formatting for this character
  //       let isBold = false;
  //       let isItalic = false;
        
  //       // Calculate absolute position by adding the current index to the sum of lengths of previous lines
  //       let absolutePosition = i;
  //       for (let lineIndex = 0; lineIndex < contentLines.indexOf(line); lineIndex++) {
  //         absolutePosition += contentLines[lineIndex].length + 1; // +1 for the newline character
  //       }
        
  //       for (const range of formattingRanges) {
  //         if (absolutePosition >= range.start && absolutePosition < range.end) {
  //           if (range.fontWeight === 'bold' || parseInt(range.fontWeight, 10) >= 600) {
  //             isBold = true;
  //           }
  //           if (range.fontStyle === 'italic') {
  //             isItalic = true;
  //           }
  //         }
  //       }
        
  //       // Apply formatting with chalk
  //       if (isBold && isItalic) {
  //         process.stdout.write(chalk.red.bold.italic(char));
  //       } else if (isBold) {
  //         process.stdout.write(chalk.red.bold(char));
  //       } else if (isItalic) {
  //         process.stdout.write(chalk.red.italic(char));
  //       } else {
  //         process.stdout.write(char);
  //       }
  //     }
  //     console.log(); // New line after printing the text
  //   }
  // }
  var characterPositionForFormatting = 0;
  for (const line of contentLines) {
    // Skip empty lines but preserve them in output
    if (!line.trim()) {
      wrappedLines.push('');
      continue;
    }
    
    // Always wrap each line to fit the width, regardless of whether there are explicit newlines
    // console.log(hasExplicitNewlines ? "Has explicit newlines, wrapping each line" : "No explicit newlines, wrapping text")
    
    // Create font info object
    const fontInfo = {
      fontFamily: fontAttrs.fontFamily,
      fontSize: fontAttrs.fontSize,
      fontWeight: fontAttrs.fontWeight,
      fontStyle: fontAttrs.fontStyle
    };
    
    try {
      // Pass formatting ranges to wrapTextAsync
      const wrapped = await wrapTextAsync(line, fontSize, textBounds.width, fontInfo, formattingRanges, characterPositionForFormatting);
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
    characterPositionForFormatting += line.length
  }
  
  // Add wrapped text as tspan elements
  await addWrappedTextAsTspansAsync(newTextElement, wrappedLines, textBounds, fontSize, formattingRanges);
  
  // Replace the original text element with the new one
  textElement.parentNode.replaceChild(newTextElement, textElement);
}

/**
 * Copy preserved attributes from original text element to new text element
 * @param {Element} sourceElement - Source element to copy attributes from
 * @param {Element} targetElement - Target element to copy attributes to
 */
async function copyPreservedAttributesAsync(sourceElement, targetElement) {
  const preserveAttrs = ['style', 'class', 'id', 'fill', 'font-family', 'font-size', 'font-weight'];
  preserveAttrs.forEach(async attr => {
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
async function addWrappedTextAsTspansAsync(textElement, wrappedLines, textBounds, fontSize, formattingRanges = []) {
  const document = textElement.ownerDocument;
  
  // Extract font info including text alignment
  const fontAttrs = await extractFontAttributesAsync(textElement);
  const fontInfo = {
    fontFamily: fontAttrs.fontFamily,
    fontSize: fontAttrs.fontSize,
    fontWeight: fontAttrs.fontWeight,
    fontStyle: fontAttrs.fontStyle,
    lineHeight: fontAttrs.lineHeight,
    textAlign: fontAttrs.textAlign
  };
  
  // console.log(`Font info for text element:`, fontInfo);
  
  // Track the current position in the original text to calculate offsets
  let currentPosition = 0;
  
  // Calculate line heights for each line based on the tallest character in that line
  // and the absolute position of each line within the full text
  const lineHeights = [];
  for (const line of wrappedLines) {
    const lineHeight = await calculateLineHeightForLineAsync(
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
  
  // Extract the original text content
  const originalText = textElement.textContent;
  
  // Reset current position for processing the lines
  currentPosition = 0;
  
  // Process each wrapped line
  for (let index = 0; index < wrappedLines.length; index++) {
    const line = wrappedLines[index];
    if (!line.trim()) {
      currentPosition += 1;
      continue;
    }

    const lineTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    
    // Calculate x position based on alignment
    const xPos = await calculateXPositionAsync(
      line,
      textBounds.width,
      textBounds,
      fontInfo.textAlign,
      fontSize,
      fontInfo,
      formattingRanges,
      currentPosition
    );
    
    lineTspan.setAttribute('x', xPos.toString());
    lineTspan.setAttribute('y', yPositions[index].toString());

    // Calculate the absolute position range for this line
    const lineStart = currentPosition;
    const lineEnd = currentPosition + line.length;

    // Find all formatting ranges that overlap with this line
    const lineFormattingRanges = formattingRanges.filter(range => 
      range.start < lineEnd && range.end > lineStart
    );

    // Handle justified text
    if (fontInfo.textAlign === 'justify' && 
        index < wrappedLines.length - 1 && // Not last line
        line.includes(' ')) {
      // Split into words and calculate spacing
      const words = line.split(' ');
      const totalSpaces = words.length - 1;
      if (totalSpaces > 0) {
        const spaceWidth = (textBounds.width - 
          await fontCache.calculateTextWidthAsync(line.replace(/\s+/g, ''), formattingRanges, fontSize, fontInfo.fontFamily, currentPosition)) / totalSpaces;
        
        // Add words with calculated spacing and formatting
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
          const word = words[wordIndex];
          const wordTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          
          // Apply formatting if any
          const wordStart = line.indexOf(word, wordIndex === 0 ? 0 : line.indexOf(words[wordIndex - 1]) + words[wordIndex - 1].length);
          const wordEnd = wordStart + word.length;
          const absoluteWordStart = lineStart + wordStart;
          const absoluteWordEnd = lineStart + wordEnd;

          // Find formatting for this word
          const wordFormatting = lineFormattingRanges.find(range => 
            range.start <= absoluteWordEnd && range.end > absoluteWordStart
          );

          if (wordFormatting) {
            if (wordFormatting.fontWeight) {
              wordTspan.setAttribute('font-weight', wordFormatting.fontWeight);
            }
            if (wordFormatting.fontStyle) {
              wordTspan.setAttribute('font-style', wordFormatting.fontStyle);
            }
          }

          wordTspan.textContent = word;
          if (wordIndex > 0) {
            wordTspan.setAttribute('dx', spaceWidth.toString());
          }
          lineTspan.appendChild(wordTspan);
        }
      } else {
        await applyFormattingAsync(lineTspan, line, lineStart, lineEnd, lineFormattingRanges);
      }
    } else {
      // Handle non-justified text with formatting
      await applyFormattingAsync(lineTspan, line, lineStart, lineEnd, lineFormattingRanges);
    }

    textElement.appendChild(lineTspan);
    currentPosition += line.length + 1;
  }
}

// Helper function to apply formatting to text
async function applyFormattingAsync(tspan, text, start, end, formattingRanges) {
  const document = tspan.ownerDocument; // Get document from the tspan element
  
  if (formattingRanges.length === 0) {
    tspan.textContent = text;
    return;
  }

  // Sort ranges by start position
  const sortedRanges = [...formattingRanges].sort((a, b) => a.start - b.start);

  let currentPos = 0;
  for (const range of sortedRanges) {
    if (range.start > end || range.end <= start) continue;

    const rangeStart = Math.max(0, range.start - start);
    const rangeEnd = Math.min(text.length, range.end - start);
    
    if (rangeStart > currentPos) {
      // Add unformatted text before this range
      const plainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      plainTspan.textContent = text.substring(currentPos, rangeStart);
      tspan.appendChild(plainTspan);
    }

    // Add formatted text
    const formattedTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    if (range.fontWeight) {
      formattedTspan.setAttribute('font-weight', range.fontWeight);
    }
    if (range.fontStyle) {
      formattedTspan.setAttribute('font-style', range.fontStyle);
    }
    formattedTspan.textContent = text.substring(rangeStart, rangeEnd);
    tspan.appendChild(formattedTspan);

    currentPos = rangeEnd;
  }

  // Add any remaining unformatted text
  if (currentPos < text.length) {
    const plainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    plainTspan.textContent = text.substring(currentPos);
    tspan.appendChild(plainTspan);
  }
}

/**
 * Rewrap text in a text element
 * @param {Element} textElement - Text element to rewrap
 */
async function rewrapTextAsyncElementAsync(textElement) {
  // Get text content and formatting
  let plainContent = '';
  let formattingRanges = [];
  
  // Extract text content
  const hasStructuredLines = textElement.querySelectorAll('tspan').length > 0;
  const topLevelTspans = Array.from(textElement.children).filter(child => child.tagName === 'tspan');
  
  // Initialize text content
  const textContentInfo = await initializeTextContentAsync(textElement);
  plainContent = textContentInfo.plainContent;
  
  // Extract formatting information
  const formattingInfo = await extractFormattingFromElementAsync(
    textElement, 
    plainContent, 
    formattingRanges, 
    hasStructuredLines, 
    topLevelTspans, 
    textContentInfo.rootTextContent
  );
  
  // Get the text bounds
  const styleAttr = textElement.getAttribute('style') || '';
  const shapeBounds = await calculateTextBoundsAsync(null, styleAttr);
  
  // Determine the container width
  const containerWidth = await estimateContainerWidthAsync(textElement);
  
  // Extract font size
  const fontSize = await extractFontSizeAsync(textElement);
  
  // Extract font attributes
  const fontAttrs = await extractFontAttributesAsync(textElement);
  
  // Wrap the text
  const wrappedLines = await wrapTextAsync(
    plainContent, 
    fontSize, 
    containerWidth, 
    fontAttrs, 
    formattingRanges
  );
  
  // Clear the text element
  while (textElement.firstChild) {
    textElement.removeChild(textElement.firstChild);
  }
  
  // Add the wrapped text as tspans
  await addWrappedTextAsTspansAsync(
    textElement, 
    wrappedLines, 
    shapeBounds, 
    fontSize, 
    formattingRanges
  );
  
  // Add font attributes to the text element
  addFontAttributes(textElement, textElement, formattingRanges);
  
  // Mark as processed
  textElement.setAttribute('data-processed', 'true');
}

module.exports = {
  processTextElementsAsync,
  rewrapTextAsyncElementAsync
}; 