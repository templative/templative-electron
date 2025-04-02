const { readdir, readFile, mkdir, writeFile } = require('fs/promises');
const { join, basename, dirname } = require('path');
const { jsPDF } = require('jspdf');
const { COMPONENT_INFO } = require('../../../../../shared/componentInfo.js');

// Constants
const diceTypes = ["CustomColorD6", "CustomWoodD6"];
const unsupportedDiceTypes = ["CustomColorD4", "CustomColorD8"];
const pagePaddingInches = 0.25;
const fpdfSizes = {
    "Letter": "letter",
    "Tabloid": "a3",
};
// Adjust the printout play area to account for margins
const printoutPlayAreaChoices = {
    "Letter": [8.5 - (pagePaddingInches * 2), 11 - (pagePaddingInches * 2)],
    "Tabloid": [11 - (pagePaddingInches * 2), 17 - (pagePaddingInches * 2)]
};
const printoutTotalSize = {
    "Letter": [8.5, 11],
    "Tabloid": [11, 17]
}

/**
 * Main function to create a PDF for printing
 */
async function createPdfForPrinting(producedDirectoryPath, isBackIncluded, size) {
    if (!fpdfSizes[size] || !printoutPlayAreaChoices[size]) {
        console.log(`!!! Cannot create size ${size}.`);
        return;
    }
    isBackIncluded = false;
    console.log(`Creating printout for ${basename(producedDirectoryPath)} ${isBackIncluded ? "with backs" : "without backs"} on ${size} paper.`)
    
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
            console.log(`!!! Missing ${componentType} type description, skipping.`);
            continue;
        }
        
        const componentInfo = COMPONENT_INFO[componentType];
        if (!componentInfo.DimensionsInches) {
            console.log(`!!! Skipping ${componentType} because its inch size isn't defined.`);
            continue;
        }
        
        const componentCommands = await generatePlacementCommandsForComponentType(
            componentType,
            componentTypeFilepathsAndQuantity[componentType],
            componentInfo,
            isBackIncluded,
            pageWidthInches,
            pageHeightInches,
            nextAvailablePage
        );
        
        placementCommands.push(...componentCommands);
        
        // Update the next available page
        if (componentCommands.length > 0) {
            const maxPage = Math.max(...componentCommands.map(cmd => cmd.pageIndex));
            nextAvailablePage = maxPage + 1;
        }
    }
    placementCommands.sort((a, b) => a.pageIndex - b.pageIndex);
    
    // Create PDF and apply all placement commands
    let pdf = await createPdfUsingPlacementCommands(placementCommands, size);
    
    // Save the PDF
    const outputPath = join(producedDirectoryPath, "printout.pdf");
    console.log(`Writing printout to ${outputPath}`);
    const pdfOutput = pdf.output('arraybuffer');
    await writeFile(outputPath, Buffer.from(pdfOutput));
    
    return 1;
}

