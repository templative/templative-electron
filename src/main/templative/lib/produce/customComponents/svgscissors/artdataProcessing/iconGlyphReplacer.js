const path = require('path');
const fsPromises = require('fs').promises;
const { JSDOM } = require('jsdom');

async function replaceIconGlyphWithPuaCharsAsync(document, inputDirectoryPath, glyphUnicodeMap) {
    // First, extract unicode values from raw content before JSDOM processes them    
    let iconGlyphs = document.querySelectorAll('iconGlyph');
    const placeholders = {};
    
    for (const iconGlyph of iconGlyphs) {
        await processGlyph(iconGlyph, document, placeholders, inputDirectoryPath, glyphUnicodeMap);
    }
    
    return placeholders;
}

async function findUnicodeForGlyph(glyphName, inputDirectoryPath, fontFamily) {
    const fontPath = path.join(inputDirectoryPath, "fonts", `${fontFamily}.svg`);
    var contents = await fsPromises.readFile(fontPath, 'utf8');

    try {
        contents = await fsPromises.readFile(fontPath, 'utf8');
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }

    /*
    Example font file:
    <?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
    <svg xmlns="http://www.w3.org/2000/svg">
    <defs>
    <font id="Alchemia" horiz-adv-x="50">
        <font-face font-family="Alchemia"
        units-per-em="50" ascent="50"
        descent="0" />
        <missing-glyph horiz-adv-x="0" />
        <glyph glyph-name="air"
        unicode="&#xEA01;"
        horiz-adv-x="50" d="M25.000001 50A25 25 0 0 1 0 25A25 25 0 0 1 25.000001 0A25 25 0 0 1 50.000001 25A25 25 0 0 1 25.000001 50zM24.976561 43.57227L32.781248 30.23633H42.285155V27.27539H34.503905L44.349608 10.42773H5.650391L15.47461 27.27539H7.714844V30.23633H17.195313zM24.976561 39.39453L19.652341 30.23633H30.32617zM17.929685 27.27539L9.75781 13.22852H40.242189L32.046876 27.27539z" />
    */

    const dom = new JSDOM(contents, { contentType: 'image/svg+xml' });
    const document = dom.window.document;

    const glyph = document.querySelector(`glyph[glyph-name="${glyphName}"]`);
    if (!glyph) {
        return null;
    }
    // The unicode attribute contains the literal string "&#xEA01;" which is what we want
    return glyph.getAttribute('unicode');
}

async function processGlyph(iconGlyph, document, placeholders, inputDirectoryPath, glyphUnicodeMap) {
    const fontFamily = iconGlyph.getAttribute('font-family');
    if (!fontFamily) {
        const textNode = document.createTextNode(`!bad font-family!`);
        iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
        return null;
    }    
    
    var unicode = iconGlyph.getAttribute('unicode');
    if (!unicode) {
        var glyphName = iconGlyph.getAttribute('glyph');
        if (!glyphName) {
            return null;
        }
        if (glyphUnicodeMap[fontFamily] === undefined || glyphUnicodeMap[fontFamily][glyphName] === undefined) {
            glyphUnicodeMap[fontFamily] = glyphUnicodeMap[fontFamily] || {};
            glyphUnicodeMap[fontFamily][glyphName] = await findUnicodeForGlyph(glyphName, inputDirectoryPath, fontFamily);;
        }
        unicode = glyphUnicodeMap[fontFamily][glyphName];
        
        if (!unicode) {
            return null;
        }
    }

    const placeholder = `__UNICODE_PLACEHOLDER_${Math.random().toString(36).substr(2, 9)}__`;
    
    if (placeholders[unicode] === undefined) {
        placeholders[unicode] = [];
    }
    placeholders[unicode].push(placeholder);
    
    const puaElement = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    puaElement.setAttribute('font-family', fontFamily);
    
    // Copy all attributes except unicode, glyphname and font-family
    const attributes = iconGlyph.attributes;
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (attr.name !== 'unicode' && attr.name !== 'glyph-name' && attr.name !== 'font-family') {
            puaElement.setAttribute(attr.name, attr.value);
        }
    }
    
    // Set a unique placeholder that we can replace later
    puaElement.textContent = placeholder;
    
    iconGlyph.parentNode.replaceChild(puaElement, iconGlyph);
}

function replacePlaceholdersWithUnicodeEntities(svgContent, placeholders) {
    let result = svgContent;
    for (const unicode in placeholders) {   
        for (const placeholder of placeholders[unicode]) {
            result = result.replace(placeholder, unicode);
        }
    }
    return result;
}

module.exports = {
    replaceIconGlyphWithPuaCharsAsync,
    replacePlaceholdersWithUnicodeEntities
}