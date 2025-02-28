/**
 * FontCache class for caching font information
 * Mirrors the Python implementation in templative-electron
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