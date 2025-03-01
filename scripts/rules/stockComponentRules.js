const { allColorVariations } = require("../../src/shared/stockComponentColors");

const diceNumerals = ["2", "4", "6", "8", "10", "12", "20"]

const meepleCommands = [
    {
        description: "Components with Meeple in their name should be tagged 'meeple'",
        condition: (component) => component.Tags && 
            ((component.DisplayName && component.DisplayName.includes("Meeple")) || 
             (component.DisplayName && component.DisplayName.includes("Meeple"))) && 
            !component.Tags.includes("meeple"),
        setValue: (component) => {
            component.Tags.push("meeple");
            return ["Tags"];
        }
    },
    {
        description: "Component tagged meeple should have SimulatorCreationTask set to TokenWithTransparencyBasedShape",
        condition: (component) => component.Tags && component.Tags.includes("meeple"),
        setValue: (component) => {
            component.SimulatorCreationTask = "TokenWithTransparencyBasedShape";
            return ["SimulatorCreationTask"];
        }
    },
    
    {
        description: "Components tagged 'meeple' should not be tagged 'minifig'",
        condition: (component) => component.Tags && component.Tags.includes("meeple") && component.Tags.includes("minifig"),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "minifig");
            return ["Tags"];
        }
    },
]
const diceCommands = [
    {
        description: "Components that begin with 'D' and then a dice numeral should be tagged 'dice'",
        condition: (component) => component.Tags && component.DisplayName && diceNumerals.some(numeral => component.DisplayName.startsWith("D" + numeral)) && !component.Tags.includes("dice"),
        setValue: (component) => {
            component.Tags.push("dice");
            return ["Tags"];
        }
    },
    {
        description: "Components tagged 'dice' and 'indented' should have SimulatorCreationTask/PlaygroundCreationTask set to StockCube",
        condition: (component) => component.Tags && component.Tags.includes("dice") && component.Tags.includes("indented"),
        setValue: (component) => {
            component.SimulatorCreationTask = "StockCube";
            component.PlaygroundCreationTask = "StockCube";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'dice' and 'blank' should have SimulatorCreationTask/PlaygroundCreationTask set to StockCube",
        condition: (component) => component.Tags && component.Tags.includes("dice") && component.Tags.includes("blank"),
        setValue: (component) => {
            component.SimulatorCreationTask = "StockCube";
            component.PlaygroundCreationTask = "StockCube";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged with 'dice' and not 'blank' and not 'indented' should have SimulatorCreationTask/PlaygroundCreationTask set to StandardDie",
        condition: (component) => component.Tags && component.Tags.includes("dice") && (!component.Tags.includes("blank") && !component.Tags.includes("indented")),
        setValue: (component) => {
            component.SimulatorCreationTask = "StandardDie";
            component.PlaygroundCreationTask = "StandardDie";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Dice should not be tagged animal or building or vehicle",
        condition: (component) => component.Tags && component.Tags.includes("dice") && (component.Tags.includes("animal") || component.Tags.includes("building") || component.Tags.includes("vehicle")),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "animal" && tag !== "building" && tag !== "vehicle");
            return ["Tags"];
        }
    },
    // Some dice are unique, and require a custom creation task
]
const packagingCommands = [
    {
        description: "If it is 'blank' and 'box' tag it packaging",
        condition: (component) => component.Tags && component.Tags.includes("blank") && component.Tags.includes("box") && !component.Tags.includes("packaging"),
        setValue: (component) => {
            component.Tags.push("packaging");
            return ["Tags"];
        }
    },
    {
        description: "Components tagged 'packaging' should not be tagged 'box'",
        condition: (component) => component.Tags && component.Tags.includes("packaging") && component.Tags.includes("box"),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "box");
            return ["Tags"];
        }
    },
    {
        description: "packaging should have SimulatorCreationTask and PlaygroundCreationTask set to none",
        condition: (component) => component.Tags && component.Tags.includes("packaging"),
        setValue: (component) => {
            component.SimulatorCreationTask = "none";
            component.PlaygroundCreationTask = "none";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components that are tagged 'box' and begin with 'BoxBand' should be tagged 'packaging' and have 'box' tag removed.",
        condition: (component) => component.Tags && component.Tags.includes("box") && component.DisplayName && component.DisplayName.startsWith("BoxBand") && !component.Tags.includes("packaging"),
        setValue: (component) => {
            component.Tags.push("packaging");
            component.Tags = component.Tags.filter(tag => tag !== "box");
            return ["Tags"];
        }
    },
    {
        description: "Components with 'StorageBox' or 'TuckBox' or 'DeckBox' in their DisplayName should be tagged 'packaging' if they are not already tagged 'packaging'",
        condition: (component) => component.Tags && component.DisplayName && (component.DisplayName.includes("StorageBox") || component.DisplayName.includes("TuckBox") || component.DisplayName.includes("DeckBox")) && !component.Tags.includes("packaging"),
        setValue: (component) => {
            component.Tags.push("packaging");
            return ["Tags"];
        }
    },
    {
        description: "Components with 'StorageBox' or 'TuckBox' or 'DeckBox' in their DisplayName should not be tagged 'box'",
        condition: (component) => component.Tags && component.DisplayName && (component.DisplayName.includes("StorageBox") || component.DisplayName.includes("TuckBox") || component.DisplayName.includes("DeckBox")) && component.Tags.includes("box"),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "box");
            return ["Tags"];
        }
    }
]

