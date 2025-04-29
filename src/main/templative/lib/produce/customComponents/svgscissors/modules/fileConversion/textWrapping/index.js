const { JSDOM } = require('jsdom');
const { cleanupSvgNamespacesAsync, cleanupUnusedDefsAsync } = require('./svgPreprocessor');
const { processTextElementsAsync } = require('./textProcessor');
const { processIconGlyphsAsync } = require('./iconFontProccessing');
const { processFormattingShortcuts } = require('./formattingShortcuts');
const {captureMessage, captureException } = require("../../../../../../sentryElectronWrapper");

async function preprocessSvgTextAsync(svgData, inputDirectoryPath) {
    try {
        // Clean up SVG namespaces
        svgData = await cleanupSvgNamespacesAsync(svgData);
    } catch (error) {
        console.error(`Error cleaning up SVG namespaces: ${error.message}`);
        // console.error(error.stack);
        return svgData;
    }

    let document;
    var dom;
    try {
        dom = new JSDOM(svgData, { contentType: 'image/svg+xml' });
        document = dom.window.document;
    } catch (error) {
        captureException(error);
        console.error(`Error parsing SVG with JSDOM: ${error.message}`);
        // console.error(error.stack);
        return svgData;
    }

    try {
        await processIconGlyphsAsync(document, inputDirectoryPath);
    } catch (error) {
        captureException(error);
        console.error(`Error processing icon glyphs: ${error.message}`);
        // console.error(error.stack);
        return svgData;
    }
    try {
        await processFormattingShortcuts(document);
    } catch (error) {
        captureException(error);
        console.error(`Error processing formatting shortcuts: ${error.message}`);
        // console.error(error.stack);
        return svgData;
    }

    try {
        if (svgData.includes('shape-inside:url(#')) {
            await processTextElementsAsync(document);
        }
    } catch (error) {
        captureException(error);
        console.error(`Error processing text elements: ${error.message}`);
        // console.error(error.stack);
        return svgData;
    }

    try {
        // Clean up unused definitions and serialize the document
        return await cleanupUnusedDefsAsync(dom.serialize());
    } catch (error) {
        captureException(error);
        console.error(`Error cleaning up unused definitions: ${error.message}`);
        // console.error(error.stack);
        return svgData;
    }
}

module.exports = {
    preprocessSvgTextAsync
}