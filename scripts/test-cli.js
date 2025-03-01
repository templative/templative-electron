#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const TEST_DIR = path.join(__dirname, 'test-project');
const CLI_PATH = path.join(__dirname, 'src/main/templative/cli.js');
const COMPONENT_NAME = 'PokerDeck';

// Helper function to run CLI commands
function runCommand(command, options = {}) {
  const fullCommand = `node ${CLI_PATH} ${command}`;
  console.log(chalk.blue(`Running: ${fullCommand}`));
  
  try {
    const output = execSync(fullCommand, {
      cwd: options.cwd || TEST_DIR,
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
  
  // Setup test directory
  setupTestDirectory();
  
  // Test init command
  console.log(chalk.bold.blue('\n=== Testing init command ==='));
  const initResult = runCommand('create init -i ' + TEST_DIR);
  if (!initResult.success) {
    console.error(chalk.red('Failed to initialize project, aborting tests'));
    process.exit(1);
  }
  
  // Test create poker deck command
  console.log(chalk.bold.blue('\n=== Testing create poker deck command ==='));
  const createResult = runCommand(`create deck poker -n ${COMPONENT_NAME} -i ${TEST_DIR}`);
  if (!createResult.success) {
    console.error(chalk.red('Failed to create poker deck, aborting tests'));
    process.exit(1);
  }
  
  // Test produce command
  console.log(chalk.bold.blue('\n=== Testing produce command ==='));
  const produceResult = runCommand(`produce --name ${COMPONENT_NAME} --input ${TEST_DIR}`);
  if (!produceResult.success) {
    console.error(chalk.red('Failed to produce game, aborting tests'));
    process.exit(1);
  }
  
  // Test preview command
  console.log(chalk.bold.blue('\n=== Testing preview command ==='));
  const previewResult = runCommand(`preview --component ${COMPONENT_NAME} --piece "PokerDeck" --input ${TEST_DIR}`);
  if (!previewResult.success) {
    console.error(chalk.red('Failed to preview piece, continuing with other tests'));
  }
  
  // Test printout command
  console.log(chalk.bold.blue('\n=== Testing printout command ==='));
  // Get the output directory from the .last file
  const lastOutputPath = fs.readFileSync(path.join(TEST_DIR, 'output', '.last'), 'utf8').trim();
  console.log(chalk.blue(`Using output directory: ${lastOutputPath}`));
  const printoutResult = runCommand(`distribute printout -i "${lastOutputPath}"`);
  if (!printoutResult.success) {
    console.error(chalk.red('Failed to create printout, continuing with other tests'));
  }
  
  // Test playground command
  // console.log(chalk.bold.blue('\n=== Testing playground command ==='));
  const playgroundPath = "/Users/oliverbarnum/Library/Application Support/Epic/TabletopPlayground";
  // const playgroundResult = runCommand(`distribute playground -i "${lastOutputPath}" -o "${playgroundPath}"`);
  // if (!playgroundResult.success) {
  //   console.error(chalk.red('Failed to create playground, continuing with other tests'));
  // }
  
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
  console.log(chalk.blue(`Test project created at: ${TEST_DIR}`));
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1);
});