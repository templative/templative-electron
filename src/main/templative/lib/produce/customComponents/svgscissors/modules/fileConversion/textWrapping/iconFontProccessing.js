const { getPUACharFromUnicode } = require('../.././../../../iconFontCreator');
const path = require('path');
const fs = require('fs').promises;
const { JSDOM } = require('jsdom');

async function processIconGlyphsAsync(document) {
    let iconGlyphs = document.querySelectorAll('iconGlyph');
    
    console.log("Found", iconGlyphs.length, "iconGlyphs");
    
    for (const iconGlyph of iconGlyphs) {
      await processGlyph(iconGlyph);
    }
}

async function processGlyph(iconGlyph) {
    const fontFamily = iconGlyph.getAttribute('font-family');
    const glyphName = iconGlyph.getAttribute('glyph');
    
    
    const fontsTempPath = "C:/Users/olive/Documents/git/templative-electron/scripts/data/stuff"
    const fontPath = path.join(fontsTempPath, `${fontFamily}.ttf`);
    
    const fontSvgPath = path.join(fontsTempPath, `${fontFamily}.svg`);
    
    // Load the svg, find the <glyph> with glyph-name="glyph", get its unicode
    const fontSvg = await fs.readFile(fontSvgPath, 'utf8');
    const dom = new JSDOM(fontSvg);
    const glyph = dom.window.document.querySelector(`glyph[glyph-name="${glyphName}"]`);
    const unicode = `&#x${glyph.getAttribute('unicode').codePointAt(0).toString(16).toUpperCase()};`;
    const puaChar = await getPUACharFromUnicode(fontPath, unicode);
    console.log(`Processing glyph ${glyphName} from font ${fontFamily} unicode: ${unicode} puaChar: ${puaChar}`);
    
    const textNode = dom.window.document.createTextNode(puaChar);
    iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
}
module.exports = {
    processIconGlyphsAsync
}