const DEFAULT_FONT_SIZE = 12;
const DEFAULT_FONT = 'Arial';
const DEFAULT_TEXT_ALIGN = 'start';
const DEFAULT_FONT_STYLE = 'normal';
const DEFAULT_FONT_WEIGHT = 'normal';
const DEFAULT_LINE_HEIGHT = 1.25;

async function extractFontSizeAsync(element) {
    const style = element.getAttribute('style') || '';
    const fontSizeMatch = style.match(/font-size:([^;]+)/);
    
    if (!fontSizeMatch) {
        return null;
    }
    const fontSizeStr = fontSizeMatch[1].trim();
    if (fontSizeStr.endsWith('px')) {
        return parseFloat(fontSizeStr.slice(0, -2));
    }
    return parseFloat(fontSizeStr);
}

async function extractNumericPropertyFromStyleAsync(style, propertyName) {
    if (!style) return null;
    
    const regex = new RegExp(`${propertyName}\\s*:\\s*([\\d.]+)`, 'i');
    const match = regex.exec(style);
    
    if (match) {
        return parseFloat(match[1]);
    }
    
    return null;
}

async function extractFontAttributesAsync(element) {
    const style = element.getAttribute('style');
    if (!style) {
        return null;
    }
    
    // Extract font attributes from style
    const fontFamily = style.match(/font-family:\s*([^;]+)/) ? 
        style.match(/font-family:\s*([^;]+)/)[1].trim() : 
        element.getAttribute('font-family') || DEFAULT_FONT;
    
    const fontSize = await extractFontSizeAsync(element) || DEFAULT_FONT_SIZE;
    
    const fontWeight = style.match(/font-weight:\s*([^;]+)/) ? 
        style.match(/font-weight:\s*([^;]+)/)[1].trim() : 
        element.getAttribute('font-weight') || DEFAULT_FONT_WEIGHT;
    
    const fontStyle = style.match(/font-style:\s*([^;]+)/) ? 
        style.match(/font-style:\s*([^;]+)/)[1].trim() : 
        element.getAttribute('font-style') || DEFAULT_FONT_STYLE;
    
    let lineHeight = DEFAULT_LINE_HEIGHT;
    const lineHeightMatch = style.match(/line-height:\s*([^;]+)/);
    if (lineHeightMatch) {
        const lineHeightStr = lineHeightMatch[1].trim();
        if (lineHeightStr.endsWith('px')) {
            lineHeight = parseFloat(lineHeightStr.slice(0, -2)) / fontSize;
        } else if (lineHeightStr.endsWith('%')) {
            lineHeight = parseFloat(lineHeightStr.slice(0, -1)) / 100;
        } else {
            lineHeight = parseFloat(lineHeightStr);
        }
        // console.log(`Extracted line-height: ${lineHeight} from element`);
    }
    
    // Extract text-align from style or attribute
    const textAlign = style.match(/text-align:\s*([^;]+)/) ? 
        style.match(/text-align:\s*([^;]+)/)[1].trim() : 
        element.getAttribute('text-anchor') || DEFAULT_TEXT_ALIGN;

    return {
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        lineHeight,
        textAlign
    };
}

module.exports = {
    extractFontSizeAsync,
    extractNumericPropertyFromStyleAsync,
    extractFontAttributesAsync,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT,
    DEFAULT_TEXT_ALIGN,
    DEFAULT_FONT_STYLE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_LINE_HEIGHT
};