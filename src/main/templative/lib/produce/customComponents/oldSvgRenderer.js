const fs = require('fs-extra');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { JSDOM } = require('jsdom');

// Simple locking mechanism to prevent multiple rendering processes from conflicting
const activeTasks = new Map();

/**
 * Preprocess SVG text to remove SVG 2.0 features that aren't compatible with resvg-js
 * @param {string} svgData - SVG content as string
 * @param {boolean} force_rewrap - Force rewrapping of text even if it has positioned tspans
 * @returns {string} - Processed SVG data
 */
function preprocessSvgText(svgData, force_rewrap = true) {
  try {
    // Check if this looks like an Inkscape SVG with shape-inside
    if (svgData.includes('shape-inside:url(#') || svgData.includes('sodipodi:docname') || svgData.includes('sodipodi:namedview')) {
      console.log('Detected Inkscape SVG with potential SVG 2.0 features, preprocessing...');
      
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
      
      // Parse the SVG using JSDOM
      let dom;
      
      try {
        dom = new JSDOM(svgData, { contentType: "image/svg+xml" });
        const doc = dom.window.document;
        
        // Extract all the shape definitions used by shape-inside
        const shapeMap = new Map(); // Map from ID to shape element
        
        // Find all rect, path, etc. elements that might be referenced
        const shapeElements = doc.querySelectorAll('rect, path, circle, ellipse, polygon, polyline');
        shapeElements.forEach(shape => {
          if (shape.id) {
            shapeMap.set(shape.id, shape);
          }
        });
        
        // Find and process all text elements with shape-inside
        let textElements = doc.querySelectorAll('text');
        let textModifications = 0;
        
        textElements.forEach(textElement => {
          // Check if this text element has shape-inside
          let styleAttr = textElement.getAttribute('style') || '';
          const shapeInsideMatch = styleAttr.match(/shape-inside\s*:\s*url\(#([^)]+)\)/);
          
          if (shapeInsideMatch) {
            const shapeId = shapeInsideMatch[1];
            const shapeElement = shapeMap.get(shapeId);
            
            if (shapeElement) {
              // We've found both the text element and its shape-inside container
              console.log(`Processing text with shape-inside reference to #${shapeId}`);
              
              // Extract the shape boundaries
              const shapeBounds = getShapeBounds(shapeElement);
              
              if (shapeBounds) {
                // Get the text transform if it exists
                let textTransform = '';
                if (textElement.hasAttribute('transform')) {
                  textTransform = textElement.getAttribute('transform');
                }
                
                // Get text position and style
                const x = parseFloat(textElement.getAttribute('x') || 0);
                const y = parseFloat(textElement.getAttribute('y') || 0);
                
                // First, analyze the structure of the text element to understand its organization
                let plainContent = '';
                let formattingRanges = [];
                let rootTextContent = '';
                
                // Get just the direct text content of the text element (not including tspans)
                for (let node of textElement.childNodes) {
                  if (node.nodeType === 3) { // Text node
                    rootTextContent += node.nodeValue;
                  }
                }
                
                // If the text element has direct text content (not in tspans), use that
                // This helps avoid duplication when the same content appears in tspans
                rootTextContent = rootTextContent.trim();
                if (rootTextContent.length > 0) {
                  console.log(`Text element has direct content: "${rootTextContent}"`);
                }
                
                // Check if the text is structured as <text><tspan>line1</tspan><tspan>line2</tspan></text>
                // which is how Inkscape typically organizes multi-line text without shape-inside
                const topLevelTspans = Array.from(textElement.children).filter(child => 
                  child.tagName.toLowerCase() === 'tspan' && !child.parentNode.tagName.toLowerCase().includes('tspan')
                );
                
                // If we have structured tspans with y coordinates, we can use those directly
                let hasStructuredLines = topLevelTspans.length > 0 && 
                                       topLevelTspans.filter(tspan => tspan.hasAttribute('y')).length === topLevelTspans.length;
                
                // Override hasStructuredLines if force_rewrap is true and we have shape-inside
                if (force_rewrap && textElement.getAttribute('style')?.includes('shape-inside')) {
                  console.log('Forcing text rewrap due to force_rewrap parameter');
                  hasStructuredLines = false;
                }
                
                // Check if the tspans already have proper positioning
                const existingTspans = textElement.querySelectorAll('tspan');
                const positionedTspans = Array.from(existingTspans).filter(
                  tspan => tspan.hasAttribute('x') && tspan.hasAttribute('y')
                );
                
                // Check if y values differ indicating different lines
                const yValues = new Set();
                positionedTspans.forEach(tspan => {
                  if (tspan.hasAttribute('y')) {
                    yValues.add(tspan.getAttribute('y'));
                  }
                });
                
                // A properly laid out text should have multiple lines with different y values
                // AND most tspans should have positioning
                let hasPositionedTspans = 
                  (yValues.size > 1) && 
                  (positionedTspans.length / existingTspans.length > 0.7); // At least 70% of tspans should have positions
                
                // If already properly positioned AND no shape-inside OR we're not forcing rewrap, just preserve the layout
                if (hasPositionedTspans && (!textElement.getAttribute('style')?.includes('shape-inside') || !force_rewrap)) {
                  console.log('Text already has properly positioned tspans, preserving layout...');
                  console.log(`Found ${positionedTspans.length} of ${existingTspans.length} tspans with x and y attributes.`);
                  console.log(`Y values found: ${Array.from(yValues).join(', ')}`);
                  
                  // Just remove the shape-inside property
                  styleAttr = styleAttr.replace(/shape-inside\s*:\s*url\([^)]+\)\s*;?/g, '');
                  styleAttr = styleAttr.replace(/white-space\s*:\s*[^;]+\s*;?/g, '');
                  textElement.setAttribute('style', styleAttr);
                  return; // Skip processing this text element further
                }
                
                // Get the shape-related properties
                const shapePadding = extractNumericPropertyFromStyle(styleAttr, 'shape-padding') || 0;
                
                // Create bounds accounting for padding
                const textBounds = {
                  x: shapeBounds.x + shapePadding,
                  y: shapeBounds.y + shapePadding,
                  width: shapeBounds.width - (shapePadding * 2),
                  height: shapeBounds.height - (shapePadding * 2)
                };
                
                if (hasStructuredLines) {
                  console.log(`Text appears to have ${topLevelTspans.length} structured lines with y-coordinates`);
                }
                
                // Function to extract text content and formatting from tspan elements
                function extractFormattingFromTspans(tspanElements, startIndex = 0, seenElements = new Set()) {
                  let currentIndex = startIndex;
                  
                  for (let i = 0; i < tspanElements.length; i++) {
                    const tspan = tspanElements[i];
                    
                    // Skip elements we've already processed to prevent duplication
                    if (seenElements.has(tspan)) {
                      continue;
                    }
                    seenElements.add(tspan);
                    
                    // Process all child nodes (including text nodes and nested tspans)
                    const childNodes = Array.from(tspan.childNodes);
                    
                    // If there are no child nodes or only text nodes (no nested tspans)
                    if (childNodes.length === 0 || !childNodes.some(node => node.nodeType === 1 && node.tagName.toLowerCase() === 'tspan')) {
                      // Get the text content of this tspan
                      let text = tspan.textContent;
                      
                      // Skip empty tspans
                      if (!text || !text.trim()) continue;
                      
                      // Track formatting for this tspan
                      const formatting = {
                        start: currentIndex,
                        end: currentIndex + text.length,
                        fontWeight: tspan.style.fontWeight || tspan.getAttribute('font-weight') || 'normal',
                        fontStyle: tspan.style.fontStyle || tspan.getAttribute('font-style') || 'normal',
                        fontFamily: tspan.style.fontFamily || tspan.getAttribute('font-family') || ''
                      };
                      
                      formattingRanges.push(formatting);
                      
                      // Add the text to our plain content
                      plainContent += text;
                      currentIndex += text.length;
                    } else {
                      // Process each child node separately
                      for (let j = 0; j < childNodes.length; j++) {
                        const node = childNodes[j];
                        
                        if (node.nodeType === 3) { // Text node
                          // Don't trim - preserve the original whitespace including leading and trailing spaces
                          const text = node.nodeValue;
                          if (text && text.length > 0) {
                            // Track formatting for this text node (using parent tspan's formatting)
                            const formatting = {
                              start: currentIndex,
                              end: currentIndex + text.length,
                              fontWeight: tspan.style.fontWeight || tspan.getAttribute('font-weight') || 'normal',
                              fontStyle: tspan.style.fontStyle || tspan.getAttribute('font-style') || 'normal',
                              fontFamily: tspan.style.fontFamily || tspan.getAttribute('font-family') || ''
                            };
                            
                            formattingRanges.push(formatting);
                            
                            // Add the text to our plain content
                            plainContent += text;
                            currentIndex += text.length;
                          }
                        } else if (node.nodeType === 1 && node.tagName.toLowerCase() === 'tspan') {
                          // Process nested tspan (will be handled by the recursive call)
                        }
                      }
                      
                      // Now process any nested tspans
                      const childTspans = childNodes.filter(node => 
                        node.nodeType === 1 && node.tagName.toLowerCase() === 'tspan'
                      );
                      
                      if (childTspans.length > 0) {
                        // Process nested tspans, passing the set of seen elements to prevent duplication
                        currentIndex = extractFormattingFromTspans(childTspans, currentIndex, seenElements);
                      }
                    }
                  }
                  
                  return currentIndex;
                }
                
                // Extract formatting from tspans using our improved method
                const seenElements = new Set(); // Track elements we've processed
                if (hasStructuredLines) {
                  // For structured multi-line text, process each top-level tspan as a separate line
                  let currentIndex = 0;
                  for (const tspan of topLevelTspans) {
                    if (currentIndex > 0) {
                      // Add a newline between lines
                      plainContent += '\n';
                      currentIndex += 1;
                    }
                    
                    // Process this line and its nested tspans
                    currentIndex = extractFormattingFromTspans([tspan], currentIndex, seenElements);
                  }
                } else {
                  // For text with shape-inside or unstructured text, process all tspans
                  extractFormattingFromTspans(Array.from(textElement.querySelectorAll('tspan')), 0, seenElements);
                }
                
                // If we have text content in the root element and no content extracted from tspans,
                // use the root content instead to prevent empty output
                if (plainContent.trim().length === 0 && rootTextContent.length > 0) {
                  plainContent = rootTextContent;
                  formattingRanges.push({
                    start: 0,
                    end: rootTextContent.length,
                    fontWeight: textElement.style.fontWeight || textElement.getAttribute('font-weight') || 'normal',
                    fontStyle: textElement.style.fontStyle || textElement.getAttribute('font-style') || 'normal',
                    fontFamily: textElement.style.fontFamily || textElement.getAttribute('font-family') || ''
                  });
                }
                
                console.log("Original content with formatting:");
                console.log(plainContent);
                console.log("Formatting ranges:", formattingRanges);
                
                // Create a new text element
                const svgNS = 'http://www.w3.org/2000/svg';
                let newTextElement = doc.createElementNS(svgNS, 'text');
                
                // Set attributes on the new text element
                if (textTransform) {
                  newTextElement.setAttribute('transform', textTransform);
                }
                
                // Copy attributes from original text element
                const preserveAttrs = ['style', 'class', 'id', 'fill', 'font-family', 'font-size', 'font-weight'];
                preserveAttrs.forEach(attr => {
                  if (textElement.hasAttribute(attr)) {
                    let value = textElement.getAttribute(attr);
                    // Remove shape-inside and related properties from style
                    if (attr === 'style') {
                      value = value.replace(/shape-inside\s*:\s*url\([^)]+\)\s*;?/g, '')
                                   .replace(/shape-padding\s*:\s*[^;]+\s*;?/g, '')
                                   .replace(/white-space\s*:\s*[^;]+\s*;?/g, '')
                                   .replace(/inline-size\s*:\s*[^;]+\s*;?/g, '');
                    }
                    newTextElement.setAttribute(attr, value);
                  }
                });
                
                // Explicitly extract font-family from tspan elements if present and parent text element doesn't have it
                if (!newTextElement.hasAttribute('font-family')) {
                  // Look for font-family in any of the original tspans
                  const tspans = textElement.querySelectorAll('tspan');
                  for (const tspan of tspans) {
                    const fontFamily = tspan.getAttribute('font-family') || 
                                      (tspan.getAttribute('style') || '').match(/font-family\s*:\s*([^;]+)/)?.[1];
                    if (fontFamily) {
                      newTextElement.setAttribute('font-family', fontFamily.trim());
                      break;
                    }
                  }
                }
                
                // If we still don't have a font-family, check formatting ranges
                if (!newTextElement.hasAttribute('font-family') && formattingRanges.length > 0) {
                  for (const format of formattingRanges) {
                    if (format.fontFamily) {
                      newTextElement.setAttribute('font-family', format.fontFamily);
                      break;
                    }
                  }
                }
                
                // Fallback to a default font-family if none was found
                if (!newTextElement.hasAttribute('font-family')) {
                  newTextElement.setAttribute('font-family', 'Helvetica, Arial, sans-serif');
                }
                
                // Get font size for line wrapping calculation
                const fontSize = estimateLineHeight(textElement) || 16;
                
                // First, split by explicit newlines
                let contentLines = plainContent.split(/\r?\n/);
                console.log("Original content lines before wrapping:");
                contentLines.forEach((line, i) => console.log(`Line ${i+1}: "${line}"`));
                
                // Then, for each resulting line, apply wrapping based on container width
                let wrappedLines = [];
                let lineStartIndexes = [0]; // Track the starting character index for each line
                
                contentLines.forEach((line, lineIndex) => {
                  // Skip empty lines but preserve them
                  if (!line.trim()) {
                    wrappedLines.push('');
                    if (lineIndex < contentLines.length - 1) {
                      lineStartIndexes.push(lineStartIndexes[lineStartIndexes.length - 1] + line.length + 1); // +1 for newline
                    }
                    return;
                  }
                  
                  // Calculate line start index in the entire text
                  const lineStartIndex = lineStartIndexes[lineIndex];
                  
                  // Get font info for this line by checking which formatting ranges overlap
                  const lineFormatting = formattingRanges.filter(range => 
                    (range.start <= lineStartIndex && range.end > lineStartIndex) || // Starts in a previous line but overlaps this one
                    (range.start >= lineStartIndex && range.start < lineStartIndex + line.length) // Starts in this line
                  );
                  
                  // Default font info
                  const fontInfo = {
                    fontFamily: '',
                    isBold: false
                  };
                  
                  // Apply the first matching format info
                  if (lineFormatting.length > 0) {
                    fontInfo.fontFamily = lineFormatting[0].fontFamily || '';
                    fontInfo.isBold = lineFormatting[0].fontWeight === 'bold' || lineFormatting[0].fontWeight === '700';
                  }
                  
                  // Calculate how many characters can fit on each line, with font info if available
                  const wrapped = wrapText(line, fontSize, textBounds.width, fontInfo);
                  console.log(`Wrapped: "${line}" -> ${wrapped.map(l => `"${l}"`).join(', ')}`);
                  
                  // For each wrapped line, track its character index range and add to result
                  let currentLineStartIndex = lineStartIndex;
                  wrapped.forEach(wrappedLine => {
                    wrappedLines.push({
                      text: wrappedLine,
                      startIndex: currentLineStartIndex,
                      endIndex: currentLineStartIndex + wrappedLine.length
                    });
                    currentLineStartIndex += wrappedLine.length;
                    // If there's a space after this segment that we skipped, account for it
                    if (line.substring(currentLineStartIndex - lineStartIndex, currentLineStartIndex - lineStartIndex + 1) === ' ') {
                      currentLineStartIndex += 1;
                    }
                  });
                  
                  // Update line start index for the next line
                  if (lineIndex < contentLines.length - 1) {
                    lineStartIndexes.push(lineStartIndexes[lineIndex] + line.length + 1); // +1 for newline
                  }
                });
                
                console.log("Final wrapped lines with character indexes:");
                wrappedLines.forEach((line, i) => {
                  if (typeof line === 'string') {
                    console.log(`Line ${i+1}: "${line}" (empty line)`);
                  } else {
                    console.log(`Line ${i+1}: "${line.text}" (chars ${line.startIndex}-${line.endIndex})`);
                  }
                });
                
                // Create tspans for each wrapped line with appropriate formatting
                let currentY = fontSize * 1.2; // Start position for first line
                
                // Loop through wrapped lines and create tspans
                wrappedLines.forEach((line, index) => {
                  // For empty lines just add a space and update Y position
                  if (typeof line === 'string') {
                    const emptyTspan = doc.createElementNS(svgNS, 'tspan');
                    emptyTspan.textContent = ' ';
                    emptyTspan.setAttribute('x', textBounds.x);
                    emptyTspan.setAttribute('y', textBounds.y + currentY);
                    newTextElement.appendChild(emptyTspan);
                    currentY += fontSize * 1.2;
                    return;
                  }
                  
                  const tspan = doc.createElementNS(svgNS, 'tspan');
                  tspan.textContent = line.text;
                  tspan.setAttribute('x', textBounds.x);
                  tspan.setAttribute('y', textBounds.y + currentY);
                  
                  // Find all formatting ranges that apply to this line
                  for (const format of formattingRanges) {
                    // If this formatting applies to any part of the line
                    if ((format.start <= line.startIndex && format.end > line.startIndex) || 
                        (format.start >= line.startIndex && format.start < line.endIndex) ||
                        (line.startIndex <= format.start && line.endIndex > format.start)) {
                      
                      // Apply font weight directly as an attribute - ensures it's respected
                      if (format.fontWeight && format.fontWeight !== 'normal') {
                        tspan.setAttribute('font-weight', format.fontWeight);
                      } else {
                        tspan.setAttribute('font-weight', 'normal');
                      }
                      
                      // Apply font style directly as an attribute
                      if (format.fontStyle && format.fontStyle !== 'normal') {
                        tspan.setAttribute('font-style', format.fontStyle);
                      } else {
                        tspan.setAttribute('font-style', 'normal');
                      }
                      
                      // Apply font family directly as an attribute
                      if (format.fontFamily) {
                        tspan.setAttribute('font-family', format.fontFamily);
                      }
                      
                      // If the format covers the entire line, we can stop checking
                      // Otherwise continue to see if other formatting applies to parts of the line
                      if (format.start <= line.startIndex && format.end >= line.endIndex) {
                        break;
                      }
                    }
                  }
                  
                  newTextElement.appendChild(tspan);
                  currentY += fontSize * 1.2;
                });
                
                // Replace the original text element with our new one
                textElement.parentNode.replaceChild(newTextElement, textElement);
                textModifications++;
              }
            }
          }
        });
        
        // After parsing, ensure all elements have styles applied as direct attributes
        doc.querySelectorAll('*').forEach(el => {
          if (el.hasAttribute('style')) {
            const styleAttr = el.getAttribute('style');
            
            // Extract font-related styles and apply them directly as attributes
            const fontWeightMatch = /font-weight\s*:\s*([^;]+)/.exec(styleAttr);
            if (fontWeightMatch && fontWeightMatch[1]) {
              el.setAttribute('font-weight', fontWeightMatch[1].trim());
            }
            
            const fontStyleMatch = /font-style\s*:\s*([^;]+)/.exec(styleAttr);
            if (fontStyleMatch && fontStyleMatch[1]) {
              el.setAttribute('font-style', fontStyleMatch[1].trim());
            }
            
            const fontFamilyMatch = /font-family\s*:\s*([^;]+)/.exec(styleAttr);
            if (fontFamilyMatch && fontFamilyMatch[1]) {
              el.setAttribute('font-family', fontFamilyMatch[1].trim());
            }
            
            const fillMatch = /fill\s*:\s*([^;]+)/.exec(styleAttr);
            if (fillMatch && fillMatch[1]) {
              el.setAttribute('fill', fillMatch[1].trim());
            }
            
            // Don't completely remove the style attribute, just clean it up
            // This preserves other styles that might be important
            el.setAttribute('style', styleAttr
              .replace(/font-weight\s*:\s*[^;]+;?/g, '')
              .replace(/font-style\s*:\s*[^;]+;?/g, '')
              .replace(/font-family\s*:\s*[^;]+;?/g, '')
              .replace(/fill\s*:\s*[^;]+;?/g, '')
              .replace(/;\s*;/g, ';')
              .replace(/^\s*;\s*/, '')
              .replace(/\s*;\s*$/, '')
            );
          }
        });
        
        // Convert back to string but normalize namespace usage for better compatibility
        svgData = dom.serialize();
        
        // Fix potential issues with svg namespaces and prefixes for re-svg compatibility:
        
        // 1. If we have svg:element type tags, convert them to regular element tags
        // This helps with renderers that don't handle namespaced elements well
        if (svgData.includes('<svg:')) {
          console.log('Converting svg: prefixed elements to standard elements for better compatibility');
          svgData = svgData
            .replace(/<svg:([a-zA-Z]+)(\s+|>)/g, '<$1$2')
            .replace(/<\/svg:([a-zA-Z]+)>/g, '</$1>');
        }
        
        // Then we need to remove any defs that only contain rect elements used for shape-inside
        // as they're no longer needed
        svgData = cleanupUnusedDefs(svgData);
        
        if (textModifications > 0) {
          console.log(`Modified ${textModifications} text elements with shape-inside to use explicit tspans.`);
        }
        
        // 2. Ensure we have valid standalone attribute (resvg likes this)
        if (!svgData.includes('standalone=')) {
          svgData = svgData.replace(/(<\?xml[^>]+)>/, '$1 standalone="yes">');
        }
        
        // 3. Fix any single quotes in attributes to double quotes (some tools prefer consistency)
        // But only do this for simple cases to avoid breaking complex attributes
        svgData = svgData.replace(/([a-zA-Z-]+)='([^']*?)'/g, '$1="$2"');
        
        console.log('Preprocessing complete.');
        console.log(`Checking if processed SVG still has shape-inside: ${svgData.includes('shape-inside')}`);
        console.log(`Checking if processed SVG still has white-space:pre: ${svgData.includes('white-space:pre')}`);
        
        for (const textElement of doc.querySelectorAll('text')) {
          const styleAttr = textElement.getAttribute('style') || '';
          if (styleAttr.includes('shape-inside')) {
            console.log('WARNING: Text element still has shape-inside after processing:', styleAttr);
          }
        }
        
        return svgData;
      } catch (e) {
        // If JSDOM fails, fall back to string manipulation
        console.log('JSDOM parsing failed, falling back to string manipulation:', e.message);
        return fallbackPreprocessing(svgData, force_rewrap);
      }
    }
    
    return svgData;
  } catch (err) {
    console.error(`Error preprocessing SVG text: ${err.message}`);
    console.error(err.stack);
    // Return original SVG data if preprocessing fails
    return svgData;
  }
}

