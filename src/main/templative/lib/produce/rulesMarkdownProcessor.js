const { writeFile } = require('fs/promises');
const { join } = require('path');
const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

async function produceRulebook(rulesMdContent, gameFolderPath) {
  try {
    // Diagnostic checks
    const cwd = process.cwd();
    console.log(`Current working directory: ${cwd}`);
    
    // Create temporary CSS files
    const tempFiles = [];
    
    // 1. Create markdown.css
    const tempCssPath = path.join(cwd, 'markdown.css');
    const cssContent = `
      .page-break { page-break-after: always; }
      .markdown-body { 
        font-size: 11px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #24292e;
        background-color: #fff;
        max-width: 100%;
      }
      .markdown-body pre > code { white-space: pre-wrap; }
      .markdown-body a { color: #0366d6; text-decoration: none; }
      .markdown-body h1, .markdown-body h2, .markdown-body h3, 
      .markdown-body h4, .markdown-body h5, .markdown-body h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
      }
      .markdown-body h1 { font-size: 2em; }
      .markdown-body h2 { font-size: 1.5em; }
      .markdown-body h3 { font-size: 1.25em; }
      .markdown-body pre { padding: 16px; overflow: auto; }
      .markdown-body table { border-collapse: collapse; width: 100%; }
      .markdown-body table th, .markdown-body table td { 
        padding: 6px 13px;
        border: 1px solid #dfe2e5;
      }
    `;
    
    try {
      fs.writeFileSync(tempCssPath, cssContent);
      tempFiles.push(tempCssPath);
      console.log(`Created temporary CSS file: ${tempCssPath}`);
    } catch (cssError) {
      console.warn(`Warning: Could not create temporary CSS file: ${cssError.message}`);
    }
    
    // 2. Create both possible styles directories
    const stylesDirs = [
      path.join(cwd, 'styles'),
      path.join(cwd, '.webpack', 'main', 'styles')
    ];
    
    // Create all possible styles directories
    stylesDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`Created styles directory: ${dir}`);
        } catch (dirError) {
          console.warn(`Warning: Could not create styles directory ${dir}: ${dirError.message}`);
        }
      }
    });
    
    // Add github.css to both possible locations
    const githubCssContent = `
      /* GitHub syntax highlighting styles */
      .hljs {
        color: #24292e;
        background: #ffffff;
      }
      .hljs-doctag,
      .hljs-keyword,
      .hljs-meta .hljs-keyword,
      .hljs-template-tag,
      .hljs-template-variable,
      .hljs-type,
      .hljs-variable.language_ {
        color: #d73a49;
      }
      .hljs-title,
      .hljs-title.class_,
      .hljs-title.class_.inherited__,
      .hljs-title.function_ {
        color: #6f42c1;
      }
      .hljs-attr,
      .hljs-attribute,
      .hljs-literal,
      .hljs-meta,
      .hljs-number,
      .hljs-operator,
      .hljs-variable,
      .hljs-selector-attr,
      .hljs-selector-class,
      .hljs-selector-id {
        color: #005cc5;
      }
      .hljs-regexp,
      .hljs-string,
      .hljs-meta .hljs-string {
        color: #032f62;
      }
      .hljs-built_in,
      .hljs-symbol {
        color: #e36209;
      }
      .hljs-comment,
      .hljs-code,
      .hljs-formula {
        color: #6a737d;
      }
      .hljs-name,
      .hljs-quote,
      .hljs-selector-tag,
      .hljs-selector-pseudo {
        color: #22863a;
      }
      .hljs-subst {
        color: #24292e;
      }
      .hljs-section {
        color: #005cc5;
        font-weight: bold;
      }
      .hljs-bullet {
        color: #735c0f;
      }
      .hljs-emphasis {
        color: #24292e;
        font-style: italic;
      }
      .hljs-strong {
        color: #24292e;
        font-weight: bold;
      }
      .hljs-addition {
        color: #22863a;
        background-color: #f0fff4;
      }
      .hljs-deletion {
        color: #b31d28;
        background-color: #ffeef0;
      }
    `;
    
    // Create github.css in all possible locations
    stylesDirs.forEach(dir => {
      const githubCssPath = path.join(dir, 'github.css');
      try {
        fs.writeFileSync(githubCssPath, githubCssContent);
        tempFiles.push(githubCssPath);
        console.log(`Created GitHub syntax highlighting file: ${githubCssPath}`);
      } catch (githubCssError) {
        console.warn(`Warning: Could not create GitHub CSS file at ${githubCssPath}: ${githubCssError.message}`);
      }
    });

    // Check possible CSS paths
    [tempCssPath, path.join(__dirname, 'markdown.css'), path.join(process.resourcesPath || '', 'markdown.css')].forEach(cssPath => {
      console.log(`Checking for CSS at: ${cssPath}`);
      console.log(`CSS file exists: ${fs.existsSync(cssPath)}`);
    });

    const outputFilepath = join(gameFolderPath, 'rules.pdf');
    console.log(`Will output PDF to: ${outputFilepath}`);
    
    // Try to resolve the specific bundle path structure
    const bundlePath = path.join(cwd, '.webpack', 'main');
    const isBundled = fs.existsSync(bundlePath);
    console.log(`Is running from webpack bundle: ${isBundled}`);
    
    // Create PDF with explicit options
    const pdfOptions = { 
      content: rulesMdContent,
      body_class: 'markdown-body',
      css: cssContent + '\n' + githubCssContent,  // Include highlighting styles directly in CSS
      pdf_options: {
        format: 'A4',
        margin: '20mm',
        printBackground: true
      },
      basedir: isBundled ? bundlePath : cwd, // Use bundle path if we're in a bundle
      // Disable highlight_style to avoid path issues and just use our embedded CSS
      highlight_style: false
    };
    
    if (tempFiles.includes(tempCssPath)) {
      pdfOptions.stylesheet = tempCssPath;
    }
    
    const pdf = await mdToPdf(pdfOptions);

    if (pdf) {
      await writeFile(outputFilepath, pdf.content);
      
      // Clean up temporary files
      tempFiles.forEach(file => {
        try {
          fs.unlinkSync(file);
          console.log(`Temporary file removed: ${file}`);
        } catch (cleanupError) {
          console.warn(`Warning: Could not remove temporary file ${file}: ${cleanupError.message}`);
        }
      });
      
      // Remove the styles directories we created
      stylesDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
          try {
            fs.rmdirSync(dir);
            console.log(`Removed temporary styles directory: ${dir}`);
          } catch (rmDirError) {
            console.warn(`Warning: Could not remove temporary styles directory ${dir}: ${rmDirError.message}`);
          }
        }
      });
      
      return outputFilepath;
    }
    console.error('Failed to produce rulebook');
    return null;
  } catch (error) {
    console.error(`Error in produceRulebook: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    return null;
  }
}

module.exports = { produceRulebook };
