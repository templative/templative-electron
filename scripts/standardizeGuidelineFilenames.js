const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

/**
 * Standardizes guideline filenames and removes duplicates
 */
async function standardizeGuidelineFilenames() {
  const guidelinesDir = path.join(__dirname, '../src/main/templative/lib/create/guidelines');
  
  try {
    // Get all files in the guidelines directory
    const files = await fs.readdir(guidelinesDir);
    
    // Track renamed files to avoid duplicates
    const renamedFiles = new Set();
    const skippedFiles = [];
    const renamedFilesMap = {};
    
    console.log(chalk.blue(`Processing ${files.length} files in guidelines directory...`));
    
    for (const file of files) {
      // Skip files that look like duplicates with (1), (2), etc.
      const filePath = path.join(guidelinesDir, file);
      
      // Skip directories
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        continue;
      }
      
      // Check if the file looks like a duplicate with (1), (2), etc.
      if (/\(\d+\)\.[^.]+$/.test(file)) {
        skippedFiles.push(file);
        console.log(chalk.yellow(`Skipping duplicate file: ${file}`));
        continue;
      }
      
      // Parse the filename
      const { name, ext } = path.parse(file);
      
      // Process the name to standardize it
      let standardizedName = name;
      
      // Replace [0-9]{2-3}Hook with HookBoxNumber
      const hookBoxMatch = name.match(/(\d{2,3})Hook/);
      if (hookBoxMatch) {
        const boxNumber = hookBoxMatch[1];
        standardizedName = name.replace(/(\d{2,3})Hook/, `HookBox${boxNumber}`);
      }
      const tuckBoxMatch = name.match(/(\d{2,3})Tuck/);
      if (tuckBoxMatch) {
        const boxNumber = tuckBoxMatch[1];
        standardizedName = name.replace(/(\d{2,3})Tuck/, `TuckBox${boxNumber}`);
      }
      // Create the new filename
      const newName = `${standardizedName}${ext}`;

      // If the new name already exists in our renamed set, skip it
      if (renamedFiles.has(newName)) {
        skippedFiles.push(file);
        console.log(chalk.yellow(`Skipping potential duplicate: ${file}`));
        continue;
      }
      
      const newPath = path.join(guidelinesDir, newName);
      
      // Rename the file
      await fs.rename(filePath, newPath);
      renamedFiles.add(newName);
      renamedFilesMap[file] = newName;
      
      console.log(chalk.green(`Renamed: ${file} -> ${newName}`));
    }
    
    console.log(chalk.blue('\nRename Summary:'));
    console.log(chalk.green(`Successfully renamed ${Object.keys(renamedFilesMap).length} files`));
    console.log(chalk.yellow(`Skipped ${skippedFiles.length} duplicate files`));
    
    if (skippedFiles.length > 0) {
      console.log(chalk.yellow('\nSkipped files (duplicates):'));
      skippedFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    console.log(chalk.blue('\nRename mapping:'));
    Object.entries(renamedFilesMap).forEach(([oldName, newName]) => {
      console.log(`  ${oldName} -> ${newName}`);
    });
    
  } catch (error) {
    console.error(chalk.red(`Error standardizing guideline filenames: ${error.message}`));
    process.exit(1);
  }
}

// Run the script
standardizeGuidelineFilenames().catch(err => {
  console.error(chalk.red(`Unhandled error: ${err.message}`));
  process.exit(1); 
});