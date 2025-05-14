const { marked } = require('marked');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

// To test, run:
// node /Users/oliverbarnum/Documents/git/templative-electron/src/main/templative/lib/produce/tests/testMarkdownToPdf.js

async function markdownToPdf(markdown, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultPdfOptions = {
      format: 'a4',
      margin: {
        top: 30,
        right: 40,
        bottom: 30,
        left: 40
      },
      info: {
        Title: 'rules'
      }
    };

    const pdfOptions = { ...defaultPdfOptions, ...options };
    
    try {      
      // Create a PDF document
      const doc = new PDFDocument({
        size: pdfOptions.format,
        margin: pdfOptions.margin,
        info: pdfOptions.info,
        bufferPages: true
      });
      
      // Collect PDF data chunks
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      
      // Resolve with the complete PDF buffer when done
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      
      // Set up document styling
      doc.font('Helvetica');
      
      // Process the HTML content
      const tokens = marked.lexer(markdown);
      
      // Process tokens and handle images asynchronously
      processTokensWithImages(doc, tokens, pdfOptions.basePath || process.cwd())
        .then(() => {
          // Add page numbers
          const pageCount = doc.bufferedPageRange().count;
          for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.fontSize(8);
            doc.text(
              `Page ${i + 1} of ${pageCount}`,
              doc.page.margins.left,
              doc.page.height - doc.page.margins.bottom - 12,
              { align: 'center', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
            );
          }
          
          // Finalize the PDF
          doc.end();
        })
        .catch(error => {
          console.error("Error processing markdown with images:", error);
          doc.end();
          reject(error);
        });
    } catch (error) {
      console.log("!!! Could not create the rules PDF due to an error", error);
      reject(error);
    }
  });
}

// Process tokens and handle images asynchronously
async function processTokensWithImages(doc, tokens, basePath, options = {}) {
  const opts = { ...{ indent: 0, listCounter: 0 }, ...options };
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    switch (token.type) {
      case 'heading':
        renderHeading(doc, token);
        break;
      
      case 'paragraph':
        // Check if paragraph contains an image
        if (token.tokens && token.tokens.some(t => t.type === 'image')) {
          await renderParagraphWithImages(doc, token, opts, basePath);
        } else {
          renderParagraph(doc, token, opts);
        }
        break;
      
      case 'list':
        renderList(doc, token, opts);
        break;
      
      case 'blockquote':
        renderBlockquote(doc, token, opts);
        break;
      
      case 'code':
        renderCode(doc, token, opts);
        break;
      
      case 'hr':
        renderHorizontalRule(doc);
        break;
      
      case 'table':
        renderTable(doc, token);
        break;
      
      case 'html':
        // Skip HTML content or implement HTML parsing if needed
        break;
      
      case 'space':
        doc.moveDown();
        break;
      
      default:
        // Handle other token types or skip them
        break;
    }
  }
}

// New function to handle paragraphs with images
async function renderParagraphWithImages(doc, token, opts, basePath) {
  doc.moveDown(1);
  
  for (const inlineToken of token.tokens) {
    if (inlineToken.type === 'image') {
      await renderImage(doc, inlineToken, opts, basePath);
    } else {
      // For non-image tokens, render them normally
      const tempTokens = [inlineToken];
      renderInlineTokens(doc, tempTokens, opts);
    }
  }
  
  doc.moveDown(0.5);
}

// Function to render images
async function renderImage(doc, token, opts, basePath) {
  try {
    const { href: src, text: alt, title } = token;
    
    // Get image data
    const imageData = await loadImage(src, basePath);
    if (!imageData) {
      console.warn(`Failed to load image: ${src}`);
      doc.text(`[Image: ${alt || src}]`, { indent: opts.indent });
      return;
    }
    
    // Get image dimensions using Sharp
    const dimensions = await getImageDimensions(imageData);
    
    // Calculate image dimensions to fit within page width
    const maxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right - opts.indent;
    const { width, height } = calculateImageDimensions(dimensions, maxWidth);
    
    // Check if we need to add a page break
    if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    
    // Save current Y position
    const startY = doc.y;
    
    // Render the image
    doc.image(imageData, doc.page.margins.left + opts.indent, startY, {
      width: width,
      height: height
    });
    
    // Manually update the Y position to be after the image
    doc.y = startY + height;
    
    // Add caption if title is provided
    if (title) {
      doc.moveDown(0.5);
      doc.fontSize(9)
         .text(title, { 
           align: 'center', 
           width: maxWidth,
           indent: opts.indent
         })
         .fontSize(11);
    }
    
    // Add extra space after the image
    doc.moveDown(1);
    
  } catch (error) {
    console.error(`Error rendering image: ${error.message}`);
    doc.text(`[Image: ${token.text || token.href}]`, { indent: opts.indent });
  }
}

