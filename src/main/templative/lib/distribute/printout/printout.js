const { readdir, readFile, mkdir } = require('fs/promises');
const { join, basename, dirname } = require('path');
const { existsSync, readFileSync } = require('fs');
const { jsPDF } = require('jspdf');
const chalk = require('chalk');
const { COMPONENT_INFO } = require('../../componentInfo.js');

// Constants
const diceTypes = ["CustomColorD6", "CustomWoodD6"];
const unsupportedDiceTypes = ["CustomColorD4", "CustomColorD8"];
const marginInches = 0.5;
const pieceMarginInches = 0.11811 * 1/3;
const fpdfSizes = {
    "Letter": "letter",
    "Tabloid": "a3",
};
// Adjust the printout play area to account for margins
const printoutPlayAreaChoices = {
    "Letter": [8.5 - (marginInches * 2), 11 - (marginInches * 2)],
    "Tabloid": [11 - (marginInches * 2), 17 - (marginInches * 2)]
};

/**
 * Main function to create a PDF for printing
 */
async function createPdfForPrinting(producedDirectoryPath, isBackIncluded, size, areMarginsIncluded) {
    if (!fpdfSizes[size] || !printoutPlayAreaChoices[size]) {
        console.log(chalk.red(`!!! Cannot create size ${size}.`));
        return;
    }
    
    const componentTypeFilepathsAndQuantity = await getDictionaryOfImageFilepathsAndQuantityGroupedByComponentType(producedDirectoryPath);

    const placementCommands = [];
    const pageWidthInches = printoutPlayAreaChoices[size][0];
    const pageHeightInches = printoutPlayAreaChoices[size][1];
    
    let nextAvailablePage = 0;
    
    for (const componentType of Object.keys(componentTypeFilepathsAndQuantity)) {
        if (componentType.startsWith("STOCK_")) {
            console.log(`Skipping STOCK component: ${componentType}`);
            continue;
        }
        
        if (!(componentType in COMPONENT_INFO)) {
            console.log(chalk.yellow(`!!! Missing ${componentType} type description, skipping.`));
            continue;
        }
        
        const componentInfo = COMPONENT_INFO[componentType];
        if (!componentInfo.DimensionsInches) {
            console.log(chalk.yellow(`!!! Skipping ${componentType} because its inch size isn't defined.`));
            continue;
        }
        
        const componentCommands = await generatePlacementCommandsForComponentType(
            componentType,
            componentTypeFilepathsAndQuantity[componentType],
            componentInfo,
            isBackIncluded,
            pageWidthInches,
            pageHeightInches,
            areMarginsIncluded,
            nextAvailablePage
        );
        
        placementCommands.push(...componentCommands);
        
        // Update the next available page
        if (componentCommands.length > 0) {
            const maxPage = Math.max(...componentCommands.map(cmd => cmd.page));
            nextAvailablePage = maxPage + 1;
        }
    }
    
    // Create PDF and apply all placement commands
    const pdf = new jsPDF("p", "in", fpdfSizes[size]);
    await applyPlacementCommandsToPdf(pdf, placementCommands, size);
    
    // Save the PDF
    const outputPath = join(producedDirectoryPath, "printout.pdf");
    console.log(`Writing printout to ${outputPath}`);
    
    // Replace pdf.save() with direct file writing
    const pdfOutput = pdf.output('arraybuffer');
    const fs = require('fs');
    fs.writeFileSync(outputPath, Buffer.from(pdfOutput));
    
    return 1;
}

/**
 * Generate placement commands for a specific component type
 */
