const fontkit = require('fontkit');
const fsPromises = require('fs').promises;
const path = require('path');
const os = require('os');

async function normalizeFontFamilyAsync(fontFamily) {
    if (!fontFamily) return 'Arial';
    
    // Remove quotes and extra spaces
    let normalized = fontFamily.replace(/["']/g, '').trim();
    
    // If there are multiple fonts, use the first one
    if (normalized.includes(',')) {
        normalized = normalized.split(',')[0].trim();
    }
    
    return normalized;
}

const CHAR_WIDTH_MULTIPLIERS = {
    wide: 1.5,      // m, w, W, M
    normal: 1.0,    // most characters
    narrow: 0.5,    // i, l, j, t, f, I, 1
    punctuation: 0.3 // ., ,, ;, :
}

class FontCache {
    constructor() {
        this.fonts = new Map();
        this.fontkitFonts = new Map();
        this.fontkitAvailable = !!fontkit;
        
        // Initialize font paths based on OS
        this.fontPaths = {};
    }

    
    
    /**
     * Try to find a font file on the system
     * @param {string} fontFamily - Font family to find
     * @returns {string|null} - Path to font file or null if not found
     */
    async findFontFileAsync(fontFamily) {
        const normalizedFontFamily = await normalizeFontFamilyAsync(fontFamily);
        
        // Check if we already have a path for this font
        if (this.fontPaths[normalizedFontFamily]) {
            return this.fontPaths[normalizedFontFamily];
        }
        
        // Try common variations of the font name
        const variations = [
            normalizedFontFamily,
            normalizedFontFamily.toLowerCase(),
            normalizedFontFamily.replace(/\s+/g, ''),
            normalizedFontFamily.replace(/\s+/g, '') + '.ttf',
            normalizedFontFamily + '.ttf',
            normalizedFontFamily + '.ttc',
            normalizedFontFamily + '.otf'
        ];
        
        const platform = os.platform();
        let fontDirs = [];
        
        // Set font directories based on OS
        if (platform === 'darwin') {
            // macOS
            fontDirs = [
                '/System/Library/Fonts/',
                '/System/Library/Fonts/Supplemental/',
                '/Library/Fonts/',
                path.join(os.homedir(), 'Library/Fonts/')
            ];
        } else if (platform === 'win32') {
            // Windows
            fontDirs = [
                'C:\\Windows\\Fonts\\',
                path.join(os.homedir(), 'AppData\\Local\\Microsoft\\Windows\\Fonts\\')
            ];
        } else {
            // Linux and others
            fontDirs = [
                '/usr/share/fonts/',
                '/usr/local/share/fonts/',
                path.join(os.homedir(), '.fonts/')
            ];
        }
        
        // Try to find the font in the font directories
        for (const dir of fontDirs) {      
            for (const variation of variations) {
                const fontPath = path.join(dir, variation);
                try {
                    await fsPromises.access(fontPath);
                    this.fontPaths[normalizedFontFamily] = fontPath;
                    return fontPath;
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        throw err;
                    }
                }
            }
        }
        
        return null;
    }
    
    getFontFromCache(normalizedFontFamily) {
        if (this.fonts.has(normalizedFontFamily)) {
            return this.fonts.get(normalizedFontFamily);
        }
        
        // Return default values if font not found
        return { avgCharWidth: 0.6, lineHeight: 1.2 };
    }
    
    /**
     * Get font information
     * @param {string} fontFamily - Font family
     * @returns {Object} - Font information
     */
    async getFontInfoAsync(fontFamily) {        
        const normalizedFontFamily = await normalizeFontFamilyAsync(fontFamily);
        
        return this.getFontFromCache(normalizedFontFamily);
    }
    
    /**
     * Get fontkit font object
     * @param {string} fontFamily - Font family
     * @returns {Object|null} - Fontkit font object or null if not found
     */
    async getFontkitFontAsync(fontFamily) {        
        if (!this.fontkitAvailable) {
            return null;
        }
        
        const normalizedFontFamily = await normalizeFontFamilyAsync(fontFamily);
        
        // Check if we already have the font loaded
        if (this.fontkitFonts.has(normalizedFontFamily)) {
            return this.fontkitFonts.get(normalizedFontFamily);
        }
        
        // Try to find the font file
        let fontPath = this.fontPaths[normalizedFontFamily];
        
        // If not found in predefined paths, try to find it on the system
        if (!fontPath) {
            fontPath = await this.findFontFileAsync(normalizedFontFamily);
        }
        
        // If we found a font path, try to load it with fontkit
        if (fontPath) {
            try {
                // For TrueType Collection (.ttc) files
                if (fontPath.toLowerCase().endsWith('.ttc') || fontPath.toLowerCase().endsWith('.dfont')) {
                    const collection = await fontkit.open(fontPath);
                    
                    // First try to get the font by postscript name
                    try {
                        const font = collection.getFont(normalizedFontFamily);
                        if (font) {
                            this.fontkitFonts.set(normalizedFontFamily, font);
                            return font;
                        }
                    } catch (err) {
                        // If we can't get by name, try to find a matching font in the collection
                        if (collection.fonts) {
                            // Try to find a font with a matching name
                            for (const font of collection.fonts) {
                                if (font.familyName === normalizedFontFamily || 
                                    font.postscriptName === normalizedFontFamily ||
                                    font.fullName === normalizedFontFamily) {
                                    this.fontkitFonts.set(normalizedFontFamily, font);
                                    return font;
                                }
                            }
                            
                            // If no match found, use the first font as fallback
                            if (collection.fonts.length > 0) {
                                const font = collection.fonts[0];
                                this.fontkitFonts.set(normalizedFontFamily, font);
                                return font;
                            }
                        }
                    }
                } else {
                    // Regular font file
                    const font = await fontkit.open(fontPath);
                    this.fontkitFonts.set(normalizedFontFamily, font);
                    return font;
                }
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
                console.error(`Error loading font ${normalizedFontFamily}:`, err);
            }
        }
        
        // Try to find a fallback font
        const fallbackFonts = ['Arial', 'Helvetica', 'sans-serif'];
        for (const fallbackName of fallbackFonts) {
            if (this.fontkitFonts.has(fallbackName)) {
                return this.fontkitFonts.get(fallbackName);
            }
        }
        
        // If no fallback found but we have any font, use the first one
        if (this.fontkitFonts.size > 0) {
            return Array.from(this.fontkitFonts.values())[0];
        }
        
        return null;
    }    
}

/**
     * Calculate the width of a character using fontkit
     * @param {string} char - Character to measure
     * @param {string} fontFamily - Font family
     * @param {number} fontSize - Font size
     * @param {string} fontWeight - Font weight
     * @param {string} fontStyle - Font style
     * @returns {number} - Character width
     */
const calculateCharWidthAsync = async (char, fontFamily, fontSize, fontWeight = 'normal', fontStyle = 'normal') => {
    // Decode HTML entities to Unicode characters
    const decodedChar = char.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    const font = await this.getFontkitFontAsync(fontFamily);
    
    if (font && typeof font.layout === 'function') {
        try {
            // Use the layout method to get the glyph run
            const run = font.layout(decodedChar);
            
            if (run && run.glyphs && run.glyphs.length > 0) {
                // Get the advance width of the glyph
                const glyph = run.glyphs[0];
                const width = (glyph.advanceWidth / font.unitsPerEm) * fontSize;
                
                // Apply a multiplier for bold text (approximate)
                const boldMultiplier = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600 ? 1.2 : 1.0;
                
                return width * boldMultiplier;
            }
        } catch (err) {
            console.error(`Error calculating width for character "${char}" using fontkit:`, err);
            
            return await this.calculateCharWidthAsync("W", "Arial", fontSize, fontWeight, fontStyle);
        }
    }
    
    // Fallback to a simple estimation if fontkit fails
    // Use different multipliers based on the character width
    // console.log(`Fallback to a simple estimation for character "${char}" using fontkit`);
    let charWidthMultiplier = 0.6; // Default for normal text
    
    // Adjust multiplier based on font weight
    const boldMultiplier = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600 ? 1.2 : 1.0;
    
    // Adjust multiplier based on character width
    if (/[mwWM]/.test(char)) {
        charWidthMultiplier *= CHAR_WIDTH_MULTIPLIERS.wide;
    } else if (/[iljtfI1]/.test(char)) {
        charWidthMultiplier *= CHAR_WIDTH_MULTIPLIERS.narrow;
    } else if (/[.,;:]/.test(char)) {
        charWidthMultiplier *= CHAR_WIDTH_MULTIPLIERS.punctuation;
    } else {
        charWidthMultiplier *= CHAR_WIDTH_MULTIPLIERS.normal;
    }
    
    return fontSize * charWidthMultiplier * boldMultiplier;
}

/**
 * Calculate the height of a character
 * @param {string} char - Character to measure
 * @param {string} fontFamily - Font family
 * @param {number} fontSize - Font size
 * @param {string} fontWeight - Font weight
 * @param {string} fontStyle - Font style
 * @returns {number} - Character height
 */
const calculateCharHeightAsync = async (char, fontFamily, fontSize, fontWeight = 'normal', fontStyle = 'normal') => {
    const font = await this.getFontkitFontAsync(fontFamily);
    
    if (font && typeof font.layout === 'function') {
        try {
            // Use the layout method to get the glyph run
            const run = font.layout(char);
            
            if (run && run.glyphs && run.glyphs.length > 0) {
                // Get the glyph metrics
                const glyph = run.glyphs[0];
                
                // Calculate height based on ascent and descent
                // The total height is the sum of ascent (above baseline) and descent (below baseline)
                const ascent = (font.ascent / font.unitsPerEm) * fontSize;
                const descent = Math.abs((font.descent / font.unitsPerEm) * fontSize);
                
                return ascent + descent;
            }
        } catch (err) {
            console.error(`Error calculating height for character "${char}" using fontkit:`, err);
        }
    }
    
    // Fallback to a simple estimation if fontkit fails
    // For most fonts, the character height is approximately 1.5 times the font size
    let heightMultiplier = 1.5;
    
    // Adjust multiplier based on font weight
    const boldMultiplier = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600 ? 1.05 : 1.0;
    
    return fontSize * heightMultiplier * boldMultiplier;
}

/**
 * Calculate the maximum height of characters in a text string
 * @param {string} text - Text to measure
 * @param {Array} formattingRanges - Array of formatting ranges
 * @param {number} defaultFontSize - Default font size
 * @param {string} defaultFontFamily - Default font family
 * @param {number} offset - Starting position of the text within the full content
 * @returns {number} - Maximum character height
 */
const calculateMaxCharHeightAsync = async (text, formattingRanges = [], defaultFontSize = 12, defaultFontFamily = 'Arial', offset = 0) => {
    if (!text || text.length === 0) {
        return defaultFontSize * 1.5;
    }
    
    let maxHeight = 0;
    // Process each character
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const absolutePosition = offset + i; // Calculate absolute position using the offset
        
        // Find formatting for the character
        let fontSize = defaultFontSize;
        let fontFamily = defaultFontFamily;
        let fontWeight = 'normal';
        let fontStyle = 'normal';
        
        // Apply formatting if available
        for (const range of formattingRanges) {
            if (absolutePosition >= range.start && absolutePosition < range.end) {
                fontSize = range.fontSize || fontSize;
                fontFamily = range.fontFamily || fontFamily;
                fontWeight = range.fontWeight || fontWeight;
                fontStyle = range.fontStyle || fontStyle;
                break;
            }
        }
        
        // Calculate height for this character
        const charHeight = await calculateCharHeightAsync(
            char,
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle
        );
        
        // Update max height
        maxHeight = Math.max(maxHeight, charHeight);
    }
    return maxHeight;
}