async function getPageInformationForComponentType(componentType, pageWidthInches, pageHeightInches) {
    const componentInfo = COMPONENT_INFO[componentType];
    const isDie = diceTypes.includes(componentType);
    let componentSizeInches = [...componentInfo.DimensionsInches];    
    if (isDie) {
        const flangeSize = componentSizeInches[1] * 0.15;
        componentSizeInches = [
            (componentSizeInches[0] * 3) + (flangeSize * 2),
            (componentSizeInches[1] * 4 + flangeSize * 2)
        ];
    }
    
    let columns = Math.floor(pageWidthInches / componentSizeInches[0]);
    let rows = Math.floor(pageHeightInches / componentSizeInches[1]);
    
    let isRotated = false;
    const rotatedColumns = rows;
    const rotatedRows = columns;
    
    if (rotatedColumns * rotatedRows > columns * rows) {        
        isRotated = true;
        columns = rotatedColumns; 
        rows = rotatedRows;
    }
    
    return {
        columns,
        rows,
        isRotated,
        componentSizeInches
    }
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
    startingPageIndex
) {
    const commands = [];
    const pageInfo = await getPageInformationForComponentType(componentType, pageWidthInches, pageHeightInches);
    const { columns, rows, isRotated, componentSizeInches } = pageInfo;

    const isDie = diceTypes.includes(componentType);
    if (rows === 0 || columns === 0) {
        console.log(`Skipping ${componentType} as it's too large for the print space.`);
        return commands;
    }
    // const exampleComponentList = [
    //     {
    //       filepath: '/Users/oliverbarnum/Documents/git/templative-electron/scripts/test-project/output/GameName_Template_0.0.0_2025-03-28_09-29-25/PokerDeck/PokerDeck-PokerDeck.png',
    //       quantity: 12,
    //       isDie: false,
    //       backFilepath: '/Users/oliverbarnum/Documents/git/templative-electron/scripts/test-project/output/GameName_Template_0.0.0_2025-03-28_09-29-25/PokerDeck/PokerDeck-back.png'
    //     }
    //   ]

    const itemsPerPage = columns * rows;
    let totalItemIndex = 0;
    
    for (const component of componentList) {
        for (let i = 0; i < component.quantity; i++) {
            const pageIndex = Math.floor(totalItemIndex / itemsPerPage);
            const itemIndexOnPage = totalItemIndex % itemsPerPage;
            const col = itemIndexOnPage % columns;
            const row = Math.floor(itemIndexOnPage / columns);
            
            // Calculate front page index
            // When backs are included, use even pages for fronts (0, 2, 4...)
            // When backs are not included, use sequential pages (0, 1, 2...)
            const frontPageIndex = isBackIncluded ? 
                startingPageIndex + (pageIndex * 2) : 
                startingPageIndex + pageIndex;

            commands.push({
                pageIndex: frontPageIndex,
                placementIndex: [col, row],
                filepath: component.filepath,
                isRotated: isRotated,
                columns: columns,
                rows: rows,
                isFront: true,
                componentSizeInches: componentSizeInches,
                type: component.isDie ? "die" : "regular",
            });
            
            // Add command for back if needed
            if (isBackIncluded && component.backFilepath) {
                // For backs, we need to mirror the position horizontally
                // to account for double-sided printing
                const reversedCol = columns - 1 - col;
                
                // Back page is always odd number (1, 3, 5...) in zero-based indexing
                const backPageIndex = frontPageIndex + 1;
                
                commands.push({
                    pageIndex: backPageIndex,
                    placementIndex: [reversedCol, row],
                    columns: columns,
                    rows: rows,
                    filepath: component.backFilepath,
                    isRotated: isRotated,
                    isFront: false,
                    componentSizeInches: componentSizeInches,
                    type: "regular" // Note: Dice don't have backs
                });
            }
            
            totalItemIndex++;
        }
    }
    
    // Sort commands by pageIndex, then by row (placementIndex[1]), then by column (placementIndex[0])
    commands.sort((a, b) => {
        // First sort by page
        if (a.pageIndex !== b.pageIndex) {
            return a.pageIndex - b.pageIndex;
        }
        // Then sort by row
        if (a.placementIndex[1] !== b.placementIndex[1]) {
            return a.placementIndex[1] - b.placementIndex[1];
        }
        // Finally sort by column
        return a.placementIndex[0] - b.placementIndex[0];
    });
    
    return commands;
}

/**
 * Apply all placement commands to the PDF
 */
async function createPdfUsingPlacementCommands(commands, size) {
    if (commands.length === 0) {
        console.log("No pieces to print.");
        return new jsPDF("p", "in", fpdfSizes[size]);
    }
    var pdf = new jsPDF("p", "in", fpdfSizes[size]);
    
    // Set a cross-platform compatible font
    pdf.setFont("helvetica");
    
    // Draw margin lines on the first page
    drawPageMarginLines(pdf, size);
    
    // Track the highest page index we've seen
    let highestPageIndex = 0;
    
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        
        // If this is a new page higher than any we've seen before
        if (command.pageIndex > highestPageIndex) {
            // Add exactly the right number of pages
            for (let p = highestPageIndex + 1; p <= command.pageIndex; p++) {
                pdf.addPage();
                drawPageMarginLines(pdf, size);
            }
            highestPageIndex = command.pageIndex;
        }
        
        // Set the current page (jsPDF pages are 1-indexed)
        pdf.setPage(command.pageIndex + 1);
        
        try {
            if (command.type === 'die') {
                // Handle die cross layout
                // await addDieCrossLayoutToPdf(pdf, size, command);
            } else {
                // Handle regular component
                await addComponentToPdf(pdf, size, command);
            }
        } catch (error) {
            console.error(`Error adding component to PDF:`, error);
            // Add error indicator on the current page
            pdf.setFillColor(255, 200, 200);
            const x = pagePaddingInches + (command.placementIndex[0] * command.componentSizeInches[0]);
            const y = pagePaddingInches + (command.placementIndex[1] * command.componentSizeInches[1]);
            pdf.rect(x, y, command.componentSizeInches[0], command.componentSizeInches[1], 'F');
            pdf.setTextColor(200, 0, 0);
            pdf.setFontSize(12);
            pdf.text(
                `Error: ${error.message.substring(0, 20)}...`, 
                x + (command.componentSizeInches[0] / 2), 
                y + (command.componentSizeInches[1] / 2),
                { align: 'center' }
            );
        }
    }
    
    return pdf;
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
        pagePaddingInches,
        pagePaddingInches, 
        width,
        height
    );
    
    // Reset line dash pattern
    pdf.setLineDashPattern([], 0);
}

