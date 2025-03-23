#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Parse command line arguments
const args = process.argv.slice(2);
const inputDirArg = args.find(arg => arg.startsWith('--input='));
const inputDir = inputDirArg ? inputDirArg.split('=')[1] : null;

// Configuration
const TEST_DIR = path.join(__dirname, 'test-project');
const CLI_PATH = path.join(__dirname, '../src/main/templative/cli.js');
const COMPONENT_NAME = 'PokerDeck';
const PROJECT_DIR = inputDir || TEST_DIR;

// Ensure component template files are accessible for tests
function ensureComponentTemplatesAvailable() {
  const templatesDir = path.join(__dirname, '../src/assets/images/componentTemplates');
  
  // Create a temporary symlink to the templates directory if needed
  const tempTemplatesDir = path.join(__dirname, '../.webpack/main/assets/images/componentTemplates');
  
  if (!fs.existsSync(path.dirname(tempTemplatesDir))) {
    fs.mkdirSync(path.dirname(tempTemplatesDir), { recursive: true });
  }
  
  if (!fs.existsSync(tempTemplatesDir) && fs.existsSync(templatesDir)) {
    try {
      // On Windows, we need to use junction instead of symlink for directories
      if (process.platform === 'win32') {
        fs.symlinkSync(templatesDir, tempTemplatesDir, 'junction');
      } else {
        fs.symlinkSync(templatesDir, tempTemplatesDir, 'dir');
      }
      console.log(chalk.green('✓ Created symlink to component templates'));
    } catch (error) {
      console.warn(chalk.yellow(`Could not create symlink: ${error.message}`));
      // Fall back to copying files if symlink fails
      if (!fs.existsSync(tempTemplatesDir)) {
        fs.mkdirSync(tempTemplatesDir, { recursive: true });
        const files = fs.readdirSync(templatesDir);
        for (const file of files) {
          fs.copyFileSync(
            path.join(templatesDir, file),
            path.join(tempTemplatesDir, file)
          );
        }
        console.log(chalk.green('✓ Copied component templates'));
      }
    }
  }
}

// Helper function to run CLI commands
function runCommand(command, options = {}) {
  const fullCommand = `node ${CLI_PATH} ${command}`;
  console.log(chalk.blue(`Running: ${fullCommand}`));
  
  try {
    const output = execSync(fullCommand, {
      cwd: options.cwd || PROJECT_DIR,
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8'
    });
    
    console.log(chalk.green('✓ Command completed successfully'));
    return { success: true, output };
  } catch (error) {
    console.error(chalk.red(`✗ Command failed: ${error.message}`));
    return { success: false, error };
  }
}

// Setup test directory
function setupTestDirectory() {
  console.log(chalk.blue(`Setting up test directory at ${TEST_DIR}`));
  
  if (fs.existsSync(TEST_DIR)) {
    console.log(chalk.yellow('Test directory already exists, cleaning...'));
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
  
  fs.mkdirSync(TEST_DIR, { recursive: true });
  console.log(chalk.green('✓ Test directory created'));
}

// Run tests
async function runTests() {
  console.log(chalk.bold.blue('=== Templative CLI Testing Framework ==='));
  
  // Ensure component templates are available
  ensureComponentTemplatesAvailable();
  
  // Only setup and initialize if no input directory was provided
  if (!inputDir) {
    // Setup test directory
    setupTestDirectory();
    
    // Test init command
    console.log(chalk.bold.blue('\n=== Testing init command ==='));
    const initResult = runCommand('create init -i ' + PROJECT_DIR);
    if (!initResult.success) {
      console.error(chalk.red('Failed to initialize project, aborting tests'));
      process.exit(1);
    }
    
    // Test create poker deck command
    console.log(chalk.bold.blue('\n=== Testing create poker deck command ==='));
    const createResult = runCommand(`create deck poker -n ${COMPONENT_NAME} -i ${PROJECT_DIR}`);
    if (!createResult.success) {
      console.error(chalk.red('Failed to create poker deck, aborting tests'));
      process.exit(1);
    }
  } else {
    console.log(chalk.blue(`Using existing project directory: ${PROJECT_DIR}`));
  }
  
  // Test produce command
  console.log(chalk.bold.blue('\n=== Testing produce command ==='));
  const produceResult = runCommand(`produce --input "${PROJECT_DIR}"`);
  if (!produceResult.success) {
    console.error(chalk.red('Failed to produce game, aborting tests'));
    process.exit(1);
  }
  
  // Get the output directory from the .last file
  const lastOutputPath = fs.readFileSync(path.join(PROJECT_DIR, 'output', '.last'), 'utf8').trim();
  console.log(chalk.blue(`Using output directory: ${lastOutputPath}`));
  
  // Test simulator command
  console.log(chalk.bold.blue('\n=== Testing simulator command ==='));
  try {
    const simulatorPath = "/Users/oliverbarnum/Library/Tabletop Simulator";
    const simulatorResult = runCommand(`distribute simulator -i "${lastOutputPath}" -o "${simulatorPath}"`);
    if (!simulatorResult.success) {
      console.error(chalk.red('Failed to create simulator, continuing with other tests'));
    }
  } catch (error) {
    console.error(chalk.red('Failed to create simulator, continuing with other tests'));
  }
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1); 
})