async function generatePlacementCommandsForComponentType(
    componentType,
    componentList,
    componentInfo,
    isBackIncluded,
    pageWidthInches,
    pageHeightInches,
    areMarginsIncluded,
    startingPageIndex
) {
    const commands = [];
    const isDie = diceTypes.includes(componentType);
    
    // Get component dimensions
    let componentSizeInches = [...componentInfo.DimensionsInches];
    
    // Adjust for margins if needed
    const marginsPixels = areMarginsIncluded && componentInfo.MarginsPixels ? componentInfo.MarginsPixels : null;
    if (marginsPixels && componentInfo.DimensionsPixels) {
        const dimensionsPixels = componentInfo.DimensionsPixels;
        const sizeOfContentPixels = [
            dimensionsPixels[0] - (marginsPixels[0] * 2), 
            dimensionsPixels[1] - (marginsPixels[1] * 2)
        ];
        const accountForMarginsFactor = [
            dimensionsPixels[0] / sizeOfContentPixels[0], 
            dimensionsPixels[1] / sizeOfContentPixels[1]
        ];
        componentSizeInches = [
            componentSizeInches[0] * accountForMarginsFactor[0], 
            componentSizeInches[1] * accountForMarginsFactor[1]
        ];
    }
    
    // Calculate piece size with margins
    let pieceSizeInches;
    if (isDie) {
        // Special handling for dice
        const flangeSize = componentSizeInches[1] * 0.15;  // Match the flange size ratio
        pieceSizeInches = [
            (componentSizeInches[0] * 3) + pieceMarginInches + (flangeSize * 2),
            (componentSizeInches[1] * 4 + flangeSize * 2) + pieceMarginInches
        ];
    } else {
        pieceSizeInches = [
            componentSizeInches[0] + pieceMarginInches, 
            componentSizeInches[1] + pieceMarginInches
        ];
    }
    
    // Calculate layout - use the usable area (page dimensions minus margins)
    // Try both orientations for non-dice components
    let columns = Math.floor(pageWidthInches / pieceSizeInches[0]);
    let rows = Math.floor(pageHeightInches / pieceSizeInches[1]);
    let isRotated = false;
    
    if (!isDie) {
        const rotatedColumns = Math.floor(pageWidthInches / pieceSizeInches[1]);
        const rotatedRows = Math.floor(pageHeightInches / pieceSizeInches[0]);
        
        // Check if rotating the components allows us to fit more on the page
        // Compare total pieces that fit in normal vs rotated orientation
        // Normal: columns * rows pieces
        // Rotated: rotatedColumns * rotatedRows pieces
        if (rotatedColumns * rotatedRows > columns * rows) {
            // Rotating allows more pieces to fit, so use rotated layout            
            isRotated = true;
            columns = rotatedColumns; 
            rows = rotatedRows;
            pieceSizeInches = [pieceSizeInches[1], pieceSizeInches[0]];
            componentSizeInches = [componentSizeInches[1], componentSizeInches[0]];
        }
    }
    
    
    if (rows === 0 || columns === 0) {
        console.log(chalk.red(`Skipping ${componentType} as it's too large for the print space.`));
        return commands;
    }
    
    // Calculate horizontal and vertical offsets for centering
    // Start from the page margin and add extra space to center the grid
    const horizontalOffset = marginInches + (pageWidthInches - (columns * pieceSizeInches[0])) / 2;
    const verticalOffset = marginInches + (pageHeightInches - (rows * pieceSizeInches[1])) / 2;
    

    
    // Process each component and generate placement commands
    let itemIndex = 0;
    
    for (const component of componentList) {
        if (component.isDie && isDie) {
            // Handle dice
            const dieImages = Array.isArray(component.filepath) ? component.filepath : [component.filepath];
            
            for (let i = 0; i < component.quantity; i++) {
                // For dice, we need to create a cross layout
                const pageIndex = Math.floor(itemIndex / (columns * rows)) + startingPageIndex;
                const itemIndexOnPage = itemIndex % (columns * rows);
                const col = itemIndexOnPage % columns;
                const row = Math.floor(itemIndexOnPage / columns);
                
                const xPos = horizontalOffset + (col * pieceSizeInches[0]);
                const yPos = verticalOffset + (row * pieceSizeInches[1]);
                
                // Add command for die cross layout
                commands.push({
                    page: pageIndex,
                    type: 'die',
                    filepaths: dieImages,
                    x: xPos,
                    y: yPos,
                    width: componentSizeInches[isRotated ? 1 : 0],
                    height: componentSizeInches[isRotated ? 0 : 1],
                    isRotated: isRotated,
                    componentType: componentType,
                    isFront: true
                });
                
                itemIndex++;
            }
        } else {
            // Handle regular components
            for (let i = 0; i < component.quantity; i++) {
                const pageIndex = Math.floor(itemIndex / (columns * rows)) + startingPageIndex;
                const itemIndexOnPage = itemIndex % (columns * rows);
                const col = itemIndexOnPage % columns;
                const row = Math.floor(itemIndexOnPage / columns);
                
                const xPos = horizontalOffset + (col * pieceSizeInches[0]);
                const yPos = verticalOffset + (row * pieceSizeInches[1]);
                
                // Calculate front page index
                // When backs are included, use even pages for fronts (0, 2, 4...)
                // When backs are not included, use sequential pages (0, 1, 2...)
                const frontPageIndex = isBackIncluded ? pageIndex * 2 : pageIndex;
                
                // Add command for front
                commands.push({
                    page: frontPageIndex,
                    type: 'regular',
                    filepath: component.filepath,
                    x: xPos,
                    y: yPos,
                    width: componentSizeInches[isRotated ? 1 : 0],
                    height: componentSizeInches[isRotated ? 0 : 1],
                    isRotated: isRotated,
                    componentType: componentType,
                    isFront: true,
                    marginsInfo: marginsPixels ? {
                        pixels: marginsPixels,
                        dimensionsPixels: componentInfo.DimensionsPixels
                    } : null
                });
                
                // Add command for back if needed
                if (isBackIncluded && component.backFilepath) {
                    // For backs, we need to mirror the position horizontally
                    // to account for double-sided printing
                    const reversedCol = columns - 1 - col;
                    const backXPos = horizontalOffset + (reversedCol * pieceSizeInches[0]);
                    
                    // Back page is always odd number (1, 3, 5...) in zero-based indexing
                    // (even pages when printed: 2, 4, 6...)
                    commands.push({
                        page: frontPageIndex + 1, // Always on next page after front
                        type: 'regular',
                        filepath: component.backFilepath,
                        x: backXPos,
                        y: yPos,
                        width: componentSizeInches[isRotated ? 1 : 0],
                        height: componentSizeInches[isRotated ? 0 : 1],
                        isRotated: isRotated,
                        componentType: componentType,
                        isFront: false,
                        marginsInfo: marginsPixels ? {
                            pixels: marginsPixels,
                            dimensionsPixels: componentInfo.DimensionsPixels
                        } : null
                    });
                }
                
                itemIndex++;
            }
        }
    }
    
    return commands;
}

