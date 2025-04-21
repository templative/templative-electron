const { getPUACharFromUnicode } = require('../.././../../../iconFontCreator');
const path = require('path');
const fs = require('fs').promises;
const { JSDOM } = require('jsdom');

async function processIconGlyphsAsync(document, inputDirectoryPath) {
    let iconGlyphs = document.querySelectorAll('iconGlyph');
    
    // console.log("Found", iconGlyphs.length, "iconGlyphs");
    const svgDomCache = {}
    for (const iconGlyph of iconGlyphs) {
      await processGlyph(iconGlyph, inputDirectoryPath, svgDomCache);
    }
}

async function processGlyph(iconGlyph, inputDirectoryPath, svgDomCache) {
    const glyphName = iconGlyph.getAttribute('glyph');
    if (!glyphName) {
        const textNode = svgDom.window.document.createTextNode("!bad glyph!");
        iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
        return;
    }
    
    const fontFamily = iconGlyph.getAttribute('font-family');
    if (!fontFamily) {
        const textNode = svgDom.window.document.createTextNode(`!bad font-family!`);
        iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
        return
    }
    
    const fontPath = path.join(inputDirectoryPath, 'fonts', `${fontFamily}.ttf`);
    const fontSvgPath = path.join(inputDirectoryPath, 'fonts', `${fontFamily}.svg`);
    
    // Load the svg, find the <glyph> with glyph-name="glyph", get its unicode
    var svgDom;
    try {
        if (svgDomCache[fontSvgPath]) {
            svgDom = svgDomCache[fontSvgPath];
        } else {
            var fontSvg = await fs.readFile(fontSvgPath, 'utf8');
            svgDom = new JSDOM(fontSvg)
            svgDomCache[fontSvgPath] = svgDom;
        }
    }
    catch (error){
        if (error.code === 'ENOENT') {
            console.warn(`Font ${fontSvgPath} not found`);
            const textNode = svgDom.window.document.createTextNode("!missing font!");
            iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
            return
        }
        throw error;
    }
    const glyph = svgDom.window.document.querySelector(`glyph[glyph-name="${glyphName}"]`);
    const unicode = `&#x${glyph.getAttribute('unicode').codePointAt(0).toString(16).toUpperCase()};`;
    var puaChar;
    try {
        // console.log(`Getting PUA char from ${fontPath} ${unicode}`);
        puaChar = await getPUACharFromUnicode(fontPath, unicode);
    }
    catch (error){
        if (error.code === 'ENOENT') {
            console.warn(`Font ${fontPath} not found`);
            const textNode = svgDom.window.document.createTextNode("!missing font!");
            iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
            return
        }
        console.error(`Error getting PUA char from unicode: ${error}`);
        const textNode = svgDom.window.document.createTextNode("!bad font!");
        iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
        return
    }
    // console.log(`Processing glyph ${glyphName} from font ${fontFamily} unicode: ${unicode} puaChar: ${puaChar}`);
    
    const textNode = svgDom.window.document.createTextNode(puaChar);
    iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
}
module.exports = {
    processIconGlyphsAsync
}