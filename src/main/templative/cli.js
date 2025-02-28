#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { version } = require('../../../../templative-js/package.json');
const { glob } = require('glob');
const Anthropic = require('@anthropic-ai/sdk');
// Add dotenv to load environment variables from .env file
require('dotenv').config();

// Import templative commands
const { create, produce, manage, distribute } = require('./api/index');

program
  .name('templative')
  .description('Templative game development toolkit')
  .version(version);

// SVG to PNG conversion command
program
  .command('convert <input>')
  .description('Convert SVG to PNG at 300 DPI')
  .option('-d, --dpi <dpi>', 'DPI for conversion (default: 300)', '300')
  .option('-o, --output <output>', 'Output filename (default: same as input with .png extension)')
  .action(convertSvgToPng);

// Python to JavaScript conversion command
program
  .command('py2js')
  .description('Convert Python files to JavaScript using Anthropic AI')
  .requiredOption('-p, --package <packageJsonPath>', 'Path to package.json file')
  .requiredOption('-f, --pipfile <pipfilePath>', 'Path to Pipfile')
  .requiredOption('-i, --input <inputDir>', 'Input directory containing Python files')
  .requiredOption('-o, --output <outputDir>', 'Output directory for JavaScript files')
  .option('-s, --single', 'Convert only a single Python file (relative to input directory)')
  .option('--force', 'Force conversion of files that already exist in the output directory')
  .action(convertPythonToJs);

// Add templative commands
program.addCommand(create);
program.addCommand(produce.produce);
program.addCommand(produce.preview);
program.addCommand(manage);
program.addCommand(distribute);

program.parse(process.argv);

// Show help when no arguments provided
if (process.argv.length <= 2) {
  program.help();
}

/**
 * Convert SVG to PNG at specified DPI
 * @param {string} input - Input SVG file path
 * @param {Object} options - Command options
 */