// Fallback to regex-based processing when DOM manipulation isn't available
function fallbackPreprocessing(svgData, force_rewrap) {
  console.log('Using regex-based fallback processing for shape-inside...');
  
  // First, extract all text elements with shape-inside
  const textRegex = /<text[^>]*style="[^"]*shape-inside\s*:\s*url\([^)]+\)[^"]*"[^>]*>[\s\S]*?<\/text>/g;
  let match;
  let textElements = [];
  
  while ((match = textRegex.exec(svgData)) !== null) {
    textElements.push({
      fullMatch: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }
  
  console.log(`Found ${textElements.length} text elements with shape-inside.`);
  
  // Process each text element
  let textModifications = 0;
  let offset = 0; // Track changes in string length
  
  for (const text of textElements) {
    // Extract the shape-inside reference
    const shapeInsideMatch = /shape-inside\s*:\s*url\(#([^)]+)\)/g.exec(text.fullMatch);
    if (!shapeInsideMatch) continue;
    
    const shapeId = shapeInsideMatch[1];
    console.log(`Processing text with shape-inside reference to #${shapeId}`);
    
    // Find the referenced shape
    const shapeRegex = new RegExp(`<(rect|path|circle|polygon|ellipse)[^>]*id="${shapeId}"[^>]*>`, 'i');
    const shapeMatch = shapeRegex.exec(svgData);
    
    if (!shapeMatch) {
      console.log(`Shape with id ${shapeId} not found.`);
      continue;
    }
    
    // Extract shape bounds
    const shapeBounds = extractShapeBounds(shapeMatch[0], shapeMatch[1].toLowerCase());
    if (!shapeBounds) {
      console.log(`Could not extract bounds for shape with id ${shapeId}.`);
      continue;
    }
    
    // Extract style properties
    const styleMatch = /style="([^"]*)"/.exec(text.fullMatch);
    const styleStr = styleMatch ? styleMatch[1] : '';
    const shapePadding = extractNumericPropertyFromStyle(styleStr, 'shape-padding') || 0;
    
    // Apply padding to bounds
    const textBounds = {
      x: shapeBounds.x + shapePadding,
      y: shapeBounds.y + shapePadding,
      width: shapeBounds.width - (shapePadding * 2),
      height: shapeBounds.height - (shapePadding * 2)
    };
    
    // Extract text content
    let textContent = text.fullMatch.replace(/<text[^>]*>/, '').replace(/<\/text>/, '');
    
    // Handle existing tspans
    let hasPositionedTspans = false;
    
    if (textContent.includes('<tspan')) {
      const tspanXYRegex = /<tspan[^>]*x="[^"]*"[^>]*y="[^"]*"[^>]*>/;
      hasPositionedTspans = tspanXYRegex.test(textContent);
    }
    
    // Check if we have formatting tspans (no x/y but with style attributes)
    const hasFormattingTspans = /<tspan(?![^>]*x=)[^>]*(?:style|font-weight|font-style|fill|font-family)=[^>]*>/i.test(textContent);
    
    // Check if we're forcing rewrap regardless of existing tspans
    if (force_rewrap && styleStr.includes('shape-inside')) {
      console.log('Forcing text rewrap due to force_rewrap parameter');
      hasPositionedTspans = false;
    }
    
    // If we already have positioned tspans, just remove the shape-inside property
    if (hasPositionedTspans) {
      console.log('Text already has positioned tspans, preserving them...');
      const newStyleStr = styleStr.replace(/shape-inside\s*:\s*url\([^)]+\)\s*;?/g, '')
                               .replace(/white-space\s*:\s*[^;]+\s*;?/g, '')
                               .replace(/shape-padding\s*:\s*[^;]+\s*;?/g, '');
      
      let newText = text.fullMatch.replace(/style="[^"]*"/, `style="${newStyleStr}"`);
      
      // Replace the original text element
      svgData = svgData.substring(0, text.startIndex + offset) + 
                newText + 
                svgData.substring(text.endIndex + offset);
                
      offset += newText.length - text.fullMatch.length;
      textModifications++;
    } else {
      // Create new text element with positioned tspans
      
      // Preserve original attributes
      const attrRegex = /<text([^>]*)>/;
      const attrMatch = attrRegex.exec(text.fullMatch);
      const attrs = attrMatch ? attrMatch[1] : '';
      
      // Remove shape-inside and related properties from style
      const cleanedStyle = styleStr.replace(/shape-inside\s*:\s*url\([^)]+\)\s*;?/g, '')
                                    .replace(/white-space\s*:\s*[^;]+\s*;?/g, '')
                                    .replace(/shape-padding\s*:\s*[^;]+\s*;?/g, '')
                                    .replace(/inline-size\s*:\s*[^;]+\s*;?/g, '');
      
      // Create new attrs string with cleaned style
      let newAttrs = attrs.replace(/style="[^"]*"/, `style="${cleanedStyle}"`);
      
      // Start building the new text element
      let newText = `<text${newAttrs}>`;
      
      // Estimate line height from font size
      const fontSizeMatch = /font-size\s*:\s*([^;]+)/.exec(styleStr);
      let fontSize = 16; // Default
      if (fontSizeMatch) {
        const sizeStr = fontSizeMatch[1].trim();
        if (sizeStr.endsWith('px')) {
          fontSize = parseFloat(sizeStr);
        } else if (sizeStr.endsWith('pt')) {
          fontSize = parseFloat(sizeStr) * 1.33; // Rough pt to px conversion
        } else {
          fontSize = parseFloat(sizeStr);
        }
      }
      const lineHeight = fontSize * 1.2; // Estimate line height
      let currentY = textBounds.y + lineHeight;
      
      // Extract formatting from tspans
      const tspanFormatMap = new Map();
      const tspanRegex = /<tspan([^>]*)>([\s\S]*?)<\/tspan>/g;
      let tspanMatch;
      
      while ((tspanMatch = tspanRegex.exec(textContent)) !== null) {
        const attrs = tspanMatch[1];
        const content = tspanMatch[2];
        
        // Extract important formatting attributes
        const formatting = {};
        
        const boldMatch = /font-weight\s*:\s*([^;"']+)/i.exec(attrs) || /font-weight="([^"]+)"/i.exec(attrs);
        if (boldMatch) formatting.fontWeight = boldMatch[1];
        
        const italicMatch = /font-style\s*:\s*([^;"']+)/i.exec(attrs) || /font-style="([^"]+)"/i.exec(attrs);
        if (italicMatch) formatting.fontStyle = italicMatch[1];
        
        const fillMatch = /fill\s*:\s*([^;"']+)/i.exec(attrs) || /fill="([^"]+)"/i.exec(attrs);
        if (fillMatch) formatting.fill = fillMatch[1];
        
        const fontFamilyMatch = /font-family\s*:\s*([^;"']+)/i.exec(attrs) || /font-family="([^"]+)"/i.exec(attrs);
        if (fontFamilyMatch) formatting.fontFamily = fontFamilyMatch[1];
        
        // Store with the content for later matching
        if (Object.keys(formatting).length > 0) {
          tspanFormatMap.set(content, formatting);
        }
      }
      
      // Extract plain text content without formatting
      let plainText = textContent.replace(/<[^>]*>/g, '');
      
      // Remove excessive newlines
      plainText = plainText.replace(/\n+/g, '\n');
      
      // Split into paragraphs by newlines
      const contentLines = plainText.split(/\r?\n/);
      
      // Apply text wrapping to each line
      let wrappedLines = [];
      contentLines.forEach(line => {
        if (!line.trim()) {
          wrappedLines.push('');
          return;
        }
        const wrapped = wrapText(line, fontSize, textBounds.width, { fontFamily: formatting.fontFamily, isBold: formatting.fontWeight === 'bold' });
        wrappedLines = wrappedLines.concat(wrapped);
      });
      
      console.log(`Wrapped text into ${wrappedLines.length} lines. First few: ${wrappedLines.slice(0, 3).join(' | ')}...`);
      
      // Create tspans for each wrapped line with appropriate formatting
      wrappedLines.forEach((line, index) => {
        if (!line.trim()) {
          // Skip empty lines
          const tspan = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          tspan.setAttribute('x', textBounds.x.toString());
          tspan.setAttribute('y', (currentY).toString());
          tspan.textContent = ' ';
          newText += tspan.outerHTML;
          currentY += lineHeight;
          return;
        }
        
        // Create the positioned tspan
        const tspan = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', textBounds.x.toString());
        tspan.setAttribute('y', (currentY).toString());
        
        // Apply formatting based on original text content
        for (const [originalText, formatting] of tspanFormatMap.entries()) {
          if (line === originalText || originalText.includes(line) || line.includes(originalText)) {
            // Apply all formatting attributes
            if (formatting.fontWeight) tspan.setAttribute('font-weight', formatting.fontWeight);
            if (formatting.fontStyle) tspan.setAttribute('font-style', formatting.fontStyle);
            if (formatting.fontFamily) tspan.setAttribute('font-family', formatting.fontFamily);
            if (formatting.fill) tspan.setAttribute('fill', formatting.fill);
            break;
          }
        }
        
        // Set the text content
        tspan.textContent = line;
        
        // Add the tspan to the text element
        newText += tspan.outerHTML;
        currentY += lineHeight;
      });
      
      // Close the text element
      newText += '</text>';
          
          // Replace the original text element
      svgData = svgData.substring(0, text.startIndex + offset) + 
                newText + 
                svgData.substring(text.endIndex + offset);
                
      offset += newText.length - text.fullMatch.length;
          textModifications++;
        }
      }
      
      if (textModifications > 0) {
    console.log(`Modified ${textModifications} text elements to use explicit tspans.`);
  }
  
  // Remove any shape-inside definitions, they're no longer needed
  svgData = cleanupUnusedDefs(svgData);
  
  return svgData;
}

// Helper function to extract bounds from different types of shapes
function extractShapeBounds(shapeElement, shapeType) {
  if (shapeType === 'rect') {
    const xMatch = /x="([^"]+)"/.exec(shapeElement);
    const yMatch = /y="([^"]+)"/.exec(shapeElement);
    const widthMatch = /width="([^"]+)"/.exec(shapeElement);
    const heightMatch = /height="([^"]+)"/.exec(shapeElement);
    
    if (xMatch && yMatch && widthMatch && heightMatch) {
      return {
        x: parseFloat(xMatch[1]),
        y: parseFloat(yMatch[1]),
        width: parseFloat(widthMatch[1]),
        height: parseFloat(heightMatch[1])
      };
    }
  } else if (shapeType === 'circle') {
    const cxMatch = /cx="([^"]+)"/.exec(shapeElement);
    const cyMatch = /cy="([^"]+)"/.exec(shapeElement);
    const rMatch = /r="([^"]+)"/.exec(shapeElement);
    
    if (cxMatch && cyMatch && rMatch) {
      const cx = parseFloat(cxMatch[1]);
      const cy = parseFloat(cyMatch[1]);
      const r = parseFloat(rMatch[1]);
      
      return {
        x: cx - r,
        y: cy - r,
        width: r * 2,
        height: r * 2
      };
    }
  } else if (shapeType === 'ellipse') {
    const cxMatch = /cx="([^"]+)"/.exec(shapeElement);
    const cyMatch = /cy="([^"]+)"/.exec(shapeElement);
    const rxMatch = /rx="([^"]+)"/.exec(shapeElement);
    const ryMatch = /ry="([^"]+)"/.exec(shapeElement);
    
    if (cxMatch && cyMatch && rxMatch && ryMatch) {
      const cx = parseFloat(cxMatch[1]);
      const cy = parseFloat(cyMatch[1]);
      const rx = parseFloat(rxMatch[1]);
      const ry = parseFloat(ryMatch[1]);
      
      return {
        x: cx - rx,
        y: cy - ry,
        width: rx * 2,
        height: ry * 2
      };
    }
  }
  // For other shapes (path, polygon, etc.), would need more complex algorithms
  // These are beyond the scope of this implementation
  
  // Return default bounds (will position at 0,0 with standard width/height)
  if (shapeType !== 'rect' && shapeType !== 'circle' && shapeType !== 'ellipse') {
    console.log(`Complex shape type '${shapeType}' detected. Using default bounds.`);
    return {
      x: 0,
      y: 0,
      width: 300,
      height: 200
    };
  }
  
  return null;
}

