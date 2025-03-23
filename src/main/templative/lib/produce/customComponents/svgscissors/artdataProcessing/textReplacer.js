const { getScopedValue } = require('./valueResolver.js');

/**
 * Replace text in SVG content
 * @param {string} contents - SVG content
 * @param {Array} textReplacements - Array of text replacements
 * @param {Object} gamedata - Game data
 * @param {Object} productionProperties - Production properties
 * @returns {Promise<string>} - SVG content with text replacements
 */
async function textReplaceInFile(contents, textReplacements, gamedata, productionProperties) {
  if (!contents) {
      console.error("Warning: contents is null or undefined");
      return "";
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
          
          // Do NOT escape XML special characters for text replacements
          // This allows XML tags like <tspan> to be properly injected
          
          // Replace all occurrences of the key with the value using a global regex
          const regex = new RegExp(escapeRegExp(key), 'g');
          contents = contents.replace(regex, value || "");
      }
      return contents;
  } catch (error) {
      console.error(`Error in text replacement: ${error.message}`);
      return contents;
  }
}

/**
 * Process value filters
 * @param {string} value - Value to process
 * @param {Object} textReplacement - Text replacement object
 * @returns {Promise<string>} - Processed value
 */
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

/**
 * Escape special characters in a string for use in a regular expression
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  textReplaceInFile,
  processValueFilters,
  escapeRegExp
}; 