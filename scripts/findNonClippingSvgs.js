const fs = require('fs');
const path = require('path');

// Function to check if a file contains clipping ID
function hasClippingId(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check for both single and double quotes, ignoring whitespace
        return /id\s*=\s*['"]clipping['"]/.test(content);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return false;
    }
}

// Function to find all SVG files in a directory
function findSvgFiles(directory) {
    try {
        const files = fs.readdirSync(directory);
        return files.filter(file => file.toLowerCase().endsWith('.svg'))
                   .map(file => path.join(directory, file));
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
        return [];
    }
}

// Main function to find SVGs without clipping IDs
function findNonClippingSvgs(directory) {
    const svgFiles = findSvgFiles(directory);
    const nonClippingFiles = svgFiles.filter(file => !hasClippingId(file));
    
    console.log('\nSVG files without clipping IDs:');
    console.log('===============================');
    if (nonClippingFiles.length === 0) {
        console.log('No files found without clipping IDs');
    } else {
        nonClippingFiles.forEach(file => {
            console.log(path.basename(file));
        });
    }
    console.log(`\nTotal files checked: ${svgFiles.length}`);
    console.log(`Files without clipping IDs: ${nonClippingFiles.length}`);
}

// Get directory from command line argument or use current directory
const targetDir = process.argv[2] || '.';
console.log(`Searching in directory: ${targetDir}`);
findNonClippingSvgs(targetDir); 