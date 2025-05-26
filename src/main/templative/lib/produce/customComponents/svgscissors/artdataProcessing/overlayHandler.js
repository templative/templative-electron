const fs = require('fs-extra');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { JSDOM } = require('jsdom');
const { sanitizeSvgContent } = require('./svgCleaner.js');
const { getScopedValue } = require('./valueResolver.js');
const { SvgFileCache } = require('../caching/svgFileCache.js');

// Import the default cache instance only for backward compatibility
const defaultSvgFileCache = new SvgFileCache();

async function collectOverlayFiles(overlays, compositions, pieceGamedata, productionProperties, svgFileCache) {
    const overlayFiles = [];
    const overlayFilesDirectory = compositions.gameCompose["artInsertsDirectory"];

    for (const overlay of overlays) {
        const isComplex = overlay.isComplex ?? false;
        if (isComplex && productionProperties.isSimple) {
            continue;
        }

        const isDebug = overlay.isDebugInfo ?? false;
        if (isDebug && productionProperties.isPublish) {
            continue;
        }

        const overlayName = await getScopedValue(overlay, pieceGamedata);
        if (!overlayName) {
            continue;
        }

        const overlaysFilepath = path.resolve(path.join(productionProperties.inputDirectoryPath, overlayFilesDirectory));
        const overlayFilename = `${overlayName}.svg`;
        const overlayFilepath = path.normalize(path.join(overlaysFilepath, overlayFilename));

        const content = await svgFileCache.readSvgFile(overlayFilepath);
        if (!content) {
            const shortPath = path.basename(path.dirname(overlayFilepath)) + path.sep + path.basename(overlayFilepath);
            console.error(`Overlay ${shortPath} does not exist.`);
            continue;
        }
        overlayFiles.push({
            path: overlayFilepath,
            content
        });
        
    }
    return overlayFiles;
}

async function addOverlays(document, overlays, compositions, pieceGamedata, productionProperties, svgFileCache = defaultSvgFileCache) {
    if (!document) {
        throw new Error("document cannot be null");
    }

    if (overlays === null) {
        throw new Error("overlays cannot be null");
    }

    const overlayFilesDirectory = compositions.gameCompose["artInsertsDirectory"];
    const mainRoot = document.documentElement || 
                document.querySelector('svg') || 
                document.querySelector('svg\\:svg');
    if (!mainRoot) {
        throw new Error("Failed to find main root element in document");
    }

    for (const overlay of overlays) {
        const isComplex = overlay.isComplex ?? false;
        if (isComplex && productionProperties.isSimple) {
            continue;
        }

        const isDebug = overlay.isDebugInfo ?? false;
        if (isDebug && productionProperties.isPublish) {
            continue;
        }

        const positionX = overlay.positionX ?? 0;
        const positionY = overlay.positionY ?? 0;
        const overlayName = await getScopedValue(overlay, pieceGamedata);
        if (!overlayName) {
            continue;
        }

        const overlaysFilepath = path.resolve(path.join(productionProperties.inputDirectoryPath, overlayFilesDirectory));
        const overlayFilename = `${overlayName}.svg`;
        const overlayFilepath = path.normalize(path.join(overlaysFilepath, overlayFilename));

        try {
            await placeOverlay(document, mainRoot, overlayFilepath, positionX, positionY, svgFileCache);
        } catch (error) {
            console.log(`!!! Overlay ${overlayFilepath} error: ${error.message}`);
            continue;
        }
    }    
}

async function placeOverlay(document, mainRoot, overlayFilepath, positionX, positionY, svgFileCache = defaultSvgFileCache) {
    try {        
        let overlayContents = await svgFileCache.readSvgFile(overlayFilepath);
        if (!overlayContents) {
            const shortPath = path.basename(path.dirname(overlayFilepath)) + path.sep + path.basename(overlayFilepath);
            console.error(`Overlay ${shortPath} does not exist.`);
            return;
        }
        
        // Sanitize the overlay SVG content
        overlayContents = sanitizeSvgContent(overlayContents);
        
        // Use JSDOM to parse overlay to match main document's DOM implementation
        const overlayJsdom = new JSDOM(overlayContents, { contentType: 'image/svg+xml' });
        const overlayDoc = overlayJsdom.window.document;
        if (!overlayDoc || !overlayDoc.documentElement) {
            console.error(`Failed to parse overlay SVG document: ${overlayFilepath}`);
            return;
        }
        
        const overlayRoot = overlayDoc.documentElement;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const viewBox = mainRoot.getAttribute('viewBox')?.split(/\s+/).map(parseFloat) ?? [];
        let scale_factor = 1.0;
        if (viewBox.length === 4) {
            const [, , width, height] = viewBox;
            const actual_width = parseFloat(mainRoot.getAttribute('width') ?? width);
            scale_factor = actual_width / width;
        }

        group.setAttribute('transform', `translate(${positionX},${positionY}) scale(${1 / scale_factor})`);

        // Copy attributes from overlay root to group, excluding certain attributes
        for (let i = 0; i < overlayRoot.attributes.length; i++) {
            const attr = overlayRoot.attributes[i];
            if (!['width', 'height', 'viewBox', 'transform'].includes(attr.name)) {
                group.setAttribute(attr.name, attr.value);
            }
        }

        // Import and move all children from overlay root to group
        const childrenToImport = Array.from(overlayRoot.childNodes);
        for (const child of childrenToImport) {
            try {
                const importedChild = document.importNode(child, true);
                group.appendChild(importedChild);
            } catch (e) {
                console.error(`Error importing child: ${e.message}`);
                break;
            }
        }

        mainRoot.appendChild(group);

    } catch (error) {
        console.error(`Error in placeOverlay: ${error.message}`);
    }
}

module.exports = {
  addOverlays,
  placeOverlay,
  getScopedValue,
  collectOverlayFiles
}; 