/**
 * Apply all placement commands to the PDF
 */
async function applyPlacementCommandsToPdf(pdf, commands, size) {
    if (commands.length === 0) {
        console.log(chalk.yellow("No pieces to print."));
        return;
    }
    
    // Set a cross-platform compatible font
    pdf.setFont("helvetica");
    
    // Sort commands by page
    commands.sort((a, b) => {
        if (a.page !== b.page) return a.page - b.page;
        // If on same page, fronts before backs
        return a.isFront ? -1 : 1;
    });
    
    let currentPage = 0;
    
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        
        // Add new page if needed (but not for the first command)
        if (command.page > currentPage) {
            for (let p = 0; p < (command.page - currentPage); p++) {
                pdf.addPage();
            }
            currentPage = command.page;
        }
        
        try {
            if (command.type === 'die') {
                // Handle die cross layout
                await addDieCrossLayoutToPdf(pdf, command);
            } else {
                // Handle regular component
                await addComponentToPdf(pdf, command);
            }
        } catch (error) {
            console.error(`Error adding component to PDF:`, error);
            // Add error indicator
            pdf.setFillColor(255, 200, 200);
            pdf.rect(command.x, command.y, command.width, command.height, 'F');
            pdf.setTextColor(200, 0, 0);
            pdf.setFont("helvetica");
            pdf.setFontSize(12);
            pdf.text(
                `Error: ${error.message.substring(0, 20)}...`, 
                command.x + (command.width / 2), 
                command.y + (command.height / 2),
                { align: 'center' }
            );
        }
    }
    
    // Draw margin lines on all pages
    const totalPages = currentPage + 1;
    for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
            pdf.setPage(page + 1); // setPage is 1-indexed
        }
        drawPageMarginLines(pdf, size);
    }
}

/**
 * Draw margin lines around the printable area of the page
 */
function drawPageMarginLines(pdf, size) {    
    // Set up dashed line style
    pdf.setDrawColor(150, 150, 150); // Light gray
    pdf.setLineWidth(0.01);
    pdf.setLineDashPattern([0.05, 0.05], 0); // Dashed line
    
    // Get the size from the current page
    const pageSize = size ? 'Letter' : 'Tabloid';
    const [width, height] = printoutPlayAreaChoices[pageSize];
    
    // Draw rectangle around the printable area
    pdf.rect(
        marginInches,
        marginInches, 
        width,
        height
    );
    
    // Reset line dash pattern
    pdf.setLineDashPattern([], 0);
}

/**
 * Add a regular component to the PDF
 */
async function addComponentToPdf(pdf, command) {
    // Check if file exists
    if (!existsSync(command.filepath)) {
        throw new Error(`File not found: ${command.filepath}`);
    }
    
    // Read the file
    const imageData = readFileSync(command.filepath);
    const base64Image = Buffer.from(imageData).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    
    // Calculate corrected positions for rotated images
    let xPos = command.x;
    let yPos = command.y;
    
    // When rotating 90 degrees, adjust coordinates to maintain top-left position
    if (command.isRotated) {
        xPos = command.x + command.height; // Move right by the height of the image
        yPos = command.y - command.width; // Move up by the width of the image
    }
    
    // Add image to PDF
    pdf.addImage(
        dataUrl, 
        'PNG', 
        xPos, 
        yPos, 
        command.width, 
        command.height, 
        '', 
        'FAST',
        command.isRotated ? 90 : 0
    );
    
    // Add cut guides if margins info is available
    if (command.marginsInfo) {
        addCutGuides(pdf, command);
    }
}

