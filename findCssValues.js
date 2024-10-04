const fs = require('fs');
const path = require('path');

// Define the fields to look for
const cssFields = {
  fontSizes: /font-size\s*:\s*([^;]+);/g,
  fontWeights: /font-weight\s*:\s*([^;]+);/g,
  lineHeights: /line-height\s*:\s*([^;]+);/g,
  colors: /color\s*:\s*([^;]+);/g,
  margins: /margin\s*:\s*([^;]+);/g,
  paddings: /padding\s*:\s*([^;]+);/g,
  widths: /width\s*:\s*([^;]+);/g,
  heights: /height\s*:\s*([^;]+);/g,
  boxShadows: /box-shadow\s*:\s*([^;]+);/g,
  borderRadius: /border-radius\s*:\s*([^;]+);/g,
  borderWidths: /border-width\s*:\s*([^;]+);/g,
  opacities: /opacity\s*:\s*([^;]+);/g,
};

// Recursively walk through a directory and process files
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (path.extname(fullPath) === '.css') {
      callback(fullPath);
    }
  });
}

// Extract values based on regex
function extractValues(content, regex) {
  const matches = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.add(match[1].trim());
  }
  return Array.from(matches);
}

// Main function to gather CSS values
function gatherCssValues(directory) {
  const result = {
    fontSizes: new Set(),
    fontWeights: new Set(),
    lineHeights: new Set(),
    colors: new Set(),
    margins: new Set(),
    paddings: new Set(),
    widths: new Set(),
    heights: new Set(),
    boxShadows: new Set(),
    borderRadius: new Set(),
    borderWidths: new Set(),
    opacities: new Set(),
  };

  walkDir(directory, (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const [key, regex] of Object.entries(cssFields)) {
      extractValues(content, regex).forEach(value => result[key].add(value));
    }
  });

  // Convert Set to Array for JSON output
  for (const key in result) {
    result[key] = Array.from(result[key]);
  }

  // Write the result to a JSON file
  fs.writeFileSync('C:/Users/olive/Documents/git/templative-electron/cssValues.json', JSON.stringify(result, null, 2));
}

// Specify the directory to search (change './your-directory' to your directory path)
gatherCssValues('C:/Users/olive/Documents/git/templative-electron/src');
