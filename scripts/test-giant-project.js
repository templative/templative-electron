const path = require('path');
const fs = require('fs');
const { COMPONENT_INFO } = require('../src/shared/componentInfo');
const { STOCK_COMPONENT_INFO } = require('../src/shared/stockComponentInfo');
const { createCustomComponent } = require('../src/main/templative/lib/create/componentCreator');
const { createStockComponent } = require('../src/main/templative/lib/create/componentCreator');
const { createProjectInDirectory } = require('../src/main/templative/lib/create/projectCreator');
const { produceGame } = require('../src/main/templative/lib/produce/gameProducer');
const { convertToTabletopSimulator } = require('../src/main/templative/lib/distribute/simulator/simulator.js');
const { createPdfForPrinting } = require("../src/main/templative/lib/distribute/printout/printout.js")

const TEST_DIR = path.join(__dirname, '../test-project');
const PROJECT_DIR = TEST_DIR;
const TABLETOP_SIMULATOR_DIR = "/Users/oliverbarnum/Library/Tabletop Simulator";

async function testEveryComponent() {
    // if (fs.existsSync(PROJECT_DIR)) {
    //     fs.rmSync(PROJECT_DIR, { recursive: true, force: true });
    // }
    // await createProjectInDirectory(PROJECT_DIR);
    // var componentCount = 0;
    // for (const componentKey in COMPONENT_INFO) {
    //     if (COMPONENT_INFO[componentKey].IsDisabled) {
    //         continue
    //     }
    //     await createCustomComponent(PROJECT_DIR, componentKey, componentKey);
    //     componentCount++;
    // }
    // console.log(`Created ${componentCount} components`);
    // var stockComponentCount = 0;
    // for (const componentKey in STOCK_COMPONENT_INFO) {
    //     await createStockComponent(PROJECT_DIR, componentKey, componentKey);
    //     stockComponentCount++;
    // }
    // console.log(`Created ${stockComponentCount} stock components`);

    // var outputDir = fs.readFileSync(path.join(PROJECT_DIR, 'output', '.last'), 'utf8').trim();
    // outputDir = await produceGame(PROJECT_DIR, null, false, false, "en");

    const isBackIncluded = true;
    const size = "Letter";
    const areMarginsIncluded = true;
    await createPdfForPrinting("/Users/oliverbarnum/Documents/git/templative-electron/bigass-test-project/output/GameName_Template_0.0.0_2025-03-28_07-50-23", isBackIncluded, size, areMarginsIncluded);

    // await convertToTabletopSimulator("/Users/oliverbarnum/Documents/git/templative-electron/scripts/test-project/output/GameName_Template_0.0.0_2025-03-14_17-18-01", TABLETOP_SIMULATOR_DIR); 
}

testEveryComponent().catch(console.error);