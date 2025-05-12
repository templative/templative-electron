const { join } = require('path');
const fs = require('fs').promises;
const { copyFile } = require('fs').promises;
const { aiArtGenerator } = require('../ai/aiArtGenerator');
const { COMPONENT_INFO } = require('../../../../shared/componentInfo');
const { getComponentTemplatesDirectoryPath } = require('../componentTemplateUtility');
const path = require('path');

async function addToComponentCompose(name, type, gameRootDirectoryPath, componentComposeData, componentInfo) {
    for (let i = 0; i < componentComposeData.length; i++) {
        if (componentComposeData[i]["name"] === name) {
            componentComposeData.splice(i, 1);
            break;
        }
    }

    const componentComposition = {
        "name": name,
        "type": type,
        "quantity": 1,
        "componentGamedataFilename": name,
        "disabled": false
    };

    if (componentInfo["HasPieceData"]) {
        componentComposition["piecesGamedataFilename"] = name;
    }

    for (const artDataTypeName of componentInfo["ArtDataTypeNames"]) {
        componentComposition[`artdata${artDataTypeName}Filename`] = `${name}${artDataTypeName}`;
    }

    componentComposeData.push(componentComposition);
    await fs.writeFile(join(gameRootDirectoryPath, 'component-compose.json'), JSON.stringify(componentComposeData, null, 4));
}

async function addStockComponentToComponentCompose(name, stockPartId, gameRootDirectoryPath, componentComposeData) {
    for (let i = 0; i < componentComposeData.length; i++) {
        if (componentComposeData[i]["name"] === name) {
            componentComposeData.splice(i, 1);
            break;
        }
    }

    componentComposeData.push({
        "name": name,
        "type": `STOCK_${stockPartId}`,
        "quantity": 1,
        "disabled": false
    });
    await fs.writeFile(join(gameRootDirectoryPath, 'component-compose.json'), JSON.stringify(componentComposeData, null, 4));
}

async function createPiecesJson(piecesDirectoryPath, name, hasPieceQuantity, type, componentAIDescription = null, artdataFiles = null) {
    let pieces = [{
        "name": name,
    }];

    if (type.startsWith("CustomColor") || type === "CustomWoodD6") {
        const die_faces = {
            "CustomColorD4": 4,
            "CustomColorD6": 6,
            "CustomWoodD6": 6,
            "CustomColorD8": 8
        };
        if (die_faces[type]) {
            pieces = Array.from({ length: die_faces[type] }, (_, i) => ({ "name": (i + 1).toString() }));
        }
    } else if (hasPieceQuantity) {
        for (const piece of pieces) {
            piece["quantity"] = 1;
        }
    }

    const filepath = join(piecesDirectoryPath, `${name}.json`);
    await fs.writeFile(filepath, JSON.stringify(pieces, null, 4));
    // console.log(`Created pieces ${filepath}`);
    return {
        "type": "pieces",
        "filepath": filepath,
        "contents": JSON.stringify(pieces)
    };
}

async function createComponentJson(componentDirectoryPath, name) {
    const componentJsonData = {
        "name": name,
    };

    const componentJsonFilepath = join(componentDirectoryPath, `${name}.json`);

    await fs.writeFile(componentJsonFilepath, JSON.stringify(componentJsonData, null, 4));
    
    // console.log(`Created component json ${componentJsonFilepath}`);

    return {
        "type": "component",
        "filepath": componentJsonFilepath,
        "contents": JSON.stringify(componentJsonData)
    };
}

async function createArtDataFiles(artDataDirectoryPath, name, artDataTypeNames) {
    const artdataFiles = [];
    for (const artDataTypeName of artDataTypeNames) {
        const artDataNameAndSide = `${name}${artDataTypeName}`;
        const artdata = {
            "name": name,
            "templateFilename": artDataNameAndSide,
            "textReplacements": [],
            "styleUpdates": [],
            "overlays": []
        };
        const filepath = join(artDataDirectoryPath, `${artDataNameAndSide}.json`);
        await fs.writeFile(filepath, JSON.stringify(artdata, null, 4));
        
        // console.log(`Created artdata ${artDataNameAndSide}`);

        artdataFiles.push({
            "type": `artdata_${artDataTypeName}`,
            "filepath": filepath,
            "contents": JSON.stringify(artdata)
        });
    }
    return artdataFiles;
}

