const { JSDOM } = require('jsdom');
const path = require('path');
const { SvgFileCache } = require('../caching/svgFileCache.js');
const CLIPPING_ELEMENT_ID = "clipping";

function calculatePathBoundingBox(pathData) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let currentX = 0, currentY = 0;
    let startX = 0, startY = 0; // Track start point for closepath
    let prevX = 0, prevY = 0; // For smooth curve calculations
    let prevQx = 0, prevQy = 0; // For smooth quadratic curve calculations
    
    // Split path into commands and coordinates
    const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g);
    if (!commands) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    function updateBounds(x, y) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }
    
    for (const command of commands) {
        const cmd = command.charAt(0);
        const coords = command.slice(1).trim().split(/[\s,]+/).filter(s => s).map(parseFloat);
        
        switch (cmd.toLowerCase()) {
            case 'm': // Move to
                if (coords.length >= 2) {
                    // Handle the first coordinate pair as a move
                    if (cmd === 'M') {
                        // Absolute move
                        currentX = coords[0];
                        currentY = coords[1];
                    } else {
                        // Relative move
                        currentX += coords[0];
                        currentY += coords[1];
                    }
                    startX = currentX;
                    startY = currentY;
                    updateBounds(currentX, currentY);
                    
                    // Handle any additional coordinate pairs as implicit line commands
                    for (let i = 2; i < coords.length; i += 2) {
                        if (i + 1 < coords.length) {
                            if (cmd === 'M') {
                                // Absolute line (implicit L)
                                currentX = coords[i];
                                currentY = coords[i + 1];
                            } else {
                                // Relative line (implicit l)
                                currentX += coords[i];
                                currentY += coords[i + 1];
                            }
                            updateBounds(currentX, currentY);
                        }
                    }
                }
                break;
                
            case 'l': // Line to
                for (let i = 0; i < coords.length; i += 2) {
                    if (i + 1 < coords.length) {
                        if (cmd === 'L') {
                            // Absolute line
                            currentX = coords[i];
                            currentY = coords[i + 1];
                        } else {
                            // Relative line
                            currentX += coords[i];
                            currentY += coords[i + 1];
                        }
                        updateBounds(currentX, currentY);
                    }
                }
                break;
                
            case 'c': // Cubic curve
                for (let i = 0; i < coords.length; i += 6) {
                    if (i + 5 < coords.length) {
                        let x1, y1, x2, y2, x3, y3;
                        if (cmd === 'C') {
                            // Absolute curve
                            x1 = coords[i];
                            y1 = coords[i + 1];
                            x2 = coords[i + 2];
                            y2 = coords[i + 3];
                            x3 = coords[i + 4];
                            y3 = coords[i + 5];
                        } else {
                            // Relative curve
                            x1 = currentX + coords[i];
                            y1 = currentY + coords[i + 1];
                            x2 = currentX + coords[i + 2];
                            y2 = currentY + coords[i + 3];
                            x3 = currentX + coords[i + 4];
                            y3 = currentY + coords[i + 5];
                        }
                        
                        // Include all control points and end point in bounds
                        updateBounds(x1, y1);
                        updateBounds(x2, y2);
                        updateBounds(x3, y3);
                        
                        // Update current position and previous control point
                        currentX = x3;
                        currentY = y3;
                        prevX = x2;
                        prevY = y2;
                    }
                }
                break;
                
            case 's': // Smooth curveto
                for (let i = 0; i < coords.length; i += 4) {
                    if (i + 3 < coords.length) {
                        let x1, y1, x2, y2, x3, y3;
                        
                        // For smooth curves, first control point is reflection of previous second control point
                        x1 = 2 * currentX - prevX;
                        y1 = 2 * currentY - prevY;
                        
                        if (cmd === 'S') {
                            // Absolute smooth curve
                            x2 = coords[i];
                            y2 = coords[i + 1];
                            x3 = coords[i + 2];
                            y3 = coords[i + 3];
                        } else {
                            // Relative smooth curve
                            x2 = currentX + coords[i];
                            y2 = currentY + coords[i + 1];
                            x3 = currentX + coords[i + 2];
                            y3 = currentY + coords[i + 3];
                        }
                        
                        updateBounds(x1, y1);
                        updateBounds(x2, y2);
                        updateBounds(x3, y3);
                        
                        // Update current position and previous control point
                        currentX = x3;
                        currentY = y3;
                        prevX = x2;
                        prevY = y2;
                    }
                }
                break;
                
            case 'q': // Quadratic Bézier curve
                for (let i = 0; i < coords.length; i += 4) {
                    if (i + 3 < coords.length) {
                        let x1, y1, x2, y2;
                        if (cmd === 'Q') {
                            // Absolute quadratic curve
                            x1 = coords[i];
                            y1 = coords[i + 1];
                            x2 = coords[i + 2];
                            y2 = coords[i + 3];
                        } else {
                            // Relative quadratic curve
                            x1 = currentX + coords[i];
                            y1 = currentY + coords[i + 1];
                            x2 = currentX + coords[i + 2];
                            y2 = currentY + coords[i + 3];
                        }
                        
                        updateBounds(x1, y1);
                        updateBounds(x2, y2);
                        
                        // Update current position and previous control point
                        currentX = x2;
                        currentY = y2;
                        prevQx = x1;
                        prevQy = y1;
                    }
                }
                break;
                
            case 't': // Smooth quadratic Bézier curveto
                for (let i = 0; i < coords.length; i += 2) {
                    if (i + 1 < coords.length) {
                        let x1, y1, x2, y2;
                        
                        // For smooth quadratic curves, control point is reflection of previous control point
                        x1 = 2 * currentX - prevQx;
                        y1 = 2 * currentY - prevQy;
                        
                        if (cmd === 'T') {
                            // Absolute smooth quadratic curve
                            x2 = coords[i];
                            y2 = coords[i + 1];
                        } else {
                            // Relative smooth quadratic curve
                            x2 = currentX + coords[i];
                            y2 = currentY + coords[i + 1];
                        }
                        
                        updateBounds(x1, y1);
                        updateBounds(x2, y2);
                        
                        // Update current position and previous control point
                        currentX = x2;
                        currentY = y2;
                        prevQx = x1;
                        prevQy = y1;
                    }
                }
                break;
                
            case 'a': // Elliptical arc
                for (let i = 0; i < coords.length; i += 7) {
                    if (i + 6 < coords.length) {
                        const rx = Math.abs(coords[i]);
                        const ry = Math.abs(coords[i + 1]);
                        const xAxisRotation = coords[i + 2];
                        const largeArcFlag = coords[i + 3];
                        const sweepFlag = coords[i + 4];
                        let x2, y2;
                        
                        if (cmd === 'A') {
                            // Absolute arc
                            x2 = coords[i + 5];
                            y2 = coords[i + 6];
                        } else {
                            // Relative arc
                            x2 = currentX + coords[i + 5];
                            y2 = currentY + coords[i + 6];
                        }
                        
                        // For elliptical arcs, we need to calculate the bounding box more accurately
                        // This is a simplified approach that includes the start point, end point, and control points
                        // A more accurate calculation would require solving the elliptical arc equations
                        updateBounds(currentX, currentY);
                        updateBounds(x2, y2);
                        
                        // Include the control points based on the arc parameters
                        // This is an approximation - the actual control points would be calculated differently
                        const centerX = (currentX + x2) / 2;
                        const centerY = (currentY + y2) / 2;
                        updateBounds(centerX - rx, centerY - ry);
                        updateBounds(centerX + rx, centerY + ry);
                        
                        currentX = x2;
                        currentY = y2;
                    }
                }
                break;
                
            case 'h': // Horizontal line
                for (const coord of coords) {
                    if (cmd === 'H') {
                        currentX = coord;
                    } else {
                        currentX += coord;
                    }
                    updateBounds(currentX, currentY);
                }
                break;
                
            case 'v': // Vertical line
                for (const coord of coords) {
                    if (cmd === 'V') {
                        currentY = coord;
                    } else {
                        currentY += coord;
                    }
                    updateBounds(currentX, currentY);
                }
                break;
                
            case 'z': // Close path
                // Close the path by moving to the start point
                currentX = startX;
                currentY = startY;
                updateBounds(currentX, currentY);
                break;
                
            default:
                // For any other commands, extract coordinate pairs
                for (let i = 0; i < coords.length; i += 2) {
                    if (i + 1 < coords.length) {
                        if (cmd === cmd.toUpperCase()) {
                            // Absolute
                            currentX = coords[i];
                            currentY = coords[i + 1];
                        } else {
                            // Relative
                            currentX += coords[i];
                            currentY += coords[i + 1];
                        }
                        updateBounds(currentX, currentY);
                    }
                }
        }
    }
    
    if (minX === Infinity) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}


