const fs = require('fs');
const path = require('path');

// Configuration
const IMAGE_DIR = '/Users/oliverbarnum/Documents/git/templative-electron/src/assets/images/componentPreviewImages';
const COMMON_COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Orange', 'Gray', 'Brown', 'Pink', 'Cyan', 'Magenta', 'Gold', 'Silver', 'Bronze'];

/**
 * Find components with color variants
 * @param {string[]} filenames - Array of filenames to process
 * @returns {Object} Map of base components to their color variants
 */
function findColorVariants(filenames) {
  const baseComponents = {};
  
  // Identify components with color variants
  filenames.forEach(filename => {
    const nameWithoutExt = path.parse(filename).name;
    let baseName = nameWithoutExt;
    let colorFound = null;
    
    // Check if the filename ends with a known color
    for (const color of COMMON_COLORS) {
      if (nameWithoutExt.endsWith(color)) {
        baseName = nameWithoutExt.substring(0, nameWithoutExt.length - color.length);
        colorFound = color;
        break;
      }
    }
    
    // Only process files with color suffixes
    if (colorFound) {
      if (!baseComponents[baseName]) {
        baseComponents[baseName] = [];
      }
      
      baseComponents[baseName].push({
        filename,
        color: colorFound
      });
    }
  });
  
  // Filter out components with fewer than 3 color variants
  return Object.keys(baseComponents)
    .filter(component => baseComponents[component].length >= 3)
    .reduce((filtered, component) => {
      filtered[component] = baseComponents[component];
      return filtered;
    }, {});
}

/**
 * Main function to analyze image files and identify color variants
 */
function analyzeImageFiles() {
  try {
    // Read all files from the directory
    const files = fs.readdirSync(IMAGE_DIR)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
      });
    
    if (files.length === 0) {
      console.log('No image files found in the specified directory.');
      return;
    }
    
    console.log(`Found ${files.length} image files.`);
    
    // Find components with color variants
    const colorVariants = findColorVariants(files);
    
    // Print the results
    console.log('\nColor Variant Analysis:');
    console.log('=======================');
    
    let totalSavings = 0;
    
    if (Object.keys(colorVariants).length === 0) {
      console.log('No components with 3 or more color variants found.');
    } else {
      Object.keys(colorVariants)
        .sort((a, b) => colorVariants[b].length - colorVariants[a].length) // Sort by number of variants
        .forEach(baseName => {
          const variants = colorVariants[baseName];
          const variantCount = variants.length;
          
          // Calculate potential time savings (variants - 1)
          const potentialSavings = variantCount - 1;
          totalSavings += potentialSavings;
          
          console.log(`Component: "${baseName}" (${variantCount} color variants, potential savings: ${potentialSavings})`);
        });
    }
    
    console.log(`\nTotal potential time savings: ${totalSavings} operations`);
    
    // Save results to a JSON file for later use
    const outputData = {
      totalFiles: files.length,
      colorVariants: colorVariants,
      potentialTimeSavings: totalSavings,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'color-variant-analysis.json'), 
      JSON.stringify(outputData, null, 2)
    );
    
    console.log('\nAnalysis complete! Results saved to color-variant-analysis.json');
    
  } catch (error) {
    console.error('Error analyzing image files:', error);
  }
}

// Run the analysis if this script is executed directly
if (require.main === module) {
  analyzeImageFiles();
}

module.exports = { analyzeImageFiles, findColorVariants };