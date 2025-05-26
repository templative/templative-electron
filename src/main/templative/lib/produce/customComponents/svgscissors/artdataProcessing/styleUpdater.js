const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { getScopedValue } = require('./valueResolver.js');
const { sanitizeSvgContent } = require('./svgCleaner.js');

async function updateStylesInFile(document, styleUpdates, pieceGamedata) {
  if (!document) {
      console.error("Warning: document is null or undefined");
      return;
  }

  try {
      for (const styleUpdate of styleUpdates) {
          const findById = styleUpdate["id"];
          const elementToUpdate = document.getElementById(findById);
          
          if (elementToUpdate !== null) {
              const value = await getScopedValue(styleUpdate, pieceGamedata);
              await replaceStyleAttributeForElement(elementToUpdate, "style", styleUpdate["cssValue"], value);
          } else {
              console.log(`Could not find element with id [${findById}].`);
          }
      }
  } catch (error) {
      console.error(`Error updating styles in DOM: ${error.message}`);
  }
}

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
  updateStylesInFile
}; 