const { allColorVariations } = require("../../src/shared/stockComponentColors");

const diceNumerals = ["2", "4", "6", "8", "10", "12", "20"]
const buildingNames = ["Windmill", "Victorian Miniature", "Water Mill", "Plastic Castle", "Observatory", "Mine", "Marketplace", "Tower Stacker", "Trellis", "Laboratory", "Harbor", "Donjon Pagoda", "Church", "Cathedral", "Castle", "Business", "Taj Mahal Palace", "Pyramid", "Command Center", "Brick Tower", "Wood Cabin", "Skyscraper", "Hut", "Hinged Stone Door"]
const premiumNames = ["Premium", "Handmade", "Treasure Chest Container", "Top Hat", "Traffic Cone", "Rifle", "1st", "Broken Column", "Campfire", "Compass", "Computer", "Computer Desk", "Fence, Wicker", "Notice Board", "Lamp Post", "Lantern", "Large Treasure Chest", "Pentagram", "Signpost", "Tombstone", "Triangle Hollow", "Valve Control Station", "Walker Driver", "Wall, Sandbags", "Wall, Stone", "T-Bar", "Table, Orange"]
const vehicleNames = ["Ship", "Sailboat", "Rocket", "Car", "Truck", "Race Car", "Airplane", "Train", "Push Cart", "Cart", "Wheelbarrow", "Motor Boat", "Motorcycle", "Locomotive", "Van", "Tank", "Semi", "SUV", "Muscle Car", "Helicopter", "Blimp", "Hot Rod", "Container Ship", "Bulldozer"]
const animals = ["Puppy", "Dinosaur", "Dog", "Cat", "Bird", "Fish", "Snake", "Lizard", "Turtle", "Frog", "Toad", "Snake", "Pig", "Kitten", "Elephant", "Dragon", "Bunny", "Bug", "Polar Bear", "Horse", "Grizzly Bear", "Goat", "Dove", "Chicken", "Ant", "Rooster", "Crab", "Bee", "Spider", "Rat", "Lady Bug" ]
const buildingMaterials = ["Brick", "Clay", "Ingot", "Crystal", "Stone", "Jewel"]
const meeplePrefixes = ["Big People", "People", "Worker, Single Bag", "Tall People", "Speedster", "Person with Hat", "Peasant", "Guard Robot",  "Footman", "Gangster", "Female Farmer", "Fedora Wearer", "Figure, Wood", "Bust", "Tiki Idol", "Ghost, White", "Gentleman", "Robot, Silver", "Armored Guard"]
const utility = ["Sand Timer", "Tape Measure", "Sharpies", "Rubber Bands", "Marker, Dry-Erase", "Horizontal Game Master", "Vertical Game Master", "Pencil", "Notepad", "Box Band", "Digital Timer", "Decoder Strips", 'Slider Clip', 'Spinner', "Rivet", "Screw,", "Stand, Chipboard", "Character Stand", "Game Stand", "Card Stand", "Direction Finder", "Snap & Stack", "Card Holder", "Badge Holder", "Tile Rack", "Magnifying Glass, 5X"]
const minifigPrefixes = ["Zombie", "Warrior Monk", "Shieldbearer", "Skeleton Warrior", "Noble", "Missionary", "Ninja", "Mafioso", "Lookout", "Human Figure", 'Colonial Soldier', 'Colonial Lumberjack', "Cavalry, Green", "Woman, Mum", "Hydra", "Gunpod", "Wyvern", "Gelatinous Monster", ]
const otherFigurines = [ "Paper Miniature Base", "Miniature Base", "Halma", "Cone Pawn", "Sticker Pawn", "Peg Pawn", "Paper Miniature Formation"]
const bodyPartPrefixes = ["Bloody Remains", "Broken Heart", "Fist", "Skull", "Brain", "Foot, Brown", "Heart"]
const resourcePrefixes = ["Brick", "Clay", "Ingot", "Coal", "Cobalt", "Crystal","Gem", "Stone", "Jewel", "Stick", "Star", "Flat Star", "Large Star", "Thin Star", "Sack, Gold", "Pumpkin", "Lightning Bolt", "Keycard", "Leather", "Light Bulb", "LED", "Herb", "Grain Sack", "Egg", "Drop","Flag", "Chest", "Brick", "Bullet", "Button", "Acorn", "Wood Logs", "Wood Pile", "Sword", "Tactical Knife", "Tablet", "Rope Coil", "Hex Nut", "I-Beam", "Gear", "Fire Axe", "Frag Grenade", "Empty Bottle", "Crescent Wrench", "AK-47", "Bolt", "Bow and Arrow", "Shotgun", "Bread", "Drumstick", "Oil Drum", "Barrel", "Oil Barrel", "Padlock", "Ring", "Cauldron", "Bowling Pin", "Hexbox", "Hex Stacker", "Stacker Cone", "Stacker", "Sheriff Badge", "Sake", "Flame", "Crown", "Crate", "Fang", "Gavel", "Joystick", "Thimble", "Radiation Mask", "Mushroom Cloud", "Triangle", "Buddha"]
const symbolPrefixes = [ "Universal No", "Universal Yes", "Question Mark", "Exclamation Mark", "Roman Numeral"]
const money = ["Coin", "Doubloon"]
const casino =["Poker Chip", "Suits"]



