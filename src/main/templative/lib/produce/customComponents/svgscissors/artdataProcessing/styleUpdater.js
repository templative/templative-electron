const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { getScopedValue } = require('./valueResolver.js');
const { sanitizeSvgContent } = require('../modules/svgElementConverter.js');

/**
 * Update styles in SVG content
 * @param {string} contents - SVG content
 * @param {Array} styleUpdates - Array of style updates
 * @param {Object} pieceGamedata - Game data
 * @returns {Promise<string>} - SVG content with updated styles
 */

async function updateStylesInFile(contents, styleUpdates, pieceGamedata) {
  if (!contents) {
      console.error("Warning: contents is null or undefined");
      return "";
  }

  try {
      // Try to sanitize the SVG content before parsing
      contents = sanitizeSvgContent(contents);
      
      const parser = new DOMParser({
          errorHandler: {
              warning: function(w) { console.warn("Warning: ", w); },
              error: function(e) { console.error("Error: ", e); },
              fatalError: function(e) { console.error("Fatal Error: ", e); }
          }
      });
      
      const doc = parser.parseFromString(contents, 'image/svg+xml');
      
      // Check if doc is valid
      if (!doc || !doc.documentElement) {
          console.error("Error: Invalid document after parsing");
          return contents;
      }
      
      for (const styleUpdate of styleUpdates) {
          const findById = styleUpdate["id"];
          // Use getElementsByTagName and filter by id instead of querySelector
          const elements = doc.getElementsByTagName("*");
          let elementToUpdate = null;
          
          for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              if (element.getAttribute('id') === findById) {
                  elementToUpdate = element;
                  break;
              }
          }
          
          if (elementToUpdate !== null) {
              const value = await getScopedValue(styleUpdate, pieceGamedata);
              await replaceStyleAttributeForElement(elementToUpdate, "style", styleUpdate["cssValue"], value);
          } else {
              console.log(`Could not find element with id [${findById}].`);
          }
      }
      
      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
  } catch (error) {
      console.error(`Error updating styles: ${error.message}`);
      return contents;
  }
}
/**
 * Replace style attribute for an element
 * @param {Element} element - Element to update
 * @param {string} attribute - Attribute to update
 * @param {string} key - Key to update
 * @param {string} value - New value
 * @returns {Promise<void>}
 */
async function replaceStyleAttributeForElement(element, attribute, key, value) {
  const attributeValue = element.getAttribute(attribute) ?? "";
  let replaceStyleWith = "";
  let found = false;

  const cssKeyValuePairs = attributeValue.split(';');
  for (const cssKeyValuePair of cssKeyValuePairs) {
      const keyAndPair = cssKeyValuePair.split(':');
      if (keyAndPair[0] === key) {
          replaceStyleWith += `${key}:${value};`;
          found = true;
      } else {
          replaceStyleWith += cssKeyValuePair + ';';
      }
  }

  if (!found) {
      replaceStyleWith += `${key}:${value};`;
  }

  if (replaceStyleWith.endsWith(";")) {
      replaceStyleWith = replaceStyleWith.slice(0, -1);
  }
  element.setAttribute(attribute, replaceStyleWith);
}

module.exports = {
  updateStylesInFile,
  replaceStyleAttributeForElement
}; 