/**
 * Add cut guides around a component
 */
function addCutGuides(pdf, command) {
    const { marginsInfo } = command;
    if (!marginsInfo) return;
    
    // Ensure font is set to a cross-platform compatible font
    pdf.setFont("helvetica");
    
    const { pixels, dimensionsPixels } = marginsInfo;
    const marginRatioX = pixels[0] / dimensionsPixels[0];
    const marginRatioY = pixels[1] / dimensionsPixels[1];
    
    const lineLength = 0.1; // inches
    pdf.setDrawColor(0, 128, 0); // Green
    pdf.setLineWidth(0.01);
    
    // Calculate margin positions
    const marginLeft = command.x + (command.width * marginRatioX);
    const marginRight = command.x + command.width - (command.width * marginRatioX);
    const marginTop = command.y + (command.height * marginRatioY);
    const marginBottom = command.y + command.height - (command.height * marginRatioY);
    
    // Draw corner marks
    // Top left
    pdf.line(marginLeft, command.y, marginLeft, command.y + lineLength);
    pdf.line(command.x, marginTop, command.x + lineLength, marginTop);
    
    // Top right
    pdf.line(marginRight, command.y, marginRight, command.y + lineLength);
    pdf.line(command.x + command.width, marginTop, command.x + command.width - lineLength, marginTop);
    
    // Bottom left
    pdf.line(marginLeft, command.y + command.height, marginLeft, command.y + command.height - lineLength);
    pdf.line(command.x, marginBottom, command.x + lineLength, marginBottom);
    
    // Bottom right
    pdf.line(marginRight, command.y + command.height, marginRight, command.y + command.height - lineLength);
    pdf.line(command.x + command.width, marginBottom, command.x + command.width - lineLength, marginBottom);
}

/**
 * Add a die cross layout to the PDF
 */
async function addDieCrossLayoutToPdf(pdf, command) {
    const { filepaths, x, y, width, height } = command;
    
    // Calculate dimensions for each face
    const faceWidth = width / 3;
    const faceHeight = height / 4;
    const flangeSize = faceHeight * 0.15;
    
    // Define positions for the 6 faces in the cross layout
    const positions = [
        [1, 0],      // Top (1)
        [1, 1],      // Front (2)
        [0, 1],      // Left (3)
        [2, 1],      // Right (4)
        [1, 2],      // Back (5)
        [1, 3]       // Bottom (6)
    ];
    
    // Draw flanges first
    pdf.setFillColor(255, 192, 203); // Pink for flanges
    
    // Top flange for face 1
    pdf.rect(
        x + faceWidth, 
        y, 
        faceWidth, 
        flangeSize, 
        'F'
    );
    
    // Flanges for face 3 (left)
    pdf.rect(x, y + faceHeight - flangeSize, faceWidth, flangeSize, 'F'); // Top
    pdf.rect(x, y + faceHeight, flangeSize, faceHeight, 'F'); // Left
    pdf.rect(x, y + faceHeight * 2, faceWidth, flangeSize, 'F'); // Bottom
    
    // Flanges for face 4 (right)
    pdf.rect(x + faceWidth * 2, y + faceHeight - flangeSize, faceWidth, flangeSize, 'F'); // Top
    pdf.rect(x + faceWidth * 3 - flangeSize, y + faceHeight, flangeSize, faceHeight, 'F'); // Right
    pdf.rect(x + faceWidth * 2, y + faceHeight * 2, faceWidth, flangeSize, 'F'); // Bottom
    
    // Add each face
    for (let i = 0; i < Math.min(filepaths.length, positions.length); i++) {
        const filepath = filepaths[i];
        const [colIndex, rowIndex] = positions[i];
        
        // Check if file exists
        if (!existsSync(filepath)) {
            console.log(chalk.red(`Warning: Die face file not found: ${filepath}`));
            continue;
        }
        
        // Read the file
        const imageData = readFileSync(filepath);
        const base64Image = Buffer.from(imageData).toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;
        
        // Calculate position
        const faceX = x + (colIndex * faceWidth);
        const faceY = y + (rowIndex * faceHeight);
        
        // Add image to PDF
        pdf.addImage(
            dataUrl, 
            'PNG', 
            faceX, 
            faceY, 
            faceWidth, 
            faceHeight, 
            '', 
            'FAST'
        );
    }
}