const colorCommands = [
    {
        description: "Components with a color in their DisplayName to be tagged with the color",
        condition: (component) => {
            if (!component.DisplayName) return false;
            const displayName = component.DisplayName;
            
            // Check for whole word/phrase colors - case insensitive
            return allColorVariations.some(variation => {
                // Create regex that matches the color as a whole word or phrase
                // This handles both "Red" and "Light Blue" formats
                const colorRegex = new RegExp(`\\b${variation}\\b`, 'i');
                return colorRegex.test(displayName);
            });
        },
        setValue: (component) => {
            const displayName = component.DisplayName;
            
            // Find which color matched
            const foundColor = allColorVariations.find(variation => {
                const colorRegex = new RegExp(`\\b${variation}\\b`, 'i');
                return colorRegex.test(displayName);
            });
            
            if (foundColor && !component.Tags.includes(foundColor)) {
                component.Tags.push(foundColor);
            }
            return ["Tags"];
        }
    },
    {
        description: "Components that are not tagged with one of the allColorVariations should have their Color set to none",
        condition: (component) => !component.Tags || !component.Tags.some(tag => allColorVariations.includes(tag)),
        setValue: (component) => {
            component.Color = "none";
            return ["Color"];
        }
    },
    {
        description: "Components with 'Wood' in their name should be tagged 'wood' if they aren't already tagged 'wood'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Wood") && !component.Tags.includes("wood"),
        setValue: (component) => {
            component.Tags.push("wood");
            return ["Tags"];
        }
    },
    {
        description: "Components tagged with one of the allColorVariations should have their Color set to the color",
        condition: (component) => component.Tags && component.Tags.some(tag => allColorVariations.includes(tag)),
        setValue: (component) => {
            component.Color = component.Tags.find(tag => allColorVariations.includes(tag));
            return ["Color"];
        }
    },
    
]

module.exports = [
    {
        description: "All components without IsDisabled set are set to false",
        condition: (component) => !component.IsDisabled,
        setValue: (component) => {
            component.IsDisabled = false;
            return ["IsDisabled"];
        }
    },
    {
        description: "Components without a PlaygroundCreationTask and SimulatorCreationTask have their PlaygroundCreationTask and SimulatorCreationTask set to none",
        condition: (component) => !component.PlaygroundCreationTask && !component.SimulatorCreationTask,
        setValue: (component) => {
            component.PlaygroundCreationTask = "none";
            component.SimulatorCreationTask = "none";
            return ["PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    
    ...meepleCommands,
    ...packagingCommands,
    ...colorCommands,
    ...diceCommands,
    
    
    {
        description: "Components tagged 'train' or 'airplane' should be tagged 'vehicle'",
        condition: (component) => component.Tags && (component.Tags.includes("train") || component.Tags.includes("airplane")) && !component.Tags.includes("vehicle"),
        setValue: (component) => {
            component.Tags.push("vehicle");
            return ["Tags"];
        }
    },
    {
        description: "Components whose name includes 'Sprue' should be tagged 'sprue' and have their 'IsDisabled' set to true",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Sprue") && !component.Tags.includes("sprue"),
        setValue: (component) => {
            component.Tags.push("sprue");
            component.IsDisabled = true;
            return ["Tags", "IsDisabled"];
        }
    },
    {
        description: "Components tagged 'cuboid' should have the tag 'cube'",
        condition: (component) => component.Tags && component.Tags.includes("cuboid") && !component.Tags.includes("cube"),
        setValue: (component) => {
            component.Tags.push("cube");
            return ["Tags"];
        }
    },
    {
        description: "Components tagged 'cube' that aren't dice get the Playground/Simulator CreationTask set to StockCube",
        condition: (component) => component.Tags && component.Tags.includes("cube") && !component.Tags.includes("dice"),
        setValue: (component) => {
            component.PlaygroundCreationTask = "StockCube";
            component.SimulatorCreationTask = "StockCube";
            return ["PlaygroundCreationTask", "SimulatorCreationTask"];
        }
    },
    {
        description: "Components without a PreviewUri should have their 'IsDisabled' set to true",
        condition: (component) => !component.PreviewUri && !component.Tags.includes("disabled"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    },
    {
        description: "Components with the Card Connectors in their DisplayName should not be tagged 'building'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Card Connectors") && component.Tags.includes("building"),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "building");
            return ["Tags"];
        }
    },
    {
        description: "Components that have Set in their DisplayName should not be tagged 'set'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Set") && component.Tags.includes("set"),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "set");
            return ["Tags"];
        }
    },
    {
        description: "Components tagged 'set' should be disabled",
        condition: (component) => component.Tags && component.Tags.includes("set"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    }
];