async function convertSvgToPng(input, options) {
  try {
    const dpi = parseInt(options.dpi, 10);
    const output = options.output || input.replace(/\.svg$/i, '.png');
    
    console.log(chalk.blue(`Converting ${input} to PNG at ${dpi} DPI...`));
    
    // Read SVG file
    const svgData = fs.readFileSync(input, 'utf8');
    
    // Extract dimensions
    const dimensions = extractSvgDimensions(svgData);
    
    // Calculate pixel dimensions for specified DPI
    // Assuming SVG units are in points (1/72 inch)
    const pxWidth = Math.round((dimensions.width / 72) * dpi);
    const pxHeight = Math.round((dimensions.height / 72) * dpi);
    
    // Render with resvg
    const resvg = new Resvg(svgData, {
      font: {
        loadSystemFonts: true,
      },
      fitTo: {
        mode: 'width',
        value: pxWidth
      },
      logLevel: 'error'
    });
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    // Save PNG file
    fs.writeFileSync(output, pngBuffer);
    
    console.log(chalk.green(`✓ Conversion complete: ${output} (${pxWidth}x${pxHeight} pixels @ ${dpi} DPI)`));
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Extract width and height from SVG data
 * @param {string} svgData - SVG file content
 * @returns {Object} - Width and height
 */
function extractSvgDimensions(svgData) {
  const viewBoxMatch = svgData.match(/viewBox=["']([^"']*)["']/);
  let width = 0;
  let height = 0;
  
  if (viewBoxMatch && viewBoxMatch[1]) {
    const [, , w, h] = viewBoxMatch[1].split(/\s+/).map(parseFloat);
    width = w;
    height = h;
  } else {
    // Try to get width/height attributes if viewBox not present
    const widthMatch = svgData.match(/width=["']([^"']*)["']/);
    const heightMatch = svgData.match(/height=["']([^"']*)["']/);
    
    if (widthMatch && heightMatch) {
      width = parseFloat(widthMatch[1]);
      height = parseFloat(heightMatch[1]);
    } else {
      // Default values if dimensions cannot be determined
      width = 1000;
      height = 1000;
      console.log(chalk.yellow('Could not determine SVG dimensions, using defaults.'));
    }
  }
  
  return { width, height };
}

/**
 * Convert Python files to JavaScript using Anthropic AI
 * @param {Object} options - Command options
 */
async function convertPythonToJs(options) {
  try {
    // Validate and initialize
    const anthropic = initializeAnthropic();
    const jsLibraries = readPackageJson(options.package);
    const pythonDependencies = readPipfile(options.pipfile);
    const inputDir = validateInputDir(options.input);
    const outputDir = ensureOutputDir(options.output);
    
    // Find Python files
    const pythonFiles = await findPythonFiles(inputDir);
    
    // Process each file
    await processFiles(pythonFiles, inputDir, outputDir, jsLibraries, pythonDependencies, anthropic, options.single, options.force);
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Initialize Anthropic client
 * @returns {Object} - Anthropic client
 */
function initializeAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.');
  }
  
  return new Anthropic({ apiKey });
}

/**
 * Read and extract dependencies from package.json
 * @param {string} packageJsonPath - Path to package.json
 * @returns {Object} - JavaScript libraries
 */
function readPackageJson(packageJsonPath) {
  const resolvedPath = path.resolve(packageJsonPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`package.json not found at ${resolvedPath}`);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  
  return {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    peerDependencies: packageJson.peerDependencies || {}
  };
}

/**
 * Read and extract dependencies from Pipfile
 * @param {string} pipfilePath - Path to Pipfile
 * @returns {Object} - Python dependencies
 */
function readPipfile(pipfilePath) {
  const resolvedPath = path.resolve(pipfilePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Pipfile not found at ${resolvedPath}`);
  }
  
  const pipfileContent = fs.readFileSync(resolvedPath, 'utf8');
  const pythonDependencies = {};
  
  // Parse [packages] section
  const packagesMatch = pipfileContent.match(/\[packages\]([\s\S]*?)(\[\w+\]|$)/);
  if (packagesMatch && packagesMatch[1]) {
    extractDependenciesFromSection(packagesMatch[1], pythonDependencies);
  }
  
  // Parse [dev-packages] section
  const devPackagesMatch = pipfileContent.match(/\[dev-packages\]([\s\S]*?)(\[\w+\]|$)/);
  if (devPackagesMatch && devPackagesMatch[1]) {
    extractDependenciesFromSection(devPackagesMatch[1], pythonDependencies, 'dev-');
  }
  
  return pythonDependencies;
}

/**
 * Extract dependencies from a Pipfile section
 * @param {string} section - Section content
 * @param {Object} dependencies - Dependencies object to populate
 * @param {string} prefix - Optional prefix for dependency names
 */
function extractDependenciesFromSection(section, dependencies, prefix = '') {
  const packageLines = section.trim().split('\n');
  
  packageLines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const parts = trimmedLine.split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const version = parts.slice(1).join('=').trim().replace(/"/g, '');
        dependencies[`${prefix}${name}`] = version;
      }
    }
  });
}

/**
 * Validate input directory
 * @param {string} inputDir - Input directory path
 * @returns {string} - Resolved input directory path
 */
function validateInputDir(inputDir) {
  const resolvedPath = path.resolve(inputDir);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Input directory not found at ${resolvedPath}`);
  }
  return resolvedPath;
}

/**
 * Ensure output directory exists
 * @param {string} outputDir - Output directory path
 * @returns {string} - Resolved output directory path
 */
function ensureOutputDir(outputDir) {
  const resolvedPath = path.resolve(outputDir);
  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
  }
  return resolvedPath;
}

/**
 * Find Python files in the input directory
 * @param {string} inputDir - Input directory path
 * @returns {Array} - List of Python files
 */
async function findPythonFiles(inputDir) {
  const pythonFiles = await glob('**/*.py', { cwd: inputDir });
  
  // Filter out __init__.py files
  const filteredFiles = pythonFiles.filter(file => !file.endsWith('__init__.py'));
  
  if (filteredFiles.length === 0) {
    console.log(chalk.yellow('No Python files found in the input directory (excluding __init__.py files).'));
    process.exit(0);
  }
  
  console.log(chalk.blue(`Found ${filteredFiles.length} Python files to convert (excluding __init__.py files).`));
  return filteredFiles;
}

/**
 * Process Python files and convert to JavaScript
 * @param {Array} pythonFiles - List of Python files
 * @param {string} inputDir - Input directory path
 * @param {string} outputDir - Output directory path
 * @param {Object} jsLibraries - JavaScript libraries
 * @param {Object} pythonDependencies - Python dependencies
 * @param {Object} anthropic - Anthropic client
 * @param {boolean} singleMode - Whether to convert only one file
 * @param {boolean} forceMode - Whether to force conversion of existing files
 */
