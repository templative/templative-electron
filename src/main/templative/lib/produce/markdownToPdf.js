const { marked } = require('marked');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const os = require('os');

// To test, run:
// node /Users/oliverbarnum/Documents/git/templative-electron/src/main/templative/lib/produce/tests/testMarkdownToPdf.js

const PAGE_PADDING_HORIZONTAL = 30;
const PAGE_PADDING_TOP = 40;
const PAGE_PADDING_BOTTOM = 60;
const PAGE_SIZE = 'a4';
const PAGE_NUMBER_FONT_SIZE = 8;

const FONT_SIZE = 12;
const LINE_HEIGHT_MULTIPLIER = 1.2;
const TOTAL_LINE_HEIGHT = FONT_SIZE * LINE_HEIGHT_MULTIPLIER;
const SPACE_BEFORE_HEADING = 20;
const SPACE_AFTER_HEADING = 0;
const SPACE_AFTER_TOKEN = 0;
const SPACE_BEFORE_PARAGRAPH = 10;
const SPACE_AFTER_PARAGRAPH = 10;
const CELL_PADDING = 6;

function getSystemFont() {
  const platform = os.platform();
  if (platform === 'darwin') {
    return 'Helvetica';
  } else if (platform === 'win32') {
    return 'Arial';
  }
  return 'Helvetica';
}

// Store the system font names for reuse
const SYSTEM_FONT = getSystemFont();

async function markdownToPdf(templativeRootDirectoryPath, markdown, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultPdfOptions = {
      format: PAGE_SIZE,
      margin: {
        top: PAGE_PADDING_TOP,
        right: PAGE_PADDING_HORIZONTAL,
        bottom: PAGE_PADDING_BOTTOM,
        left: PAGE_PADDING_HORIZONTAL
      },
      info: {
        Title: 'rules'
      }
    };

    const pdfOptions = { ...defaultPdfOptions, ...options };
    
    try {      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: pdfOptions.format
      });
      
      doc.setProperties({
        title: pdfOptions.info.Title,
        subject: pdfOptions.info.Subject || '',
        author: pdfOptions.info.Author || '',
        keywords: pdfOptions.info.Keywords || '',
        creator: pdfOptions.info.Creator || 'Templative'
      });
      
      doc.setFont(SYSTEM_FONT);
      doc.setFontSize(FONT_SIZE);
      
      const margins = {
        left: pdfOptions.margin.left,
        top: pdfOptions.margin.top,
        right: pdfOptions.margin.right,
        bottom: pdfOptions.margin.bottom
      };
      
      const tokens = marked.lexer(markdown);
      
      // Debug: Log all tokens to see what's being parsed
      
      let currentY = margins.top;
      
      // Create a cache for downloaded images
      const imageCache = {};
      
      processTokens(templativeRootDirectoryPath, doc, tokens, {
        margins: margins,
        currentY: currentY,
        pageWidth: doc.internal.pageSize.width,
        pageHeight: doc.internal.pageSize.height,
        imageCache: imageCache
      }).then(() => {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(PAGE_NUMBER_FONT_SIZE);
          doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - margins.bottom,
            { align: 'center' }
          );
        }
        
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        resolve(pdfBuffer);
      }).catch(error => {
        console.log("!!! Could not create the rules PDF due to an error", error);
        reject(error);
      });
      
    } catch (error) {
      console.log("!!! Could not create the rules PDF due to an error", error);
      reject(error);
    }
  });
}