// Create a default cache instance for backward compatibility
const defaultSvgFileCache = new SvgFileCache();

// Takes an svg file and clips the visibility of its contents to the bounds of the clipSvgElementId
async function clipSvgFileToClipFile(svgFilepath, clipSvgFilepath, clipSvgElementId=CLIPPING_ELEMENT_ID, svgFileCache=defaultSvgFileCache, isClippingBorder=true) {
    if (!svgFilepath) {
        console.log(`!!! SVG file path is required.`);
        throw new Error(`!!! SVG file path is required.`);
    }
    if (!clipSvgFilepath) {
        console.log(`!!! Clip SVG file path is required.`);
        throw new Error(`!!! Clip SVG file path is required.`);
    }
    let svgContent;
    try {
        svgContent = await svgFileCache.readSvgFile(svgFilepath);
    } catch (error) {
        if (error.message.includes("ENOENT")) {
            const shortPath = path.basename(path.dirname(svgFilepath)) + path.sep + path.basename(svgFilepath);
            console.log(`!!! SVG file ${shortPath} does not exist.`);
            return false;
        } else {
            throw error;
        }
    }
    if (!svgContent) {
        console.log(`!!! SVG file ${svgFilepath} is missing.`);
        return false;
    }
    let clipSvgContent;
    try {
        clipSvgContent = await svgFileCache.readSvgFile(clipSvgFilepath);
    } catch (error) {
        if (error.message.includes("ENOENT")) {
            const shortPath = path.basename(path.dirname(clipSvgFilepath)) + path.sep + path.basename(clipSvgFilepath);
            console.log(`!!! Clip SVG file ${shortPath} does not exist.`);
            return false;
        } else {
            throw error;
        }
    }

    return clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId, isClippingBorder);
}

