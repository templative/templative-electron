const chalk = require('chalk');
const { loadSvg } = require('../../../../distribute/simulator/imageProcessing/imageUtils');
const { JSDOM } = require('jsdom');
const { SvgFileCache } = require('./svgFileCache.js');
const CLIPPING_ELEMENT_ID = "clipping";

// Create a default cache instance for backward compatibility
const defaultSvgFileCache = new SvgFileCache();

// Takes an svg file and clips the visibility of its contents to the bounds of the clipSvgElementId
async function clipSvgFileToClipFile(svgFilepath, clipSvgFilepath, clipSvgElementId=CLIPPING_ELEMENT_ID, svgFileCache=defaultSvgFileCache) {
    const svgContent = await svgFileCache.readSvgFile(svgFilepath);
    const clipSvgContent = await svgFileCache.readSvgFile(clipSvgFilepath);
        
    if (!svgContent || !clipSvgContent) {
        console.log(chalk.red(`!!! Failed to load SVG files for clipping.`));
        return false;
    }

    return clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId);
}

async function clipSvgContentToClipFile(svgContent, clipSvgFilepath, clipSvgElementId=CLIPPING_ELEMENT_ID, svgFileCache=defaultSvgFileCache) {

    const clipSvgContent = await svgFileCache.readSvgFile(clipSvgFilepath);
        
    if (!clipSvgContent) {
        console.log(chalk.red(`!!! Failed to load SVG files for clipping.`));
        return false;
    }
    return clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId);
}

// Clips SVG content using another SVG's element as a clipping path
async function clipSvgContentToElement(svgContent, clipSvgContent, clipSvgElementId=CLIPPING_ELEMENT_ID) {
    if (!svgContent || !clipSvgContent) {
        console.log(chalk.red(`!!! Invalid SVG content provided for clipping.`));
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
            console.log(chalk.red(`Could not find element with id "${clipSvgElementId}" in clip SVG.`));
            return svgContent;
        }
        
        // Get the root SVG element
        const svgRoot = svgDoc.querySelector('svg');
        const clipRoot = clipDoc.querySelector('svg');
        
        if (!svgRoot) {
            console.log(chalk.red(`Could not find SVG root element in source file.`));
            return svgContent;
        }
        
        if (!clipRoot) {
            console.log(chalk.red(`Could not find SVG root element in clip file.`));
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
        console.log(chalk.red(`Error clipping SVG: ${error.message}`));
        return false;
    }
}

module.exports = {
    CLIPPING_ELEMENT_ID,
    clipSvgFileToClipFile,
    clipSvgContentToClipFile,
}