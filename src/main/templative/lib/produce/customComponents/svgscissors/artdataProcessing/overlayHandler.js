const fs = require('fs-extra');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { sanitizeSvgContent } = require('../modules/svgElementConverter.js');
const chalk = require('chalk');
const { getScopedValue } = require('./valueResolver.js');
const { SvgFileCache } = require('../modules/svgFileCache.js');

// Import the default cache instance only for backward compatibility
const defaultSvgFileCache = new SvgFileCache();

/**
 * Add overlays to SVG content
 * @param {string} contents - SVG content
 * @param {Array} overlays - Array of overlays
 * @param {Object} compositions - Component compositions
 * @param {Object} pieceGamedata - Game data
 * @param {Object} productionProperties - Production properties
 * @param {Object} svgFileCache - Optional SVG file cache instance
 * @returns {Promise<string>} - SVG content with overlays
 */
async function addOverlays(contents, overlays, compositions, pieceGamedata, productionProperties, svgFileCache = defaultSvgFileCache) {
    if (contents === null) {
        throw new Error("contents cannot be null");
    }

    if (overlays === null) {
        throw new Error("overlays cannot be null");
    }

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
            contents = await placeOverlay(contents, overlayFilepath, positionX, positionY, svgFileCache);
        } catch (error) {
            console.log(`!!! Overlay ${overlayFilepath} error: ${error.message}`);
            continue;
        }
    }    
    return contents;
}

/**
 * Place an overlay on SVG content
 * @param {string} contents - SVG content
 * @param {string} overlayFilepath - Path to overlay file
 * @param {number} positionX - X position
 * @param {number} positionY - Y position
 * @param {Object} svgFileCache - Optional SVG file cache instance
 * @returns {Promise<string>} - SVG content with overlay
 */
async function placeOverlay(contents, overlayFilepath, positionX, positionY, svgFileCache = defaultSvgFileCache) {
    if (!contents) {
        console.error("Warning: contents is null or undefined");
        return "";
    }

    try {
        // Sanitize the main SVG content
        contents = sanitizeSvgContent(contents);
        
        const parser = new DOMParser({
            errorHandler: {
                warning: function(w) { /* Suppress warnings */ },
                error: function(e) { console.error("Error parsing main SVG: ", e); },
                fatalError: function(e) { console.error("Fatal error parsing main SVG: ", e); }
            }
        });
        
        const mainDoc = parser.parseFromString(contents, 'image/svg+xml');
        if (!mainDoc || !mainDoc.documentElement) {
            console.error("Failed to parse main SVG document");
            return contents;
        }
        
        const mainRoot = mainDoc.documentElement;

        let overlayContents = await svgFileCache.readSvgFile(overlayFilepath);
        
        // Sanitize the overlay SVG content
        overlayContents = sanitizeSvgContent(overlayContents);
        
        const overlayDoc = parser.parseFromString(overlayContents, 'image/svg+xml');
        if (!overlayDoc || !overlayDoc.documentElement) {
            console.error(`Failed to parse overlay SVG document: ${overlayFilepath}`);
            return contents;
        }
        
        const overlayRoot = overlayDoc.documentElement;

        const group = mainDoc.createElementNS('http://www.w3.org/2000/svg', 'g');

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

        // Move all children from overlay root to group
        while (overlayRoot.firstChild) {
            try {
                group.appendChild(overlayRoot.firstChild);
            } catch (e) {
                console.error(`Error appending child: ${e.message}`);
                break;
            }
        }

        mainRoot.appendChild(group);

        const serializer = new XMLSerializer();
        return serializer.serializeToString(mainDoc);
    } catch (error) {
        console.error(`Error in placeOverlay: ${error.message}`);
        return contents;
    }
}

module.exports = {
  addOverlays,
  placeOverlay,
  getScopedValue
}; 