// Clips SVG content using another SVG's element as a clipping path
async function clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId=CLIPPING_ELEMENT_ID, isClippingBorder=true) {
    if (!svgContent) {
        console.log(`!!! Invalid source SVG content provided for clipping.`);
        return svgContent;
    }
    
    if (!clipSvgContent) {
        console.log(`!!! Invalid clip SVG content provided for clipping.`);
        return svgContent;
    }
    
    try {
        // Parse SVGs using JSDOM
        const svgDom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
        const clipDom = new JSDOM(clipSvgContent, { contentType: "image/svg+xml" });
        
        const svgDoc = svgDom.window.document;
        const clipDoc = clipDom.window.document;
        
        // Find the clipping element
        const clipElement = clipDoc.getElementById(clipSvgElementId);
        
        if (!clipElement) {
            console.log(`Could not find element with id "${clipSvgElementId}" in clip SVG.`);
            return svgContent;
        }
        
        // Get the root SVG element - handle both namespaced and non-namespaced elements
        let svgRoot = svgDoc.querySelector('svg') || svgDoc.querySelector('svg\\:svg');
        let clipRoot = clipDoc.querySelector('svg') || clipDoc.querySelector('svg\\:svg');
        
        // If still not found, try getElementsByTagName which handles namespaces better
        if (!svgRoot) {
            const svgElements = svgDoc.getElementsByTagName('svg');
            if (svgElements.length > 0) {
                svgRoot = svgElements[0];
            }
        }
        
        if (!clipRoot) {
            const clipElements = clipDoc.getElementsByTagName('svg');
            if (clipElements.length > 0) {
                clipRoot = clipElements[0];
            }
        }
        
        if (!svgRoot) {
            console.log(`Could not find SVG root element in source file.`);
            return svgContent;
        }
        
        if (!clipRoot) {
            console.log(`Could not find SVG root element in clip file.`);
            return svgContent;
        }
        
        // Get dimensions from source SVG
        const svgWidth = svgRoot.getAttribute('width') || svgRoot.getAttribute('viewBox')?.split(' ')[2];
        const svgHeight = svgRoot.getAttribute('height') || svgRoot.getAttribute('viewBox')?.split(' ')[3];
        
        // Get dimensions from clip SVG
        const clipWidth = clipRoot.getAttribute('width') || clipRoot.getAttribute('viewBox')?.split(' ')[2];
        const clipHeight = clipRoot.getAttribute('height') || clipRoot.getAttribute('viewBox')?.split(' ')[3];
        
        if (svgWidth && svgHeight && clipWidth && clipHeight) {
            // Calculate scale factors
            const scaleX = parseFloat(svgWidth) / parseFloat(clipWidth);
            const scaleY = parseFloat(svgHeight) / parseFloat(clipHeight);
            
            // Apply scaling to the clip element
            clipElement.setAttribute('transform', `scale(${scaleX}, ${scaleY})`);
        }
        
        // Create defs element if it doesn't exist
        let defs = svgRoot.querySelector('defs');
        if (!defs) {
            defs = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgRoot.insertBefore(defs, svgRoot.firstChild);
        }
        
        // Create clipPath element
        const clipPath = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'clipPath');
        
        // Import the clip element into the current document
        const importedClipElement = svgDoc.importNode(clipElement, true);
        clipPath.appendChild(importedClipElement);
        defs.appendChild(clipPath);
        
        // Create a group to hold all content with the clip path applied
        const contentGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
        if (isClippingBorder) {
            contentGroup.setAttribute('clip-path', 'url(#clipPath)');
        }
        
        // Move all direct children of the SVG (except defs) into the new group
        const childNodes = Array.from(svgRoot.childNodes);
        for (const child of childNodes) {
            if (child !== defs && child.nodeName !== 'defs') {
                contentGroup.appendChild(child);
            }
        }
        
        // Add the group back to the SVG
        svgRoot.appendChild(contentGroup);
        
        // Serialize the modified SVG
        const serializer = new svgDom.window.XMLSerializer();
        const modifiedSvg = serializer.serializeToString(svgDoc);        
        return modifiedSvg;
    } catch (error) {
        console.log(`Error clipping SVG: ${error.message}`);
        return svgContent;
    }
}

