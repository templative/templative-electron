const { JSDOM } = require('jsdom');
const { cleanupSvgNamespaces, fallbackPreprocessing, cleanupUnusedDefs } = require('./svgPreprocessor');
const { processTextElements } = require('./textProcessor');

function preprocessSvgText(svgData) {
    try {
      // Check if this looks like an Inkscape SVG with shape-inside
      if (svgData.includes('shape-inside:url(#')) {
        // console.log('Detected Inkscape SVG with potential SVG 2.0 features, preprocessing...');
        
        svgData = cleanupSvgNamespaces(svgData);
        
        // Parse the SVG using JSDOM
        const dom = new JSDOM(svgData, { contentType: 'image/svg+xml' });
        const document = dom.window.document;
        
        // Process text elements with shape-inside
        processTextElements(document);        
        return cleanupUnusedDefs(dom.serialize());
      }
      
      return svgData;
    } catch (error) {
      console.error(`Error in preprocessSvgText: ${error.message}`);
      console.error(error.stack);
      return svgData;
    }
  }

module.exports = {
    preprocessSvgText
}