function resource_path(relative_path) {
    try {
        const base_path = process.resourcesPath;
        return join(base_path, relative_path);
    } catch (err) {
        return join(process.cwd(), 'src', relative_path);
    }
}

async function createTemplateArtfile(artTemplatesDirectoryPath, name, type, artDataTypeName) {
    const componentTemplatesDirectoryPath = await getComponentTemplatesDirectoryPath();
    
    const potentialPaths = [
        path.join(componentTemplatesDirectoryPath, `${type}${artDataTypeName}.svg`),
        path.join(componentTemplatesDirectoryPath, `${type}.svg`)
    ];
    
    var contents = null;
    var chosenPath = null;
    for (const potentialPath of potentialPaths) {
        try {
            contents = await fs.readFile(potentialPath, 'utf8');
            chosenPath = potentialPath;
            break;
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
    }
    if (chosenPath === null) {
        const err = new Error(`Template file not found for ${type}`);
        err.code = 'ENOENT';
        throw err;
    }
    
    const artSideNameFilepath = join(artTemplatesDirectoryPath, `${name}${artDataTypeName}.svg`);
    
    await copyFile(chosenPath, artSideNameFilepath);
    return {
        "type": `art_${artDataTypeName}`,
        "filepath": artSideNameFilepath,
        "contents": contents
    };
}

async function createBlankArtFiles(artTemplatesDirectoryPath, name, type, artDataTypeNames) {
    
    var width = 750;
    var height = 1050;
    const componentInfo = COMPONENT_INFO[type];
    if (componentInfo && componentInfo["DimensionsPixels"]) {
        width = componentInfo["DimensionsPixels"][0];
        height = componentInfo["DimensionsPixels"][1];
    }
    else {
        console.warn(`No dimensions found for ${type}. Using default dimensions.`);
    }
    const blankSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg version="1.1" id="YOUR_ARTWORK_HERE" x="0px" y="0px" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" enable-background="new 0 0 ${width} ${height}" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> </svg>`;

    artFiles = [];
    for (const artDataTypeName of artDataTypeNames) {
        const artSideName = `${name}${artDataTypeName}`;
        const artSideNameFilepath = join(artTemplatesDirectoryPath, `${artSideName}.svg`);

        console.warn(`Creating blank template at ${artSideNameFilepath}`);
        await fs.writeFile(artSideNameFilepath, blankSvg);
        artFiles.push({
            "type": `art_${artDataTypeName}`,
            "filepath": artSideNameFilepath,
            "contents": blankSvg
        });
    }
    return artFiles;
}

async function createArtFiles(artTemplatesDirectoryPath, name, type, artDataTypeNames, componentAIDescription = null, artdataFiles = null) {
    try {
        const artFiles = [];
        for (const artDataTypeName of artDataTypeNames) {
            await createTemplateArtfile(artTemplatesDirectoryPath, name, type, artDataTypeName);
        }
        return artFiles;
    }
    catch (err) {
        if (err.code !== 'ENOENT') {
            throw err; // Re-throw if error is not ENOENT
        }
        console.warn(`Template file not found for ${type}. Creating a blank SVG.`);
    
        return createBlankArtFiles(artTemplatesDirectoryPath, name, type, artDataTypeNames);
    }
    
}

async function createOverlayFiles(artOverlaysDirectoryPath, type, componentData, piecesData) {
    const pixelDimensions = COMPONENT_INFO[type]["DimensionsPixels"];
    const width = pixelDimensions[0];
    const height = pixelDimensions[1];

    const blankSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Generator: Adobe Illustrator 15.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg
   version="1.1"
   id="YOUR_ARTWORK_HERE"
   x="0px"
   y="0px"
   width="${width}"
   height="${height}"
   viewBox="0 0 ${width} ${height}"
   enable-background="new 0 0 198 270"
   xml:space="preserve"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">

</svg>`;

    const allData = [componentData, ...piecesData];
    for (const thing of allData) {
        for (const field in thing) {
            if (field.endsWith('Image')) {
                const overlayFilepath = join(artOverlaysDirectoryPath, `${thing[field]}.svg`);
                console.log(`Creating overlay at ${overlayFilepath}`);
                await fs.writeFile(overlayFilepath, blankSvg);
            }
        }
    }
}

module.exports = {
    addToComponentCompose,
    addStockComponentToComponentCompose,
    createPiecesJson,
    createComponentJson,
    createArtDataFiles,
    resource_path,
    createArtFiles,
    createOverlayFiles
};