const undoMeeple = ["Avatar", "Flat Cap", "Fedora Person", "Hatman Green", "Future Person"]

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
        description: "Components that begin with undoMeeple should not have 'meeple' tag and instead should have 'figurine' tag",
        condition: (component) => component.Tags && undoMeeple.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName) && component.Tags.includes("meeple")),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "meeple");
            component.Tags.push("figurine");
            return ["Tags"];
        }
    },
    {
        description: "Component tagged meeple should have SimulatorCreationTask set to ThickTokenWithTransparencyBasedShape",
        condition: (component) => component.Tags && component.Tags.includes("meeple"),
        setValue: (component) => {
            component.SimulatorCreationTask = "ThickTokenWithTransparencyBasedShape";
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
    {
        description: "Components that begin with any of the following should be tagged 'meeple': " + meeplePrefixes.join(", "),
        condition: (component) => component.DisplayName && meeplePrefixes.some(prefix => component.DisplayName.startsWith(prefix)) && !component.Tags.includes("meeple"),
        setValue: (component) => {
            component.Tags.push("meeple");
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
        description: "Components that begin with 'D' and then a dice numeral should be tagged 'd${numeral}'",
        condition: (component) => component.Tags && component.DisplayName && diceNumerals.some(numeral => component.DisplayName.startsWith("D" + numeral)) && component.Tags.includes("dice"),
        setValue: (component) => {
            const numeral = component.DisplayName.match(/D(\d+)/)[1];
            component.Tags.push("d" + numeral);
            return ["Tags"];
        }
    },
    {
        description: "Dice with 'Transparent ' in their DisplayName should replace it with 'Transparent, '",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Transparent") && !component.Tags.includes("transparent"),
        setValue: (component) => {
            component.DisplayName = component.DisplayName.replace("Transparent ", "Transparent, ");
            return ["DisplayName"];
        }
    },
    {
        description: "Components tagged 'dice' and ('indented' or 'blank') that are tagged 'd6' should have SimulatorCreationTask/PlaygroundCreationTask set to StockCube",
        condition: (component) => component.Tags && component.Tags.includes("dice") && (component.Tags.includes("indented") || component.Tags.includes("blank")) && component.Tags.includes("d6"),
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
        description: "Disable components without a PreviewUri",
        condition: (component) => !component.PreviewUri,
        setValue: (component) => {
            component.IsDisabled = true;
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
    {
        description: "Components tagged 'cube' that aren't 'dice' get the Playground/Simulator CreationTask set to StockCube",
        condition: (component) => component.Tags && component.Tags.includes("cube") && !component.Tags.includes("dice"),
        setValue: (component) => {
            component.PlaygroundCreationTask = "StockCube";
            component.SimulatorCreationTask = "StockCube";
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
        description: "Components without a PreviewUri should have their 'IsDisabled' set to true",
        condition: (component) => !component.PreviewUri && !component.Tags.includes("disabled"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'building': " + buildingNames.join(", "),
        condition: (component) => component.DisplayName && buildingNames.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("building") && !component.Tags.includes("TB"),
        setValue: (component) => {
            component.Tags.push("building");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'minifig': " + minifigPrefixes.join(", "),
        condition: (component) => component.DisplayName && minifigPrefixes.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("minifig"),
        setValue: (component) => {
            component.Tags.push("minifig");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'figurine': " + otherFigurines.join(", "),
        condition: (component) => component.DisplayName && otherFigurines.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("figurine"),
        setValue: (component) => {
            component.Tags.push("figurine");
            return ["Tags"];
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
        description: "Components that contain 'Set' in their DisplayName should be tagged 'set'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Set") && !component.Tags.includes("set"),
        setValue: (component) => {
            component.Tags.push("set");
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
    },
    {
        description: "Components that begin with any of the following should be tagged 'premium': " + premiumNames.join(", "),
        condition: (component) => component.DisplayName && premiumNames.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("premium"),
        setValue: (component) => {
            component.Tags.push("premium");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'vehicle': " + vehicleNames.join(", "),
        condition: (component) => component.DisplayName && vehicleNames.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("vehicle"),
        setValue: (component) => {  
            component.Tags.push("vehicle");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'animal': " + animals.join(", "),
        condition: (component) => component.DisplayName && animals.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("animal"),
        setValue: (component) => {  
            component.Tags.push("animal");
            return ["Tags"];
        }
    },
    {
        description: "Components that have TB followed by maybe a space and definately 1 or more numbers should be tagged 'TB'",
        condition: (component) => component.DisplayName && /TB\s*\d+/.test(component.DisplayName) && !component.Tags.includes("TB"),
        setValue: (component) => {
            component.Tags.push("TB");
            return ["Tags"];
        }
    },
    {
        description: "Disable components that begin with Castle Room",
        condition: (component) => component.DisplayName && component.DisplayName.startsWith("Castle Room"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    },
    { 
        description: "Components that begin with any building material should not be tagged building",
        condition: (component) => component.DisplayName && buildingMaterials.some(material => 
            new RegExp(`^${material}(\\s|,|$)`).test(component.DisplayName)
        ) && component.Tags.includes("building"),
        setValue: (component) => {
            component.Tags = component.Tags.filter(tag => tag !== "building");
            return ["Tags"];
        }
    },
    { 
        description: "Components that begin with any body part prefix should be tagged 'bodypart",
        condition: (component) => component.DisplayName && bodyPartPrefixes.some(prefix => 
            new RegExp(`^${prefix}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("bodypart"),
        setValue: (component) => {
            component.Tags.push("bodypart");
            return ["Tags"];
        }
    },
    { 
        description: "Components that begin with any resource prefix should be tagged 'resource'",
        condition: (component) => component.DisplayName && resourcePrefixes.some(prefix => 
            new RegExp(`^${prefix}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("resource"),
        setValue: (component) => {
            component.Tags.push("resource");
            return ["Tags"];
        }
    },
    { 
        description: "Components that begin with any symbol prefix should be tagged 'symbol'",
        condition: (component) => component.DisplayName && symbolPrefixes.some(prefix => 
            new RegExp(`^${prefix}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("symbol"),
        setValue: (component) => {
            component.Tags.push("symbol");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'utility': " + utility.join(", "),
        condition: (component) => component.DisplayName && utility.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("utility"),
        setValue: (component) => {
            component.Tags.push("utility");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'casino': " + casino.join(", "),
        condition: (component) => component.DisplayName && casino.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("casino"),
        setValue: (component) => {
            component.Tags.push("casino");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with any of the following should be tagged 'money': " + money.join(", "),
        condition: (component) => component.DisplayName && money.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("money"),
        setValue: (component) => {
            component.Tags.push("money");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with 'Disc ' or 'Disc,' should be tagged 'disc'",
        condition: (component) => component.DisplayName && (component.DisplayName.startsWith("Disc ") || component.DisplayName.startsWith("Disc,")) && !component.Tags.includes("disc"),
        setValue: (component) => {
            component.Tags.push("disc");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with 'Wink ' or 'Wink,' should be tagged 'wink'",
        condition: (component) => component.DisplayName && (component.DisplayName.startsWith("Wink ") || component.DisplayName.startsWith("Wink,")) && !component.Tags.includes("wink"),
        setValue: (component) => {
            component.Tags.push("wink");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with 'Cylinder ' or 'Cylinder,' should be tagged 'cylinder'",
        condition: (component) => component.DisplayName && (component.DisplayName.startsWith("Cylinder ") || component.DisplayName.startsWith("Cylinder,")) && !component.Tags.includes("cylinder"),
        setValue: (component) => {
            component.Tags.push("cylinder");
            return ["Tags"];
        }
    },
    {
        description: "Components that are tagged 'cylinder' or 'disc' or 'wink' should be tagged 'tube'",
        condition: (component) => (component.Tags && (component.Tags.includes("cylinder") || component.Tags.includes("disc") || component.Tags.includes("wink"))) && !component.Tags.includes("tube"),
        setValue: (component) => {
            component.Tags.push("tube");
            return ["Tags"];
        }
    },
    
    {
        description: "Components that are tagged 'TB' or 'minifig' should be tagged 'figurine'",
        condition: (component) => (component.Tags && (component.Tags.includes("TB") || component.Tags.includes("minifig"))) && !component.Tags.includes("figurine"),
        setValue: (component) => {
            component.Tags.push("figurine");
            return ["Tags"];
        }
    },
    {
        description: "Components that contain 'Baggies' or 'Grab Bag' in their DisplayName should be tagged 'baggies'",
        condition: (component) => component.DisplayName && (component.DisplayName.includes("Baggies") || component.DisplayName.includes("Grab Bag")) && !component.Tags.includes("baggies"),
        setValue: (component) => {
            component.Tags.push("baggies");
            return ["Tags"];
        }
    },
    {
        description: "Components that contain 'Blank' in their DisplayName should be tagged 'blank'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Blank") && !component.Tags.includes("blank"),
        setValue: (component) => {
            component.Tags.push("blank");
            return ["Tags"];
        }
    },
    {
        description: "Components tagged 'pouch' should be tagged 'baggies'",
        condition: (component) => component.Tags && component.Tags.includes("pouch") && !component.Tags.includes("baggies"),
        setValue: (component) => {
            component.Tags.push("baggies");
            return ["Tags"];
        }
    },
    {
        description: "Components that have the word 'Vial' in their DisplayName should be tagged 'vial'",
        condition: (component) => component.DisplayName && component.DisplayName.includes("Vial") && !component.Tags.includes("vial"),
        setValue: (component) => {
            component.Tags.push("vial");
            return ["Tags"];
        }
    },
    {
        description: "Components that begin with 'InFUN' are disabled",
        condition: (component) => component.DisplayName && component.DisplayName.startsWith("InFUN"),
        setValue: (component) => {
            component.IsDisabled = true;
            return ["IsDisabled"];
        }
    },
    {
        description: "Components that have the DisplayName prefix from premiumPrefix should have Playground/SimulatorCreationTask of FlatTokenWithTransparencyBasedShape that aren't 'dice'",
        condition: (component) => component.DisplayName && premiumNames.some(name => 
            new RegExp(`^${name}(\\s|,|$)`).test(component.DisplayName)
        ) && !component.Tags.includes("dice"),
        setValue: (component) => {
            component.SimulatorCreationTask = "FlatTokenWithTransparencyBasedShape";
            component.PlaygroundCreationTask = "FlatTokenWithTransparencyBasedShape";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'packaging' or 'sleeve' or 'baggies' should have Playground/SimulatorCreationTask of none.",
        condition: (component) => component.Tags && (component.Tags.includes("packaging") || component.Tags.includes("sleeve") || component.Tags.includes("baggies")),
        setValue: (component) => {
            component.SimulatorCreationTask = "none";
            component.PlaygroundCreationTask = "none";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    }, 
    {
        description: "Components tagged 'blank' that aren't tagged 'dice' should have Playground/SimulatorCreationTask of none.",
        condition: (component) => component.Tags && component.Tags.includes("blank") && !component.Tags.includes("dice"),
        setValue: (component) => {
            component.SimulatorCreationTask = "none";
            component.PlaygroundCreationTask = "none";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    }, 
    {
        description: "Components tagged 'tube' should have Playground/SimulatorCreationTask of ThickTokenWithTransparencyBasedShape",
        condition: (component) => component.Tags && component.Tags.includes("tube"),
        setValue: (component) => {
            component.SimulatorCreationTask = "ThickTokenWithTransparencyBasedShape";
            component.PlaygroundCreationTask = "ThickTokenWithTransparencyBasedShape";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'animal' or 'bodypart' or 'symbol' or 'resource' or 'casino' or 'vial' or 'money' that aren't 'dice' and aren't 'cube' should have Playground/SimulatorCreationTask of FlatTokenWithTransparencyBasedShape",
        condition: (component) => component.Tags && (component.Tags.includes("animal") || component.Tags.includes("bodypart") || component.Tags.includes("symbol") || component.Tags.includes("resource") || component.Tags.includes("casino") || component.Tags.includes("vial") || component.Tags.includes("money")) && !component.Tags.includes("dice") && !component.Tags.includes("cube"),
        setValue: (component) => {
            component.SimulatorCreationTask = "FlatTokenWithTransparencyBasedShape";
            component.PlaygroundCreationTask = "FlatTokenWithTransparencyBasedShape";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'figurine' or 'vehicle' or 'minifig' or 'TB' or 'building' that aren't 'dice' and aren't 'cube' should have a Playground/SimulatorCreationTask of Standee",
        condition: (component) => component.Tags && (component.Tags.includes("figurine") || component.Tags.includes("vehicle") || component.Tags.includes("minifig") || component.Tags.includes("TB") || component.Tags.includes("building")) && !component.Tags.includes("dice") && !component.Tags.includes("cube"),
        setValue: (component) => {
            component.SimulatorCreationTask = "Standee";
            component.PlaygroundCreationTask = "Standee";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'domino' should have Playground/SimulatorCreationTask of Domino",
        condition: (component) => component.Tags && component.Tags.includes("domino"),
        setValue: (component) => {
            component.SimulatorCreationTask = "Domino"; 
            component.PlaygroundCreationTask = "Domino";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'baggies' or 'packaging' should have Playground/SimulatorCreationTask of Baggie",
        condition: (component) => component.Tags && (component.Tags.includes("baggies") || component.Tags.includes("packaging")),
        setValue: (component) => {
            component.SimulatorCreationTask = "Baggie"; 
            component.PlaygroundCreationTask = "Baggie";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    {
        description: "Components tagged 'tube' should have their 'SimulatorCreationTask' set to 'StockCylinder'",
        condition: (component) => component.Tags && component.Tags.includes("tube"),
        setValue: (component) => {
            component.SimulatorCreationTask = "StockCylinder";
            component.PlaygroundCreationTask = "StockCylinder";
            return ["SimulatorCreationTask", "PlaygroundCreationTask"];
        }
    },
    
];