// Helper function to get image dimensions using Sharp
async function getImageDimensions(imageData) {
  try {
    const metadata = await sharp(imageData).metadata();
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    // Return default dimensions if Sharp fails
    return { width: 400, height: 300 };
  }
}

// Helper function to calculate image dimensions while preserving aspect ratio
function calculateImageDimensions(dimensions, maxWidth) {
  const { width: originalWidth, height: originalHeight } = dimensions;
  
  // If image is smaller than maxWidth, use original size
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  // Calculate scaled dimensions to maintain aspect ratio
  const aspectRatio = originalHeight / originalWidth;
  const width = maxWidth;
  const height = Math.round(width * aspectRatio);
  
  // Limit maximum height to avoid extremely tall images
  const maxHeight = 800;
  if (height > maxHeight) {
    return {
      width: Math.round(maxHeight / aspectRatio),
      height: maxHeight
    };
  }
  
  return { width, height };
}

function renderTokens(doc, tokens, options = {}) {
  const defaultOptions = {
    indent: 0,
    listCounter: 0
  };
  
  const opts = { ...defaultOptions, ...options };
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    switch (token.type) {
      case 'heading':
        renderHeading(doc, token);
        break;
      
      case 'paragraph':
        renderParagraph(doc, token, opts);
        break;
      
      case 'list':
        renderList(doc, token, opts);
        break;
      
      case 'blockquote':
        renderBlockquote(doc, token, opts);
        break;
      
      case 'code':
        renderCode(doc, token, opts);
        break;
      
      case 'hr':
        renderHorizontalRule(doc);
        break;
      
      case 'table':
        renderTable(doc, token);
        break;
      
      case 'html':
        // Skip HTML content or implement HTML parsing if needed
        break;
      
      case 'space':
        doc.moveDown();
        break;
      
      default:
        // Handle other token types or skip them
        break;
    }
  }
}

function renderHeading(doc, token) {
  // Set font size based on heading level
  const fontSizes = {
    1: 24,
    2: 20,
    3: 16,
    4: 14,
    5: 12,
    6: 11
  };
  
  doc.moveDown(1.5);
  
  // Use standard font with bold styling instead of Helvetica-Bold
  doc.fontSize(fontSizes[token.depth] || 11)
     .text(token.text, { continued: false, font: 'Helvetica', bold: true })
     .fontSize(11);
  
  doc.moveDown(0.5);
}

function renderParagraph(doc, token, opts) {
  doc.moveDown(1);
  
  // Process inline tokens (bold, italic, etc.)
  if (token.tokens) {
    // Check for line breaks in the raw text
    const lines = token.raw.split(/  \n|\n/g);
    
    if (lines.length > 1) {
      // Handle multiple lines with line breaks
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        // Create a subset of tokens for this line
        const lineTokens = filterTokensForLine(token.tokens, lines[i]);
        
        // Render the line
        renderInlineTokens(doc, lineTokens, opts);
        
        // Add line break if not the last line
        if (i < lines.length - 1) {
          doc.moveDown(0.5);
        }
      }
    } else {
      // Single line, render normally
      renderInlineTokens(doc, token.tokens, opts);
    }
  } else {
    // Check for line breaks in the text
    const lines = token.text.split(/  \n|\n/g);
    
    if (lines.length > 1) {
      // Handle multiple lines with line breaks
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        doc.text(lines[i], { indent: opts.indent });
        
        // Add line break if not the last line
        if (i < lines.length - 1) {
          doc.moveDown(0.5);
        }
      }
    } else {
      // Single line, render normally
      doc.text(token.text, { indent: opts.indent });
    }
  }
  
  doc.moveDown(0.5);
}

// Helper function to filter tokens for a specific line
function filterTokensForLine(tokens, line) {
  // This is a simplified approach - for complex documents with mixed formatting
  // across line breaks, a more sophisticated algorithm would be needed
  if (!line || line.trim() === '') return [];
  
  // Find tokens that belong to this line
  return tokens.filter(token => {
    if (token.type === 'text') {
      return token.text && line.includes(token.text);
    }
    if (token.text) {
      return line.includes(token.text);
    }
    if (token.raw) {
      return line.includes(token.raw.replace(/\*\*\*|\*\*|\*|___|\__|_/g, ''));
    }
    return false;
  });
}

