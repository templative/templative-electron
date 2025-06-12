const { readFile } = require('fs/promises');
const { join } = require('path');
const { DOMParser } = require('@xmldom/xmldom');
const { COMPONENT_INFO } = require('../../../../../shared/componentInfo.js');
const { captureException } = require("../../sentryElectronWrapper.js");

// Constants for element IDs to look for in SVG templates
const ACTUAL_SIZE_ELEMENT_ID = "actualSize";
const CLIPPING_ELEMENT_ID = "clipping";

/**
 * Calculate bounding box for a path element by properly processing path commands
 * @param {string} pathData - The path 'd' attribute
 * @returns {{x: number, y: number, width: number, height: number}} Bounding box
 */
function calculatePathBoundingBox(pathData) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let currentX = 0, currentY = 0;
    
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
                    if (cmd === 'M') {
                        // Absolute move
                        currentX = coords[0];
                        currentY = coords[1];
                    } else {
                        // Relative move
                        currentX += coords[0];
                        currentY += coords[1];
                    }
                    updateBounds(currentX, currentY);
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
                            currentX = x3;
                            currentY = y3;
                        } else {
                            // Relative curve
                            x1 = currentX + coords[i];
                            y1 = currentY + coords[i + 1];
                            x2 = currentX + coords[i + 2];
                            y2 = currentY + coords[i + 3];
                            x3 = currentX + coords[i + 4];
                            y3 = currentY + coords[i + 5];
                            currentX = x3;
                            currentY = y3;
                        }
                        // Include all control points and end point in bounds
                        updateBounds(x1, y1);
                        updateBounds(x2, y2);
                        updateBounds(x3, y3);
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
                // No coordinates to process
                break;
                
            default:
                // For other commands (a, q, s, t), extract coordinate pairs
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

/**
 * Calculate scaling ratio from SVG template clipping element
 * @param {string} componentType - The component type
 * @returns {Promise<{widthRatio: number, heightRatio: number}>} Scaling ratios
 */