/**
 * Calculate the width of a text string with mixed formatting
 * @param {string} text - Text to measure
 * @param {Array} formattingRanges - Array of formatting ranges
 * @param {number} defaultFontSize - Default font size
 * @param {string} defaultFontFamily - Default font family
 * @param {number} offset - Offset of this text within the overall content
 * @returns {number} - Text width
 */
const calculateTextWidthAsync = async (text, formattingRanges = [], defaultFontSize = 12, defaultFontFamily = 'Arial', offset = 0) => {
    if (!text) return 0;
    
    let totalWidth = 0;
    
    // If fontkit is available, try to measure the entire text at once for better accuracy
    if (this.fontkitAvailable) {
        // Check if the text has uniform formatting
        let uniformFormatting = formattingRanges.length === 0;
        if (formattingRanges.length === 1) {
            const range = formattingRanges[0];
            uniformFormatting = range.start <= offset && range.end >= offset + text.length;
        }
        
        if (uniformFormatting) {
            // Get formatting (either from the single range or defaults)
            const fontSize = formattingRanges.length === 1 ? (formattingRanges[0].fontSize || defaultFontSize) : defaultFontSize;
            const fontFamily = formattingRanges.length === 1 ? (formattingRanges[0].fontFamily || defaultFontFamily) : defaultFontFamily;
            const fontWeight = formattingRanges.length === 1 ? (formattingRanges[0].fontWeight || 'normal') : 'normal';
            const fontStyle = formattingRanges.length === 1 ? (formattingRanges[0].fontStyle || 'normal') : 'normal';
            
            const font = await this.getFontkitFontAsync(fontFamily);
            if (font && typeof font.layout === 'function') {
                try {
                    const run = font.layout(text);
                    if (run && run.positions && run.positions.length > 0) {
                        // Calculate total width from all glyph positions
                        const scale = fontSize / font.unitsPerEm;
                        totalWidth = run.positions.reduce((sum, pos) => sum + pos.xAdvance * scale, 0);
                        
                        // Apply bold multiplier if needed
                        if (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600) {
                            totalWidth *= 1.2;
                        }
                        
                        return totalWidth;
                    }
                } catch (err) {
                    console.error(`Error measuring text width with fontkit: ${err.message}`);
                    // Fall through to character-by-character measurement
                }
            }
        }
    }
    
    // Process each character individually (fallback or for mixed formatting)
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const absolutePosition = offset + i;
        
        // Find applicable formatting for this character
        let fontSize = defaultFontSize;
        let fontFamily = defaultFontFamily;
        let fontWeight = 'normal';
        let fontStyle = 'normal';
        
        // Apply formatting from ranges that include this character
        for (const range of formattingRanges) {
            if (absolutePosition >= range.start && absolutePosition < range.end) {
                fontSize = range.fontSize || fontSize;
                fontFamily = range.fontFamily || fontFamily;
                fontWeight = range.fontWeight || fontWeight;
                fontStyle = range.fontStyle || fontStyle;
                break; // Use the first applicable range
            }
        }
        
        try {
            // Calculate width for a character
            const charWidth = await calculateCharWidthAsync(char, fontFamily, fontSize, fontWeight, fontStyle);
            totalWidth += charWidth;
        } catch (err) {
            // Fallback to a simple estimation
            let charWidthMultiplier = 0.6;
            
            // Adjust multiplier based on character width
            if (/[mwWM]/.test(char)) {
                charWidthMultiplier = CHAR_WIDTH_MULTIPLIERS.wide * 0.6;
            } else if (/[iljtfI1]/.test(char)) {
                charWidthMultiplier = CHAR_WIDTH_MULTIPLIERS.narrow * 0.6;
            } else if (/[.,;:]/.test(char)) {
                charWidthMultiplier = CHAR_WIDTH_MULTIPLIERS.punctuation * 0.6;
            }
            
            totalWidth += fontSize * charWidthMultiplier;
        }
    }
    
    return totalWidth;
}
const fontCache = new FontCache();

module.exports = {fontCache};