// test-markdown-to-pdf.js
const fs = require('fs');
const path = require('path');
const { markdownToPdf } = require('../markdownToPdf.js');

// To test, run:
// node /Users/oliverbarnum/Documents/git/templative-electron/src/main/templative/lib/produce/tests/testMarkdownToPdf.js

async function runTest() {
  try {
    console.log('Converting Markdown to PDF...');
    const sampleMarkdownPath = "/Users/oliverbarnum/Documents/git/blank-templative-project/rules.md"
    const sampleMarkdown = fs.readFileSync(sampleMarkdownPath, 'utf8');
    const pdfBuffer = await markdownToPdf(sampleMarkdown, {
      info: {
        Title: 'Test Document',
        Author: 'Test Script'
      }
    });
    
    // Check if pdfBuffer is valid
    if (!pdfBuffer) {
      throw new Error('PDF buffer is undefined or null');
    }
    
    // Save the PDF to a file
    const outputPath = path.join(__dirname, 'output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF successfully created at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

runTest();