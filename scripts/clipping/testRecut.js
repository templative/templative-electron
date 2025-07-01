// This is C:/Users/olive/Documents/git/templative-electron/scripts/testRecut.js
// Use C:/Users/olive/Documents/git/templative-electron/src/main/templative/lib/produce/gameProducer.js recutOutput() to recut the output

const path = require('path');
const { recutOutput } = require('../../src/main/templative/lib/produce/gameProducer');

async function testRecut() {
    try {
        // You'll need to specify the actual output directory path here
        const outputDirectoryPath = "C:/Users/olive/Documents/git/apcw-defines/output/capsAndHammers_PublisherArt_1_2025-06-24_05-04-09_countries";
        // Adjust this path as needed
        
        console.log(`Testing recut on directory: ${outputDirectoryPath}`);
        await recutOutput(outputDirectoryPath);
        console.log('Recut completed successfully');
    } catch (error) {
        console.error('Error during recut:', error);
    }
}

// Run the test
testRecut();