async function processFiles(pythonFiles, inputDir, outputDir, jsLibraries, pythonDependencies, anthropic, singleMode, forceMode) {
  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;
  const failures = [];

  for (const pyFile of pythonFiles) {
    const inputFilePath = path.join(inputDir, pyFile);
    const relativeDir = path.dirname(pyFile);
    const outputRelativeDir = path.join(outputDir, relativeDir);
    const outputFilePath = path.join(outputDir, pyFile.replace(/\.py$/, '.js'));
    
    // Check if file already exists and we're not in force mode
    if (fs.existsSync(outputFilePath) && !forceMode) {
      console.log(chalk.cyan(`Skipping ${pyFile} - already converted (use --force to override)`));
      skippedCount++;
      continue;
    }
    
    // Create subdirectories in output if needed
    if (!fs.existsSync(outputRelativeDir)) {
      fs.mkdirSync(outputRelativeDir, { recursive: true });
    }
    
    console.log(chalk.blue(`Converting ${pyFile}...`));
    
    try {
      // Read Python file content
      const pythonCode = fs.readFileSync(inputFilePath, 'utf8');
      
      // Skip blank files
      if (!pythonCode.trim()) {
        console.log(chalk.yellow(`Skipping empty file: ${pyFile}`));
        skippedCount++;
        continue;
      }
      
      // Check file size - rough estimate of tokens (characters / 4)
      const estimatedTokens = pythonCode.length / 4;
      const MAX_SAFE_TOKENS = 150000; // Leave room for prompt and system message
      
      if (estimatedTokens > MAX_SAFE_TOKENS) {
        console.log(chalk.yellow(`Warning: ${pyFile} is very large (~${Math.round(estimatedTokens)} tokens). This may exceed API limits.`));
        console.log(chalk.yellow(`Attempting to process with reduced context. Some functionality may be lost.`));
        
        // Write a placeholder file with warning comment
        const warningComment = `
// WARNING: This file was too large to be fully converted automatically.
// Original Python file: ${pyFile}
// Estimated size: ${Math.round(estimatedTokens)} tokens
// 
// The conversion below may be incomplete or contain errors.
// Consider breaking this file into smaller modules manually.
`;
        
        // Try to convert with a simplified prompt
        try {
          // Convert the file with a simplified prompt
          const jsCode = await convertLargeFile(pythonCode, anthropic);
          fs.writeFileSync(outputFilePath, warningComment + jsCode);
          console.log(chalk.yellow(`⚠ Partially converted ${pyFile} (file was too large for complete conversion)`));
          successCount++;
        } catch (largeFileError) {
          console.error(chalk.red(`✗ Failed to convert large file ${pyFile}: ${largeFileError.message}`));
          
          // Create a stub file with imports and basic structure
          const stubCode = createStubFile(pythonCode, pyFile);
          fs.writeFileSync(outputFilePath, stubCode);
          console.log(chalk.yellow(`⚠ Created stub file for ${pyFile} - manual conversion required`));
          
          failureCount++;
          failures.push({ file: pyFile, error: largeFileError.message });
        }
      } else {
        // Normal conversion for reasonably sized files
        const jsCode = await convertFile(pythonCode, jsLibraries, pythonDependencies, anthropic);
        fs.writeFileSync(outputFilePath, jsCode);
        console.log(chalk.green(`✓ Converted ${pyFile} to ${outputFilePath.replace(outputDir + path.sep, '')}`));
        successCount++;
      }
      
      if (singleMode) {
        break;
      }
    } catch (error) {
      console.error(chalk.red(`✗ Failed to convert ${pyFile}: ${error.message}`));
      failureCount++;
      failures.push({ file: pyFile, error: error.message });
      
      if (singleMode) {
        throw error; // In single mode, we want to fail immediately
      }
      
      // Continue with next file
      continue;
    }
  }
  
  // Print summary
  console.log(chalk.green(`\n✓ Conversion complete!`));
  console.log(chalk.blue(`Successfully converted: ${successCount} files`));
  
  if (skippedCount > 0) {
    console.log(chalk.cyan(`Skipped files (already converted): ${skippedCount} files`));
  }
  
  if (failureCount > 0) {
    console.log(chalk.red(`Failed conversions: ${failureCount} files`));
    console.log(chalk.yellow('Failed files:'));
    failures.forEach(failure => {
      console.log(chalk.yellow(`  - ${failure.file}: ${failure.error.substring(0, 100)}${failure.error.length > 100 ? '...' : ''}`));
    });
  }
}

/**
 * Convert a Python file to JavaScript
 * @param {string} pythonCode - Python code
 * @param {Object} jsLibraries - JavaScript libraries
 * @param {Object} pythonDependencies - Python dependencies
 * @param {Object} anthropic - Anthropic client
 * @returns {string} - JavaScript code
 */
