const { getTemplateScalingRatio, getScaledComponentSize } = require('./src/main/templative/lib/distribute/printout/bleedScaling');
const { COMPONENT_INFO } = require('./src/shared/componentInfo.js');

async function testTemplateScalingForFile(templateFileName, componentName = null) {
    try {
        console.log(`\n=== Testing ${templateFileName} ===`);
        
        // Use the actual implementation to get scaling ratios
        await getTemplateScalingRatio(templateFileName);
        
    } catch (error) {
        console.error(`Error testing ${templateFileName}:`, error.message);
    }
}

async function runTests() {
    // Test different types of clipping elements
    await testTemplateScalingForFile('PokerHookBox18', 'PokerHookBox18 (path)');
    // await testTemplateScalingForFile('AccordionBoard', 'AccordionBoard (rect)');
    // await testTemplateScalingForFile('PokerDeck', 'PokerDeck (path)');
    // await testTemplateScalingForFile('CustomPrintedMeeple', 'CustomPrintedMeeple (path)');
    // await testTemplateScalingForFile('BullseyeChit', 'BullseyeChit (path with circles)');
}

runTests(); 