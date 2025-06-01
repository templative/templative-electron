const { readdir, readFile, mkdir, writeFile } = require('fs/promises');
const { join, basename, dirname } = require('path');
const { jsPDF } = require('jspdf');
const { COMPONENT_INFO } = require('../../../../../shared/componentInfo.js');
const path = require('path');
const { captureException } = require("../../sentryElectronWrapper.js");
const { Jimp } = require('jimp');
const { glob } = require('glob');

// Constants
const diceTypes = ["CustomColorD6", "CustomWoodD6"];
const unsupportedDiceTypes = ["CustomColorD4", "CustomColorD8"];
const PAGE_PADDING_INCHES = 0.25;
const DOUBLE_PAGE_PADDING = PAGE_PADDING_INCHES * 2
const PAGE_SIZES = {
    "LETTER": "LETTER",
    "A3": "A3",
    "A4": "A4",
    "A5": "A5",
    "LEGAL": "LEGAL",
    "TABLOID": "TABLOID"
};
// Adjust the printout play area to account for margins
const PRINTOUT_PLAYAREA_CHOICES = {
    "LETTER": [8.5 - DOUBLE_PAGE_PADDING, 11 - DOUBLE_PAGE_PADDING],
    "A3": [11 - DOUBLE_PAGE_PADDING, 17 - DOUBLE_PAGE_PADDING],
    "A4": [8.27 - DOUBLE_PAGE_PADDING, 11.69 - DOUBLE_PAGE_PADDING],
    "A5": [5.83 - DOUBLE_PAGE_PADDING, 8.27 - DOUBLE_PAGE_PADDING],
    "LEGAL": [8.5 - DOUBLE_PAGE_PADDING, 14 - DOUBLE_PAGE_PADDING],
    "TABLOID": [11 - DOUBLE_PAGE_PADDING, 17 - DOUBLE_PAGE_PADDING]
};
const PRINTOUT_TOTAL_SIZE = {
    "LETTER": [8.5, 11],
    "A3": [11, 17],
    "A4": [8.27, 11.69],
    "A5": [5.83, 8.27],
    "LEGAL": [8.5, 14],
    "TABLOID": [11, 17]
}

/**
 * Main function to create a PDF for printing
 */