async function getTemplateScalingRatio(componentType) {
    try {
        const componentInfo = COMPONENT_INFO[componentType];
        if (!componentInfo || !componentInfo.TemplateFiles || componentInfo.TemplateFiles.length === 0) {
            // console.log(`No template file found for ${componentType}, using default scaling`);
            return { widthRatio: 1, heightRatio: 1 };
        }
        const sizePixels = componentInfo.DimensionsPixels ;
        const sizeInches = componentInfo.DimensionsInches;
        // console.log(`Size: ${sizePixels[0]} x ${sizePixels[1]} pixels`);
        // console.log(`Size: ${sizeInches[0]} x ${sizeInches[1]} inches`);
        
        /*
        Actual pixel size: 300x300px
        Path:
        m 337.5,713.39167
        c 0,-82.84584 -67.15417,-150 -150,-150 -82.84167,0 -150.000001,67.15416 -150.000001,150 0,82.84583 67.158331,150 150.000001,150 82.84167,0 150,-67.15417 150,-150
        z

        m -262.500001,0
        c 0,-62.13334 50.366671,-112.5 112.500001,-112.5 62.13333,0 112.5,50.36666 112.5,112.5 0,62.13333 -50.36667,112.5 -112.5,112.5 -62.13333,0 -112.500001,-50.36667 -112.500001,-112.5
        z
        */
        const filenamesToAttempt = [...componentInfo.TemplateFiles, componentType];
        let svgContent = null;
        let templatePath = null;
        let found = false;
        for (const templateFileName of filenamesToAttempt) {
            if (!templateFileName) continue;
            try {
                if (__dirname.includes('app.asar')) {
                    templatePath = join(__dirname, '../../../componentTemplates', `${templateFileName}.svg`);
                } else {
                    templatePath = join(__dirname, '../../src/main/templative/lib/componentTemplates', `${templateFileName}.svg`);
                }
                svgContent = await readFile(templatePath, 'utf8');
                found = true;
                break;
            } catch (err) {
                // File not found, try next
                continue;
            }
        }
        if (!found) {
            // No template file found, use default scaling
            return { widthRatio: 1, heightRatio: 1 };
        }
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        
        // Get the root SVG element dimensions
        const svgElement = svgDoc.documentElement;
        const totalWidth = parseFloat(svgElement.getAttribute('width'));
        const totalHeight = parseFloat(svgElement.getAttribute('height'));
        
        // Find the sizing element - try actualSize first, then clipping
        let elementChosen = ACTUAL_SIZE_ELEMENT_ID;
        let clippingElement = svgDoc.getElementById(elementChosen);
        if (!clippingElement) {
            elementChosen = CLIPPING_ELEMENT_ID;
            clippingElement = svgDoc.getElementById(elementChosen);
            if (!clippingElement) {
                // console.log(`No sizing element found in template for ${componentType}, using default scaling`);
                return { widthRatio: 1, heightRatio: 1 };
            }
        }
        // console.log(`Using ${elementChosen} for ${componentType}`);
        
        let clippingWidth, clippingHeight;
        
        // Handle different element types
        const tagName = clippingElement.tagName.toLowerCase();
        
        if (tagName === 'rect') {
            // For rect elements, get width and height attributes
            clippingWidth = parseFloat(clippingElement.getAttribute('width'));
            clippingHeight = parseFloat(clippingElement.getAttribute('height'));
        } else if (tagName === 'path') {
            // For path elements, calculate bounding box
            const pathData = clippingElement.getAttribute('d');
            if (!pathData) {
                // console.log(`Path element has no 'd' attribute for ${componentType}, using default scaling`);
                return { widthRatio: 1, heightRatio: 1 };
            }
            
            const boundingBox = calculatePathBoundingBox(pathData);
            // console.log(`Bounding box: boundingBox.x: ${boundingBox.x}, boundingBox.y: ${boundingBox.y}, boundingBox.width: ${boundingBox.width}, boundingBox.height: ${boundingBox.height}`);
            clippingWidth = boundingBox.width;
            clippingHeight = boundingBox.height;
        } else if (tagName === 'circle') {
            // For circle elements, use diameter
            const radius = parseFloat(clippingElement.getAttribute('r'));
            clippingWidth = clippingHeight = radius * 2;
        } else if (tagName === 'ellipse') {
            // For ellipse elements, use rx and ry
            const rx = parseFloat(clippingElement.getAttribute('rx'));
            const ry = parseFloat(clippingElement.getAttribute('ry'));
            clippingWidth = rx * 2;
            clippingHeight = ry * 2;
        } else {
            // console.log(`Unsupported clipping element type '${tagName}' for ${componentType}, using default scaling`);
            return { widthRatio: 1, heightRatio: 1 };
        }
        
        if (!clippingWidth || !clippingHeight || clippingWidth <= 0 || clippingHeight <= 0) {
            // console.log(`Invalid clipping dimensions for ${componentType}, using default scaling`);
            return { widthRatio: 1, heightRatio: 1 };
        }
        
        // console.log(`${componentType}: ${clippingWidth} / ${totalWidth}, ${clippingHeight} / ${totalHeight}px`);
        
        // Calculate the ratios (clipping area / total area)
        const clippingWidthRatio = clippingWidth / totalWidth;
        const clippingHeightRatio = clippingHeight / totalHeight;
        
        // To get the scaling factor, we need to invert the ratio
        // If clipping is 97% of total, we need to scale by 1/0.97 to make clipping the target size
        const widthScalingRatio = 1 / clippingWidthRatio;
        const heightScalingRatio = 1 / clippingHeightRatio;
        
        // console.log(`Template scaling for ${componentType}: width ratio ${widthScalingRatio.toFixed(3)}, height ratio ${heightScalingRatio.toFixed(3)} (clipping element: ${tagName})`);
        
        return { 
            widthRatio: widthScalingRatio, 
            heightRatio: heightScalingRatio 
        };
    } catch (error) {
        console.log(`Error calculating template scaling for ${componentType}: ${error.message}`);
        captureException(error);
        return { widthRatio: 1, heightRatio: 1 };
    }
}

/**
 * Get component size with template-based scaling applied
 * @param {string} componentType - The component type
 * @param {Array} baseSizeInches - Base size from component info [width, height]
 * @returns {Promise<Array>} Scaled size in inches [width, height]
 */
async function getScaledComponentSize(componentType, baseSizeInches) {
    const scalingRatio = await getTemplateScalingRatio(componentType);
    return [
        baseSizeInches[0] * scalingRatio.widthRatio,
        baseSizeInches[1] * scalingRatio.heightRatio
    ];
}

module.exports = {
    getTemplateScalingRatio,
    getScaledComponentSize
};