async function convertFile(pythonCode, jsLibraries, pythonDependencies, anthropic) {
  // Create prompt for Anthropic
  const prompt = `
You are an expert Python to JavaScript converter. Convert the following Python code to JavaScript.
The JavaScript code will be used in an Electron/React application.

Available JavaScript libraries (from package.json):
${JSON.stringify(jsLibraries, null, 2)}

Python dependencies (from Pipfile):
${JSON.stringify(pythonDependencies, null, 2)}

Python code to convert:
\`\`\`python
${pythonCode}
\`\`\`

Please convert this to idiomatic JavaScript. Include any necessary imports at the top of the file.
Maintain the same functionality and structure as the original Python code.
If the Python code imports from relative paths, convert those to equivalent JavaScript imports with the same relative paths but with .js extensions.
Only respond with the JavaScript code, no explanations or markdown.
`;

  // Implement retry logic with exponential backoff
  const maxRetries = 5;
  let retryCount = 0;
  let lastError = null;

  while (retryCount < maxRetries) {
    try {
      // Call Anthropic API with Claude 3.7
      const response = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 0.2,
        system: "You are an expert at converting Python code to JavaScript. Provide only the converted JavaScript code without any explanations or markdown formatting. Maintain the same relative import paths, just changing .py extensions to .js.",
        messages: [
          { role: "user", content: prompt }
        ]
      });
      
      // Extract JavaScript code from response and remove any markdown code block formatting
      let jsCode = response.content[0].text.trim();
      
      // Remove markdown code block if present
      if (jsCode.startsWith('```') && jsCode.endsWith('```')) {
        // Extract language identifier if present
        const firstLineEnd = jsCode.indexOf('\n');
        const firstLine = jsCode.substring(0, firstLineEnd).trim();
        
        // Remove opening ```javascript or similar
        jsCode = jsCode.substring(firstLineEnd + 1);
        
        // Remove closing ```
        jsCode = jsCode.substring(0, jsCode.lastIndexOf('```')).trim();
      }
      
      return jsCode;
    } catch (error) {
      lastError = error;
      
      // Check if it's an overloaded error
      const isOverloaded = 
        error.message.includes('overloaded') || 
        (error.response && error.response.status === 529) ||
        (error.type === 'overloaded_error');
      
      if (!isOverloaded) {
        // If it's not an overloaded error, throw immediately
        throw error;
      }
      
      retryCount++;
      
      if (retryCount >= maxRetries) {
        console.log(chalk.red(`Maximum retries (${maxRetries}) reached. Giving up.`));
        throw error;
      }
      
      // Calculate backoff time: 2^retryCount * 1000ms + random jitter
      const backoffTime = (Math.pow(2, retryCount) * 1000) + (Math.random() * 1000);
      console.log(chalk.yellow(`API overloaded. Retrying in ${Math.round(backoffTime/1000)} seconds... (Attempt ${retryCount} of ${maxRetries})`));
      
      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // If we've exhausted all retries
  throw lastError;
}

/**
 * Convert a large Python file to JavaScript with a simplified approach
 * @param {string} pythonCode - Python code
 * @param {Object} anthropic - Anthropic client
 * @returns {string} - JavaScript code
 */
