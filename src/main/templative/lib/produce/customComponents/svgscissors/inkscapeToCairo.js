const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { SVG, find } = require('@svgdotjs/svg.js');
const { Resvg } = require('@resvg/resvg-js');
const { FontCache } = require('./fontCache');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const nsMap = {
  'svg': 'http://www.w3.org/2000/svg',
  'xlink': 'http://www.w3.org/1999/xlink',
  'inkscape': 'http://www.inkscape.org/namespaces/inkscape',
};
const svgNs = '{http://www.w3.org/2000/svg}';

/**
 * Prepares SVG content for Cairo rendering
 * @param {string} contents - SVG content as string
 * @param {FontCache} fontCache - Font cache instance
 * @returns {Promise<string>} - Modified SVG content
 */
async function prepareForCairo(contents, fontCache) {
  contents = convertShapeInsideTextToWrappedText(contents, fontCache);
  contents = processSvgStrokeOrder(contents);
  return contents;
}

/**
 * Finds the path for a font family
 * @param {string} fontFamily - Font family name
 * @param {FontCache} fontCache - Font cache instance
 * @returns {string|null} - Font path or null if not found
 */
function findFontPath(fontFamily, fontCache) {
  if (fontCache.fontPathsCache[fontFamily]) {
    return fontCache.fontPathsCache[fontFamily];
  }
  
  // Use system font paths based on OS
  let fontPaths = [];
  const os = require('os');
  const platform = os.platform();
  
  if (platform === 'darwin') {
    // macOS font paths
    fontPaths = [
      '/System/Library/Fonts',
      '/Library/Fonts',
      path.join(os.homedir(), 'Library/Fonts')
    ];
  } else if (platform === 'win32') {
    // Windows font paths
    fontPaths = [
      path.join(process.env.WINDIR || 'C:\\Windows', 'Fonts')
    ];
  } else {
    // Linux font paths
    fontPaths = [
      '/usr/share/fonts',
      '/usr/local/share/fonts',
      path.join(os.homedir(), '.fonts')
    ];
  }
  
  // Simple font matching - in a real implementation, you'd want to use
  // a more sophisticated font detection mechanism
  for (const fontDir of fontPaths) {
    try {
      const files = fs.readdirSync(fontDir);
      for (const file of files) {
        if (file.toLowerCase().includes(fontFamily.toLowerCase()) && 
            (file.endsWith('.ttf') || file.endsWith('.otf'))) {
          const fontPath = path.join(fontDir, file);
          fontCache.fontPathsCache[fontFamily] = fontPath;
          return fontPath;
        }
      }
    } catch (err) {
      // Directory might not exist or be accessible
      continue;
    }
  }
  
  return null;
}

/**
 * Gets a font instance for the specified font family and size
 * @param {string} fontFamily - Font family name
 * @param {number} fontSize - Font size in pixels
 * @param {FontCache} fontCache - Font cache instance
 * @returns {object} - Font instance
 */
function getFont(fontFamily, fontSize, fontCache) {
  const fontKey = `${fontFamily}_${fontSize}`;
  if (fontCache.fontsCache[fontKey]) {
    return fontCache.fontsCache[fontKey];
  }
  
  if (fontCache.missingFonts.has(fontFamily)) {
    return { getMetrics: text => ({ width: text.length * fontSize * 0.6, height: fontSize }) };
  }
  
  const fontPath = findFontPath(fontFamily, fontCache);
  if (fontPath) {
    try {
      // In a real implementation, you'd load the font with a proper font library
      // Here we're creating a simple font metrics calculator
      const font = {
        getMetrics: text => {
          // Simple approximation of text metrics
          return {
            width: text.length * fontSize * 0.6,
            height: fontSize
          };
        }
      };
      fontCache.fontsCache[fontKey] = font;
      return font;
    } catch (e) {
      console.log(`!!! Error loading font '${fontFamily}' from ${fontPath}: ${e}. Using default font.`);
      fontCache.missingFonts.add(fontFamily);
      return { getMetrics: text => ({ width: text.length * fontSize * 0.6, height: fontSize }) };
    }
  }

  console.log(`!!! Font ${fontFamily} not found in system. Using default font.`);
  fontCache.missingFonts.add(fontFamily);
  return { getMetrics: text => ({ width: text.length * fontSize * 0.6, height: fontSize }) };
}