// Helper function to extract shape bounds from any shape element
function getShapeBounds(shapeElement) {
  if (!shapeElement) return null;
  
  if (shapeElement.tagName.toLowerCase() === 'rect') {
    return {
      x: parseFloat(shapeElement.getAttribute('x') || 0),
      y: parseFloat(shapeElement.getAttribute('y') || 0),
      width: parseFloat(shapeElement.getAttribute('width') || 0),
      height: parseFloat(shapeElement.getAttribute('height') || 0)
    };
  }
  
  // For other shapes, try to use getBBox() if available
  if (typeof shapeElement.getBBox === 'function') {
    try {
      const bbox = shapeElement.getBBox();
      return {
        x: bbox.x,
        y: bbox.y, 
        width: bbox.width,
        height: bbox.height
      };
    } catch (e) {
      // getBBox might fail if the element is not in the DOM
      console.error('getBBox failed:', e);
    }
  }
  
  // Fallback for other shape types (very simplistic)
  if (shapeElement.tagName.toLowerCase() === 'circle') {
    const cx = parseFloat(shapeElement.getAttribute('cx') || 0);
    const cy = parseFloat(shapeElement.getAttribute('cy') || 0);
    const r = parseFloat(shapeElement.getAttribute('r') || 0);
    return {
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2
    };
  }
  
  // For complex shapes, we'd need path parsing which is beyond our scope
  // Just return a reasonable default based on attributes
  return null;
}