async function createPdfForPrinting(producedDirectoryPath, isBackIncluded, size, areBordersDrawn=false) {
    size = size.toUpperCase();
    if (!PAGE_SIZES[size] || !PRINTOUT_PLAYAREA_CHOICES[size]) {
        console.log(`!!! Cannot create size ${size}.`);
        return;
    }
    console.log(`Creating printout for ${basename(producedDirectoryPath)} ${isBackIncluded ? "with backs" : "without backs"} on ${size} paper.`)
    
    const componentTypeFilepathsAndQuantity = await getDictionaryOfImageFilepathsAndQuantityGroupedByComponentType(producedDirectoryPath);

    const placementCommands = [];
    const pageWidthInches = PRINTOUT_PLAYAREA_CHOICES[size][0];
    const pageHeightInches = PRINTOUT_PLAYAREA_CHOICES[size][1];
    
    let nextAvailablePage = 0;
    
    for (const componentType of Object.keys(componentTypeFilepathsAndQuantity)) {
        if (componentType.startsWith("STOCK_")) {
            console.log(`Skipping STOCK component: ${componentType}`);
            continue;
        }
        
        if (!(componentType in COMPONENT_INFO)) {
            console.log(`!!! Missing ${componentType} type info, skipping.`);
            continue;
        }
        
        const componentInfo = COMPONENT_INFO[componentType];
        if (!componentInfo.DimensionsInches) {
            console.log(`!!! Skipping ${componentType} because its inch size isn't defined.`);
            continue;
        }
        if (componentInfo.IsDisabled) {
            console.log(`!!! Skipping ${componentType} because it's disabled.`);
            continue;
        }
        if (componentInfo.IsPrintingDisabled) {
            console.log(`!!! Skipping ${componentType} because it's a component that shouldn't be printed.`);
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
    let pdf = await createPdfUsingPlacementCommands(placementCommands, size, areBordersDrawn);
    
    // Save the PDF
    const outputPath = join(producedDirectoryPath, "printout.pdf");
    console.log(`Writing printout to ${outputPath}`);
    const pdfOutput = pdf.output('arraybuffer');
    await writeFile(outputPath, Buffer.from(pdfOutput));

    // Clean up temporary rotation files
    const tempFiles = await glob('**/*_temp.png', { cwd: producedDirectoryPath });
    for (const file of tempFiles) {
        const fullPath = join(producedDirectoryPath, file);
        await unlink(fullPath);
    }
    
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
async function createPdfUsingPlacementCommands(commands, size, areBordersDrawn) {
    if (commands.length === 0) {
        console.log("No pieces to print.");
        return new jsPDF("p", "in", PAGE_SIZES[size]);
    }
    var pdf = new jsPDF("p", "in", PAGE_SIZES[size]);
    
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
                await addComponentToPdf(pdf, size, command, areBordersDrawn);
            }
        } catch (error) {
            captureException(error);
            console.error(`Error adding component to PDF:`, error);
            // Add error indicator on the current page
            pdf.setFillColor(255, 200, 200);
            const x = PAGE_PADDING_INCHES + (command.placementIndex[0] * command.componentSizeInches[0]);
            const y = PAGE_PADDING_INCHES + (command.placementIndex[1] * command.componentSizeInches[1]);
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
    const [width, height] = PRINTOUT_PLAYAREA_CHOICES[size];
    
    // Draw rectangle around the printable area
    pdf.rect(
        PAGE_PADDING_INCHES,
        PAGE_PADDING_INCHES, 
        width,
        height
    );
    
    // Reset line dash pattern
    pdf.setLineDashPattern([], 0);
}

async function fileExists(filepath) {
    try {
        await access(filepath);
        return true;
    } catch {
        return false;
    }
}
async function rotateImage(filepath, rotationDegrees) {
    if (rotationDegrees === 0) {
        return;
    }
    const directory = dirname(filepath);
    const filename = basename(filepath, '.png');
    var outputPath = join(directory, `${filename}_${rotationDegrees}_temp.png`)
    if (await fileExists(outputPath)) {
        return;
    }
    const image = await Jimp.read(filepath);
    image.rotate(rotationDegrees);
    
    await image.write(outputPath);
}
async function getImageBufferWithRotation(filepath, rotationDegrees) {
    var outputPath = filepath;
    if (rotationDegrees !== 0) {
        const directory = dirname(filepath);
        const filename = basename(filepath, '.png');
        outputPath = join(directory, `${filename}_${rotationDegrees}_temp.png`)
    }
    const imageData = await readFile(outputPath);
    const base64Image = Buffer.from(imageData).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    return dataUrl;
}
/**
 * Add a regular component to the PDF
 */
async function addComponentToPdf(pdf, size, command, areBordersDrawn) {
    try {
        const pageSizeInches = PRINTOUT_TOTAL_SIZE[size]
        var imageRotationDegrees = (command.isRotated ? 90 : 0) * (command.isFront ? 1 : -1)
        await rotateImage(command.filepath, imageRotationDegrees);
        const dataUrl = await getImageBufferWithRotation(command.filepath, imageRotationDegrees);
        
        const isRotated = command.isRotated;
        const originalWidth = command.componentSizeInches[0];
        const originalHeight = command.componentSizeInches[1];
        
        // Calculate the grid cell dimensions (space allocated for each component)
        const cellWidth = isRotated ? originalHeight : originalWidth;
        const cellHeight = isRotated ? originalWidth : originalHeight;
        
        // Calculate base position (top-left of the grid cell)
        let xPos = PAGE_PADDING_INCHES + (command.placementIndex[0] * cellWidth);
        let yPos = PAGE_PADDING_INCHES + (command.placementIndex[1] * cellHeight);
        
        // Handle mirroring for back pages
        if (!command.isFront) {
            xPos = pageSizeInches[0] - PAGE_PADDING_INCHES - ((command.columns - 1 - command.placementIndex[0]) * cellWidth) - cellWidth;
        }
        
        pdf.addImage(
            dataUrl, 'PNG', 
            xPos, yPos, 
            cellWidth, cellHeight, 
            '', 'FAST',
            0
        );
        if (areBordersDrawn) {
            await drawBorder(pdf, size, !command.isFront, command.placementIndex, cellWidth, cellHeight, command.columns);
        }
    } catch (error) {
        captureException(error);
        throw new Error(`Issue placing ${path.basename(command.filepath)}, error: ${error.message}`);
    }
}

async function drawBorder(pdf, size, isBack, placementCoordinations, width, height, columns) {
    pdf.setDrawColor(255, 0, 0);
    pdf.setLineWidth(0.01);
    var xPos = PAGE_PADDING_INCHES + (placementCoordinations[0] * width)
    var yPos = PAGE_PADDING_INCHES + (placementCoordinations[1] * height)
    if (isBack) {
        xPos = PRINTOUT_TOTAL_SIZE[size][0] - PAGE_PADDING_INCHES - ((columns - 1 - placementCoordinations[0]) * width) - width;
    }
    pdf.rect(xPos, yPos, width, height);
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
            captureException(error);
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
        captureException(error);
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