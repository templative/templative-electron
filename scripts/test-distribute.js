#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const PROJECT_DIR = "/Users/oliverbarnum/Documents/git/apcw-defines"
const CLI_PATH = path.join(__dirname, '../src/main/templative/cli.js');

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
async function runTests() {  
  // Test produce command
  console.log(chalk.bold.blue('\n=== Testing produce command ==='));
  const produceResult = runCommand(`produce --input "${PROJECT_DIR}"`);
  if (!produceResult.success) {
    console.error(chalk.red('Failed to produce game, aborting tests'));
    process.exit(1);
  }
  const lastOutputPath = fs.readFileSync(path.join(PROJECT_DIR, 'output', '.last'), 'utf8').trim();
  
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
  
  // Summary
  console.log(chalk.bold.green('\n=== Test Summary ==='));
  console.log(chalk.green('✓ Test framework completed'));
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1);
});