/**
 * Add a regular component to the PDF
 */
async function addComponentToPdf(pdf, size, command) {

    try {
        const pageSizeInches = printoutTotalSize[size]
        const imageData = await readFile(command.filepath);
        const base64Image = Buffer.from(imageData).toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;
        var isRotated = command.isRotated
        const rotatedWidth = command.componentSizeInches[isRotated ? 1 : 0]
        const rotatedHeight = command.componentSizeInches[isRotated ? 0 : 1]
        var xPos = (pageSizeInches[0]/2) - (command.columns * rotatedWidth / 2) + (command.placementIndex[0] * rotatedWidth)
        var yPos = (pageSizeInches[1]/2) - (command.rows * rotatedHeight / 2) + (command.placementIndex[1] * rotatedHeight)
        if (isRotated) {
            xPos += rotatedWidth 
            yPos -= rotatedHeight/2
        }
        pdf.addImage(
            dataUrl, 'PNG', 
            xPos, yPos, 
            command.componentSizeInches[0], command.componentSizeInches[1], 
            '', 'FAST',
            isRotated ? 90 : 0
        );
    } catch (error) {
        throw new Error(`Issue placing: ${command.filepath}`);
    }
}

/**
 * Add a die cross layout to the PDF
 */
async function addDieCrossLayoutToPdf(pdf, size, command) {
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
        
        try {
            // Read the file asynchronously
            const imageData = await readFile(filepath);
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
        } catch (error) {
            console.log(`!!! Issue placing die: ${filepath}`);
            continue;
        }
    }
}

/**
 * Get all component filepaths and quantities
 */
async function getDictionaryOfImageFilepathsAndQuantityGroupedByComponentType(producedDirectoryPath) {
    const componentTypeFilepathAndQuantity = {};
    const directoryPathsInOutputFolder = (await readdir(producedDirectoryPath, { withFileTypes: true })).filter(dir => dir.isDirectory());
    for (const directoryPath of directoryPathsInOutputFolder) {
        const directoryComponentTypeFilepathAndQuantity = await loadFilepathsForComponent(producedDirectoryPath, directoryPath.name);
        mergeDictsRecursive(componentTypeFilepathAndQuantity, directoryComponentTypeFilepathAndQuantity);
        
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

    const componentInfo = COMPONENT_INFO[componentInstructions.type]
    if (componentInfo.IsDisabled) {
        return componentTypeFilepathAndQuantity
    }

    // Special handling for dice
    const isDie = diceTypes.includes(componentInstructions.type) || unsupportedDiceTypes.includes(componentInstructions.type);
    if (isDie) {
        // Skip unsupported dice types
        if (unsupportedDiceTypes.includes(componentInstructions.type)) {
            console.log(`!!! Skipping ${componentInstructions.name} because ${componentInstructions.type} is not supported for printing due to its complexity.`);
            return componentTypeFilepathAndQuantity;
        }
            
        if (!componentInstructions.dieFaceFilepaths) {
            console.log(`!!! Skipping ${componentInstructions.name} because it lacks 'dieFaceFilepaths'.`);
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
        console.log(`!!! Skipping ${componentInstructions.name} because it lacks 'frontInstructions'.`);
        return componentTypeFilepathAndQuantity;
    }
    
    for (const instruction of componentInstructions.frontInstructions) {
        const quantity = instruction.quantity * componentInstructions.quantity;
        const frontBack = {
            filepath: instruction.filepath,
            quantity: quantity,
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
            if (Array.isArray(dict1[key]) && Array.isArray(value)) {
                // For arrays (like component lists), concatenate them
                dict1[key] = dict1[key].concat(value);
            } else if (typeof dict1[key] === 'object' && !Array.isArray(dict1[key]) && 
                       typeof value === 'object' && !Array.isArray(value)) {
                // For nested objects (not arrays), recursively merge
                mergeDictsRecursive(dict1[key], value);
            } else {
                // For other types, replace
                dict1[key] = value;
            }
        } else {
            // Key doesn't exist yet, just assign it
            dict1[key] = value;
        }
    }
    return dict1;
}

module.exports = { createPdfForPrinting }; 