async function clipSvgContentToClipFile(document, clipSvgFilepath, clipSvgElementId=CLIPPING_ELEMENT_ID, svgFileCache=defaultSvgFileCache, isClippingBorder=true) {
    if (!document) {
        throw new Error("Document cannot be null");
    }
    if (!clipSvgFilepath) {
        throw new Error("Clip SVG file path is required");
    }
    
    let clipSvgContent;
    try {
        clipSvgContent = await svgFileCache.readSvgFile(clipSvgFilepath);
    } catch (error) {
        if (error.message.includes("ENOENT")) {
            const shortPath = path.basename(path.dirname(clipSvgFilepath)) + path.sep + path.basename(clipSvgFilepath);
            console.log(`!!! Clip SVG file ${shortPath} does not exist.`);
            throw new Error(`!!! Clip SVG file ${shortPath} does not exist.`);
        } else {
            throw error;
        }
    }
    
    return await clipSvgDomToElement(document, clipSvgContent, clipSvgElementId, isClippingBorder);
}

/**
 * Clip SVG DOM document using another SVG's element as a clipping path (DOM-based version)
 * @param {Document} document - Main SVG DOM document
 * @param {string} clipSvgContent - Clip SVG content
 * @param {string} clipSvgElementId - ID of clipping element
 * @returns {Promise<void>}
 */
