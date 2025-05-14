const { marked } = require('marked');
const hljs = require('highlight.js');

// Try to load electron, but don't fail if it's not available
let electron;
try {
  electron = require('electron');
} catch (e) {
  // Running in non-electron environment
}

// Try to load puppeteer-core for non-electron environments
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  // Puppeteer not available, will use electron if available
}

// Configure marked with syntax highlighting
const markedInstance = marked.setOptions({
  highlight: (code, language) => {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language: validLanguage }).value;
  },
  langPrefix: 'hljs '
});

// Default styling for the PDF output
const defaultStyles = `
* {
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  font-size: 11pt;
  color: #111;
  margin: 0;
  padding: 20px;
}

code {
  background-color: #f8f8f8;
  padding: 0.1em 0.375em;
  border: 1px solid #f8f8f8;
  border-radius: 0.25em;
  font-family: monospace;
}

pre code {
  display: block;
  padding: 0.5em;
}

img {
  max-width: 100%;
}
`;

/**
 * Converts markdown string to HTML
 * @param {string} markdown - The markdown content to convert
 * @returns {string} The generated HTML
 */
function markdownToHtml(markdown) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>${defaultStyles}</style>
  </head>
  <body>
    ${markedInstance.parse(markdown)}
  </body>
</html>`;
}

/**
 * Find Chrome executable path based on platform
 */
function findChromePath() {
  const platform = process.platform;
  switch (platform) {
    case 'win32':
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Generate PDF using Puppeteer
 */
async function generatePdfWithPuppeteer(html, options) {
  const browser = await puppeteer.launch({
    executablePath: findChromePath(),
    headless: 'new'
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf(options);
    return pdf;
  } finally {
    await browser.close();
  }
}

/**
 * Generate PDF using Electron
 */
async function generatePdfWithElectron(html, options) {
  const { BrowserWindow } = electron;
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    const pdf = await win.webContents.printToPDF(options);
    return pdf;
  } finally {
    win.destroy();
  }
}

/**
 * Converts markdown to PDF
 * @param {string} markdown - The markdown content to convert
 * @param {Object} options - PDF generation options
 * @returns {Promise<Buffer>} The generated PDF as a buffer
 */
async function markdownToPdf(markdown, options = {}) {
  const defaultPdfOptions = {
    format: 'a4',
    margin: {
      top: '30mm',
      right: '40mm',
      bottom: '30mm',
      left: '20mm'
    },
    printBackground: true
  };

  const pdfOptions = { ...defaultPdfOptions, ...options };
  const html = markdownToHtml(markdown);
  // if (electron) {
  //   return generatePdfWithElectron(html, pdfOptions);
  // }
  if(puppeteer) {
    return generatePdfWithPuppeteer(html, pdfOptions);
  }
  throw new Error('Neither Electron nor Puppeteer is available for PDF generation');
  
}

module.exports = {
  markdownToPdf
};