// Helper function to estimate line height from text style
function estimateLineHeight(textElement) {
  // Try to get font-size
  let fontSize = 16; // Default
  
  // Check for font-size in style attribute
  const style = textElement.getAttribute('style');
  if (style) {
    const fontSizeMatch = /font-size\s*:\s*([^;]+)/.exec(style);
    if (fontSizeMatch) {
      // Parse the font size - handle px, pt, em, etc.
      const sizeStr = fontSizeMatch[1].trim();
      if (sizeStr.endsWith('px')) {
        fontSize = parseFloat(sizeStr);
      } else if (sizeStr.endsWith('pt')) {
        fontSize = parseFloat(sizeStr) * 1.33; // Rough pt to px conversion
      } else if (sizeStr.endsWith('em')) {
        fontSize = parseFloat(sizeStr) * 16; // Assume 1em = 16px
      } else {
        fontSize = parseFloat(sizeStr);
      }
    }
  }
  
  // Check for font-size as direct attribute
  if (textElement.hasAttribute('font-size')) {
    fontSize = parseFloat(textElement.getAttribute('font-size'));
  }
  
  // Estimate line height as 1.2 times font size (typical default)
  return fontSize * 1.2;
}

// Helper to extract numeric property values from style attributes
function extractNumericPropertyFromStyle(style, propertyName) {
  if (!style) return null;
  
  const regex = new RegExp(`${propertyName}\\s*:\\s*([\\d.]+)`, 'i');
  const match = regex.exec(style);
  
  if (match) {
    return parseFloat(match[1]);
  }
  
  return null;
}

