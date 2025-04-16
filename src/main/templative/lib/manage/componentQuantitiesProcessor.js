const { defineLoader } = require('./../manage.js');

async function listComponentQuantities(gameRootDirectoryPath) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path is invalid.");
    }
    const gameCompose = await defineLoader.loadGameCompose(gameRootDirectoryPath);
    if (!gameCompose) {
        console.log("!!! game-compose.json not found.");
        return;
    }
    const componentCompose = await defineLoader.loadComponentCompose(gameRootDirectoryPath);
    if (!componentCompose) {
        console.log("!!! component-compose.json not found.");
        return;
    }
    
    await printGameComponentQuantities(gameRootDirectoryPath, gameCompose, componentCompose);
}

async function printGameComponentQuantities(gameRootDirectoryPath, gameCompose, componentCompose) {
    if (!gameRootDirectoryPath) {
        throw new Error("Game root directory path is invalid.");
    }

    const componentQuantities = {"Document": [{ "name":"Rules", "componentQuantity": 1, "pieceQuantity": 1}]};
    for (const component of componentCompose) {
        if (String(component["disabled"]) === true) {
            console.log(`Skipping disabled ${component["name"]} component.`);
            continue;
        }
        
        if (component["type"].startsWith("STOCK")) {
            await addStockComponentQuantities(componentQuantities, component);
            continue;
        }
        
        const piecesGamedata = await defineLoader.loadPiecesGamedata(gameRootDirectoryPath, gameCompose, component["piecesGamedataFilename"]);
        if (!piecesGamedata || Object.keys(piecesGamedata).length === 0) {
            console.log(`Skipping ${component["name"]} component due to missing pieces gamedata.`);
            continue;
        }
        await addComponentQuantities(componentQuantities, component, piecesGamedata);
    }
        
    let message = "";
    for (const componentType in componentQuantities) {
        let componentExplanations = "";
        let componentQuantity = 0;
        for (const explanation of componentQuantities[componentType]) {
            const quantity = explanation["componentQuantity"] * explanation["pieceQuantity"];
            componentQuantity += quantity;
            componentExplanations = `${componentExplanations}\n    ${quantity}x ${explanation["name"]}`;
        }
        message = `${message}\n${componentQuantity}x ${componentType} Pieces: ${componentExplanations}`;
    }
        
    console.log(message);
}

async function addStockComponentQuantities(componentQuantities, component) {
    if (!(component["type"] in componentQuantities)) {
        componentQuantities[component["type"]] = [];
    }

    componentQuantities[component["type"]].push({
        "name": component["name"], "componentQuantity": component["quantity"], "pieceQuantity": 1
    });
}

async function addComponentQuantities(componentQuantities, component, piecesGamedata) {
    if (!(component["type"] in componentQuantities)) {
        componentQuantities[component["type"]] = [];
    }

    let quantity = 0;
    for (const piece of piecesGamedata) {
        if (!("quantity" in piece)) {
            continue;
        }
        quantity += piece["quantity"];
    }
    
    componentQuantities[component["type"]].push({
        "name":component["name"], "componentQuantity": component["quantity"], "pieceQuantity": quantity
    });
}