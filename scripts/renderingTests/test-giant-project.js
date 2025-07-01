const path = require('path');
const fs = require('fs');
const os = require('os');
const { COMPONENT_INFO } = require('../../src/shared/componentInfo.js');
const { STOCK_COMPONENT_INFO } = require('../../src/shared/stockComponentInfo.js');
const { createCustomComponent } = require('../../src/main/templative/lib/create/componentCreator.js');
const { createStockComponent } = require('../../src/main/templative/lib/create/componentCreator.js');
const { createProjectInDirectory } = require('../../src/main/templative/lib/create/projectCreator.js');
const { produceGame } = require('../../src/main/templative/lib/produce/gameProducer.js');
const { convertToTabletopSimulator } = require('../../src/main/templative/lib/distribute/simulator/simulator.js');
const { createPdfForPrinting } = require("../../src/main/templative/lib/distribute/printout/printout.js")

const TEST_DIR = path.join(__dirname, '../test-project');
const PROJECT_DIR = TEST_DIR;

const TABLETOP_SIMULATOR_DIR = os.platform() === 'win32' ? 
    path.join(os.homedir(), "Documents", "My Games", "Tabletop Simulator") : 
    path.join(os.homedir(), "Library", "Tabletop Simulator");

async function testEveryComponent() {
    if (fs.existsSync(PROJECT_DIR)) {
        fs.rmSync(PROJECT_DIR, { recursive: true, force: true });
    }
    const success = await createProjectInDirectory(PROJECT_DIR);
    if (!success) {
        console.error("Failed to create project");
        return;
    }
    var componentCount = 0;
    for (const componentKey in COMPONENT_INFO) {
        if (COMPONENT_INFO[componentKey].IsDisabled) {
            continue
        }
        await createCustomComponent(PROJECT_DIR, componentKey, componentKey);
        componentCount++;
    }
    console.log(`Created ${componentCount} components`);
    var stockComponentCount = 0;
    for (const componentKey in STOCK_COMPONENT_INFO) {
        await createStockComponent(PROJECT_DIR, componentKey, componentKey);
        stockComponentCount++;
    }
    console.log(`Created ${stockComponentCount} stock components`);

    var outputDir = fs.readFileSync(path.join(PROJECT_DIR, 'output', '.last'), 'utf8').trim();
    outputDir = await produceGame(PROJECT_DIR, null, false, false, "en");

    const isBackIncluded = false;
    const size = "Letter"
    const areBordersDrawn = false;
    await createPdfForPrinting(outputDir, isBackIncluded, size, areBordersDrawn);

    await convertToTabletopSimulator(outputDir, TABLETOP_SIMULATOR_DIR); 
}

testEveryComponent().catch(console.error);