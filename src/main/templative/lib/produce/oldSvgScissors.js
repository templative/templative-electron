const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { parseStringPromise, Builder } = require('xml2js');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const { COMPONENT_INFO } = require('../../../../../../shared/componentInfo.js');
const { ProduceProperties, PreviewProperties } = require('../../../manage/models/produceProperties.js');
const { PieceData, ComponentBackData } = require('../../../manage/models/gamedata.js');
const { getTranslation } = require('../../translation/translation.js');
const { ComponentComposition } = require('../../../manage/models/composition.js');
const { ComponentArtdata } = require('../../../manage/models/artdata.js');
const { exportSvgToImage } = require('./inkscapeProcessor.js');
const { FontCache } = require('./fontCache.js');

async function convertElementToString(element) {
    const builder = new Builder();
    const xml = await builder.buildObject(element.root);
    return xml.replace(/^<\?xml.*?\?>/, '<?xml version="1.0" standalone="yes"?>');
}

async function createArtFileOfPiece(compositions, artdata, gamedata, componentBackOutputDirectory, productionProperties, _) {
    const templateFilesDirectory = compositions.gameCompose["artTemplatesDirectory"];
    if (artdata === null) {
        console.log(`!!! Missing artdata ${gamedata.componentDataBlob["name"]}`);
        return;
    }
    const artFilename = `${artdata["templateFilename"]}.svg`;
    const artFilepath = path.normalize(path.join(productionProperties.inputDirectoryPath, templateFilesDirectory, artFilename));
    if (!await fs.pathExists(artFilepath)) {
        console.log(`!!! Template art file ${artFilepath} does not exist.`);
        return;
    }

    if (!(compositions.componentCompose["type"] in COMPONENT_INFO)) {
        throw new Error(`No image size for ${compositions.componentCompose["type"]}`);
    }
    const component = COMPONENT_INFO[compositions.componentCompose["type"]];

    let contents = null;
    try {
        contents = await fs.readFile(artFilepath, 'utf8');
    } catch (e) {
        console.log(`!!! Template art file ${artFilepath} cannot be parsed. Error: ${e}`);
        return;
    }

    const pieceName = gamedata.pieceData ? gamedata.pieceData["name"] : gamedata.componentBackDataBlob["name"];
    const imageSizePixels = component["DimensionsPixels"];

    try {
        contents = await addOverlays(contents, artdata["overlays"], compositions, gamedata, productionProperties);
        contents = await textReplaceInFile(contents, artdata["textReplacements"], gamedata, productionProperties);
        contents = await updateStylesInFile(contents, artdata["styleUpdates"], gamedata);
        contents = await addNewlines(contents);

        const pieceUniqueHash = gamedata.pieceUniqueBackHash !== '' ? `_${gamedata.pieceUniqueBackHash}` : '';
        const artFileOutputName = `${compositions.componentCompose['name']}${pieceUniqueHash}-${pieceName}`;
        
        const artFileOutputFilepath = await createArtfile(contents, artFileOutputName, imageSizePixels, componentBackOutputDirectory);
        
        await exportSvgToImage(artFileOutputFilepath, imageSizePixels, artFileOutputName, componentBackOutputDirectory);
        console.log(`Produced ${pieceName}.`);
    } catch (error) {
        console.error(`Error producing ${pieceName}: ${error.message}`);
        console.error(error.stack);
    }
}

async function addNewlines(contents) {
    if (!contents) {
        console.error("Warning: contents is null or undefined");
        return "";
    }
    return contents.replace(/NEWLINE/g, "\n");
}

async function createArtfile(contents, artFileOutputName, imageSizePixels, outputDirectory) {
    if (contents === null) {
        throw new Error("Contents cannot be null");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, 'image/svg+xml');
    const root = doc.documentElement;

    const scale_factor = 96 / 300;

    root.setAttribute('width', `${imageSizePixels[0] * scale_factor}`);
    root.setAttribute('height', `${imageSizePixels[1] * scale_factor}`);

    root.setAttribute('viewBox', `0 0 ${imageSizePixels[0] * scale_factor} ${imageSizePixels[1] * scale_factor}`);

    const wrapper = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('transform', `scale(${scale_factor})`);

    while (root.firstChild) {
        wrapper.appendChild(root.firstChild);
    }
    root.appendChild(wrapper);

    const serializer = new XMLSerializer();
    contents = serializer.serializeToString(doc);

    const artFileOutputFileName = `${artFileOutputName}.svg`;
    const artFileOutputFilepath = path.join(outputDirectory, artFileOutputFileName);
    await fs.writeFile(artFileOutputFilepath, contents, 'utf8');
    return artFileOutputFilepath;
}

async function addOverlays(contents, overlays, compositions, pieceGamedata, productionProperties) {
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

        if (!await fs.pathExists(overlayFilepath)) {
            console.log(`!!! Overlay ${overlayFilepath} does not exist.`);
            continue;
        }

        contents = await placeOverlay(contents, overlayFilepath, positionX, positionY);
    }
    return contents;
}