async function clipSvgDomToElement(document, clipSvgContent, clipSvgElementId=CLIPPING_ELEMENT_ID, isClippingBorder=true) {
    if (!document) {
        console.log(`!!! Invalid source SVG document provided for clipping.`);
        return;
    }
    
    if (!clipSvgContent) {
        console.log(`!!! Invalid clip SVG content provided for clipping.`);
        return;
    }
    
    try {
        // Parse clip SVG using JSDOM to match main document
        const clipJsdom = new JSDOM(clipSvgContent, { contentType: "image/svg+xml" });
        const clipDoc = clipJsdom.window.document;
        
        // Find the clipping element
        const clipElement = clipDoc.getElementById(clipSvgElementId);
        
        if (!clipElement) {
            console.log(`Could not find element with id "${clipSvgElementId}" in clip SVG.`);
            return;
        }
        
        const svgRoot = document.documentElement || 
                document.querySelector('svg') || 
                document.querySelector('svg\\:svg');
        const clipRoot = clipDoc.documentElement;
        
        if (!svgRoot) {
            console.log(`Could not find SVG root element in source document.`);
            return;
        }
        
        if (!clipRoot) {
            console.log(`Could not find SVG root element in clip document.`);
            return;
        }
        
        // Get dimensions from source SVG
        const svgWidth = svgRoot.getAttribute('width') || svgRoot.getAttribute('viewBox')?.split(' ')[2];
        const svgHeight = svgRoot.getAttribute('height') || svgRoot.getAttribute('viewBox')?.split(' ')[3];
        
        // Get dimensions from clip SVG
        const clipWidth = clipRoot.getAttribute('width') || clipRoot.getAttribute('viewBox')?.split(' ')[2];
        const clipHeight = clipRoot.getAttribute('height') || clipRoot.getAttribute('viewBox')?.split(' ')[3];
        
        // Calculate clipping element's bounding box and position
        let clipBox = { x: 0, y: 0, width: 0, height: 0 };
        const tagName = clipElement.tagName.toLowerCase();
        
        if (tagName === 'rect') {
            clipBox.x = parseFloat(clipElement.getAttribute('x') || 0);
            clipBox.y = parseFloat(clipElement.getAttribute('y') || 0);
            clipBox.width = parseFloat(clipElement.getAttribute('width'));
            clipBox.height = parseFloat(clipElement.getAttribute('height'));
        } else if (tagName === 'path') {
            const pathData = clipElement.getAttribute('d');
            if (pathData) {
                clipBox = calculatePathBoundingBox(pathData);
            }
        } else if (tagName === 'circle') {
            const cx = parseFloat(clipElement.getAttribute('cx') || 0);
            const cy = parseFloat(clipElement.getAttribute('cy') || 0);
            const radius = parseFloat(clipElement.getAttribute('r'));
            clipBox.x = cx - radius;
            clipBox.y = cy - radius;
            clipBox.width = radius * 2;
            clipBox.height = radius * 2;
        } else if (tagName === 'ellipse') {
            const cx = parseFloat(clipElement.getAttribute('cx') || 0);
            const cy = parseFloat(clipElement.getAttribute('cy') || 0);
            const rx = parseFloat(clipElement.getAttribute('rx'));
            const ry = parseFloat(clipElement.getAttribute('ry'));
            clipBox.x = cx - rx;
            clipBox.y = cy - ry;
            clipBox.width = rx * 2;
            clipBox.height = ry * 2;
        }
        
        if (svgWidth && svgHeight && clipWidth && clipHeight) {
            // Calculate scale factors for initial clip scaling
            const scaleX = parseFloat(svgWidth) / parseFloat(clipWidth);
            const scaleY = parseFloat(svgHeight) / parseFloat(clipHeight);
            
            // Apply scaling to the clip element
            clipElement.setAttribute('transform', `scale(${scaleX}, ${scaleY})`);
            
            // Update clipBox with scaled values
            clipBox.x *= scaleX;
            clipBox.y *= scaleY;
            clipBox.width *= scaleX;
            clipBox.height *= scaleY;
        }
        
        // Calculate scaling ratios to make clipped content fill the entire area
        const widthRatio = parseFloat(svgWidth) / clipBox.width;
        const heightRatio = parseFloat(svgHeight) / clipBox.height;
        
        // Use the smaller ratio to maintain aspect ratio
        const scaleRatio = Math.min(widthRatio, heightRatio);
        
        // Calculate the scaled dimensions
        const scaledWidth = clipBox.width * scaleRatio;
        const scaledHeight = clipBox.height * scaleRatio;
        
        // Calculate centering offsets
        const centerX = (parseFloat(svgWidth) - scaledWidth) / 2;
        const centerY = (parseFloat(svgHeight) - scaledHeight) / 2;
        
        // Create defs element if it doesn't exist
        let defs = svgRoot.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgRoot.insertBefore(defs, svgRoot.firstChild);
        }
        
        // Create clipPath element
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'clipPath');
        
        // Import the clip element into the current document
        const importedClipElement = document.importNode(clipElement, true);
        clipPath.appendChild(importedClipElement);
        defs.appendChild(clipPath);
        
        // Create a group to hold all content with the clip path applied
        const contentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        if (isClippingBorder) {
            contentGroup.setAttribute('clip-path', 'url(#clipPath)');
        }
        
        // Apply scaling, translation, and centering
        const transform = `translate(${centerX - clipBox.x * scaleRatio}, ${centerY - clipBox.y * scaleRatio}) scale(${scaleRatio}, ${scaleRatio})`;
        contentGroup.setAttribute('transform', transform);
        
        // Move all direct children of the SVG (except defs) into the new group
        const childNodes = Array.from(svgRoot.childNodes);
        for (const child of childNodes) {
            if (child !== defs && child.nodeName !== 'defs') {
                contentGroup.appendChild(child);
            }
        }
        
        // Add the group back to the SVG
        svgRoot.appendChild(contentGroup);
        
    } catch (error) {
        console.log(`Error clipping SVG DOM: ${error.message}`);
    }
}