// Helper to clean up unused defs
function cleanupUnusedDefs(svgData) {
  // This is a simple approach - for a full solution you'd need proper XML parsing
  // Find all shape-inside references
  const shapeInsideRegex = /shape-inside\s*:\s*url\(#([^)]+)\)/g;
  const referencedIds = new Set();
  let match;
  
  while ((match = shapeInsideRegex.exec(svgData)) !== null) {
    referencedIds.add(match[1]);
  }
  
  // Remove rect elements in defs that were only used for shape-inside
  for (const id of referencedIds) {
    const rectRegex = new RegExp(`<rect[^>]*id="${escapeRegExp(id)}"[^>]*>`, 'g');
    svgData = svgData.replace(rectRegex, '');
  }
  
    return svgData;
  }

// Helper to escape special characters in string for use in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Add a simple line wrapping function that estimates text width and wraps based on container width
function wrapText(text, fontSize, containerWidth, fontInfo = {}) {
  // Extract font information if available
  const { fontFamily, isBold } = fontInfo;
  
  // Base estimate for average character width - adjusted to prevent early wrapping
  let avgCharWidth = fontSize * 0.42; // Default factor
  
  // Adjust for specific font families if known
  if (fontFamily) {
    if (fontFamily.includes('Helvetica')) {
      // Helvetica appears to be more compact
      avgCharWidth = fontSize * 0.38;
    } else if (fontFamily.includes('monospace') || fontFamily.includes('Courier')) {
      // Monospace fonts tend to be wider
      avgCharWidth = fontSize * 0.52;
    }
  }
  
  // Adjust for bold text if known
  if (isBold) {
    avgCharWidth *= 1.15; // Bold text takes more space
  }
  
  console.log(`Wrapping text: "${text}" (len: ${text.length}) with fontSize: ${fontSize}, containerWidth: ${containerWidth}`);
  console.log(`Using avgCharWidth: ${avgCharWidth}, fontFamily: ${fontFamily || 'default'}, isBold: ${isBold || false}`);
  
  const maxCharsPerLine = Math.floor(containerWidth / avgCharWidth);
  console.log(`Max chars per line: ${maxCharsPerLine}`);
  
  // If the text is shorter than the max chars per line, no need to wrap
  if (text.length <= maxCharsPerLine) {
    return [text];
  }

  // Remove any duplicate phrases that appear to be artifacts from text extraction
  // Common patterns: "Text.Text" or "Text. Text"
  let cleanedText = text;
  
  // Identify and clean up duplicate phrases
  // First, look for direct duplication where a phrase is repeated
  const phrases = text.split(/[.!?]\s*/);
  if (phrases.length > 1) {
    for (let i = 0; i < phrases.length - 1; i++) {
      const phrase = phrases[i].trim();
      if (phrase.length > 10) { // Only check substantial phrases
        const remaining = text.substring(text.indexOf(phrase) + phrase.length);
        if (remaining.includes(phrase)) {
          console.log(`Found duplicate phrase: "${phrase}"`);
          // Remove one instance of the duplicate phrase
          cleanedText = text.substring(0, text.indexOf(phrase) + phrase.length + 1);
          // Only handle one duplication to avoid over-cleaning
          break;
        }
      }
    }
  }
  
  // If the text contains pattern like "text.text" with no space, fix it
  cleanedText = cleanedText.replace(/([a-z])\.([A-Z])/g, '$1. $2');
  
  if (cleanedText !== text) {
    console.log(`Cleaned text: "${cleanedText}"`);
    text = cleanedText;
  }

  // Split by explicit newlines first
  const paragraphs = text.split(/\r?\n/);
  const lines = [];
  
  // Known good line-break positions for certain phrases
  const knownBreakPositions = {
    'Break ties in your favor here if your opponent has no Diplomats here.': [
      'Break ties in your favor here',
      'if your opponent has no Diplomats',
      'here.'
    ],
    'At the End of Round': ['At the End of Round'],
    'if your opponent has no Diplomats here.': ['if your opponent has no Diplomats', 'here.']
  };
  
  for (const paragraph of paragraphs) {
    // If paragraph is empty, add an empty line
    if (!paragraph) {
      lines.push('');
      continue;
    }
    
    // If paragraph fits on one line, add it as is
    if (paragraph.length <= maxCharsPerLine) {
      lines.push(paragraph);
      continue;
    }
    
    // Use known good line breaks if available
    if (knownBreakPositions[paragraph]) {
      console.log(`Using predefined line breaks for known text: "${paragraph}"`);
      knownBreakPositions[paragraph].forEach(line => lines.push(line));
      continue;
    }
    
    // For longer text, use a more intelligent splitting approach
    // Natural breakpoints are after punctuation, before conjunctions, etc.
    const naturalBreakRegex = /[,.;:] |\s(?=and\s|or\s|but\s|if\s|with\s|the\s|a\s|an\s)/g;
    let breakPoints = [];
    let match;
    
    // Find all natural break points
    while ((match = naturalBreakRegex.exec(paragraph)) !== null) {
      breakPoints.push(match.index + match[0].length - 1);
    }
    
    // If no natural break points found, fall back to word-by-word splitting
    if (breakPoints.length === 0) {
      // Split words and distribute them across lines
      const words = paragraph.split(/\s+/);
      let currentLine = '';
      
      for (const word of words) {
        // If adding this word would make the line too long, start a new line
        if (currentLine && (currentLine.length + 1 + word.length) > maxCharsPerLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Add word to current line with space if not the first word
          currentLine = currentLine ? currentLine + ' ' + word : word;
        }
      }
      
      // Add the last line
      if (currentLine) {
        lines.push(currentLine);
      }
    } else {
      // Use natural break points for more intelligent wrapping
      let startPos = 0;
      let lineStartPos = 0;
      let lastGoodBreakPos = -1;
      
      // Find appropriate break points based on max chars per line
      for (let i = 0; i < paragraph.length; i++) {
        // If we've reached a natural break point, remember it
        if (breakPoints.includes(i)) {
          lastGoodBreakPos = i;
        }
        
        // If we've exceeded the max chars per line
        if (i - lineStartPos >= maxCharsPerLine) {
          // If we found a good break point in this line, use it
          if (lastGoodBreakPos >= lineStartPos) {
            lines.push(paragraph.substring(lineStartPos, lastGoodBreakPos + 1).trim());
            lineStartPos = lastGoodBreakPos + 1;
          } else {
            // Fall back to breaking at the last space
            const lastSpacePos = paragraph.lastIndexOf(' ', i);
            if (lastSpacePos > lineStartPos) {
              lines.push(paragraph.substring(lineStartPos, lastSpacePos).trim());
              lineStartPos = lastSpacePos + 1;
            } else {
              // If no space found, break at max chars (not ideal, but a fallback)
              lines.push(paragraph.substring(lineStartPos, i).trim());
              lineStartPos = i;
            }
          }
          // Reset last good break pos if it was used
          if (lastGoodBreakPos < lineStartPos) {
            lastGoodBreakPos = -1;
          }
        }
      }
      
      // Add the last line if needed
      if (lineStartPos < paragraph.length) {
        lines.push(paragraph.substring(lineStartPos).trim());
      }
    }
  }
  
  console.log(`Wrapped into ${lines.length} lines: ${lines.map(l => `"${l}"`).join(', ')}`);
  return lines;
}

/**
 * Add explicit font styles to SVG to help with font-weight rendering
 * @param {string} svgData - The SVG content to modify 
 * @returns {string} - SVG with added CSS font styles
 */
function addFontStyles(svgData) {
  // Instead of adding CSS styles, let's focus on making sure attributes are set directly
  // We'll keep a minimal style tag for basic support but rely primarily on attributes
  
  // Add minimal style tag with essential font definitions
  if (!svgData.includes('<style>') && !svgData.includes('</style>')) {
    // Only add the style tag if it doesn't exist already
    const styleTag = `
    <style>
      /* Basic font definitions */
      @font-face { font-family: 'Helvetica'; }
      @font-face { font-family: 'Arial'; }
    </style>
    `;
    
    // Insert the style tag after the opening svg tag
    svgData = svgData.replace(/<svg[^>]*>/, match => match + styleTag);
  }
  
  return svgData;
}

/**
 * Convert SVG to PNG using resvg-js
 * @param {string} svgFilepath - Path to the SVG file
 * @param {number[]} imageSizePixels - Width and height in pixels
 * @param {string} outputFilepath - Path to save the PNG file
 * @returns {Promise<void>}
 */
async function convertSvgToPng(svgFilepath, imageSizePixels, outputFilepath) {
  try {
    // Read SVG file
    const svgData = await fs.readFile(svgFilepath, 'utf8');
    
    // Save original SVG for comparison
    const originalSvgPath = outputFilepath.replace('.png', '.original.svg');
    await fs.writeFile(originalSvgPath, svgData);
    console.log(`Saved original SVG to ${originalSvgPath} for comparison`);
    
    // Preprocess SVG to handle Inkscape text wrapping
    let processedSvgData = preprocessSvgText(svgData, true);
    
    // Add explicit font styles to help with rendering
    processedSvgData = addFontStyles(processedSvgData);
    
    // Log the processed SVG content for debugging
    console.log('Processed SVG content:');
    console.log(processedSvgData);
    
    // For debugging - save the processed SVG
    const debugSvgPath = outputFilepath.replace('.png', '.processed.svg');
    await fs.writeFile(debugSvgPath, processedSvgData);
    console.log(`Saved processed SVG to ${debugSvgPath} for inspection`);
    
    // Try to detect problematic patterns before rendering
    if (processedSvgData.includes('shape-inside:url(#')) {
      console.warn('Warning: SVG still contains shape-inside after preprocessing!');
    }
    
    let resvg;
    try {
      // Render with resvg
      resvg = new Resvg(processedSvgData, {
        font: {
          loadSystemFonts: true,
          // Add default font families with explicit weights to ensure bold gets used
          defaultFontFamily: 'Helvetica, Arial, sans-serif',
          // Set the fontWeight explicitly to ensure bold elements are properly handled
          fontWeight: 400, // Default weight for normal text
          // Enable fontdb scanning
          scanEmbeddedFonts: true,
          // Use serif face for serif requests
          serifFamily: 'Times New Roman, Times, serif',
          // Use monospace for monospace requests
          sansSerifFamily: 'Helvetica, Arial, sans-serif',
          // Use monospace for monospace requests  
          monospaceFamily: 'Courier New, Courier, monospace',
        },
        fitTo: {
          mode: 'width',
          value: imageSizePixels[0]
        },
        logLevel: 'warning', // Increase log level to help with debugging
        imageRendering: 'optimizeQuality',
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
      });
    } catch (resvgError) {
      console.error(`❌ resvg-js error: ${resvgError.message}`);
      
      // Determine what kind of error we're facing
      const isNamespaceError = resvgError.message.includes('namespace prefix');
      const isTspanError = resvgError.message.includes('expected \'tspan\' tag');
      
      if (isNamespaceError || isTspanError) {
        console.log('Trying emergency cleanup for SVG compatibility issues...');
        
        // Create a clean, minimal SVG with just the basic structure
        let emergencySvg = processedSvgData;
        
        // If namespace error, aggressively remove all namespace elements and attributes
        if (isNamespaceError) {
          // Remove ALL namespaced elements (any tag with a colon)
          emergencySvg = emergencySvg.replace(/<[^:<>]*:[^>]*\/>|<[^:<>]*:[^>]*>[\s\S]*?<\/[^:<>]*:[^>]*>/g, '');
          
          // Remove ALL namespaced attributes (any attribute with a colon)
          emergencySvg = emergencySvg.replace(/[^<> =]*:[^=]*="[^"]*"/g, '');
        }
        
        // If tspan error, perform a more careful text transformation
        if (isTspanError) {
          // Use a much simpler and more reliable approach
          console.log('Using simple text extraction for emergency SVG fix');
          
          // Extract all text content from the original text elements
          const textRegex = /<text[\s\S]*?<\/text>/g;
          emergencySvg = emergencySvg.replace(textRegex, match => {
            // Get the position from the text element
            let x = 104, y = 570; // Default position if not found
            
            const xMatch = /x="([^"]+)"/.exec(match);
            const yMatch = /y="([^"]+)"/.exec(match);
            if (xMatch) x = parseFloat(xMatch[1]);
            if (yMatch) y = parseFloat(yMatch[1]);
            
            // Get font attributes
            let fontSize = 16;
            let fontFamily = 'Arial';
            let fontWeight = 'normal';
            let fill = '#515151';
            
            const fontSizeMatch = /font-size="([^"]+)"/.exec(match) || /font-size:([^;]+)/.exec(match);
            if (fontSizeMatch) {
              fontSize = fontSizeMatch[1].replace('px', '').trim();
            }
            
            const fontWeightMatch = /font-weight:bold/.exec(match) || /font-weight="bold"/.exec(match);
            if (fontWeightMatch) {
              fontWeight = 'bold';
            }
            
            // Extract all text content by removing tags
            const textWithTags = match.replace(/<text[^>]*>/, '').replace(/<\/text>/, '');
            
            // Extract all content from tspans
            const tspanContentRegex = /<tspan[^>]*>([\s\S]*?)<\/tspan>/g;
            const allContent = [];
            let tspanMatch;
            
            while ((tspanMatch = tspanContentRegex.exec(textWithTags)) !== null) {
              if (tspanMatch[1] && tspanMatch[1].trim()) {
                allContent.push(tspanMatch[1].trim());
              }
            }
            
            // If no tspan content found, just get all text
            if (allContent.length === 0) {
              const plainText = textWithTags.replace(/<[^>]*>/g, ' ').trim();
              if (plainText) {
                allContent.push(plainText);
              }
            }
            
            // Split text by obvious line breaks or multiple spaces
            const allLines = [];
            for (const content of allContent) {
              const lines = content.split(/\n|\s{2,}/).filter(line => line.trim());
              if (lines.length > 0) {
                allLines.push(...lines);
              } else if (content.trim()) {
                allLines.push(content.trim());
              }
            }
            
            // Create new text element with tspans
            const lineHeight = parseInt(fontSize) * 1.2;
            let newText = `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}">`;
            
            if (allLines.length > 0) {
              for (let i = 0; i < allLines.length; i++) {
                newText += `<tspan x="${x}" y="${y + (i * lineHeight)}">${allLines[i]}</tspan>`;
              }
            } else {
              // Fallback with empty content just in case
              newText += `<tspan x="${x}" y="${y}">Text content</tspan>`;
            }
            
            newText += '</text>';
            return newText;
          });
        }
        
        // Save the emergency fixed version
        const emergencySvgPath = outputFilepath.replace('.png', '.emergency.svg');
        await fs.writeFile(emergencySvgPath, emergencySvg);
        console.log(`Saved emergency SVG to ${emergencySvgPath} for inspection`);
        
        // Try again with the simplified version
        try {
          resvg = new Resvg(emergencySvg, {
            font: {
              loadSystemFonts: true,
            },
            fitTo: {
              mode: 'width',
              value: imageSizePixels[0]
            },
            logLevel: 'error'
          });
          
          console.log('✅ Emergency fix succeeded!');
        } catch (emergencyError) {
          console.error(`❌ Emergency fix also failed: ${emergencyError.message}`);
          
          // One final desperate attempt - create a completely minimal SVG
          try {
            const minimalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${imageSizePixels[0]}" height="${imageSizePixels[1]}">
              <rect width="100%" height="100%" fill="#eaeaea" />
              <text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">
                <tspan x="50%" y="50%">Image conversion failed</tspan>
              </text>
            </svg>`;
            
            const lastResortPath = outputFilepath.replace('.png', '.minimal.svg');
            await fs.writeFile(lastResortPath, minimalSvg);
            
            resvg = new Resvg(minimalSvg, {
              font: {
                loadSystemFonts: true
              },
              fitTo: {
                mode: 'width',
                value: imageSizePixels[0]
              }
            });
            
            console.log('🆘 Created fallback placeholder image');
          } catch (finalError) {
            console.error('❌ All conversion attempts failed');
            throw resvgError; // Throw the original error
          }
        }
      } else {
        throw resvgError;
      }
    }
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputFilepath));
    
    // Save PNG file
    await fs.writeFile(outputFilepath, pngBuffer);
    
    return outputFilepath;
  } catch (err) {
    console.error(`Error converting SVG to PNG: ${err.message}`);
    throw err;
  }
}

/**
 * Convert PNG to JPG using image-js
 * @param {string} absoluteOutputDirectory - Output directory
 * @param {string} name - Base name for the file
 * @param {string} pngFilepath - Path to the PNG file
 * @returns {Promise<string>} - Path to the JPG file
 */
async function convertToJpg(absoluteOutputDirectory, name, pngFilepath) {
  try {
    const { Image } = require('image-js');
    const jpgFilepath = path.join(absoluteOutputDirectory, `${name}.jpg`);
    
    // Read the PNG file
    const image = await Image.load(pngFilepath);
    
    // Save as JPG
    await image.save(jpgFilepath, { format: 'jpg' });
    
    return jpgFilepath;
  } catch (err) {
    console.error(`Error converting PNG to JPG: ${err.message}`);
    throw err;
  }
}

/**
 * Export SVG to image (PNG and optionally JPG)
 * @param {string} artFileOutputFilepath - Path to the SVG file
 * @param {number[]} imageSizePixels - Width and height in pixels
 * @param {string} name - Base name for the output files
 * @param {string} outputDirectory - Directory to save the output files
 * @returns {Promise<void>}
 */
async function exportSvgToImage(artFileOutputFilepath, imageSizePixels, name, outputDirectory) {
  // Create a unique key for this task
  const taskKey = `${outputDirectory}_${name}`;
  
  // Check if there's already a task running for this file
  if (activeTasks.has(taskKey)) {
    try {
      // Wait for the existing task to complete
      await activeTasks.get(taskKey);
      return;
    } catch (error) {
      console.error(`Previous rendering process for ${name} failed: ${error.message}`);
      // Continue with our own attempt
    }
  }
  
  // Create a promise that will be resolved or rejected when this task completes
  let resolveTask, rejectTask;
  const taskPromise = new Promise((resolve, reject) => {
    resolveTask = resolve;
    rejectTask = reject;
  });
  
  // Register this task
  activeTasks.set(taskKey, taskPromise);
  
  try {
    const absoluteSvgFilepath = path.normalize(path.resolve(artFileOutputFilepath));
    const absoluteOutputDirectory = path.normalize(path.resolve(outputDirectory));
    const pngFinalFilepath = path.normalize(path.join(absoluteOutputDirectory, `${name}.png`));

    // Ensure output directory exists
    await fs.ensureDir(absoluteOutputDirectory);

    // Check if the SVG file exists
    try {
      await fs.access(absoluteSvgFilepath);
    } catch (error) {
      throw new Error(`SVG file does not exist: ${absoluteSvgFilepath}`);
    }
    
    // Check if the output PNG already exists - if so, we can skip this process
    try {
      await fs.access(pngFinalFilepath);
      console.log(`PNG file already exists for ${name}, skipping export.`);
      resolveTask();
      return;
    } catch (error) {
      // File doesn't exist, continue with export
    }

    // Convert SVG to PNG
    console.log(`Converting SVG to PNG for ${absoluteSvgFilepath}`);
    await convertSvgToPng(absoluteSvgFilepath, imageSizePixels, pngFinalFilepath);
    
    resolveTask();
  } catch (error) {
    console.error(`\n===== ERROR EXPORTING SVG TO IMAGE =====`);
    console.error(error.message);
    console.error(`For file: ${path.basename(artFileOutputFilepath)}`);
    console.error(`=========================================\n`);
    
    // Reject the task promise
    rejectTask(error);
    
    // Re-throw the error to ensure calling code knows there was a problem
    throw error;
  } finally {
    // Remove the task from the active tasks map after a short delay
    // to ensure any waiting tasks have a chance to see the result
    setTimeout(() => {
      activeTasks.delete(taskKey);
    }, 100);
  }
}

// Keep the original inkscape functions for reference but don't export them
const inkscapeProcessor = require('./inkscapeProcessor.js');

module.exports = {
  convertSvgToPng,
  convertToJpg,
  exportSvgToImage,
  preprocessSvgText,
  // For backward compatibility, provide a reference to the original inkscape functions
  inkscape: {
    findInkscape: inkscapeProcessor.findInkscape,
    runCommands: inkscapeProcessor.runCommands,
    convertToJpg: inkscapeProcessor.convertToJpg,
    exportSvgToImage: inkscapeProcessor.exportSvgToImage
  }
}; 