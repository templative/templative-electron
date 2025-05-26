const { getScopedValue } = require('./valueResolver.js');
const { JSDOM } = require('jsdom');

async function textReplaceInFile(document, textReplacements, gamedata, productionProperties) {
  if (!document) {
      console.error("Warning: document is null or undefined");
      return;
  }

  try {
      for (const textReplacement of textReplacements) {
          const key = `{${textReplacement["key"]}}`;
          let value = await getScopedValue(textReplacement, gamedata);
          if (typeof value === 'string') {
              value = value.replace(/\\\\n/g, "\n");
          }
          value = await processValueFilters(value, textReplacement);

          const isComplex = textReplacement.isComplex ?? false;
          if (isComplex && productionProperties.isSimple) {
              value = "";
          }

          const isDebug = textReplacement.isDebugInfo ?? false;
          if (isDebug && productionProperties.isPublish) {
              value = "";
          }

          if (productionProperties.targetLanguage !== "en" && (textReplacement.isTranslateable ?? false) && value) {
              const translation = getTranslation("./", value, productionProperties.targetLanguage);
              if (translation) {
                  value = translation;
              } else {
                  console.log(`Could not translate ${value}`);
              }
          }
          const mainRoot = document.documentElement || 
                document.querySelector('svg') || 
                document.querySelector('svg\\:svg');
          if (!mainRoot) {
              throw new Error("Failed to find main root element in document");
          }
          // Replace text in DOM using TreeWalker for efficient text node traversal
          const walker = document.createTreeWalker(
              mainRoot,
              4, // NodeFilter.SHOW_TEXT
              null,
              false
          );

          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
              if (node.nodeValue && node.nodeValue.includes(key)) {
                  textNodes.push(node);
              }
          }

          // Replace text in collected text nodes
          for (const textNode of textNodes) {
              const newValue = textNode.nodeValue.replace(new RegExp(escapeRegExp(key), 'g'), value || "");
              
              // Check if the replacement value contains XML/HTML elements
              if (newValue.includes('<') && newValue.includes('>')) {
                  // Replace with actual XML elements
                  await replaceTextNodeWithXmlContent(textNode, newValue, document);
              } else {
                  // Simple text replacement
                  textNode.nodeValue = newValue;
              }
          }
      }
  } catch (error) {
      console.error(`Error in DOM text replacement: ${error.message}`);
  }
}

async function processValueFilters(value, textReplacement) {
  if ("filters" in textReplacement) {
      for (const filter of textReplacement["filters"]) {
          if (filter === "toUpper") {
              value = value.toUpperCase();
          }
      }
  }
  return String(value);
}

async function replaceTextNodeWithXmlContent(textNode, xmlContent, document) {
  try {
    const parent = textNode.parentNode;
    if (!parent) return;
    
    // Wrap the content in an SVG element for proper parsing
    const wrappedContent = `<svg xmlns="http://www.w3.org/2000/svg">${xmlContent}</svg>`;
    
    // Parse using JSDOM
    const tempDom = new JSDOM(wrappedContent, { contentType: 'image/svg+xml' });
    const tempDoc = tempDom.window.document;
    const tempRoot = tempDoc.documentElement;
    
    // Import and insert each child from the parsed content
    const childNodes = Array.from(tempRoot.childNodes);
    for (const child of childNodes) {
      if (child.nodeType === 1) { // Element node
        const importedElement = document.importNode(child, true);
        parent.insertBefore(importedElement, textNode);
      } else if (child.nodeType === 3) { // Text node
        const textContent = document.createTextNode(child.nodeValue);
        parent.insertBefore(textContent, textNode);
      }
    }
    
    // Remove the original text node
    parent.removeChild(textNode);
    
  } catch (error) {
    console.error(`Error replacing text node with XML content: ${error.message}`);
    // Fallback to text replacement
    textNode.nodeValue = xmlContent;
  }
}

/**
 * Escape special characters in a string for use in a regular expression
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  textReplaceInFile
}; 