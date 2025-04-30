/**
 * FontCache class for caching font information
 */
class FontCache {
  /**
   * Creates a new FontCache instance
   */
  constructor() {
    this.fontsCache = {};
    this.fontPathsCache = {};
    this.missingFonts = new Set();
  }
}

module.exports = { FontCache };