/**
 * Clip and scale SVG content using another SVG's element as a clipping path, 
 * scaling the clipped content to fit the entire SVG bounds while maintaining aspect ratio
 * @param {string} svgContent - Source SVG content
 * @param {string} clipSvgContent - Clip SVG content
 * @param {string} clipSvgElementId - ID of clipping element
 * @returns {Promise<string>} Modified SVG content
 */
async function clipAndScaleSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId=CLIPPING_ELEMENT_ID, isClippingBorder=true) {
    if (!svgContent) {
        console.log(`!!! Invalid source SVG content provided for clipping and scaling.`);
        return svgContent;
    }
    
    if (!clipSvgContent) {
        console.log(`!!! Invalid clip SVG content provided for clipping and scaling.`);
        return svgContent;
    }
    
    try {
        // Parse SVGs using JSDOM
        const svgDom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
        const clipDom = new JSDOM(clipSvgContent, { contentType: "image/svg+xml" });
        
        const svgDoc = svgDom.window.document;
        const clipDoc = clipDom.window.document;
        
        // Find the clipping element
        const clipElement = clipDoc.getElementById(clipSvgElementId);
        
        if (!clipElement) {
            console.log(`Could not find element with id "${clipSvgElementId}" in clip SVG.`);
            return svgContent;
        }
        
        // Get the root SVG element - handle both namespaced and non-namespaced elements
        let svgRoot = svgDoc.querySelector('svg') || svgDoc.querySelector('svg\\:svg');
        let clipRoot = clipDoc.querySelector('svg') || clipDoc.querySelector('svg\\:svg');
        
        // If still not found, try getElementsByTagName which handles namespaces better
        if (!svgRoot) {
            const svgElements = svgDoc.getElementsByTagName('svg');
            if (svgElements.length > 0) {
                svgRoot = svgElements[0];
            }
        }
        
        if (!clipRoot) {
            const clipElements = clipDoc.getElementsByTagName('svg');
            if (clipElements.length > 0) {
                clipRoot = clipElements[0];
            }
        }
        
        if (!svgRoot) {
            console.log(`Could not find SVG root element in source file.`);
            return svgContent;
        }
        
        if (!clipRoot) {
            console.log(`Could not find SVG root element in clip file.`);
            return svgContent;
        }
        
        // Get dimensions from source SVG
        const svgWidth = svgRoot.getAttribute('width') || svgRoot.getAttribute('viewBox')?.split(' ')[2];
        const svgHeight = svgRoot.getAttribute('height') || svgRoot.getAttribute('viewBox')?.split(' ')[3];
        
        // Get dimensions from clip SVG
        const clipWidth = clipRoot.getAttribute('width') || clipRoot.getAttribute('viewBox')?.split(' ')[2];
        const clipHeight = clipRoot.getAttribute('height') || clipRoot.getAttribute('viewBox')?.split(' ')[3];
        
        // Calculate clipping element's bounding box and position
        let clipBox = { x: 0, y: 0, width: 0, height: 0 };
        const tagName = clipElement.tagName.toLowerCase();
        
        if (tagName === 'rect') {
            clipBox.x = parseFloat(clipElement.getAttribute('x') || 0);
            clipBox.y = parseFloat(clipElement.getAttribute('y') || 0);
            clipBox.width = parseFloat(clipElement.getAttribute('width'));
            clipBox.height = parseFloat(clipElement.getAttribute('height'));
        } else if (tagName === 'path') {
            const pathData = clipElement.getAttribute('d');
            if (pathData) {
                clipBox = calculatePathBoundingBox(pathData);
            }
        } else if (tagName === 'circle') {
            const cx = parseFloat(clipElement.getAttribute('cx') || 0);
            const cy = parseFloat(clipElement.getAttribute('cy') || 0);
            const radius = parseFloat(clipElement.getAttribute('r'));
            clipBox.x = cx - radius;
            clipBox.y = cy - radius;
            clipBox.width = radius * 2;
            clipBox.height = radius * 2;
        } else if (tagName === 'ellipse') {
            const cx = parseFloat(clipElement.getAttribute('cx') || 0);
            const cy = parseFloat(clipElement.getAttribute('cy') || 0);
            const rx = parseFloat(clipElement.getAttribute('rx'));
            const ry = parseFloat(clipElement.getAttribute('ry'));
            clipBox.x = cx - rx;
            clipBox.y = cy - ry;
            clipBox.width = rx * 2;
            clipBox.height = ry * 2;
        }
        
        if (svgWidth && svgHeight && clipWidth && clipHeight) {
            // Calculate scale factors for initial clip scaling
            const scaleX = parseFloat(svgWidth) / parseFloat(clipWidth);
            const scaleY = parseFloat(svgHeight) / parseFloat(clipHeight);
            
            // Apply scaling to the clip element
            clipElement.setAttribute('transform', `scale(${scaleX}, ${scaleY})`);
            
            // Update clipBox with scaled values
            clipBox.x *= scaleX;
            clipBox.y *= scaleY;
            clipBox.width *= scaleX;
            clipBox.height *= scaleY;
        }                
        
        // Create defs element if it doesn't exist
        let defs = svgRoot.querySelector('defs');
        if (!defs) {
            defs = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgRoot.insertBefore(defs, svgRoot.firstChild);
        }
        
        // Create clipPath element
        const clipPath = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'clipPath');
        
        // Import the clip element into the current document
        const importedClipElement = svgDoc.importNode(clipElement, true);
        clipPath.appendChild(importedClipElement);
        defs.appendChild(clipPath);
        
        // Create a group to hold all content with the clip path applied
        const contentGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
        if (isClippingBorder) {
            contentGroup.setAttribute('clip-path', 'url(#clipPath)');
        }
        
        // Apply scaling, translation, and centering
        const transform = `translate(${-clipBox.x}, ${-clipBox.y})`;
        contentGroup.setAttribute('transform', transform);
        const outputDimensions = [clipBox.width, clipBox.height];
        svgRoot.setAttribute('width', outputDimensions[0].toString());
        svgRoot.setAttribute('height', outputDimensions[1].toString());
        svgRoot.setAttribute('viewBox', `0 0 ${outputDimensions[0]} ${outputDimensions[1]}`);
        const childNodes = Array.from(svgRoot.childNodes);
        for (const child of childNodes) {
            if (child !== defs && child.nodeName !== 'defs') {
                contentGroup.appendChild(child);
            }
        }
        
        // Add the group back to the SVG
        svgRoot.appendChild(contentGroup);
        
        // Serialize the modified SVG
        const serializer = new svgDom.window.XMLSerializer();
        const modifiedSvg = serializer.serializeToString(svgDoc);        
        return modifiedSvg;
    } catch (error) {
        console.log(`Error clipping and scaling SVG: ${error.message}`);
        return svgContent;
    }
}

module.exports = {
    CLIPPING_ELEMENT_ID,
    clipSvgFileToClipFile,
    clipSvgContentToElement,
    clipSvgContentToClipFile,
    clipSvgDomToElement,
    clipAndScaleSvgContentToElement,
    calculatePathBoundingBox,
}