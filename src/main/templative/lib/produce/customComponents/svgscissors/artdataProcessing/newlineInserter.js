/**
 * Add newlines to SVG content for better readability in certain contexts
 * @param {string} contents - SVG content
 * @returns {Promise<string>} - SVG content with added newlines
 */
async function addNewlines(contents) {
    if (!contents) {
        return "";
    }
    
    // Add newlines after closing tags for better readability
    return contents.replace(/NEWLINE/g, "\n");
}

module.exports = {
    addNewlines
}; 