async function processTokens(templativeRootDirectoryPath, doc, tokens, context) {
  let { margins, currentY, pageWidth, pageHeight, imageCache } = context;

  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Check if we need a new page
    if (currentY > pageHeight - margins.bottom - 50) {
      doc.addPage();
      currentY = margins.top;
    }
    
    switch (token.type) {
      case 'heading':
        currentY = renderHeading(doc, token, currentY, margins, pageWidth);
        break;
      
      case 'paragraph':
        // Check if this paragraph contains an image
        if (token.tokens && token.tokens.some(t => t.type === 'image')) {
          // Extract image tokens and process them
          for (const inlineToken of token.tokens) {
            if (inlineToken.type === 'image') {
              currentY = await renderImage(templativeRootDirectoryPath, doc, inlineToken, currentY, margins, pageWidth, imageCache);
            }
          }
        } else {
          currentY = renderParagraph(doc, token, currentY, margins, pageWidth);
        }
        break;
      
      case 'list':
        currentY = renderList(doc, token, currentY, margins, pageWidth);
        break;
      
      case 'blockquote':
        currentY = renderBlockquote(doc, token, currentY, margins, pageWidth);
        break;
      
      case 'code':
        currentY = renderCode(doc, token, currentY, margins, pageWidth);
        break;
      
      case 'hr':
        currentY = renderHorizontalRule(doc, currentY, margins, pageWidth);
        break;
      
      case 'table':
        currentY = renderTable(doc, token, currentY, margins, pageWidth);
        break;
      
      case 'space':
        currentY += SPACE_AFTER_TOKEN;
        break;
      
      case 'image':
        currentY = await renderImage(templativeRootDirectoryPath, doc, token, currentY, margins, pageWidth, imageCache);
        break;
      
      default:
        break;
    }
    
    // Update context
    context.currentY = currentY;
  }
  
  return context.currentY;
}

function renderHeading(doc, token, y, margins, pageWidth) {
  const fontSizes = {
    1: FONT_SIZE + 14,
    2: FONT_SIZE + 10,
    3: FONT_SIZE + 6,
    4: FONT_SIZE + 4,
    5: FONT_SIZE + 2,
    6: FONT_SIZE
  };
  
  y += SPACE_BEFORE_HEADING;

  doc.setFont(SYSTEM_FONT);
  doc.setFontSize(fontSizes[token.depth] || FONT_SIZE);
  
  const textWidth = pageWidth - margins.left - margins.right;
  const textLines = doc.splitTextToSize(token.text, textWidth);
  
  doc.text(textLines, margins.left, y);
  
  y += (textLines.length * (fontSizes[token.depth] * LINE_HEIGHT_MULTIPLIER)) + SPACE_AFTER_HEADING;
  
  doc.setFont(SYSTEM_FONT);
  doc.setFontSize(FONT_SIZE);
  
  return y;
}

function renderParagraph(doc, token, y, margins, pageWidth) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  const textWidth = pageWidth - margins.left - margins.right;
  
  // Process inline tokens instead of just joining text
  if (token.tokens) {
    y = renderInlineTokens(doc, token.tokens, y, margins, textWidth);
  } else {
    const textLines = doc.splitTextToSize(token.text, textWidth);
    doc.text(textLines, margins.left, y);
    y += (textLines.length * TOTAL_LINE_HEIGHT);
  }
  
  y += SPACE_AFTER_PARAGRAPH;
  
  return y;
}