async function convertLargeFile(pythonCode, anthropic) {
  // Extract imports and function/class definitions to understand structure
  const importLines = [];
  const classDefinitions = [];
  const functionDefinitions = [];
  
  // Simple parsing to extract key structural elements
  const lines = pythonCode.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      importLines.push(line);
    } else if (trimmedLine.startsWith('class ')) {
      classDefinitions.push(trimmedLine);
    } else if (trimmedLine.startsWith('def ')) {
      functionDefinitions.push(trimmedLine);
    }
  }
  
  // Create a simplified prompt with just the structure information
  const structurePrompt = `
You are an expert Python to JavaScript converter. I have a very large Python file that needs conversion.
I'll provide the imports and function/class definitions to help you understand the structure.

Python imports:
${importLines.join('\n')}

Python class definitions:
${classDefinitions.join('\n')}

Python function definitions:
${functionDefinitions.join('\n')}

Now, here's a portion of the Python code to convert:
\`\`\`python
${pythonCode.substring(0, 100000)} // Truncate to avoid token limits
... (file continues but was truncated due to size)
\`\`\`

Please convert this to idiomatic JavaScript. Include all necessary imports at the top of the file.
Maintain the same functionality and structure as the original Python code as much as possible.
If the Python code imports from relative paths, convert those to equivalent JavaScript imports with the same relative paths but with .js extensions.
Only respond with the JavaScript code, no explanations or markdown.
`;

  // Implement retry logic with exponential backoff
  const maxRetries = 3;
  let retryCount = 0;
  let lastError = null;

  while (retryCount < maxRetries) {
    try {
      // Call Anthropic API with Claude 3 Opus (which has larger context)
      const response = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 0.2,
        system: "You are an expert at converting Python code to JavaScript. The file is very large, so focus on correctly converting the structure, imports, and main functionality. Provide only the converted JavaScript code without any explanations or markdown formatting.",
        messages: [
          { role: "user", content: structurePrompt }
        ]
      });
      
      // Extract JavaScript code from response and remove any markdown code block formatting
      let jsCode = response.content[0].text.trim();
      
      // Remove markdown code block if present
      if (jsCode.startsWith('```') && jsCode.endsWith('```')) {
        // Extract language identifier if present
        const firstLineEnd = jsCode.indexOf('\n');
        const firstLine = jsCode.substring(0, firstLineEnd).trim();
        
        // Remove opening ```javascript or similar
        jsCode = jsCode.substring(firstLineEnd + 1);
        
        // Remove closing ```
        jsCode = jsCode.substring(0, jsCode.lastIndexOf('```')).trim();
      }
      
      return jsCode;
    } catch (error) {
      lastError = error;
      
      // Check if it's an overloaded error
      const isOverloaded = 
        error.message.includes('overloaded') || 
        (error.response && error.response.status === 529) ||
        (error.type === 'overloaded_error');
      
      if (!isOverloaded) {
        // If it's not an overloaded error, throw immediately
        throw error;
      }
      
      retryCount++;
      
      if (retryCount >= maxRetries) {
        console.log(chalk.red(`Maximum retries (${maxRetries}) reached. Giving up.`));
        throw error;
      }
      
      // Calculate backoff time: 2^retryCount * 1000ms + random jitter
      const backoffTime = (Math.pow(2, retryCount) * 1000) + (Math.random() * 1000);
      console.log(chalk.yellow(`API overloaded. Retrying in ${Math.round(backoffTime/1000)} seconds... (Attempt ${retryCount} of ${maxRetries})`));
      
      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // If we've exhausted all retries
  throw lastError;
}

/**
 * Create a stub JavaScript file from Python code
 * @param {string} pythonCode - Python code
 * @param {string} filename - Original Python filename
 * @returns {string} - JavaScript stub code
 */
function createStubFile(pythonCode, filename) {
  // Extract imports
  const importLines = [];
  const classNames = [];
  const functionNames = [];
  
  // Simple parsing to extract key structural elements
  const lines = pythonCode.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      importLines.push(line);
    } else if (trimmedLine.startsWith('class ')) {
      const match = trimmedLine.match(/class\s+(\w+)/);
      if (match && match[1]) {
        classNames.push(match[1]);
      }
    } else if (trimmedLine.startsWith('def ')) {
      const match = trimmedLine.match(/def\s+(\w+)/);
      if (match && match[1]) {
        functionNames.push(match[1]);
      }
    }
  }
  
  // Convert Python imports to JavaScript imports (basic conversion)
  const jsImports = importLines.map(line => {
    if (line.startsWith('from ')) {
      // from module import thing
      const match = line.match(/from\s+([\w.]+)\s+import\s+([\w,\s]+)/);
      if (match) {
        const module = match[1].replace(/\./g, '/');
        const imports = match[2].split(',').map(i => i.trim());
        
        if (imports.includes('*')) {
          return `import * as ${module.split('/').pop()} from './${module}.js';`;
        } else {
          return `import { ${imports.join(', ')} } from './${module}.js';`;
        }
      }
    } else if (line.startsWith('import ')) {
      // import module
      const match = line.match(/import\s+([\w.]+)(?:\s+as\s+(\w+))?/);
      if (match) {
        const module = match[1].replace(/\./g, '/');
        const alias = match[2] || module.split('/').pop();
        return `import * as ${alias} from './${module}.js';`;
      }
    }
    return `// TODO: Convert Python import: ${line}`;
  });
  
  // Create stub classes
  const jsClasses = classNames.map(className => {
    return `
class ${className} {
  constructor() {
    // TODO: Implement constructor
  }
  
  // TODO: Implement methods
}
`;
  });
  
  // Create stub functions
  const jsFunctions = functionNames.map(funcName => {
    return `
function ${funcName}() {
  // TODO: Implement function
  throw new Error('Function ${funcName} not implemented');
}
`;
  });
  
  // Create exports
  const exports = [...classNames, ...functionNames].map(name => name).join(', ');
  
  return `
// STUB FILE: This is a placeholder for ${filename}
// This file was too large to be automatically converted
// You will need to manually implement the functionality

${jsImports.join('\n')}

${jsClasses.join('\n')}

${jsFunctions.join('\n')}

// Exports
module.exports = { ${exports} };
`;
}