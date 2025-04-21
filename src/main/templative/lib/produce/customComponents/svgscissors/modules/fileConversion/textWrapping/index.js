const { JSDOM } = require('jsdom');
const { cleanupSvgNamespacesAsync, cleanupUnusedDefsAsync } = require('./svgPreprocessor');
const { processTextElementsAsync } = require('./textProcessor');

async function preprocessSvgTextAsync(svgData) {
    try {
      // Check if this looks like an Inkscape SVG with shape-inside
      if (!svgData.includes('shape-inside:url(#')) {
        return svgData;
      }
      console.log('Detected shape-inside, preprocessing...');
      svgData = await cleanupSvgNamespacesAsync(svgData);
        
      // Parse the SVG using JSDOM
      const dom = new JSDOM(svgData, { contentType: 'image/svg+xml' });
      const document = dom.window.document;
      
      // Process text elements with shape-inside
      await processTextElementsAsync(document);        
      return await cleanupUnusedDefsAsync(dom.serialize());
    } catch (error) {
      console.error(`Error in preprocessSvgTextAsync: ${error.message}`);
      console.error(error.stack);
      return svgData;
    }
  }

module.exports = {
    preprocessSvgTextAsync
}