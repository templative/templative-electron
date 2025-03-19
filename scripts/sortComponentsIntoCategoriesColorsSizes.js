const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const outputPath = "/Users/oliverbarnum/Documents/git/templative-electron/src/main/templative/lib/componentPreviewImages"

// Ensure the output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const {COMPONENT_INFO} = require("../src/shared/componentInfo.js");
const {STOCK_COMPONENT_INFO} = require("../src/shared/stockComponentInfo.js");
const {extractBaseNameAndColor, extractBaseNameAndSize, cleanBaseName} = require("../src/renderer/app/components/Create/TypeSelection/ComponentUtils.js");

const customMajorCategories = [
  "packaging","stickers", "deck", "die", "premium", "board","token","mat","document", "blank", "screen", "dial"
]

const stockMajorCategories = [
  "dice", "premium", "packaging", 'sleeve', 'baggies', "cube", "tube", "blank", "building","meeple","TB", "minifig", "figurine", "animal",  "vehicle",  "casino", "money", "utility", "vial","symbol", "bodypart", "resource"
]

async function processComponent(componentCategorization, component, isStock) {
  let {baseName: sizeLessName, size} = extractBaseNameAndSize(component.DisplayName, component.DisplayName);
  
  // Handle color extraction, making sure to preserve light/dark variations
  let {baseName: colorLessName, color} = extractBaseNameAndColor(sizeLessName || component.DisplayName, sizeLessName || component.DisplayName);

  if (component.DisplayName === "Clear Poker Tuck Box (41)") {
    console.log(colorLessName)
  }
  
  if (size === null) {
    size = "Sizeless"
  }
  if (color === null) {
    color = "Colorless"
  }

  // Clean up the base name to remove size and color parts
  const name = cleanBaseName(colorLessName || component.DisplayName, size, color);

  const tags = component.Tags || []
  let possibleCategories = isStock ? stockMajorCategories : customMajorCategories;
  let category = "NO_CATEGORY"
  for (const tag of tags) {
    if (possibleCategories.includes(tag)) {
      category = tag
      break
    }
  }
  const typeCategory = isStock ? "STOCK" : "CUSTOM"
  if (!componentCategorization[typeCategory][category][name]) {
    componentCategorization[typeCategory][category][name] = {}
  }
  

  // if (!isStock) {
  //   const existingComponent = componentCategorization[typeCategory][category][name][size]
  //   if (existingComponent) {
  //     console.log(chalk.red(`${typeCategory} ${category} ${name} ${size} already exists ${existingComponent} so we cannot add ${component.Key}`))
  //     return
  //   }
  //   componentCategorization[typeCategory][category][name][size] = component.Key
  //   return
  // }
  if (!componentCategorization[typeCategory][category][name][size]) {
    componentCategorization[typeCategory][category][name][size] = {}
  }

  const existingComponent = componentCategorization[typeCategory][category][name][size][color]
  if (existingComponent) {
    console.log(chalk.red(`${typeCategory} ${category} ${name} ${size} ${color} already exists ${existingComponent} so we cannot add ${component.Key}`))
    return
  }
  
  componentCategorization[typeCategory][category][name][size][color] = component.Key
}

async function createCategories() {
  let componentCategorization = {
    "STOCK": Object.fromEntries(stockMajorCategories.map(category => [category, {}])),
    "CUSTOM": Object.fromEntries(customMajorCategories.map(category => [category, {}])),
  }
  componentCategorization["STOCK"]["NO_CATEGORY"] = {}
  componentCategorization["CUSTOM"]["NO_CATEGORY"] = {}

  for (const key in STOCK_COMPONENT_INFO) {
    const stockComponent = STOCK_COMPONENT_INFO[key]
    await processComponent(componentCategorization, stockComponent, true)
  }
  for (const key in COMPONENT_INFO) {
    const customComponent = COMPONENT_INFO[key]
    await processComponent(componentCategorization, customComponent, false)
  }
  const contents = `const COMPONENT_CATEGORIES = ${JSON.stringify(componentCategorization, null, 2)}
  module.exports = { COMPONENT_CATEGORIES }`
  fs.writeFileSync(path.join(__dirname, '../src/shared/componentCategories.js'), contents);
}

// Execute the function
createCategories().catch(error => {
  console.error('Error creating categories:', error);
  process.exit(1);
});