function renderInlineTokens(doc, tokens, opts) {
  let currentText = '';
  
  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        currentText += token.text;
        break;
        
      case 'strong':
        // First output any accumulated text
        if (currentText) {
          doc.text(currentText, { continued: true, indent: opts.indent });
          currentText = '';
        }
        
        // Check if token contains nested em tokens
        if (token.tokens && token.tokens.some(t => t.type === 'em')) {
          // Handle bold+italic text
          doc.font('Helvetica-BoldOblique')
             .text(token.raw.replace(/\*\*\*|\*\*|\*|___|\__|_/g, ''), { continued: true })
             .font('Helvetica');
        } else {
          // Apply bold styling
          doc.font('Helvetica-Bold')
             .text(token.text, { continued: true })
             .font('Helvetica');
        }
        break;
        
      case 'em':
        // First output any accumulated text
        if (currentText) {
          doc.text(currentText, { continued: true, indent: opts.indent });
          currentText = '';
        }
        
        // Check if token contains nested strong tokens
        if (token.tokens && token.tokens.some(t => t.type === 'strong')) {
          // Handle italic+bold text
          doc.font('Helvetica-BoldOblique')
             .text(token.raw.replace(/\*\*\*|\*\*|\*|___|\__|_/g, ''), { continued: true })
             .font('Helvetica');
        } else {
          // Apply italic styling
          doc.font('Helvetica-Oblique')
             .text(token.text, { continued: true })
             .font('Helvetica');
        }
        break;
        
      // Add support for combined bold and italic
      case 'strong_em':
      case 'em_strong':
        // First output any accumulated text
        if (currentText) {
          doc.text(currentText, { continued: true, indent: opts.indent });
          currentText = '';
        }
        
        // Apply bold and italic styling
        doc.font('Helvetica-BoldOblique')
           .text(token.text || token.raw.replace(/\*\*\*|\*\*|\*|___|\__|_/g, ''), { continued: true })
           .font('Helvetica');
        break;
        
      case 'link':
        // First output any accumulated text
        if (currentText) {
          doc.text(currentText, { continued: true, indent: opts.indent });
          currentText = '';
        }
        
        doc.fillColor('blue')
           .text(token.text, { continued: true, link: token.href, underline: true });
        doc.fillColor('black');
        break;
        
      case 'code':
        // First output any accumulated text
        if (currentText) {
          doc.text(currentText, { continued: true, indent: opts.indent });
          currentText = '';
        }
        
        // Use Courier which is a standard font in PDFKit
        doc.font('Courier')
           .text(token.text, { continued: true });
        doc.font('Helvetica');
        break;
        
      default:
        if (token.text) {
          currentText += token.text;
        }
        break;
    }
  }
  
  // Output any remaining text
  if (currentText.length > 0) {
    doc.text(currentText, { indent: opts.indent, continued: false });
  } else {
    // End the text flow if we've output special tokens but no final text
    doc.text('', { continued: false });
  }
}

function renderList(doc, token, opts) {
  doc.moveDown(1);
  
  const newIndent = opts.indent + 15;
  const listType = token.ordered ? 'ordered' : 'unordered';
  
  token.items.forEach((item, index) => {
    // Create appropriate bullet
    let bullet = listType === 'ordered' ? `${index + 1}.` : '• ';

    // Regular list item
    doc.text(bullet, { indent: opts.indent, continued: true });
    
    if (item.tokens) {
      const firstToken = item.tokens[0];
      
      if (firstToken.type === 'text') {
        doc.text(firstToken.text);
      } else {
        doc.text(' ');
        renderTokens(doc, item.tokens, { ...opts, indent: newIndent });
      }
      
      // Handle nested tokens (excluding the first one we just processed)
      if (item.tokens.length > 1) {
        renderTokens(doc, item.tokens.slice(1), { ...opts, indent: newIndent });
      }
    } else {
      doc.text(' ' + item.text);
    }
    
    doc.moveDown(0.5);
  });
}