async function placeOverlay(contents, overlayFilepath, positionX, positionY) {
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

        let overlayContents = await fs.readFile(overlayFilepath, 'utf8');
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

async function textReplaceInFile(contents, textReplacements, gamedata, productionProperties) {
    if (!contents) {
        console.error("Warning: contents is null or undefined");
        return "";
    }

    try {
        for (const textReplacement of textReplacements) {
            const key = `{${textReplacement["key"]}}`;
            let value = await getScopedValue(textReplacement, gamedata);
            if (typeof value === 'string') {
                value = value.replace(/\\\\n/g, "\n");
            }
            value = await processValueFilters(value, textReplacement);

            const isComplex = textReplacement.isComplex ?? false;
            if (isComplex && productionProperties.isSimple) {
                value = "";
            }

            const isDebug = textReplacement.isDebugInfo ?? false;
            if (isDebug && productionProperties.isPublish) {
                value = "";
            }

            if (productionProperties.targetLanguage !== "en" && (textReplacement.isTranslateable ?? false) && value) {
                const translation = getTranslation("./", value, productionProperties.targetLanguage);
                if (translation) {
                    value = translation;
                } else {
                    console.log(`Could not translate ${value}`);
                }
            }
            
            // Do NOT escape XML special characters for text replacements
            // This allows XML tags like <tspan> to be properly injected
            
            contents = contents.replace(key, value || "");
        }
        return contents;
    } catch (error) {
        console.error(`Error in text replacement: ${error.message}`);
        return contents;
    }
}

async function processValueFilters(value, textReplacement) {
    if ("filters" in textReplacement) {
        for (const filter of textReplacement["filters"]) {
            if (filter === "toUpper") {
                value = value.toUpperCase();
            }
        }
    }
    return String(value);
}

async function updateStylesInFile(contents, styleUpdates, pieceGamedata) {
    if (!contents) {
        console.error("Warning: contents is null or undefined");
        return "";
    }

    try {
        // Try to sanitize the SVG content before parsing
        contents = sanitizeSvgContent(contents);
        
        const parser = new DOMParser({
            errorHandler: {
                warning: function(w) { console.warn("Warning: ", w); },
                error: function(e) { console.error("Error: ", e); },
                fatalError: function(e) { console.error("Fatal Error: ", e); }
            }
        });
        
        const doc = parser.parseFromString(contents, 'image/svg+xml');
        
        // Check if doc is valid
        if (!doc || !doc.documentElement) {
            console.error("Error: Invalid document after parsing");
            return contents;
        }
        
        for (const styleUpdate of styleUpdates) {
            const findById = styleUpdate["id"];
            // Use getElementsByTagName and filter by id instead of querySelector
            const elements = doc.getElementsByTagName("*");
            let elementToUpdate = null;
            
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.getAttribute('id') === findById) {
                    elementToUpdate = element;
                    break;
                }
            }
            
            if (elementToUpdate !== null) {
                const value = await getScopedValue(styleUpdate, pieceGamedata);
                await replaceStyleAttributeForElement(elementToUpdate, "style", styleUpdate["cssValue"], value);
            } else {
                console.log(`Could not find element with id [${findById}].`);
            }
        }
        
        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
    } catch (error) {
        console.error(`Error updating styles: ${error.message}`);
        return contents;
    }
}

async function replaceStyleAttributeForElement(element, attribute, key, value) {
    const attributeValue = element.getAttribute(attribute) ?? "";
    let replaceStyleWith = "";
    let found = false;

    const cssKeyValuePairs = attributeValue.split(';');
    for (const cssKeyValuePair of cssKeyValuePairs) {
        const keyAndPair = cssKeyValuePair.split(':');
        if (keyAndPair[0] === key) {
            replaceStyleWith += `${key}:${value};`;
            found = true;
        } else {
            replaceStyleWith += cssKeyValuePair + ';';
        }
    }

    if (!found) {
        replaceStyleWith += `${key}:${value};`;
    }

    if (replaceStyleWith.endsWith(";")) {
        replaceStyleWith = replaceStyleWith.slice(0, -1);
    }
    element.setAttribute(attribute, replaceStyleWith);
}

async function getScopedValue(scopedValue, pieceGameData) {
    if (scopedValue === null) {
        throw new Error("scopedValue cannot be null.");
    }

    const scope = scopedValue["scope"];
    const source = scopedValue["source"];

    let scopeData = null;
    if (scope === "studio") {
        scopeData = pieceGameData.studioDataBlob;
    } else if (scope === "game") {
        scopeData = pieceGameData.gameDataBlob;
    } else if (scope === "component") {
        scopeData = pieceGameData.componentDataBlob;
    } else if (scope === "piece") {
        scopeData = pieceGameData.pieceData ? pieceGameData.pieceData : pieceGameData.componentBackDataBlob;
    } else if (scope === "global") {
        return source;
    } else if (scope === "utility") {
        const utilityFunctions = {
            "git-sha": getCurrentGitSha
        };
        if (!(source in utilityFunctions)) {
            console.log(`Missing function ${source} not found in ${scope} scope.`);
            return source;
        }
        return utilityFunctions[source]();
    }

    if (!(source in scopeData)) {
        console.log(`Missing key ${source} not found in ${scope} scope.`);
        return source;
    }

    return scopeData[source];
}

function getCurrentGitSha() {
    try {
        const { execSync } = require('child_process');
        return execSync('git rev-parse HEAD').toString().trim();
    } catch (error) {
        console.error('Error getting git SHA:', error);
        return 'unknown';
    }
}

// Helper function to sanitize SVG content before parsing
function sanitizeSvgContent(content) {
    if (!content) return "";
    
    // Fix common XML issues
    return content
        // Ensure XML declaration is correct
        .replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8" standalone="no"?>')
        // Fix self-closing tags
        .replace(/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*)\/>/g, '<$1 $2></$1>')
        // Remove any control characters
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
        // Fix unclosed CDATA sections
        .replace(/<!\[CDATA\[([^\]]*)(?!\]\]>)/g, '<![CDATA[$1]]>')
        // Fix unescaped ampersands
        .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
}

module.exports = {
    convertElementToString,
    createArtFileOfPiece,
    addNewlines,
    createArtfile,
    addOverlays,
    placeOverlay,
    textReplaceInFile,
    processValueFilters,
    updateStylesInFile,
    replaceStyleAttributeForElement,
    getScopedValue,
    sanitizeSvgContent
};
