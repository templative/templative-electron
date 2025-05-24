async function replaceIconGlyphWithPuaCharsAsync(document) {
    // First, extract unicode values from raw content before JSDOM processes them    
    let iconGlyphs = document.querySelectorAll('iconGlyph');
    const placeholders = {};
    
    for (const iconGlyph of iconGlyphs) {
        await processGlyph(iconGlyph, document, placeholders);
    }
    
    return placeholders;
}

async function processGlyph(iconGlyph, document, placeholders) {
    const fontFamily = iconGlyph.getAttribute('font-family');
    if (!fontFamily) {
        const textNode = document.createTextNode(`!bad font-family!`);
        iconGlyph.parentNode.replaceChild(textNode, iconGlyph);
        return null;
    }    
    
    var unicode = iconGlyph.getAttribute('unicode');
    if (!unicode) {
        return null;
    }
    const placeholder = `__UNICODE_PLACEHOLDER_${Math.random().toString(36).substr(2, 9)}__`;
    unicode = `&#x${unicode.codePointAt(0).toString(16).toUpperCase()};`;
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