// Add this new function to handle inline tokens
function renderInlineTokens(doc, tokens, y, margins, textWidth) {
  let currentText = '';
  let currentX = margins.left;
  let startY = y;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Handle different token types
    switch (token.type) {
      case 'text':
        currentText += token.text || '';
        break;
        
      case 'link':
        // Flush any pending text with normal style
        if (currentText) {
          const lines = doc.splitTextToSize(currentText, textWidth - (currentX - margins.left));
          doc.text(lines, currentX, y);
          currentX += doc.getTextWidth(lines[0]);
          if (lines.length > 1) {
            y += (lines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
          currentText = '';
        }
        
        // Get link text and URL
        const linkText = token.text || token.href;
        const linkUrl = token.href;
        
        // Set link style (blue and underlined)
        doc.setTextColor(0, 0, 255);
        
        // Render the link text
        const linkLines = doc.splitTextToSize(linkText, textWidth - (currentX - margins.left));
        doc.text(linkLines, currentX, y);
        
        // Add link annotation
        const linkWidth = doc.getTextWidth(linkLines[0]);
        doc.link(
          currentX, 
          y - FONT_SIZE, 
          linkWidth,
          FONT_SIZE * 1.2,
          { url: linkUrl }
        );
        
        currentX += linkWidth;
        if (linkLines.length > 1) {
          y += (linkLines.length - 1) * TOTAL_LINE_HEIGHT;
          currentX = margins.left;
        }
        
        // Reset to normal style
        doc.setTextColor(0, 0, 0);
        break;
        
      case 'strong':
        // Flush any pending text with normal style
        if (currentText) {
          const lines = doc.splitTextToSize(currentText, textWidth - (currentX - margins.left));
          doc.text(lines, currentX, y);
          currentX += doc.getTextWidth(lines[0]);
          if (lines.length > 1) {
            y += (lines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
          currentText = '';
        }
        
        // Check if this is a nested token with both bold and italic
        if (token.tokens && token.tokens.some(t => t.type === 'em')) {
          // Set bold and italic style
          doc.setFont(SYSTEM_FONT, 'bolditalic');
          
          // Extract the text from the em token
          const emText = token.tokens.map(t => t.text || '').join('');
          const boldItalicLines = doc.splitTextToSize(emText, textWidth - (currentX - margins.left));
          
          doc.text(boldItalicLines, currentX, y);
          currentX += doc.getTextWidth(boldItalicLines[0]);
          if (boldItalicLines.length > 1) {
            y += (boldItalicLines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
        } else {
          // Regular bold text
          doc.setFont(SYSTEM_FONT, 'bold');
          const boldText = token.text || '';
          const boldLines = doc.splitTextToSize(boldText, textWidth - (currentX - margins.left));
          
          doc.text(boldLines, currentX, y);
          currentX += doc.getTextWidth(boldLines[0]);
          if (boldLines.length > 1) {
            y += (boldLines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
        }
        
        // Reset to normal style
        doc.setFont(SYSTEM_FONT, 'normal');
        break;
        
      case 'em':
        // Flush any pending text with normal style
        if (currentText) {
          const lines = doc.splitTextToSize(currentText, textWidth - (currentX - margins.left));
          doc.text(lines, currentX, y);
          currentX += doc.getTextWidth(lines[0]);
          if (lines.length > 1) {
            y += (lines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
          currentText = '';
        }
        
        // Check if this is a nested token with both italic and bold
        if (token.tokens && token.tokens.some(t => t.type === 'strong')) {
          // Set bold and italic style
          doc.setFont(SYSTEM_FONT, 'bolditalic');
          
          // Extract the text from the strong token
          const strongText = token.tokens.map(t => t.text || '').join('');
          const boldItalicLines = doc.splitTextToSize(strongText, textWidth - (currentX - margins.left));
          
          doc.text(boldItalicLines, currentX, y);
          currentX += doc.getTextWidth(boldItalicLines[0]);
          if (boldItalicLines.length > 1) {
            y += (boldItalicLines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
        } else {
          // Regular italic text
          doc.setFont(SYSTEM_FONT, 'italic');
          const italicText = token.text || '';
          const italicLines = doc.splitTextToSize(italicText, textWidth - (currentX - margins.left));
          
          doc.text(italicLines, currentX, y);
          currentX += doc.getTextWidth(italicLines[0]);
          if (italicLines.length > 1) {
            y += (italicLines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
        }
        
        // Reset to normal style
        doc.setFont(SYSTEM_FONT, 'normal');
        break;
        
      case 'strong_em':
      case 'em_strong':
        // Flush any pending text with normal style
        if (currentText) {
          const lines = doc.splitTextToSize(currentText, textWidth - (currentX - margins.left));
          doc.text(lines, currentX, y);
          currentX += doc.getTextWidth(lines[0]);
          if (lines.length > 1) {
            y += (lines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
          currentText = '';
        }
        
        // Set bold and italic style
        doc.setFont(SYSTEM_FONT, 'bolditalic');
        const boldItalicText = token.text || '';
        const boldItalicLines = doc.splitTextToSize(boldItalicText, textWidth - (currentX - margins.left));
        doc.text(boldItalicLines, currentX, y);
        currentX += doc.getTextWidth(boldItalicLines[0]);
        if (boldItalicLines.length > 1) {
          y += (boldItalicLines.length - 1) * TOTAL_LINE_HEIGHT;
          currentX = margins.left;
        }
        
        // Reset to normal style
        doc.setFont(SYSTEM_FONT, 'normal');
        break;
        
      case 'image':
        // Flush any pending text with normal style
        if (currentText) {
          const lines = doc.splitTextToSize(currentText, textWidth - (currentX - margins.left));
          doc.text(lines, currentX, y);
          currentX += doc.getTextWidth(lines[0]);
          if (lines.length > 1) {
            y += (lines.length - 1) * TOTAL_LINE_HEIGHT;
            currentX = margins.left;
          }
          currentText = '';
        }
        
        // For inline images, we'll just add a placeholder text
        const imgText = `[Image: ${token.text || 'image'}]`;
        doc.setFont(SYSTEM_FONT, 'italic');
        doc.text(imgText, currentX, y);
        currentX += doc.getTextWidth(imgText);
        doc.setFont(SYSTEM_FONT, 'normal');
        break;
        
      default:
        if (token.text) {
          currentText += token.text;
        }
        break;
    }
  }
  
  // Flush any remaining text
  if (currentText) {
    const lines = doc.splitTextToSize(currentText, textWidth - (currentX - margins.left));
    doc.text(lines, currentX, y);
    if (lines.length > 1) {
      y += (lines.length - 1) * TOTAL_LINE_HEIGHT;
    }
  }
  
  // Ensure we advance at least one line height
  if (y <= startY) {
    y += TOTAL_LINE_HEIGHT;
  }
  
  return y;
}

function renderList(doc, token, y, margins, pageWidth) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  const listIndent = 15;
  const textWidth = pageWidth - margins.left - margins.right - listIndent;
  
  // Recursive function to handle nested lists
  function processListItems(items, level = 0) {
    const currentIndent = listIndent * level;
    const currentTextWidth = pageWidth - margins.left - margins.right - currentIndent - listIndent;
    
    items.forEach((item, index) => {
      const bullet = token.ordered ? `${index + 1}.` : '•';
      
      // Check if we need a new page
      if (y + TOTAL_LINE_HEIGHT > doc.internal.pageSize.height - margins.bottom) {
        doc.addPage();
        y = margins.top;
      }
      
      doc.text(bullet, margins.left + currentIndent, y);
      
      // Process inline tokens for list items
      if (item.tokens) {
        const listMargins = { ...margins, left: margins.left + currentIndent + listIndent };
        
        // Process each token in the list item
        for (const token of item.tokens) {
          if (token.type === 'text' || token.type === 'strong' || token.type === 'em') {
            y = renderInlineTokens(doc, [token], y, listMargins, currentTextWidth);
          } else if (token.type === 'list') {
            // Handle nested list
            y += TOTAL_LINE_HEIGHT;
            processListItems(token.items, level + 1);
          } else {
            // For other token types, render as appropriate
            const textLines = doc.splitTextToSize(token.text || '', currentTextWidth);
            doc.text(textLines, margins.left + currentIndent + listIndent, y);
            y += (textLines.length * TOTAL_LINE_HEIGHT);
          }
        }
      } else {
        const textLines = doc.splitTextToSize(item.text, currentTextWidth);
        doc.text(textLines, margins.left + currentIndent + listIndent, y);
        y += (textLines.length * TOTAL_LINE_HEIGHT);
      }
      
      // Process any nested lists in this item
      if (item.items && item.items.length > 0) {
        processListItems(item.items, level + 1);
      }
      
      y += SPACE_AFTER_PARAGRAPH;
    });
  }
  
  // Start processing the list
  processListItems(token.items);
  
  return y;
}

function renderBlockquote(doc, token, y, margins, pageWidth) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  let text = '';
  if (token.tokens) {
    text = token.tokens.map(t => {
      if (t.tokens) {
        return t.tokens.map(st => st.text || '').join('');
      }
      return t.text || '';
    }).join('\n');
  } else {
    text = token.text;
  }

  const quoteIndent = 10;
  const textWidth = pageWidth - margins.left - margins.right - quoteIndent - 5;
  const textLines = doc.splitTextToSize(text, textWidth);
  
  const startY = y - (TOTAL_LINE_HEIGHT * 1);
  const endY = y + ((textLines.length-1) * TOTAL_LINE_HEIGHT);
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(3);
  doc.line(margins.left + 3, startY, margins.left + 3, endY);
  
  doc.setTextColor(68, 68, 68);
  doc.text(textLines, margins.left + quoteIndent, y);
  doc.setTextColor(0, 0, 0);
  
  y = endY + 10;
  
  return y;
}

function renderCode(doc, token, y, margins, pageWidth) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  const codeLines = token.text.split('\n');
  
  const blockHeight = codeLines.length * TOTAL_LINE_HEIGHT + 20;
  
  // Check if we need a new page to fit the code block
  if (y + blockHeight > doc.internal.pageSize.height - margins.bottom) {
    doc.addPage();
    y = margins.top;
  }
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margins.left, y - (TOTAL_LINE_HEIGHT * 1.5), pageWidth - margins.left - margins.right, blockHeight, 'F');
  
  doc.setFont('Courier');
  doc.setFontSize(FONT_SIZE);
  
  codeLines.forEach((line, index) => {
    doc.text(line, margins.left + 10, y + (index * TOTAL_LINE_HEIGHT));
  });
  
  doc.setFont(SYSTEM_FONT);
  doc.setFontSize(FONT_SIZE);
  
  y += blockHeight + SPACE_AFTER_PARAGRAPH;
  
  return y;
}

function renderHorizontalRule(doc, y, margins, pageWidth) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.line(margins.left, y, pageWidth - margins.right, y);
  doc.setDrawColor(0, 0, 0);
  
  y += SPACE_AFTER_PARAGRAPH;
  
  return y;
}

function renderTable(doc, token, y, margins, pageWidth) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  const table = token;
  const colCount = table.header.length;
  const rowCount = table.rows.length;
  const colWidth = (pageWidth - margins.left - margins.right) / colCount;
  const cellPadding = CELL_PADDING;
  const lineHeight = FONT_SIZE * LINE_HEIGHT_MULTIPLIER;
  
  // Calculate total table height to check if we need a new page
  const headerHeight = lineHeight + (2 * cellPadding);
  const rowHeight = lineHeight + (2 * cellPadding);
  const totalTableHeight = headerHeight + (rowHeight * rowCount) + SPACE_AFTER_PARAGRAPH;
  
  // Check if we need a new page to fit the table
  if (y + totalTableHeight > doc.internal.pageSize.height - margins.bottom) {
    doc.addPage();
    y = margins.top;
  }
  
  doc.setFont(SYSTEM_FONT);
  table.header.forEach((cell, i) => {
    const cellText = typeof cell === 'object' && cell !== null ? 
      (cell.text || JSON.stringify(cell)) : String(cell);
    
    doc.text(
      cellText, 
      margins.left + (i * colWidth) + cellPadding, 
      y + cellPadding
    );
  });
  
  doc.setFont(SYSTEM_FONT);
  
  y += lineHeight + (2 * cellPadding);
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margins.left, y - cellPadding, pageWidth - margins.right, y - cellPadding);
  
  table.rows.forEach((row, rowIndex) => {
    if (y + lineHeight > doc.internal.pageSize.height - margins.bottom) {
      doc.addPage();
      y = margins.top;
    }
    
    row.forEach((cell, colIndex) => {
      const cellText = typeof cell === 'object' && cell !== null ? 
        (cell.text || JSON.stringify(cell)) : String(cell);
      
      doc.text(
        cellText, 
        margins.left + (colIndex * colWidth) + cellPadding, 
        y + cellPadding
      );
    });
    
    y += lineHeight + (2 * cellPadding);
    
    if (rowIndex < rowCount - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margins.left, y - cellPadding, pageWidth - margins.right, y - cellPadding);
    }
  });
  
  doc.setDrawColor(0, 0, 0);
  
  y += SPACE_AFTER_PARAGRAPH;
  
  return y;
}

// Function to download an image and return it as base64
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    
    // Check if it's a local file path
    if (url.startsWith('file://') || !url.startsWith('http')) {
      let filePath = url;
      if (url.startsWith('file://')) {
        filePath = url.replace('file://', '');
      }
      
      try {
        if (!fs.existsSync(filePath)) {
          console.error(`Local image file not found: ${filePath}`);
          return resolve(null);
        }
        
        const data = fs.readFileSync(filePath);
        const extension = path.extname(filePath).substring(1).toLowerCase() || 'jpeg';
        const base64 = `data:image/${extension};base64,${data.toString('base64')}`;
        resolve(base64);
      } catch (error) {
        console.error('Error reading local image:', error);
        resolve(null);
      }
      return;
    }
    
    // For remote URLs, use a temporary file approach
    const protocol = url.startsWith('https') ? https : http;
    
    // Create a temporary file to store the image
    const tempFilePath = path.join(os.tmpdir(), `templative-image-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);
    const fileStream = fs.createWriteStream(tempFilePath);
    
    const request = protocol.get(url, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        console.error(`Failed to download image: HTTP ${response.statusCode}`);
        fileStream.close();
        fs.unlink(tempFilePath, () => {}); // Clean up
        resolve(null);
        return;
      }
      
      // Get the content type to determine image format
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        
        try {
          // Read the file back as base64
          const data = fs.readFileSync(tempFilePath);
          const base64 = `data:${contentType};base64,${data.toString('base64')}`;
          
          // Clean up the temporary file
          fs.unlink(tempFilePath, (err) => {
            if (err) console.error('Error deleting temp file:', err);
          });
          
          resolve(base64);
        } catch (error) {
          console.error('Error processing downloaded image:', error);
          // Clean up the temporary file
          fs.unlink(tempFilePath, () => {});
          resolve(null);
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('Error downloading image:', error);
      fileStream.close();
      fs.unlink(tempFilePath, () => {}); // Clean up
      resolve(null);
    });
    
    // Set a timeout for the request
    request.setTimeout(10000, () => {
      console.error('Image download timed out');
      request.abort();
      fileStream.close();
      fs.unlink(tempFilePath, () => {}); // Clean up
      resolve(null);
    });
    
    fileStream.on('error', (error) => {
      console.error('Error writing to temp file:', error);
      request.abort();
      fileStream.close();
      fs.unlink(tempFilePath, () => {}); // Clean up
      resolve(null);
    });
  });
}

async function renderImage(templativeRootDirectoryPath, doc, token, y, margins, pageWidth, imageCache) {
  y += SPACE_BEFORE_PARAGRAPH;
  
  let imageUrl = token.href;
  const altText = token.text || '';
  const maxWidth = pageWidth - margins.left - margins.right;

  
  try {
    // Resolve relative paths using templativeRootDirectoryPath
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('file://') && !path.isAbsolute(imageUrl)) {
      // This is a relative path - resolve it against templativeRootDirectoryPath
      imageUrl = path.resolve(templativeRootDirectoryPath, imageUrl);
    }
    
    // Check if image is already in cache
    let imageData;
    if (imageCache[imageUrl]) {
      imageData = imageCache[imageUrl];
    } else {
      // Download the image
      imageData = await downloadImage(imageUrl);
      
      // Log the first 100 characters of the image data to verify it's valid
      if (imageData) {
        imageCache[imageUrl] = imageData;
      } else {
      }
    }
    
    if (!imageData) {
      // If image couldn't be downloaded, show alt text
      doc.setFont(SYSTEM_FONT, 'italic');
      doc.text(`[Image: ${altText || imageUrl}]`, margins.left, y);
      doc.setFont(SYSTEM_FONT, 'normal');
      return y + TOTAL_LINE_HEIGHT + SPACE_AFTER_PARAGRAPH;
    }
    
    // Add the image to the PDF
    try {
      // Try to get image properties to determine dimensions
      let imgWidth, imgHeight;
      
      try {
        // Get image properties
        const imgProps = doc.getImageProperties(imageData);
        
        // Calculate dimensions to maintain aspect ratio
        imgWidth = maxWidth;
        imgHeight = (imgProps.height * maxWidth) / imgProps.width;
        
      } catch (propsError) {
        console.error('Error getting image properties:', propsError);
        // Use default dimensions if we can't get properties
        imgWidth = maxWidth;
        imgHeight = maxWidth * 0.75; // Assume a reasonable aspect ratio
      }
      
      // Check if image would go off the page
      const totalImageHeight = imgHeight + (altText ? 20 + FONT_SIZE * LINE_HEIGHT_MULTIPLIER : 0);
      if (y + totalImageHeight > doc.internal.pageSize.height - margins.bottom) {
        doc.addPage();
        y = margins.top;
      }
      
      // Try a simpler approach first - directly add the image
      try {
        doc.addImage(
          imageData,
          null, // Let jsPDF determine the type
          margins.left,
          y,
          imgWidth,
          imgHeight
        );
        
        y += imgHeight; // Update y position
        
        // Add caption if alt text is provided
        if (altText) {
          const captionY = y + 10;
          doc.setFont(SYSTEM_FONT, 'italic');
          doc.setFontSize(FONT_SIZE - 2);
          
          const captionLines = doc.splitTextToSize(altText, maxWidth);
          doc.text(captionLines, pageWidth / 2, captionY, { align: 'center' });
          
          doc.setFont(SYSTEM_FONT, 'normal');
          doc.setFontSize(FONT_SIZE);
          
          y = captionY + (captionLines.length * (FONT_SIZE - 2) * LINE_HEIGHT_MULTIPLIER);
        }
      } catch (directError) {
        console.error('Error with image insertion, trying fallback method:', directError);
        
        // Try with explicit format
        try {
          // Extract the format from the data URL
          const formatMatch = imageData.match(/^data:image\/(\w+);base64,/);
          const format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
          
          doc.addImage(
            imageData,
            format,
            margins.left,
            y,
            imgWidth,
            imgHeight
          );
          
          y += imgHeight;
          
          // Add caption if alt text is provided
          if (altText) {
            const captionY = y + 10;
            doc.setFont(SYSTEM_FONT, 'italic');
            doc.setFontSize(FONT_SIZE - 2);
            
            const captionLines = doc.splitTextToSize(altText, maxWidth);
            doc.text(captionLines, pageWidth / 2, captionY, { align: 'center' });
            
            doc.setFont(SYSTEM_FONT, 'normal');
            doc.setFontSize(FONT_SIZE);
            
            y = captionY + (captionLines.length * (FONT_SIZE - 2) * LINE_HEIGHT_MULTIPLIER);
          }
          
        } catch (finalError) {
          console.error('All image insertion methods failed:', finalError);
          // Fallback to alt text
          doc.setFont(SYSTEM_FONT, 'italic');
          doc.text(`[Image: ${altText || imageUrl}]`, margins.left, y);
          doc.setFont(SYSTEM_FONT, 'normal');
          y += TOTAL_LINE_HEIGHT;
        }
      }
    } catch (error) {
      console.error('Error in renderImage:', error);
      // Fallback to alt text
      doc.setFont(SYSTEM_FONT, 'italic');
      doc.text(`[Image: ${altText || imageUrl}]`, margins.left, y);
      doc.setFont(SYSTEM_FONT, 'normal');
      y += TOTAL_LINE_HEIGHT;
    }
    
  } catch (error) {
    console.error('Error in renderImage:', error);
    // Fallback to alt text
    doc.setFont(SYSTEM_FONT, 'italic');
    doc.text(`[Image: ${altText || imageUrl}]`, margins.left, y);
    doc.setFont(SYSTEM_FONT, 'normal');
    y += TOTAL_LINE_HEIGHT;
  }
  
  y += SPACE_AFTER_PARAGRAPH;
  
  return y;
}

module.exports = {
  markdownToPdf
};