/**
 * Gets font information from styles
 * @param {Object} currentStyles - Current styles
 * @param {FontCache} fontCache - Font cache instance
 * @returns {Array} - [font, fontSize, lineHeight]
 */
function getFontInfo(currentStyles, fontCache) {
  let fontSize = currentStyles['font-size'] || '16px';
  const fontFamily = (currentStyles['font-family'] || 'Arial').replace(/'/g, '').trim();
  const lineHeight = parseFloat(currentStyles['line-height'] || 1.2);

  try {
    fontSize = parseFloat(fontSize.replace('px', ''));
    if (fontSize <= 0) {
      throw new Error(`Invalid font size: ${fontSize}. Using default size of 16px.`);
    }
  } catch (e) {
    console.log(`!!! Invalid font size '${fontSize}' encountered. Using default size of 16px.`);
    fontSize = 16;
  }

  const font = getFont(fontFamily, fontSize, fontCache);
  
  return [font, fontSize, lineHeight];
}

/**
 * Gets current styles by merging parent and child styles
 * @param {Element} textElem - Text element
 * @param {Element} child - Child element
 * @returns {Object} - Merged styles
 */
function getCurrentStyles(textElem, child) {
  const parentStyles = parseStyleString(textElem.getAttribute('style') || '');
  const childStyles = parseStyleString(child.getAttribute('style') || '');
  return { ...parentStyles, ...childStyles };
}

/**
 * Processes a text line for wrapping
 * @param {string} word - Word to add
 * @param {string} currentLine - Current line
 * @param {Object} font - Font instance
 * @param {number} fontSize - Font size
 * @param {number} maxWidth - Maximum width
 * @param {number} yOffset - Y offset
 * @param {Object} currentStyles - Current styles
 * @param {Element} textElem - Text element
 * @param {Element} child - Child element
 * @param {Array} lines - Lines array
 * @returns {Array} - [updatedCurrentLine, updatedYOffset]
 */
function processTextLine(word, currentLine, font, fontSize, maxWidth, yOffset, currentStyles, textElem, child, lines) {
  const testLine = `${currentLine} ${word}`.trim();

  try {
    const width = font.getMetrics(testLine).width;
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        const mergedAttribs = mergeAttributes(textElem, child, currentStyles);
        lines.push([currentLine, yOffset, mergedAttribs]);
        console.log(`   --> Created wrapped line: ${currentLine} with styles: ${mergedAttribs.style}`);
      }
      currentLine = word;
      yOffset += fontSize * parseFloat(currentStyles['line-height'] || 1.2);
    }
  } catch (e) {
    console.log(`!!! Failed to calculate text width for '${testLine}': ${e}`);
  }

  return [currentLine, yOffset];
}

/**
 * Merges attributes from parent and child elements
 * @param {Element} parentElem - Parent element
 * @param {Element} childElem - Child element
 * @param {Object} currentStyles - Current styles
 * @returns {Object} - Merged attributes
 */
function mergeAttributes(parentElem, childElem, currentStyles) {
  const mergedAttribs = {};
  
  // Copy parent attributes
  for (let i = 0; i < parentElem.attributes.length; i++) {
    const attr = parentElem.attributes[i];
    mergedAttribs[attr.name] = attr.value;
  }
  
  // Copy and override with child attributes
  for (let i = 0; i < childElem.attributes.length; i++) {
    const attr = childElem.attributes[i];
    mergedAttribs[attr.name] = attr.value;
  }

  // Handle style attribute merging
  const parentStyles = parseStyleString(parentElem.getAttribute('style') || '');
  const childStyles = parseStyleString(childElem.getAttribute('style') || '');

  // Combine parent and child styles, giving priority to the child
  const combinedStyles = { ...parentStyles, ...childStyles, ...currentStyles };

  // Set the merged 'style' attribute
  mergedAttribs.style = buildStyleString(combinedStyles);
  
  return mergedAttribs;
}

/**
 * Parses a style string into an object
 * @param {string} styleString - Style string
 * @returns {Object} - Style object
 */
