const path = require('path');
const fs = require('fs');
const { marked } = require('marked');  // You'll need to install this with npm
const { loadRules } = require('./defineLoader.js');
const { produceRulebook } = require('../produce/rulesMarkdownProcessor.js');

async function convertRulesToPdf(gameRootDirectoryPath) {
    const rules = await loadRules(gameRootDirectoryPath);
    if (!rules) {
        console.log("!!! rules.md not found.");
        return;
    }
    await produceRulebook(rules, gameRootDirectoryPath);
    const pdfFilePath = path.join(gameRootDirectoryPath, "rules.pdf");
    console.log(`PDF rules file created at ${pdfFilePath}`);
}

async function convertRulesMdToHtml(gameRootDirectoryPath) {
    const rules = await loadRules(gameRootDirectoryPath);
    if (!rules) {
        console.log("!!! rules.md not found.");
        return;
    }
    const htmlContent = marked(rules);
    const htmlFilePath = path.join(gameRootDirectoryPath, "rules.html");
    await fs.writeFile(htmlFilePath, htmlContent, 'utf-8');
    console.log(`HTML rules file created at ${htmlFilePath}`);
}

async function convertRulesMdToSpans(gameRootDirectoryPath) {
    const rules = await loadRules(gameRootDirectoryPath);
    if (!rules) {
        console.log("!!! rules.md not found.");
        return;
    }
    await convertRulesMdToSpansRaw(rules, gameRootDirectoryPath);
}

async function convertRulesMdToSpansRaw(rules, gameFolderPath) {
    const fontSize = 20;
    const fontSizeProgression = 5;

    let htmlContent = marked(rules);
    htmlContent = htmlContent.replace(/\n/g, "");

    // This creates a newline at the beginning of doc
    htmlContent = htmlContent.replace(/<h1>/g, `<tspan font-weight='bold' font-size='${(6*fontSizeProgression)+fontSize}px'>\\n`);
    htmlContent = htmlContent.replace(/<h2>/g, `<tspan font-weight='bold' font-size='${(5*fontSizeProgression)+fontSize}px'>\\n`); 
    htmlContent = htmlContent.replace(/<h3>/g, `<tspan font-weight='bold' font-size='${(4*fontSizeProgression)+fontSize}px'>\\n`);
    htmlContent = htmlContent.replace(/<h4>/g, `<tspan font-weight='bold' font-size='${(3*fontSizeProgression)+fontSize}px'>\\n`);
    htmlContent = htmlContent.replace(/<h5>/g, `<tspan font-weight='bold' font-size='${(2*fontSizeProgression)+fontSize}px'>\\n`);
    htmlContent = htmlContent.replace(/<h6>/g, `<tspan font-weight='bold' font-size='${(1*fontSizeProgression)+fontSize}px'>\\n`);

    htmlContent = htmlContent.replace(/<\/h1>/g, "</tspan>\\n");
    htmlContent = htmlContent.replace(/<\/h2>/g, "</tspan>\\n");
    htmlContent = htmlContent.replace(/<\/h3>/g, "</tspan>\\n");
    htmlContent = htmlContent.replace(/<\/h4>/g, "</tspan>\\n");
    htmlContent = htmlContent.replace(/<\/h5>/g, "</tspan>\\n");
    htmlContent = htmlContent.replace(/<\/h6>/g, "</tspan>\\n");

    htmlContent = htmlContent.replace(/<p>/g, `<tspan font-size='${fontSize}px'>`);
    htmlContent = htmlContent.replace(/<\/p>/g, "</tspan>\\n");

    htmlContent = htmlContent.replace(/<ul>/g, `<tspan font-size='${fontSize}px'>`);
    htmlContent = htmlContent.replace(/<\/ul>/g, "</tspan>");
    htmlContent = htmlContent.replace(/<li>/g, "- ");
    htmlContent = htmlContent.replace(/<\/li>/g, "\\n");

    htmlContent = htmlContent.replace(/<strong>/g, "<tspan font-weight='bold'>");
    htmlContent = htmlContent.replace(/<\/strong>/g, "</tspan>");

    htmlContent = htmlContent.replace(/<em>/g, "<tspan font-style='oblique'>");
    htmlContent = htmlContent.replace(/<\/em>/g, "</tspan>");

    const svgFilePath = path.join(gameFolderPath, "rules.svg.txt");
    await fs.writeFile(svgFilePath, htmlContent, 'utf-8');
    console.log(`SVG tspans file created at ${svgFilePath}`);
}

module.exports = {
    convertRulesToPdf,
    convertRulesMdToHtml,
    convertRulesMdToSpans,
    convertRulesMdToSpansRaw
};