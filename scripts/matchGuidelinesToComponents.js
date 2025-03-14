const fs = require('fs');
const path = require('path');
const { COMPONENT_INFO } = require('../src/shared/componentInfo');
const { JSDOM } = require('jsdom');
// Path to the guidelines directory
const guidelinesDir = path.join(__dirname, '../src/main/templative/lib/create/guidelines');

// Get all files in the guidelines directory
const guidelineFiles = fs.readdirSync(guidelinesDir);

// Function to normalize a string for comparison
function normalizeString(str) {
  var normalized = str.toLowerCase()
  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.slice(prefix.length);
    }
  }
  return normalized
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// List of suffixes to remove before matching
const suffixes = ['back', 'front', "evennumberedpage", "oddnumberedpage", "20pg", "40pg", "top", "face", "bottom", "inside", "outside", "inner", "outer", "cover", "page", "spine", "even", "odd", "toponly"];
const prefixes = ["foil"]

var fileNames = []

guidelineFiles.forEach(file => {
  if (fs.statSync(path.join(guidelinesDir, file)).isDirectory() || file === '.DS_Store') {
    return;
  }
  fileNames.push(path.parse(file).name)
})
var components = {...COMPONENT_INFO}
var normalizedComponents = {}
for (const componentKey in components) {
    normalizedComponents[normalizeString(componentKey)] = componentKey
}
var componentFileNameToComponentTypeKeyMappings = {}
function lookForComponentTypesForEachTemplateFile() {
    for (const fileName of fileNames) {
        const normalizedFileName = normalizeString(fileName)
        // console.log(normalizedFileName)
        if (normalizedComponents[normalizedFileName]) {
            componentFileNameToComponentTypeKeyMappings[fileName] = normalizedComponents[normalizedFileName]
        }
        else {
            for (const suffix of suffixes) {
                // console.log(suffix, "")
                const normalizedFileNameWithoutSuffix = normalizedFileName.replace(suffix, "")
                // console.log(normalizedFileNameWithoutSuffix)
                if (normalizedComponents[normalizedFileNameWithoutSuffix]) {
                    componentFileNameToComponentTypeKeyMappings[fileName] = normalizedComponents[normalizedFileNameWithoutSuffix]
                    break;
                }
            }
        }
        if (!componentFileNameToComponentTypeKeyMappings[fileName]) {
            console.log(`${fileName} is not a component type`)
        }
    }
}
lookForComponentTypesForEachTemplateFile()
for (const fileName in componentFileNameToComponentTypeKeyMappings) {
    var componentInfo = components[componentFileNameToComponentTypeKeyMappings[fileName]]
    let svg;
    try {
        svg = fs.readFileSync(path.join(guidelinesDir, fileName + ".svg"), "utf8");
    } catch (error) {
        console.log(`Could not read file for ${fileName}.`);
        continue;
    }
    if (fileName === "BigMat") {
        console.log("BigMat")
    }

    const dom = new JSDOM(svg)
    const document = dom.window.document
    const svgElement = document.querySelector("svg")
    const correctWidth = componentInfo.DimensionsPixels[0]
    const correctHeight = componentInfo.DimensionsPixels[1]
    
    // Set the size and viewbox of the svg element
    svgElement.setAttribute("width", correctWidth)
    svgElement.setAttribute("height", correctHeight)
    svgElement.setAttribute("viewBox", `0 0 ${correctWidth} ${correctHeight}`)

    // Replace the existing text element removal code with this more thorough approach
    // First, get all text elements using querySelectorAll
    const textElements = document.querySelectorAll("text")
    textElements.forEach(textElement => {
        textElement.remove()
    })
    
    // Some SVGs might have text elements in nested groups or with different namespaces
    // Try a more aggressive approach to find and remove all text elements
    const svgNS = "http://www.w3.org/2000/svg"
    
    // Remove elements by tag name (works for some SVGs where querySelectorAll might miss elements)
    const removeElementsByTagName = (tagName) => {
        const elements = document.getElementsByTagName(tagName)
        while (elements.length > 0) {
            if (elements[0].parentNode) {
                elements[0].parentNode.removeChild(elements[0])
            } else {
                break // Avoid infinite loop if element can't be removed
            }
        }
    }
    
    // Try multiple approaches to ensure all text elements are removed
    removeElementsByTagName("text")
    
    // Also check for tspan elements which are often used within text elements
    removeElementsByTagName("tspan")
    
    // Check if any text elements remain
    const remainingTextElements = document.querySelectorAll("text").length
    if (remainingTextElements > 0) {
        console.log(`${fileName} still has ${remainingTextElements} text elements after removal attempts.`)
    }
    
    // Get just the SVG element's outer HTML, not the entire document
    const serializedSvg = svgElement.outerHTML
    fs.writeFileSync(path.join(guidelinesDir, fileName + ".svg"), serializedSvg)

    // Get existing template files or initialize empty array
    let templateFiles = componentInfo.TemplateFiles || []
    
    // Only add the filename if it's not already in the array
    if (!templateFiles.includes(fileName)) {
        templateFiles.push(fileName)
    }
    
    componentInfo.TemplateFiles = templateFiles
}

const contents = `const COMPONENT_INFO = ${JSON.stringify(components, null, 4)} 
module.exports = { COMPONENT_INFO }`

fs.writeFileSync(path.join(__dirname, "../src/shared/componentInfo.js"), contents)