function parseStyleString(styleString) {
  const styleDict = {};
  if (styleString) {
    const styles = styleString.split(';');
    for (const style of styles) {
      if (style.includes(':')) {
        const [key, value] = style.split(':', 2);
        styleDict[key.trim()] = value.trim();
      }
    }
  }
  return styleDict;
}

/**
 * Builds a style string from a style object
 * @param {Object} styles - Style object
 * @returns {string} - Style string
 */
function buildStyleString(styles) {
  return Object.entries(styles)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

/**
 * Gets an inherited style from an element or its ancestors
 * @param {Element} element - Element
 * @param {string} attribute - Style attribute
 * @param {*} defaultValue - Default value
 * @returns {*} - Style value or default
 */
function getInheritedStyle(element, attribute, defaultValue = null) {
  while (element !== null) {
    const style = element.getAttribute('style') || '';
    if (style === '') {
      element = element.parentNode;
      continue;
    }
    const styleDict = parseStyleString(style);
    if (attribute in styleDict) {
      const value = styleDict[attribute].trim();
      return value.replace(/['"]/g, '');
    }
    element = element.parentNode;
  }
  
  return defaultValue;
}

/**
 * Gets all styles including inherited ones
 * @param {Element} element - Element
 * @returns {Object} - All styles
 */
function getAllStylesIncludingInheritance(element) {
  const finalStyling = {};
  while (element !== null) {
    const style = element.getAttribute('style') || '';
    if (style === '') {
      element = element.parentNode;
      continue;
    }
    const styleDict = parseStyleString(style);
    for (const attribute in styleDict) {
      if (attribute in finalStyling) {
        continue;
      }
      const value = styleDict[attribute].trim();
      finalStyling[attribute] = value.replace(/['"]/g, '');
    }
    element = element.parentNode;
  }
  return finalStyling;
}

/**
 * Determines the paint order for an element
 * @param {Object} styleDict - Style dictionary
 * @returns {Array} - Paint order array
 */
function determinePaintOrder(styleDict) {
  const paintOrder = styleDict['paint-order'] && styleDict['paint-order'].toLowerCase() || 'fill stroke markers';
  
  if (paintOrder.includes('stroke') && paintOrder.includes('fill')) {
    let firstPaint = null;
    for (const paint of paintOrder.split(' ')) {
      if (['fill', 'stroke'].includes(paint)) {
        firstPaint = paint;
        break;
      }
    }
    if (firstPaint === 'stroke') {
      return ['stroke', 'fill'];
    }
    
    return ['fill', 'stroke'];
  }
  return ['fill', 'stroke'];
}

/**
 * Processes SVG stroke order to ensure correct rendering
 * @param {string} svgContent - SVG content
 * @returns {string} - Modified SVG content
 */
function processSvgStrokeOrder(svgContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'text/xml');
  const root = doc.documentElement;
  
  const svgElements = ['tspan', 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'text'];
  const TEXT_TAG = 'text';
  const TSPAN_TAG = 'tspan';
  
  for (const elemTag of svgElements) {
    // Find all elements of this type using namespace-aware selection
    const elements = [];
    const elementList = doc.getElementsByTagNameNS(nsMap.svg, elemTag);
    for (let i = 0; i < elementList.length; i++) {
      elements.push(elementList.item(i));
    }
    
    for (const elem of elements) {
      const styleDict = getAllStylesIncludingInheritance(elem);
      const hasFill = 'fill' in styleDict;
      const hasStroke = 'stroke' in styleDict;
      if (!(hasFill && hasStroke)) {
        continue;
      }
    
      if ([TEXT_TAG, TSPAN_TAG].includes(elem.localName)) {
        // Determine if the element has direct text content
        const hasDirectText = elem.textContent && elem.textContent.trim();
        
        // Determine if any child has direct text content
        let hasChildText = false;
        for (let i = 0; i < elem.childNodes.length; i++) {
          const child = elem.childNodes[i];
          if (child.textContent && child.textContent.trim()) {
            hasChildText = true;
            break;
          }
        }
        
        // If neither the element nor its children have text, skip splitting
        if (!(hasDirectText || hasChildText)) {
          continue;
        }
      }
    
      // Create a copy for fill
      const fillElem = elem.cloneNode(false);
      for (let i = 0; i < elem.attributes.length; i++) {
        const attr = elem.attributes[i];
        if (['stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity', 'stroke-width'].includes(attr.name)) {
          continue;
        }
        fillElem.setAttribute(attr.name, attr.value);
      }
      
      // Handle style attribute for fill
      let fillStyleDict;
      if ('stroke' in styleDict) {
        fillStyleDict = { ...styleDict };
        delete fillStyleDict.stroke;
      } else {
        fillStyleDict = { ...styleDict };
      }
      const fillStyle = Object.entries(fillStyleDict)
        .filter(([k]) => k !== 'stroke')
        .map(([k, v]) => `${k}:${v}`)
        .join(';') + ';stroke:none';
      fillElem.setAttribute('style', fillStyle);
      
      // Create a copy for stroke
      const strokeElem = elem.cloneNode(false);
      for (let i = 0; i < elem.attributes.length; i++) {
        const attr = elem.attributes[i];
        if (['fill', 'fill-opacity', 'fill-rule'].includes(attr.name)) {
          continue;
        }
        strokeElem.setAttribute(attr.name, attr.value);
      }
      
      // Handle style attribute for stroke
      let strokeStyleDict;
      if ('fill' in styleDict) {
        strokeStyleDict = { ...styleDict };
        delete strokeStyleDict.fill;
      } else {
        strokeStyleDict = { ...styleDict };
      }
      const strokeStyle = Object.entries(strokeStyleDict)
        .filter(([k]) => k !== 'fill')
        .map(([k, v]) => `${k}:${v}`)
        .join(';') + ';fill:none';
      strokeElem.setAttribute('style', strokeStyle);
      
      if ([TEXT_TAG, TSPAN_TAG].includes(elem.localName)) {
        // Preserve the text content in both fill and stroke elements
        fillElem.textContent = elem.textContent;
        strokeElem.textContent = elem.textContent;
        
        // Iterate through child elements (e.g., <tspan>)
        for (let i = 0; i < elem.childNodes.length; i++) {
          const child = elem.childNodes[i];
          if (child.nodeType === 1) { // Element node
            // Create corresponding fill child
            const fillChild = child.cloneNode(true);
            fillElem.appendChild(fillChild);
            
            // Create corresponding stroke child
            const strokeChild = child.cloneNode(true);
            strokeElem.appendChild(strokeChild);
          }
        }
      }
      
      // Insert fill and stroke elements
      const parent = elem.parentNode;
      if (parent === null) {
        continue;
      }
      
      const index = Array.from(parent.childNodes).indexOf(elem);
      let currentIndex = index;
      
      const insertionOrder = determinePaintOrder(styleDict);
      for (const order of insertionOrder) {
        if (order === 'fill') {
          parent.insertBefore(fillElem, parent.childNodes[currentIndex] || null);
          currentIndex++;
        } else if (order === 'stroke') {
          parent.insertBefore(strokeElem, parent.childNodes[currentIndex] || null);
          currentIndex++;
        }
      }
      
      // Remove the original element
      parent.removeChild(elem);
    }
  }
  
  const serializer = new XMLSerializer();
  const modifiedSvgContent = serializer.serializeToString(doc);
  return modifiedSvgContent;
}

/**
 * Converts shape-inside text to wrapped text
 * @param {string} svgContent - SVG content
 * @param {FontCache} fontCache - Font cache instance
 * @returns {string} - Modified SVG content
 */
function convertShapeInsideTextToWrappedText(svgContent, fontCache) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'text/xml');
  const root = doc.documentElement;

  const textElements = doc.getElementsByTagNameNS(nsMap.svg, 'text');
  for (let i = 0; i < textElements.length; i++) {
    const textElem = textElements[i];
    const shapeInside = getInheritedStyle(textElem, 'shape-inside');
    if (!shapeInside) {
      continue;
    }
    convertTextElement(root, textElem, fontCache);
  }

  const serializer = new XMLSerializer();
  const modifiedSvgContent = serializer.serializeToString(doc);
  return modifiedSvgContent;
}

/**
 * Wraps text with tspans
 * @param {Element} textElem - Text element
 * @param {number} maxWidth - Maximum width
 * @param {FontCache} fontCache - Font cache instance
 * @param {Object} inheritedStyles - Inherited styles
 * @param {number} xPos - X position
 * @param {number} yPos - Y position
 * @returns {Element} - New text element with wrapped text
 */
function wrapTextWithTspans(textElem, maxWidth, fontCache, inheritedStyles = {}, xPos = 0, yPos = 0) {
  const lines = [];
  let yOffset = 0;

  const originalTextStyles = textElem.getAttribute('style') || '';
  let parsedStyles = parseStyleString(originalTextStyles);

  if ('shape-inside' in parsedStyles) {
    if (textElem.textContent) {
      textElem.textContent = '\n' + textElem.textContent;
    } else {
      textElem.textContent = '\n';
    }
    delete parsedStyles['shape-inside'];
    const updatedStyleString = buildStyleString(parsedStyles);
    textElem.setAttribute('style', updatedStyleString);
  }

  // Stack for iterative traversal: [element, styles, child_index]
  const stack = [];
  stack.push([textElem, { ...inheritedStyles }, 0]);

  // List of text runs: [text, styles]
  const textRuns = [];

  while (stack.length > 0) {
    const [elem, currentStyles, childIndex] = stack.pop();

    // Merge styles
    const elementStyles = parseStyleString(elem.getAttribute('style') || '');
    const styles = { ...currentStyles, ...elementStyles };

    if (childIndex === 0) {
      // Process element's text content
      const text = elem.firstChild ? elem.firstChild.nodeValue || '' : '';
      if (text !== null) {
        textRuns.push([text, { ...styles }]);
      }
    }

    if (childIndex < elem.childNodes.length) {
      // There are more children to process
      // Push the current element back onto the stack with the next child index
      stack.push([elem, currentStyles, childIndex + 1]);
      // Now, push the child onto the stack to process it next
      const child = elem.childNodes[childIndex];
      if (child.nodeType === 1) { // Element node
        stack.push([child, { ...styles }, 0]);
      }
    } else {
      // All children have been processed, process tail text
      const tail = elem.nextSibling && elem.nextSibling.nodeType === 3 ? elem.nextSibling.nodeValue : '';
      if (tail !== null) {
        // Use currentStyles (styles of the parent)
        textRuns.push([tail, { ...currentStyles }]);
      }
    }
  }

  // Process the text runs to wrap them into lines
  let currentLineTokens = [];
  let currentLineWidth = 0;
  let currentLineMaxFontSize = 0;
  let currentLineMaxLineHeight = 0;

  for (const [text, styles] of textRuns) {
    // Split the text run into segments based on newlines, including empty segments
    const segments = text.split('\n');

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      // Split segment into tokens (words and spaces)
      const tokens = segment.match(/[^\s]+|\s+/g) || [];
      for (const token of tokens) {
        if (token === '') {
          continue;
        }
        // Update font based on styles
        const [font, fontSize, lineHeight] = getFontInfo(styles, fontCache);
        const tokenWidth = font.getMetrics(token).width;
        // Update maximum font size and line height for the current line
        currentLineMaxFontSize = Math.max(currentLineMaxFontSize, fontSize);
        currentLineMaxLineHeight = Math.max(currentLineMaxLineHeight, lineHeight);
        if (currentLineWidth + tokenWidth > maxWidth && token.trim()) {
          // Wrap to new line
          if (currentLineTokens.length > 0) {
            lines.push([currentLineTokens, yOffset, currentLineMaxFontSize, currentLineMaxLineHeight]);
            yOffset += currentLineMaxFontSize * currentLineMaxLineHeight;
            currentLineTokens = [];
            currentLineWidth = 0;
            // Reset maximums after wrapping to new line
            currentLineMaxFontSize = fontSize;
            currentLineMaxLineHeight = lineHeight;
          }
        }
        // Add token to current line
        currentLineTokens.push([token, { ...styles }]);
        currentLineWidth += tokenWidth;
      }
      // After processing the segment, check for line breaks
      if (i < segments.length - 1) {
        // Newline encountered, force line break
        if (currentLineTokens.length > 0) {
          // Add the current line
          lines.push([currentLineTokens, yOffset, currentLineMaxFontSize, currentLineMaxLineHeight]);
          yOffset += currentLineMaxFontSize * currentLineMaxLineHeight;
          currentLineTokens = [];
          currentLineWidth = 0;
          // Reset maximums after newline
          currentLineMaxFontSize = 0;
          currentLineMaxLineHeight = 0;
        } else {
          // Empty line due to consecutive newlines
          // Use default font size and line height if maximums are zero
          if (currentLineMaxFontSize === 0) {
            const [font, fontSize, lineHeight] = getFontInfo(styles, fontCache);
            currentLineMaxFontSize = fontSize;
            currentLineMaxLineHeight = lineHeight;
          }
          lines.push([[], yOffset, currentLineMaxFontSize, currentLineMaxLineHeight]);
          yOffset += currentLineMaxFontSize * currentLineMaxLineHeight;
          // Reset maximums after empty line
          currentLineMaxFontSize = 0;
          currentLineMaxLineHeight = 0;
        }
      }
    }
  }

  // After processing all text runs, add any remaining tokens as a line
  if (currentLineTokens.length > 0) {
    lines.push([currentLineTokens, yOffset, currentLineMaxFontSize, currentLineMaxLineHeight]);
  }

  // Build the new text element with tspans
  const doc = textElem.ownerDocument;
  const newTextElem = doc.createElementNS(nsMap.svg, 'text');
  newTextElem.setAttribute('x', xPos.toString());
  newTextElem.setAttribute('y', yPos.toString());
  newTextElem.setAttribute('style', originalTextStyles);  // Updated style without 'shape-inside'

  // Now, for each line, create tspans for each style run in the line
  for (const [lineRuns, offset, lineMaxFontSize, lineMaxLineHeight] of lines) {
    // Create a parent tspan for the line
    const tspanLine = doc.createElementNS(nsMap.svg, 'tspan');
    tspanLine.setAttribute('x', xPos.toString());
    tspanLine.setAttribute('y', (parseFloat(yPos) + offset).toString());
    if (!lineRuns.length) {
      // Empty line (due to multiple newlines), set text to empty string
      tspanLine.textContent = '';
    } else {
      // Build the text content and sub-tspans
      let currentStyles = null;
      let tspanRun = null;
      for (const [token, styles] of lineRuns) {
        if (JSON.stringify(currentStyles) !== JSON.stringify(styles)) {
          // Start a new tspan for the style run
          if (tspanRun !== null) {
            tspanLine.appendChild(tspanRun);
          }
          tspanRun = doc.createElementNS(nsMap.svg, 'tspan');
          // Set styles
          tspanRun.setAttribute('style', buildStyleString(styles));
          tspanRun.textContent = '';
          currentStyles = styles;
        }
        // Append token to tspanRun.textContent
        tspanRun.textContent += token;
      }
      if (tspanRun !== null) {
        tspanLine.appendChild(tspanRun);
      }
    }
    newTextElem.appendChild(tspanLine);
  }

  return newTextElem;
}

/**
 * Converts a text element with shape-inside to wrapped text
 * @param {Element} root - Root element
 * @param {Element} textElem - Text element
 * @param {FontCache} fontCache - Font cache instance
 */
function convertTextElement(root, textElem, fontCache) {
  // Extract the 'shape-inside' style from the element
  const shapeInside = getInheritedStyle(textElem, 'shape-inside');
  if (!shapeInside) {
    return;
  }

  // Extract the ID of the rectangle used for the shape-inside reference
  const match = shapeInside.match(/url\(#(.*?)\)/);
  if (!match) {
    console.log(`!!! Invalid shape-inside attribute found: '${shapeInside}'.`);
    return;
  }

  const rectId = match[1];
  const rect = root.querySelector(`rect[id='${rectId}']`);
  if (!rect) {
    console.log(chalk.red("!!! Cannot find rect used for shape-inside."));
    return;
  }

  // Get rectangle dimensions and position for text wrapping
  const parentStyles = parseStyleString(textElem.getAttribute('style') || '');
  parentStyles["shape-inside"] = null;
  const maxWidth = parseFloat(rect.getAttribute('width'));
  const xPos = rect.getAttribute('x');
  const yPos = rect.getAttribute('y');
  const wrappedTextElem = wrapTextWithTspans(textElem, maxWidth, fontCache, parentStyles, xPos, yPos);

  // Replace the original text element in the root with the wrapped text element
  textElem.parentNode.replaceChild(wrappedTextElem, textElem);
}

module.exports = { prepareForCairo };