/**
 * Get all component filepaths and quantities
 */
async function getDictionaryOfImageFilepathsAndQuantityGroupedByComponentType(producedDirectoryPath) {
    const componentTypeFilepathAndQuantity = {};
    const directoryPathsInOutputFolder = await readdir(producedDirectoryPath, { withFileTypes: true });
    
    for (const directoryPath of directoryPathsInOutputFolder) {
        if (directoryPath.isDirectory()) {
            const directoryComponentTypeFilepathAndQuantity = await loadFilepathsForComponent(producedDirectoryPath, directoryPath.name);
            mergeDictsRecursive(componentTypeFilepathAndQuantity, directoryComponentTypeFilepathAndQuantity);
        }
    }
    
    return componentTypeFilepathAndQuantity;
}

/**
 * Load filepaths for a component
 */
async function loadFilepathsForComponent(producedDirectoryPath, directoryPath) {
    const componentDirectoryPath = join(producedDirectoryPath, directoryPath);
    const componentInstructionsFilepath = join(componentDirectoryPath, "component.json");
    
    try {
        const componentInstructionsFile = await readFile(componentInstructionsFilepath, 'utf8');
        const componentInstructions = JSON.parse(componentInstructionsFile);
        const componentTypeFilepathAndQuantity = await collectFilepathQuantitiesForComponent(componentInstructions);
        return componentTypeFilepathAndQuantity;
    } catch (error) {
        console.error(`Error loading component from ${componentDirectoryPath}:`, error.message);
        return {};
    }
}

/**
 * Collect filepath quantities for a component
 */
async function collectFilepathQuantitiesForComponent(componentInstructions) {    
    const componentTypeFilepathAndQuantity = {};
    if (!(componentInstructions.type in componentTypeFilepathAndQuantity)) {
        componentTypeFilepathAndQuantity[componentInstructions.type] = [];
    }
    
    if (componentInstructions.type.startsWith("STOCK_")) {
        return componentTypeFilepathAndQuantity;
    }

    // Special handling for dice
    const isDie = diceTypes.includes(componentInstructions.type) || unsupportedDiceTypes.includes(componentInstructions.type);
    if (isDie) {
        // Skip unsupported dice types
        if (unsupportedDiceTypes.includes(componentInstructions.type)) {
            console.log(chalk.yellow(`!!! Skipping ${componentInstructions.name} because ${componentInstructions.type} is not supported for printing due to its complexity.`));
            return componentTypeFilepathAndQuantity;
        }
            
        if (!componentInstructions.dieFaceFilepaths) {
            console.log(chalk.red(`!!! Skipping ${componentInstructions.name} because it lacks 'dieFaceFilepaths'.`));
            return componentTypeFilepathAndQuantity;
        }
        
        const dieLayout = {
            filepath: componentInstructions.dieFaceFilepaths,  // Pass all filepaths
            quantity: componentInstructions.quantity,
            isDie: isDie
        };
        componentTypeFilepathAndQuantity[componentInstructions.type].push(dieLayout);
        return componentTypeFilepathAndQuantity;
    }

    if (!componentInstructions.frontInstructions) {
        console.log(chalk.yellow(`!!! Skipping ${componentInstructions.name} because it lacks 'frontInstructions'.`));
        return componentTypeFilepathAndQuantity;
    }
    
    for (const instruction of componentInstructions.frontInstructions) {
        const frontBack = {
            filepath: instruction.filepath,
            quantity: instruction.quantity * componentInstructions.quantity,
            isDie: isDie
        };
        if (componentInstructions.backInstructions) {
            frontBack.backFilepath = componentInstructions.backInstructions.filepath;
        }
        
        componentTypeFilepathAndQuantity[componentInstructions.type].push(frontBack);
    }

    return componentTypeFilepathAndQuantity;
}

/**
 * Helper function to merge dictionaries recursively
 */
function mergeDictsRecursive(dict1, dict2) {
    for (const [key, value] of Object.entries(dict2)) {
        if (key in dict1) {
            if (typeof dict1[key] === 'object' && typeof value === 'object') {
                mergeDictsRecursive(dict1[key], value);
            } else if (Array.isArray(dict1[key]) && Array.isArray(value)) {
                dict1[key].push(...value);
            } else {
                dict1[key] = value;
            }
        } else {
            dict1[key] = value;
        }
    }
    return dict1;
}

module.exports = { createPdfForPrinting }; 