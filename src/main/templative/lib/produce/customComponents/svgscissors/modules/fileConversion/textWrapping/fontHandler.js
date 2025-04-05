// Try to require fontkit, but don't fail if it's not available
const fontkit = require('fontkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Extract numeric property from style
 * @param {string} style - Style string
 * @param {string} propertyName - Property name
 * @returns {number|null} - Numeric value or null if not found
 */
function extractNumericPropertyFromStyle(style, propertyName) {
  if (!style) return null;
  
  const regex = new RegExp(`${propertyName}\\s*:\\s*([\\d.]+)`, 'i');
  const match = regex.exec(style);
  
  if (match) {
    return parseFloat(match[1]);
  }
  
  return null;
}

/**
 * Add font styles to SVG
 * @param {string} svgData - SVG content as string
 * @returns {string} - SVG with font styles
 */
function addFontStyles(svgData) {
  // Check if we already have a style element
  if (svgData.includes('<style>') || svgData.includes('<style ')) {
    return svgData;
  }
  
  // Add basic font styles
  const fontStyles = `
    <style>
      @font-face {
        font-family: 'Arial';
        font-style: normal;
        font-weight: normal;
        src: local('Arial');
      }
      @font-face {
        font-family: 'Helvetica';
        font-style: normal;
        font-weight: normal;
        src: local('Helvetica');
      }
      text {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  `;
  
  // Insert styles after the opening SVG tag
  return svgData.replace(/<svg([^>]*)>/, `<svg$1>${fontStyles}`);
}

/**
 * Font cache class for managing font information
 */
class FontCache {
  constructor() {
    this.fonts = new Map();
    this.fontkitFonts = new Map();
    this.initialized = false;
    this.fontkitAvailable = !!fontkit;
    
    // Initialize font paths based on OS
    this.fontPaths = this.getSystemFontPaths();
    
    // Character width multipliers for different character categories
    this.charWidthMultipliers = {
      wide: 1.5,      // m, w, W, M
      normal: 1.0,    // most characters
      narrow: 0.5,    // i, l, j, t, f, I, 1
      punctuation: 0.3 // ., ,, ;, :
    };
  }
  
  /**
   * Get system font paths based on OS
   * @returns {Object} - Map of font family to font path
   */
  getSystemFontPaths() {
    const fontPaths = {};
    const platform = os.platform();
    
    // Default paths for common fonts based on OS
    if (platform === 'darwin') {
      // macOS
      fontPaths['Arial'] = '/System/Library/Fonts/Supplemental/Arial.ttf';
      fontPaths['Helvetica'] = '/System/Library/Fonts/Helvetica.ttc';
      fontPaths['Times'] = '/System/Library/Fonts/Times.ttc';
      fontPaths['Courier'] = '/System/Library/Fonts/Courier.ttc';
      fontPaths['Verdana'] = '/Library/Fonts/Verdana.ttf';
      fontPaths['Georgia'] = '/Library/Fonts/Georgia.ttf';
    } else if (platform === 'win32') {
      // Windows
      const winFontDir = 'C:\\Windows\\Fonts\\';
      fontPaths['Arial'] = winFontDir + 'arial.ttf';
      fontPaths['Helvetica'] = winFontDir + 'helvetica.ttf';
      fontPaths['Times New Roman'] = winFontDir + 'times.ttf';
      fontPaths['Courier New'] = winFontDir + 'cour.ttf';
      fontPaths['Verdana'] = winFontDir + 'verdana.ttf';
      fontPaths['Georgia'] = winFontDir + 'georgia.ttf';
    } else {
      // Linux and others
      fontPaths['Arial'] = '/usr/share/fonts/truetype/msttcorefonts/Arial.ttf';
      fontPaths['Helvetica'] = '/usr/share/fonts/truetype/msttcorefonts/helvetica.ttf';
      fontPaths['Times'] = '/usr/share/fonts/truetype/msttcorefonts/Times_New_Roman.ttf';
      fontPaths['Courier'] = '/usr/share/fonts/truetype/msttcorefonts/Courier_New.ttf';
    }
    
    return fontPaths;
  }
  
  /**
   * Try to find a font file on the system
   * @param {string} fontFamily - Font family to find
   * @returns {string|null} - Path to font file or null if not found
   */
  findFontFile(fontFamily) {
    const normalizedFontFamily = this.normalizeFontFamily(fontFamily);
    
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
      if (!fs.existsSync(dir)) continue;
      
      for (const variation of variations) {
        const fontPath = path.join(dir, variation);
        if (fs.existsSync(fontPath)) {
          // Cache the path for future use
          this.fontPaths[normalizedFontFamily] = fontPath;
          return fontPath;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Initialize the font cache
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Load default font metrics
      this.fonts.set('Arial', {
        avgCharWidth: 0.6,
        lineHeight: 1.2
      });
      
      this.fonts.set('Helvetica', {
        avgCharWidth: 0.6,
        lineHeight: 1.2
      });
      
      // Load fonts with fontkit if available
      if (this.fontkitAvailable) {
        for (const [fontName, fontPath] of Object.entries(this.fontPaths)) {
          try {
            if (fs.existsSync(fontPath)) {
              // console.log(`Loading font ${fontName} from ${fontPath}`);
              const font = fontkit.openSync(fontPath);
              
              // Test if the font has the expected methods
              if (font && typeof font.layout === 'function') {
                this.fontkitFonts.set(fontName, font);
                // console.log(`Successfully loaded font ${fontName} with fontkit`);
              } else {
                // console.warn(`Font ${fontName} loaded but doesn't have expected methods`);
              }
            } else {
              // console.warn(`Font file not found: ${fontPath}`);
            }
          } catch (err) {
            console.error(`Error loading font ${fontName} with fontkit:`, err);
          }
        }
      } else {
        // console.warn('fontkit not available, using fallback font metrics');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error(`Error initializing font cache: ${error.message}`);
      this.initialized = true; // Mark as initialized anyway to prevent repeated attempts
    }
  }
  
  /**
   * Get font information
   * @param {string} fontFamily - Font family
   * @returns {Object} - Font information
   */
  getFontInfo(fontFamily) {
    if (!this.initialized) {
      console.warn('Font cache not initialized');
      return { avgCharWidth: 0.6, lineHeight: 1.2 };
    }
    
    const normalizedFontFamily = this.normalizeFontFamily(fontFamily);
    
    if (this.fonts.has(normalizedFontFamily)) {
      return this.fonts.get(normalizedFontFamily);
    }
    
    // Return default values if font not found
    return { avgCharWidth: 0.6, lineHeight: 1.2 };
  }
  
  /**
   * Get fontkit font object
   * @param {string} fontFamily - Font family
   * @returns {Object|null} - Fontkit font object or null if not found
   */
  getFontkitFont(fontFamily) {
    if (!this.initialized) {
      this.initialize();
    }
    
    if (!this.fontkitAvailable) {
      return null;
    }
    
    const normalizedFontFamily = this.normalizeFontFamily(fontFamily);
    
    // Check if we already have the font loaded
    if (this.fontkitFonts.has(normalizedFontFamily)) {
      return this.fontkitFonts.get(normalizedFontFamily);
    }
    
    // Try to find the font file
    let fontPath = this.fontPaths[normalizedFontFamily];
    
    // If not found in predefined paths, try to find it on the system
    if (!fontPath || !fs.existsSync(fontPath)) {
      fontPath = this.findFontFile(normalizedFontFamily);
    }
    
    // If we found a font path, try to load it with fontkit
    if (fontPath && fs.existsSync(fontPath)) {
      try {
        // For TrueType Collection (.ttc) files
        if (fontPath.toLowerCase().endsWith('.ttc') || fontPath.toLowerCase().endsWith('.dfont')) {
          const collection = fontkit.openSync(fontPath);
          
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
          const font = fontkit.openSync(fontPath);
          this.fontkitFonts.set(normalizedFontFamily, font);
          return font;
        }
      } catch (err) {
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
  
  /**
   * Calculate the width of a character using fontkit
   * @param {string} char - Character to measure
   * @param {string} fontFamily - Font family
   * @param {number} fontSize - Font size
   * @param {string} fontWeight - Font weight
   * @param {string} fontStyle - Font style
   * @returns {number} - Character width
   */
  calculateCharWidth(char, fontFamily, fontSize, fontWeight = 'normal', fontStyle = 'normal') {
    const font = this.getFontkitFont(fontFamily);
    
    if (font && typeof font.layout === 'function') {
      try {
        // Use the layout method to get the glyph run
        const run = font.layout(char);
        
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
      charWidthMultiplier *= this.charWidthMultipliers.wide;
    } else if (/[iljtfI1]/.test(char)) {
      charWidthMultiplier *= this.charWidthMultipliers.narrow;
    } else if (/[.,;:]/.test(char)) {
      charWidthMultiplier *= this.charWidthMultipliers.punctuation;
    } else {
      charWidthMultiplier *= this.charWidthMultipliers.normal;
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
  calculateCharHeight(char, fontFamily, fontSize, fontWeight = 'normal', fontStyle = 'normal') {
    const font = this.getFontkitFont(fontFamily);
    
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
  calculateMaxCharHeight(text, formattingRanges = [], defaultFontSize = 12, defaultFontFamily = 'Arial', offset = 0) {
    if (!text || text.length === 0) {
      return defaultFontSize * 1.5;
    }
    
    let maxHeight = 0;
    // Process each character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const absolutePosition = offset + i; // Calculate absolute position using the offset
      
      // Find formatting for this character
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
      const charHeight = this.calculateCharHeight(
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
  calculateTextWidth(text, formattingRanges = [], defaultFontSize = 12, defaultFontFamily = 'Arial', offset = 0) {
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
        
        const font = this.getFontkitFont(fontFamily);
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
        // Calculate width for this character
        const charWidth = this.calculateCharWidth(char, fontFamily, fontSize, fontWeight, fontStyle);
        totalWidth += charWidth;
      } catch (err) {
        // Fallback to a simple estimation
        let charWidthMultiplier = 0.6;
        
        // Adjust multiplier based on character width
        if (/[mwWM]/.test(char)) {
          charWidthMultiplier = this.charWidthMultipliers.wide * 0.6;
        } else if (/[iljtfI1]/.test(char)) {
          charWidthMultiplier = this.charWidthMultipliers.narrow * 0.6;
        } else if (/[.,;:]/.test(char)) {
          charWidthMultiplier = this.charWidthMultipliers.punctuation * 0.6;
        }
        
        totalWidth += fontSize * charWidthMultiplier;
      }
    }
    
    return totalWidth;
  }
  
  /**
   * Normalize font family name
   * @param {string} fontFamily - Font family
   * @returns {string} - Normalized font family
   */
  normalizeFontFamily(fontFamily) {
    if (!fontFamily) return 'Arial';
    
    // Remove quotes and extra spaces
    let normalized = fontFamily.replace(/["']/g, '').trim();
    
    // If there are multiple fonts, use the first one
    if (normalized.includes(',')) {
      normalized = normalized.split(',')[0].trim();
    }
    
    return normalized;
  }
}

// Create a singleton instance
const fontCache = new FontCache();

/**
 * Extract font size from a text element
 * @param {Element} textElement - Text element
 * @returns {number} - Font size
 */
function extractFontSize(textElement) {
  const style = textElement.getAttribute('style') || '';
  const fontSizeMatch = style.match(/font-size:([^;]+)/);
  
  if (fontSizeMatch) {
    const fontSizeStr = fontSizeMatch[1].trim();
    if (fontSizeStr.endsWith('px')) {
      return parseFloat(fontSizeStr.slice(0, -2));
    }
    return parseFloat(fontSizeStr);
  }
  
  return 12; // Default font size
}

/**
 * Estimate line height based on the font size and line-height style
 * @param {Element} textElement - Text element
 * @returns {number} - Line height
 */
function estimateLineHeight(textElement) {
  const fontSize = extractFontSize(textElement);
  const style = textElement.getAttribute('style') || '';
  const lineHeightMatch = style.match(/line-height:([^;]+)/);
  
  if (lineHeightMatch) {
    const lineHeightStr = lineHeightMatch[1].trim();
    if (lineHeightStr.endsWith('px')) {
      return parseFloat(lineHeightStr.slice(0, -2));
    } else if (lineHeightStr.endsWith('%')) {
      return fontSize * parseFloat(lineHeightStr.slice(0, -1)) / 100;
    }
    return parseFloat(lineHeightStr) * fontSize;
  }
  
  // Default line height is 1.2 times the font size
  // This is a minimum - actual line height may be larger based on tallest character
  return fontSize * 1.2;
}

/**
 * Calculate line height based on the tallest character in the line
 * @param {string} line - Line of text
 * @param {number} fontSize - Base font size
 * @param {Array} formattingRanges - Formatting ranges
 * @param {Object} fontInfo - Font information
 * @param {number} offset - Starting position of the line within the full content
 * @returns {number} - Line height based on tallest character
 */
function calculateLineHeightForLine(line, fontSize, formattingRanges = [], fontInfo = {}, offset = 0) {
  if (!line || line.trim().length === 0) {
    return fontSize * (fontInfo.lineHeight || 1.2); // Default for empty lines
  }
  
  // Get the maximum character height in the line
  const maxCharHeight = fontCache.calculateMaxCharHeight(
    line,
    formattingRanges,
    fontSize,
    fontInfo.fontFamily || 'Arial',
    offset // Pass the offset to calculateMaxCharHeight
  );
  
  // For lines with normal text, use the line-height parameter from the SVG
  // For lines with very large text (like 90px "End"), adjust the spacing
  // to prevent excessive line heights
  let lineHeightMultiplier = fontInfo.lineHeight || 1.25; // Use the extracted line-height or default to 1.25
  lineHeightMultiplier *= 0.8;
  // For very large text, we might need to adjust the line height multiplier
  // to prevent excessive spacing
  // if (maxCharHeight > fontSize * 2) {
  //   // For lines with very large text, use a slightly reduced line height
  //   // but still respect the original line-height parameter
  //   lineHeightMultiplier = Math.max(0.9, lineHeightMultiplier * 0.9);
  // }
  
  // console.log(`Using line-height multiplier: ${lineHeightMultiplier} for line: "${line}" at offset ${offset}`);
  
  return maxCharHeight * lineHeightMultiplier;
}

/**
 * Extract font attributes from a text element or tspan
 * @param {Element} element - Text element or tspan
 * @returns {Object} - Font attributes
 */
function extractFontAttributes(element) {
  const style = element.getAttribute('style') || '';
  
  // Extract font attributes from style
  const fontFamily = style.match(/font-family:\s*([^;]+)/) ? 
    style.match(/font-family:\s*([^;]+)/)[1].trim() : 
    element.getAttribute('font-family') || 'Arial';
  
  const fontSize = extractFontSize(element);
  
  const fontWeight = style.match(/font-weight:\s*([^;]+)/) ? 
    style.match(/font-weight:\s*([^;]+)/)[1].trim() : 
    element.getAttribute('font-weight') || 'normal';
  
  const fontStyle = style.match(/font-style:\s*([^;]+)/) ? 
    style.match(/font-style:\s*([^;]+)/)[1].trim() : 
    element.getAttribute('font-style') || 'normal';
  
  // Extract line-height from style or use default
  let lineHeight = 1.25; // Default line-height
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
  
  return {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight
  };
}

module.exports = {
  extractNumericPropertyFromStyle,
  addFontStyles,
  FontCache,
  fontCache,
  estimateLineHeight,
  extractFontSize,
  calculateLineHeightForLine,
  extractFontAttributes
}; 