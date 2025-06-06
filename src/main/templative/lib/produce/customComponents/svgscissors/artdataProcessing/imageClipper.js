const { JSDOM } = require('jsdom');
const path = require('path');
const { SvgFileCache } = require('../caching/svgFileCache.js');
const CLIPPING_ELEMENT_ID = "clipping";

// Create a default cache instance for backward compatibility
const defaultSvgFileCache = new SvgFileCache();

// Takes an svg file and clips the visibility of its contents to the bounds of the clipSvgElementId
async function clipSvgFileToClipFile(svgFilepath, clipSvgFilepath, clipSvgElementId=CLIPPING_ELEMENT_ID, svgFileCache=defaultSvgFileCache) {
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

    return clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId);
}

// Clips SVG content using another SVG's element as a clipping path
async function clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId=CLIPPING_ELEMENT_ID) {
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
        contentGroup.setAttribute('clip-path', 'url(#clipPath)');
        
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

async function clipSvgContentToClipFile(document, clipSvgFilepath, clipSvgElementId=CLIPPING_ELEMENT_ID, svgFileCache=defaultSvgFileCache) {
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
    
    return await clipSvgDomToElement(document, clipSvgContent, clipSvgElementId);
}

/**
 * Clip SVG DOM document using another SVG's element as a clipping path (DOM-based version)
 * @param {Document} document - Main SVG DOM document
 * @param {string} clipSvgContent - Clip SVG content
 * @param {string} clipSvgElementId - ID of clipping element
 * @returns {Promise<void>}
 */
async function clipSvgDomToElement(document, clipSvgContent, clipSvgElementId=CLIPPING_ELEMENT_ID) {
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
        contentGroup.setAttribute('clip-path', 'url(#clipPath)');
        
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

module.exports = {
    CLIPPING_ELEMENT_ID,
    clipSvgFileToClipFile,
    clipSvgContentToClipFile,
    clipSvgDomToElement
}