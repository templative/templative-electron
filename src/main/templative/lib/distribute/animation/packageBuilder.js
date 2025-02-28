const fs = require('fs').promises;
const path = require('path');
const instructionsLoader = require('../../manage/instructionsLoader');
const { copyFile } = require('fs').promises;

async function createPackage(input, output) {
  const instructions = await instructionsLoader.loadGameInstructions(input);
  const gameVersionName = instructions.name;

  console.log(`Creating typescript package for ${gameVersionName}.`);

  const newPackageDirectoryPath = path.join(output, gameVersionName);
  await createOrReplacePackageDirectory(newPackageDirectoryPath);
  const packageNames = await createComponentPackages(input, newPackageDirectoryPath);

  const mainPackageContents = await assembleMainPackageContents(gameVersionName, packageNames);
  await createFile(newPackageDirectoryPath, 'package.jsx', mainPackageContents);
}

async function assembleMainPackageContents(gameVersionName, packageNames) {
  let componentPackageExports = '';
  let componentPackageInclusions = '';
  for (const packageName of packageNames) {
    const packageInclusion = `import ${packageName} from './${packageName}/${packageName}'\n`;
    componentPackageInclusions += packageInclusion;

    const packageExport = `\t${packageName}: ${packageName}, \n`;
    componentPackageExports += packageExport;
  }

  return `//\n// ${gameVersionName}\n//\n\n${componentPackageInclusions}\nmodule.exports = {\n${componentPackageExports}}`;
}

async function createComponentPackages(input, newPackageDirectoryPath) {
  const packageNames = [];
  const componentDirectories = await fs.readdir(input, { withFileTypes: true });
  for (const componentDirectory of componentDirectories) {
    if (componentDirectory.isDirectory()) {
      const componentSourceDirectoryPath = `${input}/${componentDirectory.name}`;
      const packageName = await createComponentPackage(componentSourceDirectoryPath, newPackageDirectoryPath);
      packageNames.push(packageName);
    }
  }
  return packageNames;
}

async function createComponentPackage(componentSourceDirectoryPath, outputDirectoryPath) {
  const componentInstructions = await instructionsLoader.loadComponentInstructions(componentSourceDirectoryPath);
  const componentName = componentInstructions.name;

  const componentOutputDirectory = `${outputDirectoryPath}/${componentName}`;
  await createOrReplacePackageDirectory(componentOutputDirectory);

  const frontInstructions = componentInstructions.frontInstructions;

  let componentImageInclusions = '';
  let componentPackageExports = '';
  for (const frontInstruction of frontInstructions) {
    const pieceName = frontInstruction.name;
    const filepath = frontInstruction.filepath;
    const filename = path.basename(filepath);

    const newFilepath = path.join(componentOutputDirectory, filename);
    await copyFile(filepath, newFilepath);

    const imageInclusion = `import ${pieceName} from './${filename}'\n`;
    componentImageInclusions += imageInclusion;

    const packageExport = `\t${pieceName}: ${pieceName}, \n`;
    componentPackageExports += packageExport;
  }

  const backInstructions = componentInstructions.backInstructions;
  const backFilepath = backInstructions.filepath;
  const backFilename = path.basename(backFilepath);
  const backNewFilepath = path.join(componentOutputDirectory, backFilename);
  await copyFile(backFilepath, backNewFilepath);
  const backImageInclusion = `const back = require('./${backFilename}');`;
  componentImageInclusions += backImageInclusion;

  componentPackageExports += '\tback: back, \n';

  const contents = `//\n// ${componentName}\n//\n\n${componentImageInclusions}\n\nmodule.exports = {\n${componentPackageExports}}`;
  await createFile(componentOutputDirectory, `${componentName}.jsx`, contents);
  return componentName;
}

async function createFile(outputDirectory, filename, contents) {
  const filepath = path.join(outputDirectory, filename);
  await fs.writeFile(filepath, contents);
}

async function createOrReplacePackageDirectory(newPackageDirectoryPath) {
  try {
    await fs.access(newPackageDirectoryPath);
    await fs.rm(newPackageDirectoryPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  await fs.mkdir(newPackageDirectoryPath, { recursive: true });
}

module.exports = {
  createPackage,
};