function renderBlockquote(doc, token, opts) {
  // Check if we need to add a page break to avoid splitting the blockquote header
  const minHeightNeeded = 40; // Minimum space needed for the first line and some content
  if (doc.y + minHeightNeeded > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
  
  doc.moveDown(1);
  
  const quoteIndent = 10;
  const totalIndent = opts.indent + quoteIndent;
  
  // Process the blockquote content
  if (token.tokens && token.tokens.length > 0) {
    // Save current position to calculate height later
    const startY = doc.y;
    
    // Render the blockquote content with increased indent
    renderTokens(doc, token.tokens, { 
      ...opts, 
      indent: totalIndent 
    });
    
    // Calculate the height of the rendered content
    const endY = doc.y;
    const blockHeight = endY - startY;
    
    // Draw the vertical line
    doc.strokeColor('#cccccc')
       .lineWidth(3)
       .moveTo(doc.page.margins.left + opts.indent + 3, startY)
       .lineTo(doc.page.margins.left + opts.indent + 3, startY + blockHeight)
       .stroke();
    
    // Reset stroke color
    doc.strokeColor('black');
  } else {
    // If there are no tokens, just render the text
    doc.fillColor('#444444')
       .text(token.text, { indent: totalIndent })
       .fillColor('black');
  }
  
  doc.moveDown(0.5);
}

function renderCode(doc, token, opts) {
  doc.moveDown(1);
  
  // Draw code block background
  const originalY = doc.y;
  const codeText = token.text.split('\n');
  const lineHeight = doc.currentLineHeight();
  const blockHeight = lineHeight * (codeText.length + 1);
  
  // Use the current indent for the background rectangle
  doc.rect(doc.page.margins.left + opts.indent, originalY - 5, 
           doc.page.width - doc.page.margins.right - doc.page.margins.left - opts.indent - 10, 
           blockHeight)
     .fill('#f0f0f0');
  
  // Render code with monospace font
  doc.font('Courier')
     .fontSize(10)
     .fillColor('black');
  
  codeText.forEach(line => {
    doc.text(line, { indent: opts.indent + 10 });
  });
  
  doc.font('Helvetica')
     .fontSize(11);
  
  doc.moveDown(1);
}

function renderHorizontalRule(doc) {
  doc.moveDown(1);
  
  const y = doc.y;
  doc.strokeColor('#cccccc')
     .lineWidth(1)
     .moveTo(doc.page.margins.left, y)
     .lineTo(doc.page.width - doc.page.margins.right, y)
     .stroke();
  
  doc.strokeColor('black');
  doc.moveDown(1);
}

function renderTable(doc, token) {
  doc.moveDown(1);
  
  const table = token;
  const colCount = table.header.length;
  const rowCount = table.rows.length;
  const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / colCount;
  const cellPadding = 5;
  const lineHeight = doc.currentLineHeight();
  
  // Calculate positions
  let startX = doc.page.margins.left;
  let startY = doc.y;
  
  // Draw header - use standard font with bold styling
  table.header.forEach((cell, i) => {
    // Convert cell content to string if it's an object
    const cellText = typeof cell === 'object' && cell !== null ? 
      (cell.text || JSON.stringify(cell)) : String(cell);
    
    doc.text(cellText, 
             startX + (i * colWidth) + cellPadding, 
             startY + cellPadding, 
             { width: colWidth - (2 * cellPadding), font: 'Helvetica', bold: true });
  });
  
  // Move to next row
  startY += lineHeight + (2 * cellPadding);
  
  // Draw separator line
  doc.strokeColor('#000000')
     .lineWidth(1)
     .moveTo(startX, startY)
     .lineTo(startX + (colWidth * colCount), startY)
     .stroke();
  
  // Draw rows
  table.rows.forEach((row, rowIndex) => {
    const rowY = startY + (rowIndex * (lineHeight + (2 * cellPadding)));
    
    row.forEach((cell, colIndex) => {
      // Convert cell content to string if it's an object
      const cellText = typeof cell === 'object' && cell !== null ? 
        (cell.text || JSON.stringify(cell)) : String(cell);
      
      doc.text(cellText, 
               startX + (colIndex * colWidth) + cellPadding, 
               rowY + cellPadding, 
               { width: colWidth - (2 * cellPadding) });
    });
    
    // Draw row separator
    if (rowIndex < rowCount - 1) {
      const lineY = rowY + lineHeight + (2 * cellPadding);
      doc.strokeColor('#cccccc')
         .lineWidth(0.5)
         .moveTo(startX, lineY)
         .lineTo(startX + (colWidth * colCount), lineY)
         .stroke();
    }
  });
  
  // Reset stroke color
  doc.strokeColor('black');
  
  // Move past the table
  const finalY = startY + (rowCount * (lineHeight + (2 * cellPadding)));
  
  // Reset cursor position to left margin and move down
  doc.x = doc.page.margins.left;
  doc.y = finalY;
  doc.moveDown(1);
}

// Helper function to load image data from URL or local file
async function loadImage(src, basePath) {
  return new Promise((resolve, reject) => {
    // Check if it's a URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      // Load from URL
      const protocol = src.startsWith('https') ? https : http;
      
      protocol.get(src, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to load image: ${response.statusCode}`));
        }
        
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', err => reject(err));
      }).on('error', err => reject(err));
      
    } else {
      // Load from local file
      try {
        // Handle absolute and relative paths
        let imagePath = src;
        if (!path.isAbsolute(src)) {
          imagePath = path.join(basePath, src);
        }
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.warn(`Image file not found: ${imagePath}`);
          return resolve(null);
        }
        
        // Read the file
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            console.error(`Error reading image file: ${err.message}`);
            return resolve(null);
          }
          resolve(data);
        });
      } catch (error) {
        console.error(`Error processing image path: ${error.message}`);
        resolve(null);
      }
    }
  });
}

module.exports = {
  markdownToPdf
};
