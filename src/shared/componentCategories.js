const COMPONENT_CATEGORIES = {
  "STOCK": {
    "dice": {
      "D6": {
        "8mm": {
          "White": "D6, 8mm, White",
          "Black": "D6, 8mm, Black",
          "Blue": "D6, 8mm, Blue",
          "Green": "D6, 8mm, Green",
          "Red": "D6, 8mm, Red"
        },
        "16mm": {
          "Yellow": "D6, 16mm, Yellow",
          "Blue": "D6, 16mm, Blue",
          "Black": "D6, 16mm, Black",
          "Green": "D6, 16mm, Green",
          "Purple": "D6, 16mm, Purple",
          "Red": "D6, 16mm, Red",
          "White": "D6, 16mm, White"
        },
        "12mm": {
          "Blue": "D6, 12mm, Blue",
          "Green": "D6, 12mm, Green",
          "Red": "D6, 12mm, Red",
          "White": "D6, 12mm, White",
          "Yellow": "D6, 12mm, Yellow"
        },
        "14mm": {
          "Black": "D6, 14mm, Black"
        }
      },
      "D6, Clear": {
        "12mm": {
          "Colorless": "D6, 12mm, Clear"
        }
      },
      "D12": {
        "Sizeless": {
          "White": "D12, White",
          "Black": "D12, Black",
          "Blue": "D12, Blue",
          "Green": "D12, Green",
          "Red": "D12, Red",
          "Yellow": "D12, Yellow"
        }
      },
      "D20": {
        "Sizeless": {
          "Black": "D20, Black",
          "Yellow": "D20, Yellow",
          "White": "D20, White",
          "Blue": "D20, Blue",
          "Green": "D20, Green",
          "Red": "D20, Red"
        }
      },
      "D10": {
        "Sizeless": {
          "Black": "D10, Black",
          "Blue": "D10, Blue",
          "Green": "D10, Green",
          "Red": "D10, Red",
          "White": "D10, White",
          "Yellow": "D10, Yellow"
        }
      },
      "D10x10": {
        "Sizeless": {
          "Black": "D10x10, Black"
        }
      },
      "D10x10, Black on Color": {
        "Sizeless": {
          "Red": "D10x10, Black on Red"
        }
      },
      "D10x10, White on Color": {
        "Sizeless": {
          "Red": "D10x10, White on Red"
        }
      },
      "D12, Body Parts": {
        "Sizeless": {
          "Colorless": "D12, Body Parts"
        }
      },
      "D3, Rounded, Numeral": {
        "16mm": {
          "Black": "D3, 16mm, Rounded, Numeral, Black",
          "Blue": "D3, 16mm, Rounded, Numeral, Blue",
          "Green": "D3, 16mm, Rounded, Numeral, Green",
          "Red": "D3, 16mm, Rounded, Numeral, Red",
          "White": "D3, 16mm, Rounded, Numeral, White",
          "Yellow": "D3, 16mm, Rounded, Numeral, Yellow"
        }
      },
      "D4": {
        "Sizeless": {
          "Black": "D4, Black",
          "Blue": "D4, Blue",
          "Green": "D4, Green",
          "Orange": "D4, Orange",
          "Red": "D4, Red",
          "White": "D4, White",
          "Yellow": "D4, Yellow"
        }
      },
      "D4, Blank": {
        "Sizeless": {
          "Colorless": "D4, Blank"
        }
      },
      "D6, Marbled": {
        "12mm": {
          "Black": "D6, 12mm, Marbled Black",
          "Green": "D6, 12mm, Marbled Green"
        }
      },
      "D6, Rounded": {
        "12mm": {
          "Blue": "D6, 12mm, Rounded, Blue"
        }
      },
      "D6, Rounded, Color/Black": {
        "12mm": {
          "Blue": "D6, 12mm, Rounded, Blue/Black",
          "Golden": "D6, 12mm, Rounded, Golden/Black",
          "Purple": "D6, 12mm, Rounded, Purple/Black",
          "White": "D6, 12mm, Rounded, White/Black"
        }
      },
      "D6, Rounded, Color/Blue": {
        "12mm": {
          "Orange": "D6, 12mm, Rounded, Orange/Blue"
        }
      },
      "D6, Transparent": {
        "12mm": {
          "Black": "D6, 12mm, Transparent, Black",
          "Blue": "D6, 12mm, Transparent, Blue",
          "Green": "D6, 12mm, Transparent, Green",
          "Orange": "D6, 12mm, Transparent, Orange",
          "Purple": "D6, 12mm, Transparent, Purple",
          "Red": "D6, 12mm, Transparent, Red",
          "Yellow": "D6, 12mm, Transparent, Yellow"
        }
      },
      "D6, Bold Numeral": {
        "15mm": {
          "Red": "D6, 15mm, Bold Numeral, Red"
        }
      },
      "D6, Numeral": {
        "15mm": {
          "Blue": "D6, 15mm, Numeral, Blue",
          "Green": "D6, 15mm, Numeral, Green",
          "Gray": "D6, 15mm, Numeral, Gray"
        },
        "16mm": {
          "Black": "D6, 16mm, Numeral, Black"
        }
      },
      "D6, Betrayal": {
        "16mm": {
          "Colorless": "D6, 16mm, Betrayal"
        }
      },
      "D6, Binary": {
        "16mm": {
          "Colorless": "D6, 16mm, Binary"
        }
      },
      "D6, Black on Color": {
        "16mm": {
          "Blue": "D6, 16mm, Black on Blue",
          "Pink": "D6, 16mm, Black on Pink"
        }
      },
      "D6, Blank": {
        "16mm": {
          "Black": "D6, 16mm, Blank, Black",
          "Blue": "D6, 16mm, Blank, Blue",
          "Green": "D6, 16mm, Blank, Green",
          "Orange": "D6, 16mm, Blank, Orange",
          "Purple": "D6, 16mm, Blank, Purple",
          "Red": "D6, 16mm, Blank, Red",
          "White": "D6, 16mm, Blank, White",
          "Yellow": "D6, 16mm, Blank, Yellow"
        }
      },
      "D6, Blank, Wood, Dark": {
        "16mm": {
          "Colorless": "D6, 16mm, Blank, Wood, Dark"
        }
      },
      "D6, Lightning Bolt": {
        "16mm": {
          "Black": "D6, 16mm, Lightning Bolt, Black",
          "Blue": "D6, 16mm, Lightning Bolt, Blue",
          "Brown": "D6, 16mm, Lightning Bolt, Brown",
          "Green": "D6, 16mm, Lightning Bolt, Green",
          "Yellow": "D6, 16mm, Lightning Bolt, Yellow"
        }
      },
      "D6, Rounded, Pearl": {
        "16mm": {
          "Black": "D6, 16mm, Rounded, Black Pearl",
          "Blue": "D6, 16mm, Rounded, Blue Pearl",
          "Brown": "D6, 16mm, Rounded, Brown Pearl",
          "Green": "D6, 16mm, Rounded, Green Pearl",
          "White": "D6, 16mm, Rounded, White Pearl"
        }
      },
      "D6, Rounded, Opaque": {
        "16mm": {
          "Brown": "D6, 16mm, Rounded, Brown Opaque",
          "Orange": "D6, 16mm, Rounded, Orange Opaque"
        }
      },
      "D6, Sicherman, High": {
        "16mm": {
          "Colorless": "D6, 16mm, Sicherman, High"
        }
      },
      "D6, Sicherman, Low": {
        "16mm": {
          "Colorless": "D6, 16mm, Sicherman, Low"
        }
      },
      "D6, Symbol, Ivory": {
        "16mm": {
          "Colorless": "D6, 16mm, Symbol, Ivory"
        }
      },
      "D6, Wood": {
        "16mm": {
          "Colorless": "D6, 16mm, Wood"
        }
      },
      "D6, Animal Symbols": {
        "25mm": {
          "Colorless": "D6, 25mm, Animal Symbols"
        }
      },
      "D6, Alien, Black on Color": {
        "Sizeless": {
          "Green": "D6, Alien, Black on Green"
        }
      },
      "D6, Alien, Red on Color": {
        "Sizeless": {
          "Green": "D6, Alien, Red on Green"
        }
      },
      "D6, Colors": {
        "Sizeless": {
          "Colorless": "D6, Colors"
        }
      },
      "D6, Dinosaur": {
        "Sizeless": {
          "Colorless": "D6, Dinosaur"
        }
      },
      "D6, Emotion": {
        "Sizeless": {
          "Colorless": "D6, Emotion"
        }
      },
      "D6, Indented, Blank": {
        "Sizeless": {
          "Blue": "D6, Indented, Blank, Blue",
          "Green": "D6, Indented, Blank, Green",
          "Orange": "D6, Indented, Blank, Orange",
          "Purple": "D6, Indented, Blank, Purple",
          "Red": "D6, Indented, Blank, Red",
          "White": "D6, Indented, Blank, White",
          "Yellow": "D6, Indented, Blank, Yellow"
        }
      },
      "D6, Indented, Blank, Dark": {
        "Sizeless": {
          "Blue": "D6, Indented, Blank, Dark Blue"
        }
      },
      "D6, Indented, Blank, Lavender": {
        "Sizeless": {
          "Colorless": "D6, Indented, Blank, Lavender"
        }
      },
      "D6, Indented, Blank, Light": {
        "Sizeless": {
          "Blue": "D6, Indented, Blank, Light Blue"
        }
      },
      "D6, Indented, Blank, Lime": {
        "Sizeless": {
          "Green": "D6, Indented, Blank, Lime Green"
        }
      },
      "D6, Interrogative": {
        "Sizeless": {
          "Colorless": "D6, Interrogative"
        }
      },
      "D6, Natural Shapes": {
        "Sizeless": {
          "Colorless": "D6, Natural Shapes"
        }
      },
      "D6, Negative Counter": {
        "Sizeless": {
          "Colorless": "D6, Negative Counter"
        }
      },
      "D6, Parts of Speech": {
        "Sizeless": {
          "Colorless": "D6, Parts of Speech"
        }
      },
      "D6, Positive Counter": {
        "Sizeless": {
          "Colorless": "D6, Positive Counter"
        }
      },
      "D6, Shapes": {
        "Sizeless": {
          "Colorless": "D6, Shapes"
        }
      },
      "D6, Species": {
        "Sizeless": {
          "Colorless": "D6, Species"
        }
      },
      "D6, Train": {
        "18mm": {
          "White": "D6, Train, 18mm, White"
        }
      },
      "D6, Woodland Animals": {
        "Sizeless": {
          "Colorless": "D6, Woodland Animals"
        }
      },
      "D8": {
        "Sizeless": {
          "Black": "D8, Black",
          "Blue": "D8, Blue",
          "Green": "D8, Green",
          "Red": "D8, Red",
          "White": "D8, White",
          "Yellow": "D8, Yellow"
        }
      },
      "D8, Blank": {
        "Sizeless": {
          "Colorless": "D8, Blank"
        }
      },
      "D8, Compass": {
        "Sizeless": {
          "Colorless": "D8, Compass"
        }
      },
      "Rocket Dice": {
        "Sizeless": {
          "Black": "Rocket Dice, Black",
          "Blue": "Rocket Dice, Blue",
          "Brown": "Rocket Dice, Brown",
          "Green": "Rocket Dice, Green",
          "Gray": "Rocket Dice, Gray",
          "Pink": "Rocket Dice, Pink",
          "Purple": "Rocket Dice, Purple",
          "Red": "Rocket Dice, Red",
          "White": "Rocket Dice, White"
        }
      },
      "Rocket Dice, Frost": {
        "Sizeless": {
          "White": "Rocket Dice, Frost White"
        }
      },
      "D16": {
        "Sizeless": {
          "Purple": "D16, Purple"
        }
      },
      "D6, Caramel": {
        "12mm": {
          "Colorless": "D6, 12mm, Caramel"
        }
      }
    },
    "premium": {
      "1st": {
        "Sizeless": {
          "Colorless": "1st"
        }
      },
      "Broken Column": {
        "Sizeless": {
          "Colorless": "Broken Column"
        }
      },
      "Campfire": {
        "Sizeless": {
          "Colorless": "Campfire"
        }
      },
      "Compass": {
        "Sizeless": {
          "Colorless": "Compass"
        }
      },
      "Computer": {
        "Sizeless": {
          "Colorless": "Computer"
        }
      },
      "Computer Desk": {
        "Sizeless": {
          "Colorless": "Computer Desk"
        }
      },
      "Fence, Wicker": {
        "Sizeless": {
          "Colorless": "Fence, Wicker"
        }
      },
      "Handmade Campfire": {
        "Sizeless": {
          "Colorless": "Handmade Campfire"
        }
      },
      "Handmade Coal": {
        "Sizeless": {
          "Colorless": "Handmade Coal"
        }
      },
      "Handmade Corn": {
        "Sizeless": {
          "Colorless": "Handmade Corn"
        }
      },
      "Handmade Fence": {
        "Sizeless": {
          "Colorless": "Handmade Fence"
        }
      },
      "Handmade Grape": {
        "Sizeless": {
          "Colorless": "Handmade Grape"
        }
      },
      "Handmade Oil Drum": {
        "Sizeless": {
          "Colorless": "Handmade Oil Drum"
        }
      },
      "Handmade Pumpkin": {
        "Sizeless": {
          "Colorless": "Handmade Pumpkin"
        }
      },
      "Handmade Reed": {
        "Sizeless": {
          "Colorless": "Handmade Reed"
        }
      },
      "Handmade Skull": {
        "Sizeless": {
          "Colorless": "Handmade Skull"
        }
      },
      "Handmade Trash Can": {
        "Sizeless": {
          "Colorless": "Handmade Trash Can"
        }
      },
      "Handmade Trough": {
        "Sizeless": {
          "Colorless": "Handmade Trough"
        }
      },
      "Handmade Uranium Rod": {
        "Sizeless": {
          "Colorless": "Handmade Uranium Rod"
        }
      },
      "Handmade Wheat": {
        "Sizeless": {
          "Colorless": "Handmade Wheat"
        }
      },
      "Lamp Post": {
        "Sizeless": {
          "Colorless": "Lamp Post"
        }
      },
      "Lantern": {
        "Sizeless": {
          "Colorless": "Lantern"
        }
      },
      "Large Treasure Chest (closed)": {
        "Large": {
          "Colorless": "Large Treasure Chest (closed)"
        }
      },
      "Notice Board": {
        "Sizeless": {
          "Colorless": "Notice Board"
        }
      },
      "Pentagram": {
        "Sizeless": {
          "Colorless": "Pentagram"
        }
      },
      "Premium Apple": {
        "Sizeless": {
          "Colorless": "Premium Apple"
        }
      },
      "Premium Axe": {
        "Sizeless": {
          "Colorless": "Premium Axe"
        }
      },
      "Premium Barrel": {
        "Sizeless": {
          "Colorless": "Premium Barrel"
        }
      },
      "Premium Bee": {
        "Sizeless": {
          "Colorless": "Premium Bee"
        }
      },
      "Premium Blue Cloth Bundle": {
        "Sizeless": {
          "Colorless": "Premium Blue Cloth Bundle"
        }
      },
      "Premium Brain": {
        "Sizeless": {
          "Colorless": "Premium Brain"
        }
      },
      "Premium Brown Spice Sack": {
        "Sizeless": {
          "Colorless": "Premium Brown Spice Sack"
        }
      },
      "Premium Buckler": {
        "Sizeless": {
          "Colorless": "Premium Buckler"
        }
      },
      "Premium Campfire": {
        "Sizeless": {
          "Colorless": "Premium Campfire"
        }
      },
      "Premium Cinder Block": {
        "Sizeless": {
          "Colorless": "Premium Cinder Block"
        }
      },
      "Premium Coal": {
        "Sizeless": {
          "Colorless": "Premium Coal"
        }
      },
      "Premium Copper Ingot": {
        "Sizeless": {
          "Colorless": "Premium Copper Ingot"
        }
      },
      "Premium Corn": {
        "Sizeless": {
          "Colorless": "Premium Corn"
        }
      },
      "Premium Crate": {
        "Sizeless": {
          "Colorless": "Premium Crate"
        }
      },
      "Premium Dog": {
        "Sizeless": {
          "Colorless": "Premium Dog"
        }
      },
      "Premium Energy Cell": {
        "Sizeless": {
          "Colorless": "Premium Energy Cell"
        }
      },
      "Premium Fur Bundle": {
        "Sizeless": {
          "Colorless": "Premium Fur Bundle"
        }
      },
      "Premium Gold Ingot": {
        "Sizeless": {
          "Colorless": "Premium Gold Ingot"
        }
      },
      "Premium Gold Nugget": {
        "Sizeless": {
          "Colorless": "Premium Gold Nugget"
        }
      },
      "Premium Grain Sack": {
        "Sizeless": {
          "Colorless": "Premium Grain Sack"
        }
      },
      "Premium Green Spice Sack": {
        "Sizeless": {
          "Colorless": "Premium Green Spice Sack"
        }
      },
      "Premium Heart": {
        "Sizeless": {
          "Colorless": "Premium Heart"
        }
      },
      "Premium Horse": {
        "Sizeless": {
          "Colorless": "Premium Horse"
        }
      },
      "Premium Iron Ingot": {
        "Sizeless": {
          "Colorless": "Premium Iron Ingot"
        }
      },
      "Premium Leather Bag": {
        "Sizeless": {
          "Colorless": "Premium Leather Bag"
        }
      },
      "Premium Leather Scroll": {
        "Sizeless": {
          "Colorless": "Premium Leather Scroll"
        }
      },
      "Premium LP Gas Can": {
        "Sizeless": {
          "Colorless": "Premium LP Gas Can"
        }
      },
      "Premium Magnifying Glass": {
        "Sizeless": {
          "Colorless": "Premium Magnifying Glass"
        }
      },
      "Premium Marble Tile": {
        "Sizeless": {
          "Colorless": "Premium Marble Tile"
        }
      },
      "Premium Oil Drum": {
        "Sizeless": {
          "Colorless": "Premium Oil Drum"
        }
      },
      "Premium Orange Cloth Bundle": {
        "Sizeless": {
          "Colorless": "Premium Orange Cloth Bundle"
        }
      },
      "Premium Ore": {
        "Sizeless": {
          "Colorless": "Premium Ore"
        }
      },
      "Premium Potion Bottle": {
        "Sizeless": {
          "Colorless": "Premium Potion Bottle"
        }
      },
      "Premium Pumpkin": {
        "Sizeless": {
          "Colorless": "Premium Pumpkin"
        }
      },
      "Premium Purple Cloth Bundle": {
        "Sizeless": {
          "Colorless": "Premium Purple Cloth Bundle"
        }
      },
      "Premium Red Spice Sack": {
        "Sizeless": {
          "Colorless": "Premium Red Spice Sack"
        }
      },
      "Premium Sealed Scroll": {
        "Sizeless": {
          "Colorless": "Premium Sealed Scroll"
        }
      },
      "Premium Skull": {
        "Sizeless": {
          "Colorless": "Premium Skull"
        }
      },
      "Premium Space Crate": {
        "Sizeless": {
          "Colorless": "Premium Space Crate"
        }
      },
      "Premium Tome": {
        "Sizeless": {
          "Colorless": "Premium Tome"
        }
      },
      "Premium Trash Can": {
        "Sizeless": {
          "Colorless": "Premium Trash Can"
        }
      },
      "Premium Treasure Chest": {
        "Sizeless": {
          "Colorless": "Premium Treasure Chest"
        }
      },
      "Premium Uranium Rod": {
        "Sizeless": {
          "Colorless": "Premium Uranium Rod"
        }
      },
      "Premium Water Bucket": {
        "Sizeless": {
          "Colorless": "Premium Water Bucket"
        }
      },
      "Premium White Cloth Bundle": {
        "Sizeless": {
          "Colorless": "Premium White Cloth Bundle"
        }
      },
      "Premium White Spice Sack": {
        "Sizeless": {
          "Colorless": "Premium White Spice Sack"
        }
      },
      "Premium Wood": {
        "Sizeless": {
          "Colorless": "Premium Wood"
        }
      },
      "Premium Yarn Ball": {
        "Sizeless": {
          "Colorless": "Premium Yarn Ball"
        }
      },
      "Rifle": {
        "Sizeless": {
          "Colorless": "Rifle"
        }
      },
      "Signpost": {
        "Sizeless": {
          "Colorless": "Signpost"
        }
      },
      "T-Bar": {
        "Sizeless": {
          "Brown": "T-Bar, Brown"
        }
      },
      "Table": {
        "Sizeless": {
          "Orange": "Table, Orange"
        }
      },
      "Toilet Paper": {
        "Sizeless": {
          "Colorless": "Toilet Paper"
        }
      },
      "Tombstone": {
        "Sizeless": {
          "Colorless": "Tombstone"
        }
      },
      "Top Hat": {
        "Sizeless": {
          "Colorless": "Top Hat"
        }
      },
      "Traffic Cone": {
        "Sizeless": {
          "Colorless": "Traffic Cone"
        }
      },
      "Treasure Chest Container": {
        "Sizeless": {
          "Colorless": "Treasure Chest Container"
        }
      },
      "Valve Control Station": {
        "Sizeless": {
          "Colorless": "Valve Control Station"
        }
      },
      "Walker Driver, Space": {
        "Sizeless": {
          "Colorless": "Walker Driver, Space"
        }
      },
      "Wall, Sandbags": {
        "Sizeless": {
          "Colorless": "Wall, Sandbags"
        }
      },
      "Wall, Stone": {
        "Sizeless": {
          "Colorless": "Wall, Stone"
        }
      },
      "Premium Beer Mug": {
        "Sizeless": {
          "Colorless": "Premium Beer Mug"
        }
      },
      "Premium Blood Droplet": {
        "Sizeless": {
          "Colorless": "Premium Blood Droplet"
        }
      },
      "Premium Blue Tome": {
        "Sizeless": {
          "Colorless": "Premium Blue Tome"
        }
      },
      "Premium Brown Mushroom": {
        "Sizeless": {
          "Colorless": "Premium Brown Mushroom"
        }
      },
      "Premium Bullet": {
        "Sizeless": {
          "Colorless": "Premium Bullet"
        }
      },
      "Premium Coffee Bean": {
        "Sizeless": {
          "Colorless": "Premium Coffee Bean"
        }
      },
      "Premium Deflector Shield": {
        "Sizeless": {
          "Colorless": "Premium Deflector Shield"
        }
      },
      "Premium Explosion": {
        "Sizeless": {
          "Colorless": "Premium Explosion"
        }
      },
      "Premium Gas Can": {
        "Sizeless": {
          "Colorless": "Premium Gas Can"
        }
      },
      "Premium Green Leaf": {
        "Sizeless": {
          "Colorless": "Premium Green Leaf"
        }
      },
      "Premium Hammer": {
        "Sizeless": {
          "Colorless": "Premium Hammer"
        }
      },
      "Premium Ice Crystals": {
        "Sizeless": {
          "Colorless": "Premium Ice Crystals"
        }
      },
      "Premium Med Kit": {
        "Sizeless": {
          "Colorless": "Premium Med Kit"
        }
      },
      "Premium Milk Bottle": {
        "Sizeless": {
          "Colorless": "Premium Milk Bottle"
        }
      },
      "Premium Mushroom": {
        "Sizeless": {
          "Colorless": "Premium Mushroom"
        }
      },
      "Premium Orange Tome": {
        "Sizeless": {
          "Colorless": "Premium Orange Tome"
        }
      },
      "Premium Pile of Bones": {
        "Sizeless": {
          "Colorless": "Premium Pile of Bones"
        }
      },
      "Premium Present": {
        "Sizeless": {
          "Colorless": "Premium Present"
        }
      },
      "Premium Purple Grapes": {
        "Sizeless": {
          "Colorless": "Premium Purple Grapes"
        }
      },
      "Premium Smoke Cloud": {
        "Sizeless": {
          "Colorless": "Premium Smoke Cloud"
        }
      },
      "Premium Stone": {
        "Sizeless": {
          "Colorless": "Premium Stone"
        }
      },
      "Premium Tech Tablet": {
        "Sizeless": {
          "Colorless": "Premium Tech Tablet"
        }
      },
      "Premium Tentacle": {
        "Sizeless": {
          "Colorless": "Premium Tentacle"
        }
      },
      "Premium Toxic Waste": {
        "Sizeless": {
          "Colorless": "Premium Toxic Waste"
        }
      },
      "Premium Water Droplet": {
        "Sizeless": {
          "Colorless": "Premium Water Droplet"
        }
      },
      "Premium Wheat Bundle": {
        "Sizeless": {
          "Colorless": "Premium Wheat Bundle"
        }
      },
      "Premium White Sheaf": {
        "Sizeless": {
          "Colorless": "Premium White Sheaf"
        }
      },
      "Premium Wrench": {
        "Sizeless": {
          "Colorless": "Premium Wrench"
        }
      }
    },
    "packaging": {
      "Box Insert, Pro": {
        "Medium": {
          "Colorless": "Box Insert, Pro, Medium"
        },
        "Small": {
          "Colorless": "Box Insert, Pro, Small"
        }
      },
      "Box Insert, Stout": {
        "Small": {
          "Colorless": "Box Insert, Stout, Small"
        }
      },
      "Card Envelope": {
        "Sizeless": {
          "Colorless": "Card Envelope",
          "White": "Card Envelope, White"
        }
      },
      "Clear Poker Tuck Box (200)": {
        "200": {
          "Colorless": "Clear Poker Tuck Box (200)"
        }
      },
      "Clear Poker Tuck Box (41)": {
        "41": {
          "Colorless": "Clear Poker Tuck Box (41)"
        }
      },
      "Clear Poker Tuck Box (66)": {
        "66": {
          "Colorless": "Clear Poker Tuck Box (66)"
        }
      },
      "Deck Box, Blank": {
        "Sizeless": {
          "Colorless": "Deck Box, Blank"
        }
      },
      "Euro Poker Tin": {
        "Sizeless": {
          "Colorless": "Euro Poker Tin"
        }
      },
      "Hang Tabs, Triangle (pack of 20)": {
        "Sizeless": {
          "Colorless": "Hang Tabs, Triangle (pack of 20)"
        }
      },
      "Blank Mint Tin": {
        "Sizeless": {
          "Colorless": "Blank Mint Tin"
        }
      },
      "Mint Tin Ribbon": {
        "Sizeless": {
          "Colorless": "Mint Tin Ribbon"
        }
      },
      "Mint Tin": {
        "Tall": {
          "Colorless": "Mint Tin, Tall"
        }
      },
      "Parts Bowl": {
        "70mm": {
          "Colorless": "Parts Bowl, 70mm"
        }
      },
      "Parts Tray": {
        "Sizeless": {
          "Colorless": "Parts Tray"
        }
      },
      "Storage Jar, Round, Clear": {
        "Sizeless": {
          "Colorless": "Storage Jar, Round, Clear"
        }
      },
      "Storage Jar, Tin": {
        "Sizeless": {
          "Colorless": "Storage Jar, Tin"
        }
      },
      "Deck Storage, Clear": {
        "Sizeless": {
          "Colorless": "Deck Storage, Clear"
        }
      },
      "Large Black Tin": {
        "Large": {
          "Colorless": "Large Black Tin"
        }
      }
    },
    "sleeve": {
      "Jumbo Sleeve Pack (100)": {
        "100": {
          "Colorless": "Jumbo Sleeve Pack (100)"
        }
      },
      "Mini Sleeve Pack (100)": {
        "100": {
          "Colorless": "Mini Sleeve Pack (100)"
        }
      },
      "Tarot Sleeve Pack (100)": {
        "100": {
          "Colorless": "Tarot Sleeve Pack (100)"
        }
      },
      "Bridge Sleeve Pack (100)": {
        "100": {
          "Colorless": "Bridge Sleeve Pack (100)"
        }
      },
      "Poker Sleeve Pack (100)": {
        "100": {
          "Colorless": "Poker Sleeve Pack (100)"
        }
      }
    },
    "baggies": {
      "11 X 11 Baggies": {
        "Sizeless": {
          "Colorless": "11 X 11 Baggies"
        }
      },
      "3 X 4 Baggies": {
        "Sizeless": {
          "Colorless": "3 X 4 Baggies"
        }
      },
      "4 X 10 Baggies": {
        "Sizeless": {
          "Colorless": "4 X 10 Baggies"
        }
      },
      "4 X 5 Baggies": {
        "Sizeless": {
          "Colorless": "4 X 5 Baggies"
        }
      },
      "4 X 6 Baggies": {
        "Sizeless": {
          "Colorless": "4 X 6 Baggies"
        }
      },
      "5 X 5 Baggies": {
        "Sizeless": {
          "Colorless": "5 X 5 Baggies"
        }
      },
      "5 X 7 Baggies": {
        "Sizeless": {
          "Colorless": "5 X 7 Baggies"
        }
      },
      "6 X 10 Baggies": {
        "Sizeless": {
          "Colorless": "6 X 10 Baggies"
        }
      },
      "7 X 12 Baggies": {
        "Sizeless": {
          "Colorless": "7 X 12 Baggies"
        }
      },
      "9 X 12 Baggies": {
        "Sizeless": {
          "Colorless": "9 X 12 Baggies"
        }
      },
      "Burlap Bag": {
        "Small": {
          "Black": "Burlap Bag, Small, Black",
          "Green": "Burlap Bag, Small, Green",
          "Red": "Burlap Bag, Small, Red",
          "White": "Burlap Bag, Small, White"
        }
      },
      "Cotton Bag": {
        "Small": {
          "White": "Cotton Bag, Small, White"
        }
      },
      "Grab Bag": {
        "Sizeless": {
          "Colorless": "Grab Bag"
        }
      },
      "Grab Bag, Premium": {
        "Sizeless": {
          "Colorless": "Grab Bag, Premium"
        }
      },
      "Parts Bag, Fancy": {
        "Sizeless": {
          "Gold": "Parts Bag, Fancy, Gold",
          "Silver": "Parts Bag, Fancy, Silver"
        }
      },
      "Parts Bag": {
        "Large": {
          "Black": "Parts Bag, Large, Black",
          "Blue": "Parts Bag, Large, Blue",
          "Red": "Parts Bag, Large, Red"
        },
        "Medium": {
          "Black": "Parts Bag, Medium, Black",
          "Blue": "Parts Bag, Medium, Blue",
          "Brown": "Parts Bag, Medium, Brown",
          "Green": "Parts Bag, Medium, Green",
          "Gray": "Parts Bag, Medium, Gray",
          "Purple": "Parts Bag, Medium, Purple",
          "Red": "Parts Bag, Medium, Red"
        },
        "Small": {
          "Black": "Parts Bag, Small, Black",
          "Blue": "Parts Bag, Small, Blue",
          "Brown": "Parts Bag, Small, Brown",
          "Gray": "Parts Bag, Small, Gray",
          "Green": "Parts Bag, Small, Green",
          "Purple": "Parts Bag, Small, Purple",
          "Red": "Parts Bag, Small, Red"
        },
        "Tall": {
          "Black": "Parts Bag, Tall, Black"
        }
      },
      "Parts Bag, Large Cloth": {
        "Sizeless": {
          "Black": "Parts Bag, Large Cloth, Black"
        }
      }
    },
    "cube": {
      "Cube": {
        "8mm": {
          "Green": "Cube, 8mm, Green",
          "Orange": "Cube, 8mm, Orange",
          "Black": "Cube, 8mm, Black",
          "Blue": "Cube, 8mm, Blue",
          "White": "Cube, 8mm, White",
          "Red": "Cube, 8mm, Red",
          "Purple": "Cube, 8mm, Purple",
          "Brown": "Cube, 8mm, Brown",
          "Gray": "Cube, 8mm, Gray",
          "Pink": "Cube, 8mm, Pink",
          "Yellow": "Cube, 8mm, Yellow"
        },
        "10mm": {
          "Black": "Cube, 10mm, Black",
          "Blue": "Cube, 10mm, Blue",
          "Brown": "Cube, 10mm, Brown",
          "Green": "Cube, 10mm, Green",
          "Gray": "Cube, 10mm, Gray",
          "Orange": "Cube, 10mm, Orange",
          "Pink": "Cube, 10mm, Pink",
          "Purple": "Cube, 10mm, Purple",
          "Red": "Cube, 10mm, Red",
          "White": "Cube, 10mm, White",
          "Yellow": "Cube, 10mm, Yellow"
        },
        "15mm": {
          "Red": "Cube, 15mm, Red"
        },
        "13mm": {
          "Blue": "Cube, 13mm, Blue",
          "Green": "Cube, 13mm, Green",
          "Red": "Cube, 13mm, Red",
          "Yellow": "Cube, 13mm, Yellow"
        }
      },
      "Block 1x1": {
        "Sizeless": {
          "Black": "Block 1x1, Black",
          "Blue": "Block 1x1, Blue",
          "Red": "Block 1x1, Red",
          "White": "Block 1x1, White",
          "Yellow": "Block 1x1, Yellow"
        }
      },
      "Block 1x2": {
        "Sizeless": {
          "Black": "Block 1x2, Black",
          "Blue": "Block 1x2, Blue",
          "Red": "Block 1x2, Red",
          "White": "Block 1x2, White",
          "Yellow": "Block 1x2, Yellow"
        }
      },
      "Block 1x3": {
        "Sizeless": {
          "Black": "Block 1x3, Black",
          "Blue": "Block 1x3, Blue",
          "Red": "Block 1x3, Red",
          "White": "Block 1x3, White",
          "Yellow": "Block 1x3, Yellow"
        }
      },
      "Cube, Mustard": {
        "10mm": {
          "Colorless": "Cube, 10mm, Mustard"
        }
      },
      "Cube, Bright": {
        "8mm": {
          "Yellow": "Cube, 8mm, Bright Yellow"
        }
      },
      "Cube, Light": {
        "8mm": {
          "Pink": "Cube, 8mm, Light Pink"
        }
      },
      "Cube, Natural": {
        "8mm": {
          "Colorless": "Cube, 8mm, Natural"
        }
      },
      "Cube, Metal": {
        "8mm": {
          "Bronze": "Cube, Metal, Bronze, 8mm",
          "Gold": "Cube, Metal, Gold, 8mm",
          "Silver": "Cube, Metal, Silver, 8mm"
        }
      },
      "D6": {
        "12mm": {
          "Black": "D6, 12mm, Black"
        }
      },
      "Flatbed Truck, Wood": {
        "Sizeless": {
          "Black": "Flatbed Truck, Wood, Black"
        }
      },
      "Future Cube": {
        "Sizeless": {
          "Orange": "Future Cube, Orange",
          "Purple": "Future Cube, Purple",
          "Red": "Future Cube, Red",
          "Yellow": "Future Cube, Yellow",
          "Blue": "Future Cube, Blue"
        }
      },
      "Ice Cube, Copper": {
        "10mm": {
          "Colorless": "Ice Cube, 10mm, Copper"
        },
        "8mm": {
          "Colorless": "Ice Cube, 8mm, Copper"
        }
      },
      "Ice Cube, Opaque": {
        "10mm": {
          "Black": "Ice Cube, 10mm, Opaque, Black",
          "Gold": "Ice Cube, 10mm, Opaque, Gold",
          "Silver": "Ice Cube, 10mm, Opaque, Silver",
          "White": "Ice Cube, 10mm, Opaque, White"
        },
        "12mm": {
          "Black": "Ice Cube, 12mm, Opaque, Black",
          "Gold": "Ice Cube, 12mm, Opaque, Gold",
          "Silver": "Ice Cube, 12mm, Opaque, Silver",
          "White": "Ice Cube, 12mm, Opaque, White"
        },
        "8mm": {
          "Black": "Ice Cube, 8mm, Opaque, Black",
          "Gold": "Ice Cube, 8mm, Opaque, Gold",
          "Silver": "Ice Cube, 8mm, Opaque, Silver",
          "White": "Ice Cube, 8mm, Opaque, White"
        }
      },
      "Ice Cube, Transparent": {
        "10mm": {
          "Black": "Ice Cube, 10mm, Transparent, Black",
          "Blue": "Ice Cube, 10mm, Transparent, Blue",
          "Green": "Ice Cube, 10mm, Transparent, Green",
          "Orange": "Ice Cube, 10mm, Transparent, Orange",
          "Purple": "Ice Cube, 10mm, Transparent, Purple",
          "Red": "Ice Cube, 10mm, Transparent, Red",
          "White": "Ice Cube, 10mm, Transparent, White",
          "Yellow": "Ice Cube, 10mm, Transparent, Yellow"
        },
        "12mm": {
          "Black": "Ice Cube, 12mm, Transparent, Black",
          "Blue": "Ice Cube, 12mm, Transparent, Blue",
          "Green": "Ice Cube, 12mm, Transparent, Green",
          "Orange": "Ice Cube, 12mm, Transparent, Orange",
          "Purple": "Ice Cube, 12mm, Transparent, Purple",
          "Red": "Ice Cube, 12mm, Transparent, Red",
          "White": "Ice Cube, 12mm, Transparent, White",
          "Yellow": "Ice Cube, 12mm, Transparent, Yellow"
        },
        "8mm": {
          "Black": "Ice Cube, 8mm, Transparent, Black",
          "Blue": "Ice Cube, 8mm, Transparent, Blue",
          "Green": "Ice Cube, 8mm, Transparent, Green",
          "Orange": "Ice Cube, 8mm, Transparent, Orange",
          "Purple": "Ice Cube, 8mm, Transparent, Purple",
          "Red": "Ice Cube, 8mm, Transparent, Red",
          "White": "Ice Cube, 8mm, Transparent, White",
          "Yellow": "Ice Cube, 8mm, Transparent, Yellow"
        }
      },
      "Ice Cube, Transparent, Clear": {
        "10mm": {
          "Colorless": "Ice Cube, 10mm, Transparent, Clear"
        },
        "12mm": {
          "Colorless": "Ice Cube, 12mm, Transparent, Clear"
        },
        "8mm": {
          "Colorless": "Ice Cube, 8mm, Transparent, Clear"
        }
      },
      "Qubit": {
        "Sizeless": {
          "Black": "Qubit, Black",
          "Blue": "Qubit, Blue",
          "Green": "Qubit, Green",
          "Orange": "Qubit, Orange",
          "Purple": "Qubit, Purple",
          "Red": "Qubit, Red",
          "White": "Qubit, White",
          "Yellow": "Qubit, Yellow"
        }
      }
    },
    "tube": {
      "Cylinder, 10mm x 10mm": {
        "Sizeless": {
          "Black": "Cylinder, 10mm x 10mm, Black",
          "Blue": "Cylinder, 10mm x 10mm, Blue",
          "Green": "Cylinder, 10mm x 10mm, Green",
          "Orange": "Cylinder, 10mm x 10mm, Orange",
          "Purple": "Cylinder, 10mm x 10mm, Purple",
          "Red": "Cylinder, 10mm x 10mm, Red",
          "White": "Cylinder, 10mm x 10mm, White",
          "Yellow": "Cylinder, 10mm x 10mm, Yellow"
        }
      },
      "Cylinder, 8m x 15mm": {
        "Sizeless": {
          "Yellow": "Cylinder, 8m x 15mm, Yellow"
        }
      },
      "Cylinder, 10mm x 18mm": {
        "Sizeless": {
          "Yellow": "Cylinder, 10mm x 18mm, Yellow"
        }
      },
      "Cylinder, 14mm x 30mm, Natural": {
        "Sizeless": {
          "Colorless": "Cylinder, 14mm x 30mm, Natural"
        }
      },
      "Cylinder, 30mm x 15mm": {
        "Sizeless": {
          "Blue": "Cylinder, 30mm x 15mm, Blue",
          "Yellow": "Cylinder, 30mm x 15mm, Yellow"
        }
      },
      "Disc, 14mm x 10mm": {
        "Sizeless": {
          "Blue": "Disc, 14mm x 10mm, Blue",
          "Purple": "Disc, 14mm x 10mm, Purple",
          "Red": "Disc, 14mm x 10mm, Red"
        }
      },
      "Disc, 14mm x 4mm": {
        "Sizeless": {
          "Black": "Disc, 14mm x 4mm, Black",
          "Green": "Disc, 14mm x 4mm, Green",
          "Red": "Disc, 14mm x 4mm, Red",
          "Yellow": "Disc, 14mm x 4mm, Yellow"
        }
      },
      "Disc, 14mm x 4mm, Light": {
        "Sizeless": {
          "Blue": "Disc, 14mm x 4mm, Light Blue",
          "Purple": "Disc, 14mm x 4mm, Light Purple"
        }
      },
      "Disc, 15mm x 5mm": {
        "Sizeless": {
          "Black": "Disc, 15mm x 5mm, Black",
          "Blue": "Disc, 15mm x 5mm, Blue",
          "Green": "Disc, 15mm x 5mm, Green",
          "Red": "Disc, 15mm x 5mm, Red"
        }
      },
      "Disc, 15mm x 6mm, Lime": {
        "Sizeless": {
          "Green": "Disc, 15mm x 6mm, Lime Green"
        }
      },
      "Disc, 15mm x 6mm": {
        "Sizeless": {
          "Orange": "Disc, 15mm x 6mm, Orange",
          "Red": "Disc, 15mm x 6mm, Red",
          "Yellow": "Disc, 15mm x 6mm, Yellow"
        }
      },
      "Disc, 16mm x 10mm": {
        "Sizeless": {
          "Blue": "Disc, 16mm x 10mm, Blue",
          "Brown": "Disc, 16mm x 10mm, Brown",
          "Green": "Disc, 16mm x 10mm, Green",
          "Purple": "Disc, 16mm x 10mm, Purple",
          "Red": "Disc, 16mm x 10mm, Red",
          "Yellow": "Disc, 16mm x 10mm, Yellow"
        }
      },
      "Disc, 16mm x 4mm": {
        "Sizeless": {
          "Black": "Disc, 16mm x 4mm, Black",
          "Blue": "Disc, 16mm x 4mm, Blue",
          "Green": "Disc, 16mm x 4mm, Green",
          "Orange": "Disc, 16mm x 4mm, Orange",
          "Purple": "Disc, 16mm x 4mm, Purple",
          "Red": "Disc, 16mm x 4mm, Red",
          "White": "Disc, 16mm x 4mm, White",
          "Yellow": "Disc, 16mm x 4mm, Yellow"
        }
      },
      "Disc, 16mm x 6mm, Light": {
        "Sizeless": {
          "Purple": "Disc, 16mm x 6mm, Light Purple"
        }
      },
      "Disc, 16mm x 6mm": {
        "Sizeless": {
          "Orange": "Disc, 16mm x 6mm, Orange"
        }
      },
      "Disc, 16mm x 8mm, Mint": {
        "Sizeless": {
          "Colorless": "Disc, 16mm x 8mm, Mint"
        }
      },
      "Disc, 16mm x 8mm": {
        "Sizeless": {
          "Pink": "Disc, 16mm x 8mm, Pink",
          "Purple": "Disc, 16mm x 8mm, Purple",
          "Yellow": "Disc, 16mm x 8mm, Yellow"
        }
      },
      "Disc, 16mm x 8mm, Tan": {
        "Sizeless": {
          "Colorless": "Disc, 16mm x 8mm, Tan"
        }
      },
      "Disc, 17mm x 10mm, Apricot": {
        "Sizeless": {
          "Colorless": "Disc, 17mm x 10mm, Apricot"
        }
      },
      "Disc, 17mm x 10mm": {
        "Sizeless": {
          "Green": "Disc, 17mm x 10mm, Green"
        }
      },
      "Disc, 18mm x 3mm, Clear": {
        "Sizeless": {
          "Colorless": "Disc, 18mm x 3mm, Clear"
        }
      },
      "Disc, 18mm x 3mm, fluorescent blue ": {
        "Sizeless": {
          "Colorless": "Disc, 18mm x 3mm, fluorescent blue "
        }
      },
      "Disc, 18mm x 3mm, Fluorescent": {
        "Sizeless": {
          "Green": "Disc, 18mm x 3mm, Fluorescent Green",
          "Orange": "Disc, 18mm x 3mm, Fluorescent Orange",
          "Red": "Disc, 18mm x 3mm, Fluorescent Red",
          "Yellow": "Disc, 18mm x 3mm, Fluorescent Yellow"
        }
      },
      "Disc, 18mm x 3mm, Transparent": {
        "Sizeless": {
          "Blue": "Disc, 18mm x 3mm, Transparent, Blue",
          "Green": "Disc, 18mm x 3mm, Transparent, Green",
          "Gray": "Disc, 18mm x 3mm, Transparent, Gray",
          "Orange": "Disc, 18mm x 3mm, Transparent, Orange",
          "Purple": "Disc, 18mm x 3mm, Transparent, Purple",
          "Red": "Disc, 18mm x 3mm, Transparent, Red",
          "Yellow": "Disc, 18mm x 3mm, Transparent, Yellow"
        }
      },
      "Disc, 18mm x 5mm": {
        "Sizeless": {
          "Red": "Disc, 18mm x 5mm, Red"
        }
      },
      "Disc, 18mm x 6mm, Clear": {
        "Sizeless": {
          "Colorless": "Disc, 18mm x 6mm, Clear"
        }
      },
      "Disc, 18mm x 6mm, Fluorescent": {
        "Sizeless": {
          "Blue": "Disc, 18mm x 6mm, Fluorescent Blue",
          "Green": "Disc, 18mm x 6mm, Fluorescent Green",
          "Orange": "Disc, 18mm x 6mm, Fluorescent Orange",
          "Red": "Disc, 18mm x 6mm, Fluorescent Red",
          "Yellow": "Disc, 18mm x 6mm, Fluorescent Yellow"
        }
      },
      "Disc, 18mm x 6mm, Transparent": {
        "Sizeless": {
          "Blue": "Disc, 18mm x 6mm, Transparent, Blue",
          "Green": "Disc, 18mm x 6mm, Transparent, Green",
          "Gray": "Disc, 18mm x 6mm, Transparent, Gray",
          "Orange": "Disc, 18mm x 6mm, Transparent, Orange",
          "Purple": "Disc, 18mm x 6mm, Transparent, Purple",
          "Red": "Disc, 18mm x 6mm, Transparent, Red",
          "Yellow": "Disc, 18mm x 6mm, Transparent, Yellow"
        }
      },
      "Disc, 20mm x 5mm, Pastel": {
        "Sizeless": {
          "Blue": "Disc, 20mm x 5mm, Pastel Blue",
          "Orange": "Disc, 20mm x 5mm, Pastel Orange",
          "Purple": "Disc, 20mm x 5mm, Pastel Purple",
          "Pink": "Disc, 20mm x 5mm, Pastel Pink"
        }
      },
      "Disc, 25mm x 3mm, Clear": {
        "Sizeless": {
          "Colorless": "Disc, 25mm x 3mm, Clear"
        }
      },
      "Disc, 25mm x 3mm, Fluorescent": {
        "Sizeless": {
          "Blue": "Disc, 25mm x 3mm, Fluorescent Blue",
          "Green": "Disc, 25mm x 3mm, Fluorescent Green",
          "Orange": "Disc, 25mm x 3mm, Fluorescent Orange",
          "Red": "Disc, 25mm x 3mm, Fluorescent Red",
          "Yellow": "Disc, 25mm x 3mm, Fluorescent Yellow"
        }
      },
      "Disc, 25mm x 3mm, Transparent": {
        "Sizeless": {
          "Blue": "Disc, 25mm x 3mm, Transparent, Blue",
          "Green": "Disc, 25mm x 3mm, Transparent, Green",
          "Gray": "Disc, 25mm x 3mm, Transparent, Gray",
          "Orange": "Disc, 25mm x 3mm, Transparent, Orange",
          "Red": "Disc, 25mm x 3mm, Transparent, Red",
          "Purple": "Disc, 25mm x 3mm, Transparent, Purple",
          "Yellow": "Disc, 25mm x 3mm, Transparent, Yellow"
        }
      },
      "Disc, 25mm x 6mm, Clear": {
        "Sizeless": {
          "Colorless": "Disc, 25mm x 6mm, Clear"
        }
      },
      "Disc, 25mm x 6mm, Fluorescent": {
        "Sizeless": {
          "Blue": "Disc, 25mm x 6mm, Fluorescent Blue",
          "Green": "Disc, 25mm x 6mm, Fluorescent Green",
          "Orange": "Disc, 25mm x 6mm, Fluorescent Orange",
          "Red": "Disc, 25mm x 6mm, Fluorescent Red",
          "Yellow": "Disc, 25mm x 6mm, Fluorescent Yellow"
        }
      },
      "Disc, 25mm x 6mm, Transparent": {
        "Sizeless": {
          "Blue": "Disc, 25mm x 6mm, Transparent, Blue",
          "Green": "Disc, 25mm x 6mm, Transparent, Green",
          "Gray": "Disc, 25mm x 6mm, Transparent, Gray",
          "Orange": "Disc, 25mm x 6mm, Transparent, Orange",
          "Purple": "Disc, 25mm x 6mm, Transparent, Purple",
          "Red": "Disc, 25mm x 6mm, Transparent, Red",
          "Yellow": "Disc, 25mm x 6mm, Transparent, Yellow"
        }
      },
      "Disc, 30mm x 5mm": {
        "Sizeless": {
          "Blue": "Disc, 30mm x 5mm, Blue"
        }
      },
      "Game Designer’s Ruler": {
        "Sizeless": {
          "Colorless": "Game Designer’s Ruler"
        }
      },
      "Pizza Disc": {
        "Sizeless": {
          "Yellow": "Pizza Disc, Yellow"
        }
      },
      "Wink": {
        "20mm": {
          "Black": "Wink, 20mm, Black"
        }
      },
      "Wink, Opaque": {
        "20mm": {
          "White": "Wink, 20mm, Opaque, White"
        },
        "22mm": {
          "Black": "Wink, 22mm, Opaque, Black",
          "White": "Wink, 22mm, Opaque, White"
        }
      },
      "Wink, Translucent": {
        "20mm": {
          "Blue": "Wink, 20mm, Translucent, Blue",
          "Green": "Wink, 20mm, Translucent, Green"
        },
        "22mm": {
          "Black": "Wink, 22mm, Translucent Black",
          "Blue": "Wink, 22mm, Translucent Blue",
          "Green": "Wink, 22mm, Translucent Green",
          "Orange": "Wink, 22mm, Translucent Orange",
          "Purple": "Wink, 22mm, Translucent Purple",
          "Red": "Wink, 22mm, Translucent Red",
          "Yellow": "Wink, 22mm, Translucent, Yellow"
        }
      }
    },
    "blank": {
      "Blank Board, Accordion": {
        "Sizeless": {
          "Colorless": "Blank Board, Accordion"
        }
      },
      "Blank Board, Bi-Fold": {
        "Sizeless": {
          "Colorless": "Blank Board, Bi-Fold"
        }
      },
      "Blank Board, Domino": {
        "Sizeless": {
          "Colorless": "Blank Board, Domino"
        }
      },
      "Blank Board, Half": {
        "Sizeless": {
          "Colorless": "Blank Board, Half"
        }
      },
      "Blank Board, Six-Fold": {
        "Medium": {
          "Colorless": "Blank Board, Medium, Six-Fold"
        },
        "Sizeless": {
          "Colorless": "Blank Board, Six-Fold"
        }
      },
      "Blank Board, Quad-Fold, 18 inch": {
        "Sizeless": {
          "Colorless": "Blank Board, Quad-Fold, 18 inch"
        }
      },
      "Blank Board, Skinny": {
        "Sizeless": {
          "Colorless": "Blank Board, Skinny"
        }
      },
      "Blank Board, Sliver": {
        "Sizeless": {
          "Colorless": "Blank Board, Sliver"
        }
      },
      "Blank Board, Square": {
        "Sizeless": {
          "Colorless": "Blank Board, Square"
        },
        "Large": {
          "Colorless": "Blank Board, Square, Large"
        },
        "Small": {
          "Colorless": "Blank Board, Square, Small"
        }
      },
      "Blank Board, Strip": {
        "Sizeless": {
          "Colorless": "Blank Board, Strip"
        }
      },
      "Blank Box, Hook, Bridge (108)": {
        "108": {
          "Colorless": "Blank Box, Hook, Bridge (108)"
        }
      },
      "Blank Box, Hook, Bridge (54)": {
        "54": {
          "Colorless": "Blank Box, Hook, Bridge (54)"
        }
      },
      "Blank Box, Hook, Jumbo (36)": {
        "36": {
          "Colorless": "Blank Box, Hook, Jumbo (36)"
        }
      },
      "Blank Box, Hook, Jumbo (90)": {
        "90": {
          "Colorless": "Blank Box, Hook, Jumbo (90)"
        }
      },
      "Blank Box, Hook, Poker (108)": {
        "108": {
          "Colorless": "Blank Box, Hook, Poker (108)"
        }
      },
      "Blank Box, Hook, Poker (18)": {
        "18": {
          "Colorless": "Blank Box, Hook, Poker (18)"
        }
      },
      "Blank Box, Hook, Poker (36)": {
        "36": {
          "Colorless": "Blank Box, Hook, Poker (36)"
        }
      },
      "Blank Box, Hook, Poker (54)": {
        "54": {
          "Colorless": "Blank Box, Hook, Poker (54)"
        }
      },
      "Blank Box, Hook, Poker (72)": {
        "72": {
          "Colorless": "Blank Box, Hook, Poker (72)"
        }
      },
      "Blank Box, Hook, Poker (90)": {
        "90": {
          "Colorless": "Blank Box, Hook, Poker (90)"
        }
      },
      "Blank Box, Hook, Square (48)": {
        "48": {
          "Colorless": "Blank Box, Hook, Square (48)"
        }
      },
      "Blank Box, Hook, Square (96)": {
        "96": {
          "Colorless": "Blank Box, Hook, Square (96)"
        }
      },
      "Blank Box, Hook, Tarot (40)": {
        "40": {
          "Colorless": "Blank Box, Hook, Tarot (40)"
        }
      },
      "Blank Box, Hook, Tarot (90)": {
        "90": {
          "Colorless": "Blank Box, Hook, Tarot (90)"
        }
      },
      "Blank Box, Pro": {
        "Medium": {
          "Colorless": "Blank Box, Pro, Medium"
        },
        "Small": {
          "Colorless": "Blank Box, Pro, Small"
        }
      },
      "Blank Box, Prototype": {
        "Large": {
          "Colorless": "Blank Box, Prototype, Large"
        },
        "Medium": {
          "Colorless": "Blank Box, Prototype, Medium"
        },
        "Small": {
          "Colorless": "Blank Box, Prototype, Small"
        }
      },
      "Blank Box, Retail": {
        "Large": {
          "Colorless": "Blank Box, Retail, Large"
        }
      },
      "Blank Box, Tuck, Bridge (108)": {
        "108": {
          "Colorless": "Blank Box, Tuck, Bridge (108)"
        }
      },
      "Blank Box, Tuck, Bridge (54)": {
        "54": {
          "Colorless": "Blank Box, Tuck, Bridge (54)"
        }
      },
      "Blank Box, Tuck, Jumbo (90)": {
        "90": {
          "Colorless": "Blank Box, Tuck, Jumbo (90)"
        }
      },
      "Blank Box, Tuck, Poker (108)": {
        "108": {
          "Colorless": "Blank Box, Tuck, Poker (108)"
        }
      },
      "Blank Box, Tuck, Poker (36)": {
        "36": {
          "Colorless": "Blank Box, Tuck, Poker (36)"
        }
      },
      "Blank Box, Tuck, Poker (54)": {
        "54": {
          "Colorless": "Blank Box, Tuck, Poker (54)"
        }
      },
      "Blank Box, Tuck, Poker (72)": {
        "72": {
          "Colorless": "Blank Box, Tuck, Poker (72)"
        }
      },
      "Blank Box, Tuck, Poker (90)": {
        "90": {
          "Colorless": "Blank Box, Tuck, Poker (90)"
        }
      },
      "Blank Box, Tuck, Square (48)": {
        "48": {
          "Colorless": "Blank Box, Tuck, Square (48)"
        }
      },
      "Blank Box, Tuck, Square (96)": {
        "96": {
          "Colorless": "Blank Box, Tuck, Square (96)"
        }
      },
      "Blank Box, Tuck, Tarot (40)": {
        "40": {
          "Colorless": "Blank Box, Tuck, Tarot (40)"
        }
      },
      "Blank Box, Tuck, Tarot (90)": {
        "90": {
          "Colorless": "Blank Box, Tuck, Tarot (90)"
        }
      },
      "Blank Bridge Card": {
        "Sizeless": {
          "Colorless": "Blank Bridge Card"
        }
      },
      "Blank Business Card": {
        "Sizeless": {
          "Colorless": "Blank Business Card"
        }
      },
      "Blank Chit, Arrow": {
        "Sizeless": {
          "Colorless": "Blank Chit, Arrow"
        }
      },
      "Blank Chit, Bullseye": {
        "Sizeless": {
          "Colorless": "Blank Chit, Bullseye"
        }
      },
      "Blank Chit, Circle": {
        "Large": {
          "Colorless": "Blank Chit, Circle, Large"
        },
        "Medium": {
          "Colorless": "Blank Chit, Circle, Medium"
        },
        "Small": {
          "Colorless": "Blank Chit, Circle, Small"
        }
      },
      "Blank Chit, Domino": {
        "Sizeless": {
          "Colorless": "Blank Chit, Domino"
        }
      },
      "Blank Chit, Square": {
        "Large": {
          "Colorless": "Blank Chit, Square, Large"
        },
        "Medium": {
          "Colorless": "Blank Chit, Square, Medium"
        },
        "Small": {
          "Colorless": "Blank Chit, Square, Small"
        }
      },
      "Blank Chit, Triangle": {
        "Medium": {
          "Colorless": "Blank Chit, Triangle, Medium"
        }
      },
      "Blank Circle Card": {
        "Sizeless": {
          "Colorless": "Blank Circle Card"
        }
      },
      "Blank Circle Shard": {
        "Sizeless": {
          "Colorless": "Blank Circle Shard"
        }
      },
      "Blank Clear Euro Poker Card": {
        "Sizeless": {
          "Colorless": "Blank Clear Euro Poker Card"
        }
      },
      "Blank Divider Card": {
        "Sizeless": {
          "Colorless": "Blank Divider Card"
        }
      },
      "Blank Document": {
        "Sizeless": {
          "Colorless": "Blank Document"
        }
      },
      "Blank Domino Card": {
        "Sizeless": {
          "Colorless": "Blank Domino Card"
        }
      },
      "Blank Dual Dial": {
        "Sizeless": {
          "Colorless": "Blank Dual Dial"
        }
      },
      "Blank Euro Poker": {
        "Sizeless": {
          "Colorless": "Blank Euro Poker"
        }
      },
      "Blank Euro Square Card": {
        "Sizeless": {
          "Colorless": "Blank Euro Square Card"
        }
      },
      "Blank Foil Poker Card": {
        "Sizeless": {
          "Colorless": "Blank Foil Poker Card"
        }
      },
      "Blank Foil Tarot Card": {
        "Sizeless": {
          "Colorless": "Blank Foil Tarot Card"
        }
      },
      "Blank Folio, Bridge": {
        "Sizeless": {
          "Colorless": "Blank Folio, Bridge"
        }
      },
      "Blank Folio": {
        "Medium": {
          "Colorless": "Blank Folio, Medium"
        },
        "Small": {
          "Colorless": "Blank Folio, Small"
        }
      },
      "Blank Folio, Mint Tin": {
        "Sizeless": {
          "Colorless": "Blank Folio, Mint Tin"
        }
      },
      "Blank Folio, Poker": {
        "Sizeless": {
          "Colorless": "Blank Folio, Poker"
        }
      },
      "Blank Folio, Square": {
        "Sizeless": {
          "Colorless": "Blank Folio, Square"
        }
      },
      "Blank Folio, Tarot": {
        "Sizeless": {
          "Colorless": "Blank Folio, Tarot"
        }
      },
      "Blank Hex Card": {
        "Sizeless": {
          "Colorless": "Blank Hex Card"
        }
      },
      "Blank Hex Shard": {
        "Sizeless": {
          "Colorless": "Blank Hex Shard"
        }
      },
      "Blank Jumbo Card": {
        "Sizeless": {
          "Colorless": "Blank Jumbo Card"
        }
      },
      "Blank Mat, Big": {
        "Sizeless": {
          "Colorless": "Blank Mat, Big"
        }
      },
      "Blank Mat, Domino": {
        "Sizeless": {
          "Colorless": "Blank Mat, Domino"
        }
      },
      "Blank Mat, Flower": {
        "Sizeless": {
          "Colorless": "Blank Mat, Flower"
        }
      },
      "Blank Mat, Half": {
        "Sizeless": {
          "Colorless": "Blank Mat, Half"
        }
      },
      "Blank Mat, Hex": {
        "Sizeless": {
          "Colorless": "Blank Mat, Hex"
        },
        "Large": {
          "Colorless": "Blank Mat, Hex, Large"
        }
      },
      "Blank Mat, Invader": {
        "Sizeless": {
          "Colorless": "Blank Mat, Invader"
        }
      },
      "Blank Mat, Postcard": {
        "Sizeless": {
          "Colorless": "Blank Mat, Postcard"
        }
      },
      "Blank Mat, Quarter": {
        "Sizeless": {
          "Colorless": "Blank Mat, Quarter"
        }
      },
      "Blank Mat, Skinny": {
        "Sizeless": {
          "Colorless": "Blank Mat, Skinny"
        }
      },
      "Blank Mat, Sliver": {
        "Sizeless": {
          "Colorless": "Blank Mat, Sliver"
        }
      },
      "Blank Mat, Small Bi-fold": {
        "Sizeless": {
          "Colorless": "Blank Mat, Small Bi-fold"
        }
      },
      "Blank Mat, Spinner": {
        "Sizeless": {
          "Colorless": "Blank Mat, Spinner"
        }
      },
      "Blank Mat, Square": {
        "Sizeless": {
          "Colorless": "Blank Mat, Square"
        },
        "Large": {
          "Colorless": "Blank Mat, Square, Large"
        },
        "Small": {
          "Colorless": "Blank Mat, Square, Small"
        }
      },
      "Blank Mat, Strip": {
        "Sizeless": {
          "Colorless": "Blank Mat, Strip"
        }
      },
      "Blank Micro Card (slug)": {
        "Sizeless": {
          "Colorless": "Blank Micro Card (slug)"
        }
      },
      "Blank Mini Card": {
        "Sizeless": {
          "Colorless": "Blank Mini Card"
        }
      },
      "Blank Mint Tin Accordion (4 Panel)": {
        "Sizeless": {
          "Colorless": "Blank Mint Tin Accordion (4 Panel)"
        }
      },
      "Blank Mint Tin Accordion (6 Panel)": {
        "Sizeless": {
          "Colorless": "Blank Mint Tin Accordion (6 Panel)"
        }
      },
      "Blank Mint Tin Accordion (8 Panel)": {
        "Sizeless": {
          "Colorless": "Blank Mint Tin Accordion (8 Panel)"
        }
      },
      "Blank Mint Tin Card": {
        "Sizeless": {
          "Colorless": "Blank Mint Tin Card"
        }
      },
      "Blank Poker Card": {
        "Sizeless": {
          "Colorless": "Blank Poker Card"
        }
      },
      "Blank Ring": {
        "Large": {
          "Colorless": "Blank Ring, Large"
        },
        "Medium": {
          "Colorless": "Blank Ring, Medium"
        },
        "Small": {
          "Colorless": "Blank Ring, Small"
        }
      },
      "Blank Screen": {
        "Large": {
          "Colorless": "Blank Screen, Large"
        },
        "Medium": {
          "Colorless": "Blank Screen, Medium"
        },
        "Small": {
          "Colorless": "Blank Screen, Small"
        }
      },
      "Blank Small Dial": {
        "Sizeless": {
          "Colorless": "Blank Small Dial"
        }
      },
      "Blank Small Pro Tarot Insert": {
        "Sizeless": {
          "Colorless": "Blank Small Pro Tarot Insert"
        }
      },
      "Blank Small Square Card": {
        "Sizeless": {
          "Colorless": "Blank Small Square Card"
        }
      },
      "Blank Small Stout Tarot Insert": {
        "Sizeless": {
          "Colorless": "Blank Small Stout Tarot Insert"
        }
      },
      "Blank Square Card": {
        "Sizeless": {
          "Colorless": "Blank Square Card"
        }
      },
      "Blank Square Shard": {
        "Sizeless": {
          "Colorless": "Blank Square Shard"
        }
      },
      "Blank Standee": {
        "Large": {
          "Colorless": "Blank Standee, Large"
        },
        "Medium": {
          "Colorless": "Blank Standee, Medium"
        },
        "Small": {
          "Colorless": "Blank Standee, Small"
        }
      },
      "Blank Stickers, Meeple": {
        "Sizeless": {
          "Colorless": "Blank Stickers, Meeple"
        }
      },
      "Blank Stickers, Pawn": {
        "Sizeless": {
          "Colorless": "Blank Stickers, Pawn"
        }
      },
      "Blank Stickers, Sheet, Dice": {
        "Sizeless": {
          "Colorless": "Blank Stickers, Sheet, Dice"
        }
      },
      "Blank Stickers, Sheet, Token": {
        "Sizeless": {
          "Colorless": "Blank Stickers, Sheet, Token"
        }
      },
      "Blank Tarot Card": {
        "Sizeless": {
          "Colorless": "Blank Tarot Card"
        }
      },
      "Blank Tile, Circle, Mini": {
        "Sizeless": {
          "Colorless": "Blank Tile, Circle, Mini"
        }
      },
      "Blank Tile, Domino": {
        "Sizeless": {
          "Colorless": "Blank Tile, Domino"
        }
      },
      "Blank Tile, Hex": {
        "Large": {
          "Colorless": "Blank Tile, Hex, Large"
        },
        "Medium": {
          "Colorless": "Blank Tile, Hex, Medium"
        },
        "Small": {
          "Colorless": "Blank Tile, Hex, Small"
        }
      },
      "Blank Tile, Hex, Mini": {
        "Sizeless": {
          "Colorless": "Blank Tile, Hex, Mini"
        }
      },
      "Blank Tile, Square": {
        "Large": {
          "Colorless": "Blank Tile, Square, Large"
        },
        "Medium": {
          "Colorless": "Blank Tile, Square, Medium"
        },
        "Small": {
          "Colorless": "Blank Tile, Square, Small"
        }
      },
      "Blank Tile, Square, Mini": {
        "Sizeless": {
          "Colorless": "Blank Tile, Square, Mini"
        }
      },
      "Blank Tile, Triangle": {
        "Sizeless": {
          "Colorless": "Blank Tile, Triangle"
        }
      },
      "Blank Tombstone Shard": {
        "Sizeless": {
          "Colorless": "Blank Tombstone Shard"
        }
      },
      "Blank US Game Card": {
        "Sizeless": {
          "Colorless": "Blank US Game Card"
        }
      },
      "Blank US Game Mat": {
        "Sizeless": {
          "Colorless": "Blank US Game Mat"
        }
      },
      "Blank Large Stout Box": {
        "Sizeless": {
          "Colorless": "Blank Large Stout Box"
        }
      },
      "Medium Stout Box, Blank": {
        "Medium": {
          "Colorless": "Medium Stout Box, Blank"
        }
      },
      "Blank Small Stout Box": {
        "Sizeless": {
          "Colorless": "Blank Small Stout Box"
        }
      },
      "Snaplock Box, Micro": {
        "Sizeless": {
          "Colorless": "Snaplock Box, Micro"
        }
      },
      "Snaplock Box, Mini": {
        "Sizeless": {
          "Colorless": "Snaplock Box, Mini"
        }
      },
      "Snaplock Box, Organizer": {
        "Sizeless": {
          "Colorless": "Snaplock Box, Organizer"
        }
      },
      "Snaplock Box, Poker, 100+ Card": {
        "Sizeless": {
          "Colorless": "Snaplock Box, Poker, 100+ Card"
        }
      },
      "Blank Euro Poker Card": {
        "Sizeless": {
          "Colorless": "Blank Euro Poker Card"
        }
      },
      "Blank VHS Box": {
        "Sizeless": {
          "Colorless": "Blank VHS Box"
        }
      },
      "Large Quad Fold Game Board": {
        "Large": {
          "Colorless": "Large Quad Fold Game Board"
        }
      }
    },
    "building": {
      "Victorian Miniature": {
        "Sizeless": {
          "Yellow": "Victorian Miniature, Yellow",
          "Blue": "Victorian Miniature, Blue",
          "Green": "Victorian Miniature, Green",
          "Red": "Victorian Miniature, Red"
        }
      },
      "House, Wood": {
        "Sizeless": {
          "Black": "House, Wood, Black",
          "Blue": "House, Wood, Blue",
          "Green": "House, Wood, Green",
          "Orange": "House, Wood, Orange",
          "White": "House, Wood, White",
          "Red": "House, Wood, Red",
          "Purple": "House, Wood, Purple",
          "Yellow": "House, Wood, Yellow"
        }
      },
      "Building": {
        "Small": {
          "Black": "Building, Small, Black",
          "Blue": "Building, Small, Blue",
          "Green": "Building, Small, Green",
          "Orange": "Building, Small, Orange",
          "Purple": "Building, Small, Purple",
          "Red": "Building, Small, Red",
          "White": "Building, Small, White",
          "Yellow": "Building, Small, Yellow"
        }
      },
      "Building, Side Door": {
        "Small": {
          "Black": "Building, Small, Side Door, Black",
          "Blue": "Building, Small, Side Door, Blue",
          "Green": "Building, Small, Side Door, Green",
          "Orange": "Building, Small, Side Door, Orange",
          "Purple": "Building, Small, Side Door, Purple",
          "Red": "Building, Small, Side Door, Red",
          "White": "Building, Small, Side Door, White",
          "Yellow": "Building, Small, Side Door, Yellow"
        }
      },
      "Business Miniature": {
        "Sizeless": {
          "Blue": "Business Miniature, Blue",
          "Green": "Business Miniature, Green",
          "Red": "Business Miniature, Red",
          "Yellow": "Business Miniature, Yellow"
        }
      },
      "Card Connector, 120-degree": {
        "Sizeless": {
          "Black": "Card Connector, 120-degree, Black",
          "Blue": "Card Connector, 120-degree, Blue",
          "Green": "Card Connector, 120-degree, Green",
          "Orange": "Card Connector, 120-degree, Orange",
          "Purple": "Card Connector, 120-degree, Purple",
          "Red": "Card Connector, 120-degree, Red",
          "White": "Card Connector, 120-degree, White",
          "Yellow": "Card Connector, 120-degree, Yellow"
        }
      },
      "Card Connector, 90-degree": {
        "Sizeless": {
          "Black": "Card Connector, 90-degree, Black",
          "Blue": "Card Connector, 90-degree, Blue",
          "Green": "Card Connector, 90-degree, Green",
          "Orange": "Card Connector, 90-degree, Orange",
          "Purple": "Card Connector, 90-degree, Purple",
          "Red": "Card Connector, 90-degree, Red",
          "White": "Card Connector, 90-degree, White",
          "Yellow": "Card Connector, 90-degree, Yellow"
        }
      },
      "Castle Room, Catwalks": {
        "Sizeless": {
          "Colorless": "Castle Room, Catwalks"
        }
      },
      "Castle Room, Chambers": {
        "Sizeless": {
          "Colorless": "Castle Room, Chambers"
        }
      },
      "Castle Room, Outpost": {
        "Sizeless": {
          "Colorless": "Castle Room, Outpost"
        }
      },
      "Castle Room, Sanctuary": {
        "Sizeless": {
          "Colorless": "Castle Room, Sanctuary"
        }
      },
      "Castle Room, Tower": {
        "Sizeless": {
          "Colorless": "Castle Room, Tower"
        }
      },
      "Castle Room, Veranda": {
        "Sizeless": {
          "Colorless": "Castle Room, Veranda"
        }
      },
      "Castle Tower": {
        "Sizeless": {
          "Colorless": "Castle Tower"
        }
      },
      "Castle": {
        "Sizeless": {
          "Black": "Castle, Black",
          "Blue": "Castle, Blue",
          "Green": "Castle, Green",
          "Orange": "Castle, Orange",
          "Purple": "Castle, Purple",
          "Red": "Castle, Red",
          "White": "Castle, White",
          "Yellow": "Castle, Yellow"
        }
      },
      "Cathedral": {
        "Sizeless": {
          "Black": "Cathedral, Black",
          "Blue": "Cathedral, Blue",
          "Green": "Cathedral, Green",
          "Orange": "Cathedral, Orange",
          "Purple": "Cathedral, Purple",
          "Red": "Cathedral, Red",
          "White": "Cathedral, White",
          "Yellow": "Cathedral, Yellow"
        }
      },
      "Church, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "Church, Acrylic, Opaque, Black",
          "Gold": "Church, Acrylic, Opaque, Gold",
          "Silver": "Church, Acrylic, Opaque, Silver",
          "White": "Church, Acrylic, Opaque, White"
        }
      },
      "Church, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "Church, Acrylic, Transparent, Black",
          "Blue": "Church, Acrylic, Transparent, Blue",
          "Green": "Church, Acrylic, Transparent, Green",
          "Orange": "Church, Acrylic, Transparent, Orange",
          "Purple": "Church, Acrylic, Transparent, Purple",
          "Red": "Church, Acrylic, Transparent, Red",
          "White": "Church, Acrylic, Transparent, White",
          "Yellow": "Church, Acrylic, Transparent, Yellow"
        }
      },
      "Church, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Church, Acrylic, Transparent, Clear"
        }
      },
      "Church, Plastic": {
        "Sizeless": {
          "Blue": "Church, Plastic, Blue",
          "Orange": "Church, Plastic, Orange",
          "Red": "Church, Plastic, Red"
        }
      },
      "Church, Plastic,White": {
        "Sizeless": {
          "Colorless": "Church, Plastic,White"
        }
      },
      "Church, Wood": {
        "Sizeless": {
          "Black": "Church, Wood, Black",
          "Blue": "Church, Wood, Blue",
          "Green": "Church, Wood, Green",
          "Orange": "Church, Wood, Orange",
          "Purple": "Church, Wood, Purple",
          "Red": "Church, Wood, Red",
          "White": "Church, Wood, White",
          "Yellow": "Church, Wood, Yellow"
        }
      },
      "Command Center": {
        "Sizeless": {
          "Black": "Command Center, Black",
          "Blue": "Command Center, Blue",
          "Green": "Command Center, Green",
          "Orange": "Command Center, Orange",
          "Purple": "Command Center, Purple",
          "Red": "Command Center, Red",
          "White": "Command Center, White",
          "Yellow": "Command Center, Yellow"
        }
      },
      "Donjon Pagoda": {
        "Sizeless": {
          "Black": "Donjon Pagoda, Black",
          "Blue": "Donjon Pagoda, Blue",
          "Green": "Donjon Pagoda, Green",
          "Orange": "Donjon Pagoda, Orange",
          "Purple": "Donjon Pagoda, Purple",
          "Red": "Donjon Pagoda, Red",
          "White": "Donjon Pagoda, White",
          "Yellow": "Donjon Pagoda, Yellow"
        }
      },
      "Future Dome": {
        "Sizeless": {
          "Blue": "Future Dome, Blue",
          "Green": "Future Dome, Green",
          "Orange": "Future Dome, Orange",
          "Purple": "Future Dome, Purple",
          "Red": "Future Dome, Red",
          "Yellow": "Future Dome, Yellow"
        }
      },
      "Future Pyramid": {
        "Sizeless": {
          "Green": "Future Pyramid, Green",
          "Orange": "Future Pyramid, Orange",
          "Purple": "Future Pyramid, Purple",
          "Red": "Future Pyramid, Red",
          "Yellow": "Future Pyramid, Yellow"
        }
      },
      "Handmade Brick": {
        "Sizeless": {
          "Colorless": "Handmade Brick"
        }
      },
      "Harbor": {
        "Sizeless": {
          "Black": "Harbor, Black",
          "Blue": "Harbor, Blue",
          "Green": "Harbor, Green",
          "Orange": "Harbor, Orange",
          "Purple": "Harbor, Purple",
          "Red": "Harbor, Red",
          "White": "Harbor, White",
          "Yellow": "Harbor, Yellow"
        }
      },
      "Henhouse": {
        "Sizeless": {
          "Black": "Henhouse, Black",
          "Blue": "Henhouse, Blue",
          "Green": "Henhouse, Green",
          "Orange": "Henhouse, Orange",
          "Purple": "Henhouse, Purple",
          "Red": "Henhouse, Red",
          "White": "Henhouse, White",
          "Yellow": "Henhouse, Yellow"
        }
      },
      "Hinged Stone Door": {
        "Sizeless": {
          "Blue": "Hinged Stone Door, Blue",
          "Bronze": "Hinged Stone Door, Bronze",
          "Green": "Hinged Stone Door, Green",
          "Gray": "Hinged Stone Door, Gray",
          "Red": "Hinged Stone Door, Red"
        }
      },
      "Hotel": {
        "Sizeless": {
          "Black": "Hotel, Black",
          "Blue": "Hotel, Blue",
          "Green": "Hotel, Green",
          "Orange": "Hotel, Orange",
          "Purple": "Hotel, Purple",
          "Red": "Hotel, Red",
          "White": "Hotel, White",
          "Yellow": "Hotel, Yellow"
        }
      },
      "House, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "House, Acrylic, Opaque, Black",
          "Gold": "House, Acrylic, Opaque, Gold",
          "Silver": "House, Acrylic, Opaque, Silver",
          "White": "House, Acrylic, Opaque, White"
        }
      },
      "House, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "House, Acrylic, Transparent, Black",
          "Blue": "House, Acrylic, Transparent, Blue",
          "Green": "House, Acrylic, Transparent, Green",
          "Orange": "House, Acrylic, Transparent, Orange",
          "Purple": "House, Acrylic, Transparent, Purple",
          "Red": "House, Acrylic, Transparent, Red",
          "Yellow": "House, Acrylic, Transparent, Yellow"
        }
      },
      "House, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "House, Acrylic, Transparent, Clear"
        }
      },
      "House": {
        "Sizeless": {
          "Black": "House, Black",
          "Blue": "House, Blue",
          "Green": "House, Green",
          "Orange": "House, Orange",
          "Purple": "House, Purple",
          "Red": "House, Red",
          "White": "House, White",
          "Yellow": "House, Yellow"
        }
      },
      "House, Wood, Natural": {
        "Sizeless": {
          "Colorless": "House, Wood, Natural"
        }
      },
      "Hut": {
        "Large": {
          "Colorless": "Hut, Large"
        },
        "Small": {
          "Colorless": "Hut, Small"
        }
      },
      "Laboratory": {
        "Sizeless": {
          "Black": "Laboratory, Black",
          "Blue": "Laboratory, Blue",
          "Green": "Laboratory, Green",
          "Orange": "Laboratory, Orange",
          "Purple": "Laboratory, Purple",
          "Red": "Laboratory, Red",
          "White": "Laboratory, White",
          "Yellow": "Laboratory, Yellow"
        }
      },
      "Marketplace": {
        "Sizeless": {
          "Black": "Marketplace, Black",
          "Blue": "Marketplace, Blue",
          "Green": "Marketplace, Green",
          "Orange": "Marketplace, Orange",
          "Purple": "Marketplace, Purple",
          "Red": "Marketplace, Red",
          "White": "Marketplace, White",
          "Yellow": "Marketplace, Yellow"
        }
      },
      "Mine": {
        "Sizeless": {
          "Black": "Mine, Black",
          "Blue": "Mine, Blue",
          "Green": "Mine, Green",
          "Orange": "Mine, Orange",
          "Purple": "Mine, Purple",
          "Red": "Mine, Red",
          "White": "Mine, White",
          "Yellow": "Mine, Yellow"
        }
      },
      "Observatory": {
        "Sizeless": {
          "Black": "Observatory, Black",
          "Blue": "Observatory, Blue",
          "Green": "Observatory, Green",
          "Orange": "Observatory, Orange",
          "Purple": "Observatory, Purple",
          "Red": "Observatory, Red",
          "White": "Observatory, White",
          "Yellow": "Observatory, Yellow"
        }
      },
      "Plastic Castle": {
        "Sizeless": {
          "Red": "Plastic Castle, Red"
        }
      },
      "Premium Brick": {
        "Sizeless": {
          "Colorless": "Premium Brick"
        }
      },
      "Pyramid": {
        "Sizeless": {
          "Black": "Pyramid, Black",
          "Blue": "Pyramid, Blue",
          "Purple": "Pyramid, Purple",
          "Red": "Pyramid, Red",
          "White": "Pyramid, White",
          "Yellow": "Pyramid, Yellow"
        }
      },
      "Taj Mahal Palace, Set of 5": {
        "5": {
          "Colorless": "Taj Mahal Palace, Set of 5"
        }
      },
      "Tower Stacker": {
        "Sizeless": {
          "Black": "Tower Stacker, Black",
          "Blue": "Tower Stacker, Blue",
          "Green": "Tower Stacker, Green",
          "Orange": "Tower Stacker, Orange",
          "Purple": "Tower Stacker, Purple",
          "Red": "Tower Stacker, Red",
          "White": "Tower Stacker, White",
          "Yellow": "Tower Stacker, Yellow"
        }
      },
      "Trellis of Grapes": {
        "Sizeless": {
          "Blue": "Trellis of Grapes, Blue",
          "Green": "Trellis of Grapes, Green",
          "Orange": "Trellis of Grapes, Orange",
          "White": "Trellis of Grapes, White"
        }
      },
      "Water Mill": {
        "Sizeless": {
          "Black": "Water Mill, Black",
          "Blue": "Water Mill, Blue",
          "Green": "Water Mill, Green",
          "Orange": "Water Mill, Orange",
          "Purple": "Water Mill, Purple",
          "Red": "Water Mill, Red",
          "White": "Water Mill, White",
          "Yellow": "Water Mill, Yellow"
        }
      },
      "Windmill": {
        "Sizeless": {
          "Black": "Windmill, Black",
          "Blue": "Windmill, Blue",
          "Green": "Windmill, Green",
          "Orange": "Windmill, Orange",
          "Purple": "Windmill, Purple",
          "Red": "Windmill, Red",
          "White": "Windmill, White",
          "Yellow": "Windmill, Yellow"
        }
      },
      "Wood Cabin": {
        "Sizeless": {
          "Brown": "Wood Cabin, Brown"
        }
      },
      "Skyscraper": {
        "Sizeless": {
          "Black": "Skyscraper, Black",
          "Blue": "Skyscraper, Blue",
          "Green": "Skyscraper, Green",
          "Orange": "Skyscraper, Orange",
          "Purple": "Skyscraper, Purple",
          "Red": "Skyscraper, Red",
          "White": "Skyscraper, White",
          "Yellow": "Skyscraper, Yellow"
        }
      }
    },
    "meeple": {
      "Armored Guard": {
        "Sizeless": {
          "Colorless": "Armored Guard"
        }
      },
      "Aztec - Character Meeple": {
        "Sizeless": {
          "Colorless": "Aztec - Character Meeple"
        }
      },
      "Big People": {
        "Sizeless": {
          "Blue": "Big People, Blue"
        }
      },
      "Bust, Wood": {
        "Sizeless": {
          "Blue": "Bust, Wood, Blue",
          "Green": "Bust, Wood, Green"
        }
      },
      "Bust, Wood, Collared": {
        "Sizeless": {
          "Blue": "Bust, Wood, Collared, Blue",
          "Green": "Bust, Wood, Collared, Green"
        }
      },
      "Cleric - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cleric - Character Meeple"
        }
      },
      "Cowboy, Black - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Black - Character Meeple"
        }
      },
      "Cowboy, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Blue - Character Meeple"
        }
      },
      "Cowboy, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Green - Character Meeple"
        }
      },
      "Cowboy, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Orange - Character Meeple"
        }
      },
      "Cowboy, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Purple - Character Meeple"
        }
      },
      "Cowboy, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Red - Character Meeple"
        }
      },
      "Cowboy, White - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, White - Character Meeple"
        }
      },
      "Cowboy, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Cowboy, Yellow - Character Meeple"
        }
      },
      "Doctor - Character Meeple": {
        "Sizeless": {
          "Colorless": "Doctor - Character Meeple"
        }
      },
      "Dwarf, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Dwarf, Blue - Character Meeple"
        }
      },
      "Dwarf, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Dwarf, Green - Character Meeple"
        }
      },
      "Dwarf, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Dwarf, Orange - Character Meeple"
        }
      },
      "Dwarf, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Dwarf, Purple - Character Meeple"
        }
      },
      "Dwarf, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Dwarf, Red - Character Meeple"
        }
      },
      "Dwarf, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Dwarf, Yellow - Character Meeple"
        }
      },
      "Elf - Character Meeple": {
        "Sizeless": {
          "Colorless": "Elf - Character Meeple"
        }
      },
      "Farmer, Female, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Female, Blue - Character Meeple"
        }
      },
      "Farmer, Female, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Female, Green - Character Meeple"
        }
      },
      "Farmer, Female, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Female, Orange - Character Meeple"
        }
      },
      "Farmer, Female, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Female, Purple - Character Meeple"
        }
      },
      "Farmer, Female, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Female, Red - Character Meeple"
        }
      },
      "Farmer, Female, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Female, Yellow - Character Meeple"
        }
      },
      "Farmer, Male, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Male, Blue - Character Meeple"
        }
      },
      "Farmer, Male, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Male, Green - Character Meeple"
        }
      },
      "Farmer, Male, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Male, Orange - Character Meeple"
        }
      },
      "Farmer, Male, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Male, Purple - Character Meeple"
        }
      },
      "Farmer, Male, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Male, Red - Character Meeple"
        }
      },
      "Farmer, Male, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Farmer, Male, Yellow - Character Meeple"
        }
      },
      "Fedora Wearer": {
        "Sizeless": {
          "Black": "Fedora Wearer, Black"
        }
      },
      "Female Farmer": {
        "Sizeless": {
          "Green": "Female Farmer, Green",
          "Orange": "Female Farmer, Orange",
          "Purple": "Female Farmer, Purple",
          "White": "Female Farmer, White",
          "Yellow": "Female Farmer, Yellow"
        }
      },
      "Figure, Wood": {
        "Sizeless": {
          "Green": "Figure, Wood, Green",
          "White": "Figure, Wood, White"
        }
      },
      "Fire Elemental - Character Meeple": {
        "Sizeless": {
          "Colorless": "Fire Elemental - Character Meeple"
        }
      },
      "Firefighter - Character Meeple": {
        "Sizeless": {
          "Colorless": "Firefighter - Character Meeple"
        }
      },
      "Footman": {
        "Sizeless": {
          "Blue": "Footman, Blue",
          "Green": "Footman, Green",
          "Red": "Footman, Red",
          "Yellow": "Footman, Yellow"
        }
      },
      "Gangster": {
        "Sizeless": {
          "Blue": "Gangster, Blue",
          "Green": "Gangster, Green",
          "Orange": "Gangster, Orange",
          "Yellow": "Gangster, Yellow"
        }
      },
      "Geisha - Character Meeple": {
        "Sizeless": {
          "Colorless": "Geisha - Character Meeple"
        }
      },
      "Gentleman": {
        "Sizeless": {
          "Gold": "Gentleman, Gold"
        }
      },
      "Ghost": {
        "Sizeless": {
          "White": "Ghost, White"
        }
      },
      "Gnome": {
        "Sizeless": {
          "Blue": "Gnome, Blue"
        }
      },
      "Guard Robot": {
        "Sizeless": {
          "Black": "Guard Robot, Black",
          "Green": "Guard Robot, Green",
          "Red": "Guard Robot, Red",
          "Yellow": "Guard Robot, Yellow"
        }
      },
      "Halfling - Character Meeple": {
        "Sizeless": {
          "Colorless": "Halfling - Character Meeple"
        }
      },
      "Hazmat - Character Meeple": {
        "Sizeless": {
          "Colorless": "Hazmat - Character Meeple"
        }
      },
      "Ice Elemental - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ice Elemental - Character Meeple"
        }
      },
      "Lab Assistant - Character Meeple": {
        "Sizeless": {
          "Colorless": "Lab Assistant - Character Meeple"
        }
      },
      "Maasai - Character Meeple": {
        "Sizeless": {
          "Colorless": "Maasai - Character Meeple"
        }
      },
      "Man In Black - Character Meeple": {
        "Sizeless": {
          "Colorless": "Man In Black - Character Meeple"
        }
      },
      "Medic - Character Meeple": {
        "Sizeless": {
          "Colorless": "Medic - Character Meeple"
        }
      },
      "Meeple, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "Meeple, Acrylic, Opaque, Black",
          "Gold": "Meeple, Acrylic, Opaque, Gold",
          "Silver": "Meeple, Acrylic, Opaque, Silver",
          "White": "Meeple, Acrylic, Opaque, White"
        },
        "Large": {
          "Black": "Meeple, Large, Acrylic, Opaque, Black",
          "Gold": "Meeple, Large, Acrylic, Opaque, Gold",
          "Silver": "Meeple, Large, Acrylic, Opaque, Silver",
          "White": "Meeple, Large, Acrylic, Opaque, White"
        }
      },
      "Meeple, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "Meeple, Acrylic, Transparent, Black",
          "Blue": "Meeple, Acrylic, Transparent, Blue",
          "Green": "Meeple, Acrylic, Transparent, Green",
          "Orange": "Meeple, Acrylic, Transparent, Orange",
          "Purple": "Meeple, Acrylic, Transparent, Purple",
          "Red": "Meeple, Acrylic, Transparent, Red",
          "White": "Meeple, Acrylic, Transparent, White",
          "Yellow": "Meeple, Acrylic, Transparent, Yellow"
        },
        "Large": {
          "Black": "Meeple, Large, Acrylic, Transparent, Black",
          "Blue": "Meeple, Large, Acrylic, Transparent, Blue",
          "Green": "Meeple, Large, Acrylic, Transparent, Green",
          "Orange": "Meeple, Large, Acrylic, Transparent, Orange",
          "Purple": "Meeple, Large, Acrylic, Transparent, Purple",
          "Red": "Meeple, Large, Acrylic, Transparent, Red",
          "White": "Meeple, Large, Acrylic, Transparent, White",
          "Yellow": "Meeple, Large, Acrylic, Transparent, Yellow"
        }
      },
      "Meeple, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Meeple, Acrylic, Transparent, Clear"
        },
        "Large": {
          "Colorless": "Meeple, Large, Acrylic, Transparent, Clear"
        }
      },
      "Meeple, Wood": {
        "Large": {
          "Black": "Meeple, Large, Wood, Black",
          "Blue": "Meeple, Large, Wood, Blue",
          "Green": "Meeple, Large, Wood, Green",
          "Orange": "Meeple, Large, Wood, Orange",
          "Purple": "Meeple, Large, Wood, Purple",
          "Red": "Meeple, Large, Wood, Red",
          "White": "Meeple, Large, Wood, White",
          "Yellow": "Meeple, Large, Wood, Yellow"
        },
        "Sizeless": {
          "Black": "Meeple, Wood, Black",
          "Blue": "Meeple, Wood, Blue",
          "Green": "Meeple, Wood, Green",
          "Orange": "Meeple, Wood, Orange",
          "Purple": "Meeple, Wood, Purple",
          "Red": "Meeple, Wood, Red",
          "White": "Meeple, Wood, White",
          "Yellow": "Meeple, Wood, Yellow"
        }
      },
      "Meeple, Mini, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "Meeple, Mini, Acrylic, Opaque, Black",
          "Gold": "Meeple, Mini, Acrylic, Opaque, Gold",
          "Silver": "Meeple, Mini, Acrylic, Opaque, Silver",
          "White": "Meeple, Mini, Acrylic, Opaque, White"
        }
      },
      "Meeple, Mini, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "Meeple, Mini, Acrylic, Transparent, Black",
          "Blue": "Meeple, Mini, Acrylic, Transparent, Blue",
          "Green": "Meeple, Mini, Acrylic, Transparent, Green",
          "Orange": "Meeple, Mini, Acrylic, Transparent, Orange",
          "Purple": "Meeple, Mini, Acrylic, Transparent, Purple",
          "Red": "Meeple, Mini, Acrylic, Transparent, Red",
          "Yellow": "Meeple, Mini, Acrylic, Transparent, Yellow"
        }
      },
      "Meeple, Mini, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Meeple, Mini, Acrylic, Transparent, Clear"
        }
      },
      "Meeple, Mini, Wood": {
        "Sizeless": {
          "Black": "Meeple, Mini, Wood, Black",
          "Blue": "Meeple, Mini, Wood, Blue",
          "Green": "Meeple, Mini, Wood, Green",
          "Orange": "Meeple, Mini, Wood, Orange",
          "Purple": "Meeple, Mini, Wood, Purple",
          "Red": "Meeple, Mini, Wood, Red",
          "White": "Meeple, Mini, Wood, White",
          "Yellow": "Meeple, Mini, Wood, Yellow"
        }
      },
      "Meeple, Thick": {
        "Sizeless": {
          "Blue": "Meeple, Thick, Blue",
          "Orange": "Meeple, Thick, Orange",
          "Purple": "Meeple, Thick, Purple",
          "Red": "Meeple, Thick, Red",
          "Teal": "Meeple, Thick, Teal",
          "Yellow": "Meeple, Thick, Yellow"
        }
      },
      "Mongol - Character Meeple": {
        "Sizeless": {
          "Colorless": "Mongol - Character Meeple"
        }
      },
      "Ninja, Black - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Black - Character Meeple"
        }
      },
      "Ninja, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Blue - Character Meeple"
        }
      },
      "Ninja, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Green - Character Meeple"
        }
      },
      "Ninja, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Orange - Character Meeple"
        }
      },
      "Ninja, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Purple - Character Meeple"
        }
      },
      "Ninja, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Red - Character Meeple"
        }
      },
      "Ninja, White - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, White - Character Meeple"
        }
      },
      "Ninja, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Ninja, Yellow - Character Meeple"
        }
      },
      "Nurse - Character Meeple": {
        "Sizeless": {
          "Colorless": "Nurse - Character Meeple"
        }
      },
      "Office Worker, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Office Worker, Blue - Character Meeple"
        }
      },
      "Office Worker, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Office Worker, Purple - Character Meeple"
        }
      },
      "Outlaw - Character Meeple": {
        "Sizeless": {
          "Colorless": "Outlaw - Character Meeple"
        }
      },
      "Peasant": {
        "Sizeless": {
          "Purple": "Peasant, Purple"
        }
      },
      "People": {
        "Sizeless": {
          "Black": "People, Black",
          "Blue": "People, Blue",
          "Green": "People, Green",
          "Orange": "People, Orange",
          "Purple": "People, Purple",
          "Red": "People, Red",
          "White": "People, White",
          "Yellow": "People, Yellow"
        }
      },
      "People, Thick": {
        "Sizeless": {
          "Green": "People, Thick, Green",
          "Purple": "People, Thick, Purple"
        }
      },
      "Person with Hat": {
        "Sizeless": {
          "Teal": "Person with Hat, Teal"
        }
      },
      "Pirate, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Pirate, Blue - Character Meeple"
        }
      },
      "Pirate, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Pirate, Green - Character Meeple"
        }
      },
      "Pirate, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Pirate, Orange - Character Meeple"
        }
      },
      "Pirate, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Pirate, Purple - Character Meeple"
        }
      },
      "Pirate, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Pirate, Red - Character Meeple"
        }
      },
      "Pirate, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Pirate, Yellow - Character Meeple"
        }
      },
      "Police - Character Meeple": {
        "Sizeless": {
          "Colorless": "Police - Character Meeple"
        }
      },
      "Renegade - Character Meeple": {
        "Sizeless": {
          "Colorless": "Renegade - Character Meeple"
        }
      },
      "Robot": {
        "Sizeless": {
          "Silver": "Robot, Silver"
        }
      },
      "Rogue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Rogue - Character Meeple"
        }
      },
      "Scientist - Character Meeple": {
        "Sizeless": {
          "Colorless": "Scientist - Character Meeple"
        }
      },
      "Sheriff - Character Meeple": {
        "Sizeless": {
          "Colorless": "Sheriff - Character Meeple"
        }
      },
      "Skeleton - Character Meeple": {
        "Sizeless": {
          "Colorless": "Skeleton - Character Meeple"
        }
      },
      "Soldier, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Soldier, Blue - Character Meeple"
        }
      },
      "Soldier, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Soldier, Green - Character Meeple"
        }
      },
      "Speedster": {
        "Sizeless": {
          "Red": "Speedster, Red"
        }
      },
      "Swordsman, Black - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Black - Character Meeple"
        }
      },
      "Swordsman, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Blue - Character Meeple"
        }
      },
      "Swordsman, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Green - Character Meeple"
        }
      },
      "Swordsman, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Orange - Character Meeple"
        }
      },
      "Swordsman, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Purple - Character Meeple"
        }
      },
      "Swordsman, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Red - Character Meeple"
        }
      },
      "Swordsman, White - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, White - Character Meeple"
        }
      },
      "Swordsman, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Swordsman, Yellow - Character Meeple"
        }
      },
      "Tall People": {
        "Tall": {
          "Black": "Tall People, Black",
          "Blue": "Tall People, Blue",
          "Green": "Tall People, Green",
          "Orange": "Tall People, Orange",
          "Purple": "Tall People, Purple",
          "Red": "Tall People, Red",
          "White": "Tall People, White",
          "Yellow": "Tall People, Yellow"
        }
      },
      "Tall People, Thick": {
        "Tall": {
          "Green": "Tall People, Thick, Green",
          "Gray": "Tall People, Thick, Gray",
          "Purple": "Tall People, Thick, Purple",
          "Red": "Tall People, Thick, Red",
          "Yellow": "Tall People, Thick, Yellow"
        }
      },
      "Thief - Character Meeple": {
        "Sizeless": {
          "Colorless": "Thief - Character Meeple"
        }
      },
      "Tiki Idol": {
        "Sizeless": {
          "Yellow": "Tiki Idol, Yellow"
        }
      },
      "Vampire - Character Meeple": {
        "Sizeless": {
          "Colorless": "Vampire - Character Meeple"
        }
      },
      "Villager, Black - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Black - Character Meeple"
        }
      },
      "Villager, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Blue - Character Meeple"
        }
      },
      "Villager, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Green - Character Meeple"
        }
      },
      "Villager, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Orange - Character Meeple"
        }
      },
      "Villager, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Purple - Character Meeple"
        }
      },
      "Villager, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Red - Character Meeple"
        }
      },
      "Villager, White - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, White - Character Meeple"
        }
      },
      "Villager, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Villager, Yellow - Character Meeple"
        }
      },
      "Wizard, Blue - Character Meeple": {
        "Sizeless": {
          "Colorless": "Wizard, Blue - Character Meeple"
        }
      },
      "Wizard, Green - Character Meeple": {
        "Sizeless": {
          "Colorless": "Wizard, Green - Character Meeple"
        }
      },
      "Wizard, Orange - Character Meeple": {
        "Sizeless": {
          "Colorless": "Wizard, Orange - Character Meeple"
        }
      },
      "Wizard, Purple - Character Meeple": {
        "Sizeless": {
          "Colorless": "Wizard, Purple - Character Meeple"
        }
      },
      "Wizard, Red - Character Meeple": {
        "Sizeless": {
          "Colorless": "Wizard, Red - Character Meeple"
        }
      },
      "Wizard, Yellow - Character Meeple": {
        "Sizeless": {
          "Colorless": "Wizard, Yellow - Character Meeple"
        }
      },
      "Worker, Single Bag": {
        "Sizeless": {
          "Blue": "Worker, Single Bag, Blue",
          "Green": "Worker, Single Bag, Green",
          "Orange": "Worker, Single Bag, Orange",
          "Purple": "Worker, Single Bag, Purple",
          "White": "Worker, Single Bag, White",
          "Yellow": "Worker, Single Bag, Yellow"
        }
      },
      "Yeti - Character Meeple": {
        "Sizeless": {
          "Colorless": "Yeti - Character Meeple"
        }
      }
    },
    "TB": {
      "Adventuress, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Adventuress, Fantasy, TB25"
        }
      },
      "Alice, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Alice, Fantasy, TB25"
        }
      },
      "Alien, Grey, TB15": {
        "Sizeless": {
          "Black": "Alien, Grey, TB15, Black",
          "Blue": "Alien, Grey, TB15, Blue",
          "Green": "Alien, Grey, TB15, Green",
          "Gray": "Alien, Grey, TB15, Gray",
          "Orange": "Alien, Grey, TB15, Orange",
          "Purple": "Alien, Grey, TB15, Purple",
          "Red": "Alien, Grey, TB15, Red",
          "White": "Alien, Grey, TB15, White",
          "Yellow": "Alien, Grey, TB15, Yellow"
        }
      },
      "Alien, Space, TB25": {
        "Sizeless": {
          "Colorless": "Alien, Space, TB25"
        }
      },
      "Amphisbaena, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Amphisbaena, Fantasy, TB25"
        }
      },
      "Ankheg, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Ankheg, Fantasy, TB50"
        }
      },
      "Astronaut TB15": {
        "Sizeless": {
          "Black": "Astronaut TB15, Black"
        }
      },
      "Astronaut, TB15": {
        "Sizeless": {
          "Blue": "Astronaut, TB15, Blue",
          "Green": "Astronaut, TB15, Green",
          "Orange": "Astronaut, TB15, Orange",
          "Purple": "Astronaut, TB15, Purple",
          "Red": "Astronaut, TB15, Red",
          "White": "Astronaut, TB15, White",
          "Yellow": "Astronaut, TB15, Yellow"
        }
      },
      "Barbarian Duel, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Barbarian Duel, Fantasy, TB25"
        }
      },
      "Barbarian, Nordic, Historic, TB25": {
        "Sizeless": {
          "Colorless": "Barbarian, Nordic, Historic, TB25"
        }
      },
      "Base Shoe, TB15": {
        "Sizeless": {
          "Black": "Base Shoe, TB15, Black",
          "Blue": "Base Shoe, TB15, Blue",
          "Green": "Base Shoe, TB15, Green",
          "Orange": "Base Shoe, TB15, Orange",
          "Purple": "Base Shoe, TB15, Purple",
          "Red": "Base Shoe, TB15, Red",
          "White": "Base Shoe, TB15, White",
          "Yellow": "Base Shoe, TB15, Yellow"
        }
      },
      "Base Shoe, TB25": {
        "Sizeless": {
          "Black": "Base Shoe, TB25, Black",
          "Blue": "Base Shoe, TB25, Blue",
          "Green": "Base Shoe, TB25, Green",
          "Orange": "Base Shoe, TB25, Orange",
          "Purple": "Base Shoe, TB25, Purple",
          "Red": "Base Shoe, TB25, Red",
          "White": "Base Shoe, TB25, White",
          "Yellow": "Base Shoe, TB25, Yellow"
        }
      },
      "Battle Priest, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Battle Priest, Fantasy, TB25"
        }
      },
      "Berehynia, TB25": {
        "Sizeless": {
          "Colorless": "Berehynia, TB25"
        }
      },
      "Blight Twig, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Blight Twig, Fantasy, TB25"
        }
      },
      "Bog Beast, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Bog Beast, Fantasy, TB25"
        }
      },
      "Caveman, TB15": {
        "Sizeless": {
          "Black": "Caveman, TB15, Black",
          "Blue": "Caveman, TB15, Blue",
          "Green": "Caveman, TB15, Green",
          "Orange": "Caveman, TB15, Orange",
          "Purple": "Caveman, TB15, Purple",
          "Red": "Caveman, TB15, Red",
          "White": "Caveman, TB15, White",
          "Yellow": "Caveman, TB15, Yellow"
        }
      },
      "Cavewoman, TB15": {
        "Sizeless": {
          "Black": "Cavewoman, TB15, Black",
          "Blue": "Cavewoman, TB15, Blue",
          "Green": "Cavewoman, TB15, Green",
          "Orange": "Cavewoman, TB15, Orange",
          "Purple": "Cavewoman, TB15, Purple",
          "Red": "Cavewoman, TB15, Red",
          "White": "Cavewoman, TB15, White",
          "Yellow": "Cavewoman, TB15, Yellow"
        }
      },
      "Chest, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Chest, Fantasy, TB25"
        }
      },
      "Creepy Hand, TB25": {
        "Sizeless": {
          "Colorless": "Creepy Hand, TB25"
        }
      },
      "Dark Elf Sorcerer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dark Elf Sorcerer, Fantasy, TB25"
        }
      },
      "Dark Warrior 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dark Warrior 1, Fantasy, TB25"
        }
      },
      "Dark Warrior 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dark Warrior 2, Fantasy, TB25"
        }
      },
      "Drider, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Drider, Fantasy, TB50"
        }
      },
      "Dwarf Axe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dwarf Axe, Fantasy, TB25"
        }
      },
      "Dwarf Minigun, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dwarf Minigun, Fantasy, TB25"
        }
      },
      "Dwarf Paladin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dwarf Paladin, Fantasy, TB25"
        }
      },
      "Dwarf Rifleman, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Dwarf Rifleman, Fantasy, TB25"
        }
      },
      "Dwarf, Pistol, Space, TB25": {
        "Sizeless": {
          "Colorless": "Dwarf, Pistol, Space, TB25"
        }
      },
      "Elf Archer 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Elf Archer 2, Fantasy, TB25"
        }
      },
      "Elf Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Elf Archer, Fantasy, TB25"
        }
      },
      "Female Assassin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Female Assassin, Fantasy, TB25"
        }
      },
      "Female Elf Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Female Elf Archer, Fantasy, TB25"
        }
      },
      "Female Elf Mage, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Female Elf Mage, Fantasy, TB25"
        }
      },
      "Fire, TB25": {
        "Sizeless": {
          "Colorless": "Fire, TB25"
        }
      },
      "Flute Girl, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Flute Girl, Fantasy, TB25"
        }
      },
      "Future Soldier, TB15": {
        "Sizeless": {
          "Black": "Future Soldier, TB15, Black",
          "Blue": "Future Soldier, TB15, Blue",
          "Green": "Future Soldier, TB15, Green",
          "Orange": "Future Soldier, TB15, Orange",
          "Purple": "Future Soldier, TB15, Purple",
          "Red": "Future Soldier, TB15, Red",
          "White": "Future Soldier, TB15, White",
          "Yellow": "Future Soldier, TB15, Yellow"
        }
      },
      "Ghost Bunny, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ghost Bunny, Fantasy, TB25"
        }
      },
      "Ghost, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ghost, Fantasy, TB25"
        }
      },
      "Ghoul 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ghoul 2, Fantasy, TB25"
        }
      },
      "Ghoul, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ghoul, Fantasy, TB25"
        }
      },
      "Giant Rat 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Giant Rat 1, Fantasy, TB25"
        }
      },
      "Giant Rat 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Giant Rat 2, Fantasy, TB25"
        }
      },
      "Gnoll Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnoll Archer, Fantasy, TB25"
        }
      },
      "Gnoll, Axe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnoll, Axe, Fantasy, TB25"
        }
      },
      "Gnoll, Flail, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnoll, Flail, Fantasy, TB25"
        }
      },
      "Gnome, Crossbow, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnome, Crossbow, Fantasy, TB25"
        }
      },
      "Gnome, Sword, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnome, Sword, Fantasy, TB25"
        }
      },
      "Gnome, TB15": {
        "Sizeless": {
          "Black": "Gnome, TB15, Black",
          "Blue": "Gnome, TB15, Blue",
          "Green": "Gnome, TB15, Green",
          "Orange": "Gnome, TB15, Orange",
          "Purple": "Gnome, TB15, Purple",
          "Red": "Gnome, TB15, Red",
          "White": "Gnome, TB15, White",
          "Yellow": "Gnome, TB15, Yellow"
        }
      },
      "Gnomette, Hammer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnomette, Hammer, Fantasy, TB25"
        }
      },
      "Gnomette, Mage, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Gnomette, Mage, Fantasy, TB25"
        }
      },
      "Goblin Archer Draw Bald, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin Archer Draw Bald, Fantasy, TB25"
        }
      },
      "Goblin Archer, Draw, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin Archer, Draw, Fantasy, TB25"
        }
      },
      "Goblin Chieftain, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin Chieftain, Fantasy, TB25"
        }
      },
      "Goblin Sling 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin Sling 1, Fantasy, TB25"
        }
      },
      "Goblin Warlock, Fantasy, TB25": {
        "Sizeless": {
          "Yellow": "Goblin Warlock, Fantasy, TB25, Yellow"
        }
      },
      "Goblin, Defensive, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin, Defensive, Fantasy, TB25"
        }
      },
      "Goblin, Jester, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin, Jester, Fantasy, TB25"
        }
      },
      "Goblin, Offensive, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Goblin, Offensive, Fantasy, TB25"
        }
      },
      "Grim Reaper, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Grim Reaper, Fantasy, TB25"
        }
      },
      "Guard 1, Space, TB25": {
        "Sizeless": {
          "Colorless": "Guard 1, Space, TB25"
        }
      },
      "Guard 2, Space, TB25": {
        "Sizeless": {
          "Colorless": "Guard 2, Space, TB25"
        }
      },
      "Guard, Heavy, Space, TB25": {
        "Sizeless": {
          "Colorless": "Guard, Heavy, Space, TB25"
        }
      },
      "Hag, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Hag, Fantasy, TB25"
        }
      },
      "Halfling Pirate, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Halfling Pirate, Fantasy, TB25"
        }
      },
      "Halfling, Space, TB25": {
        "Sizeless": {
          "Colorless": "Halfling, Space, TB25"
        }
      },
      "Harpy 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Harpy 2, Fantasy, TB25"
        }
      },
      "Harpy, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Harpy, Fantasy, TB25"
        }
      },
      "Hobgoblin, Crossbow 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Hobgoblin, Crossbow 2, Fantasy, TB25"
        }
      },
      "Hobgoblin, Crossbow, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Hobgoblin, Crossbow, Fantasy, TB25"
        }
      },
      "Hobgoblin, Sword 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Hobgoblin, Sword 2, Fantasy, TB25"
        }
      },
      "Hobgoblin, Sword, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Hobgoblin, Sword, Fantasy, TB25"
        }
      },
      "Hooded Stranger, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Hooded Stranger, Fantasy, TB25"
        }
      },
      "Imp, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Imp, Fantasy, TB25"
        }
      },
      "Insect Warrior, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Insect Warrior, Fantasy, TB25"
        }
      },
      "Knight Wolfrib, Historic, TB25": {
        "Sizeless": {
          "Colorless": "Knight Wolfrib, Historic, TB25"
        }
      },
      "Knight, Lance, Space, TB25": {
        "Sizeless": {
          "Colorless": "Knight, Lance, Space, TB25"
        }
      },
      "Kobold, Pickaxe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Kobold, Pickaxe, Fantasy, TB25"
        }
      },
      "Krampus, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Krampus, Fantasy, TB25"
        }
      },
      "Lich, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Lich, Fantasy, TB25"
        }
      },
      "Man, American Revolution, TB15": {
        "Sizeless": {
          "Black": "Man, American Revolution, TB15, Black",
          "Blue": "Man, American Revolution, TB15, Blue",
          "Green": "Man, American Revolution, TB15, Green",
          "Orange": "Man, American Revolution, TB15, Orange",
          "Purple": "Man, American Revolution, TB15, Purple",
          "Red": "Man, American Revolution, TB15, Red",
          "White": "Man, American Revolution, TB15, White",
          "Yellow": "Man, American Revolution, TB15, Yellow"
        }
      },
      "Man, Iroquois, TB15": {
        "Sizeless": {
          "Black": "Man, Iroquois, TB15, Black",
          "Blue": "Man, Iroquois, TB15, Blue",
          "Green": "Man, Iroquois, TB15, Green",
          "Orange": "Man, Iroquois, TB15, Orange",
          "Purple": "Man, Iroquois, TB15, Purple",
          "Red": "Man, Iroquois, TB15, Red",
          "White": "Man, Iroquois, TB15, White",
          "Yellow": "Man, Iroquois, TB15, Yellow"
        }
      },
      "Man, Modern, Chainsaw, TB25": {
        "Sizeless": {
          "Colorless": "Man, Modern, Chainsaw, TB25"
        }
      },
      "Man, Modern, Flashlight, TB25": {
        "Sizeless": {
          "Colorless": "Man, Modern, Flashlight, TB25"
        }
      },
      "Man, Modern, Shotgun, TB25": {
        "Sizeless": {
          "Colorless": "Man, Modern, Shotgun, TB25"
        }
      },
      "Man, Modern, TB15": {
        "Sizeless": {
          "Black": "Man, Modern, TB15, Black",
          "Blue": "Man, Modern, TB15, Blue",
          "Green": "Man, Modern, TB15, Green",
          "Orange": "Man, Modern, TB15, Orange",
          "Purple": "Man, Modern, TB15, Purple",
          "Red": "Man, Modern, TB15, Red",
          "White": "Man, Modern, TB15, White",
          "Yellow": "Man, Modern, TB15, Yellow"
        }
      },
      "Man, Post Apocalypse, Archer, TB25": {
        "Sizeless": {
          "Colorless": "Man, Post Apocalypse, Archer, TB25"
        }
      },
      "Man, Post Apocalypse, Dual SMG, TB25": {
        "Sizeless": {
          "Colorless": "Man, Post Apocalypse, Dual SMG, TB25"
        }
      },
      "Man, Post Apocalypse, Hammer, TB25": {
        "Sizeless": {
          "Colorless": "Man, Post Apocalypse, Hammer, TB25"
        }
      },
      "Man, Post Apocalypse, TB15": {
        "Sizeless": {
          "Black": "Man, Post Apocalypse, TB15, Black",
          "Blue": "Man, Post Apocalypse, TB15, Blue",
          "Green": "Man, Post Apocalypse, TB15, Green",
          "Orange": "Man, Post Apocalypse, TB15, Orange",
          "Purple": "Man, Post Apocalypse, TB15, Purple",
          "Red": "Man, Post Apocalypse, TB15, Red",
          "White": "Man, Post Apocalypse, TB15, White",
          "Yellow": "Man, Post Apocalypse, TB15, Yellow"
        }
      },
      "Man, Samurai Armor, TB15": {
        "Sizeless": {
          "Black": "Man, Samurai Armor, TB15, Black",
          "Blue": "Man, Samurai Armor, TB15, Blue",
          "Green": "Man, Samurai Armor, TB15, Green",
          "Orange": "Man, Samurai Armor, TB15, Orange",
          "Purple": "Man, Samurai Armor, TB15, Purple",
          "Red": "Man, Samurai Armor, TB15, Red",
          "White": "Man, Samurai Armor, TB15, White",
          "Yellow": "Man, Samurai Armor, TB15, Yellow"
        }
      },
      "Mech, TB15": {
        "Sizeless": {
          "Black": "Mech, TB15, Black",
          "Blue": "Mech, TB15, Blue",
          "Green": "Mech, TB15, Green",
          "Orange": "Mech, TB15, Orange",
          "Purple": "Mech, TB15, Purple",
          "Red": "Mech, TB15, Red",
          "White": "Mech, TB15, White",
          "Yellow": "Mech, TB15, Yellow"
        }
      },
      "Medic, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Medic, Fantasy, TB25"
        }
      },
      "Mermaid, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Mermaid, Fantasy, TB25"
        }
      },
      "Monk, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Monk, Fantasy, TB25"
        }
      },
      "Norse Maiden, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Norse Maiden, Fantasy, TB25"
        }
      },
      "Nothic, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Nothic, Fantasy, TB25"
        }
      },
      "Obelisk, TB25": {
        "Sizeless": {
          "Colorless": "Obelisk, TB25"
        }
      },
      "Ogre, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ogre, Fantasy, TB25"
        }
      },
      "Opossum Druid, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Opossum Druid, Fantasy, TB25"
        }
      },
      "Orc Scimitar, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Orc Scimitar, Fantasy, TB25"
        }
      },
      "Orc Shaman, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Orc Shaman, Fantasy, TB25"
        }
      },
      "Owlbear, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Owlbear, Fantasy, TB50"
        }
      },
      "Pirate 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate 1, Fantasy, TB25"
        }
      },
      "Pirate 2, Female, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate 2, Female, Fantasy, TB25"
        }
      },
      "Pirate 3, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate 3, Fantasy, TB25"
        }
      },
      "Pirate 4, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate 4, Fantasy, TB25"
        }
      },
      "Pit Fiend, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Pit Fiend, Fantasy, TB50"
        }
      },
      "Putler, TB25": {
        "Sizeless": {
          "Colorless": "Putler, TB25"
        }
      },
      "Ratcatcher, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ratcatcher, Fantasy, TB25"
        }
      },
      "Ratfolk, Assassin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ratfolk, Assassin, Fantasy, TB25"
        }
      },
      "Robot, Detective, Space, TB25": {
        "Sizeless": {
          "Colorless": "Robot, Detective, Space, TB25"
        }
      },
      "Robot, Wizard, Space, TB25": {
        "Sizeless": {
          "Colorless": "Robot, Wizard, Space, TB25"
        }
      },
      "Samurai Armor, Historic, TB25": {
        "Sizeless": {
          "Colorless": "Samurai Armor, Historic, TB25"
        }
      },
      "Skeleton Archer 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Archer 2, Fantasy, TB25"
        }
      },
      "Skeleton Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Archer, Fantasy, TB25"
        }
      },
      "Skeleton Axe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Axe, Fantasy, TB25"
        }
      },
      "Skeleton Sword 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Sword 2, Fantasy, TB25"
        }
      },
      "Skeleton Sword 3, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Sword 3, Fantasy, TB25"
        }
      },
      "Skeleton Sword, Armored, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Sword, Armored, Fantasy, TB25"
        }
      },
      "Skeleton Sword, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Skeleton Sword, Fantasy, TB25"
        }
      },
      "Snowman 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Snowman 1, Fantasy, TB25"
        }
      },
      "Snowman 2 Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Snowman 2 Fantasy, TB25"
        }
      },
      "Spider, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Spider, Fantasy, TB50"
        }
      },
      "Stand, Chipboard, TB15": {
        "Sizeless": {
          "Black": "Stand, Chipboard, TB15, Black",
          "Blue": "Stand, Chipboard, TB15, Blue",
          "Green": "Stand, Chipboard, TB15, Green",
          "Orange": "Stand, Chipboard, TB15, Orange",
          "Purple": "Stand, Chipboard, TB15, Purple",
          "Red": "Stand, Chipboard, TB15, Red",
          "White": "Stand, Chipboard, TB15, White",
          "Yellow": "Stand, Chipboard, TB15, Yellow"
        }
      },
      "Tentacle Portal, TB25": {
        "Sizeless": {
          "Colorless": "Tentacle Portal, TB25"
        }
      },
      "Tiefling Female Mage, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Tiefling Female Mage, Fantasy, TB25"
        }
      },
      "Troll, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Troll, Fantasy, TB50"
        }
      },
      "Trophy, TB15": {
        "Sizeless": {
          "Bronze": "Trophy, TB15, Bronze",
          "Gold": "Trophy, TB15, Gold",
          "Silver": "Trophy, TB15, Silver"
        }
      },
      "Walker, Space, TB50": {
        "Sizeless": {
          "Colorless": "Walker, Space, TB50"
        }
      },
      "Wereshark, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Wereshark, Fantasy, TB25"
        }
      },
      "Werewolf, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Werewolf, Fantasy, TB25"
        }
      },
      "Wilhelm Tell, Crossbowman, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Wilhelm Tell, Crossbowman, Fantasy, TB25"
        }
      },
      "Wizard Old, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Wizard Old, Fantasy, TB25"
        }
      },
      "Woman, Modern, Baseball Bat, TB25": {
        "Sizeless": {
          "Colorless": "Woman, Modern, Baseball Bat, TB25"
        }
      },
      "Woman, Modern, Handgun, TB25": {
        "Sizeless": {
          "Colorless": "Woman, Modern, Handgun, TB25"
        }
      },
      "Woman, Modern, TB15": {
        "Sizeless": {
          "Black": "Woman, Modern, TB15, Black",
          "Blue": "Woman, Modern, TB15, Blue",
          "Green": "Woman, Modern, TB15, Green",
          "Orange": "Woman, Modern, TB15, Orange",
          "Purple": "Woman, Modern, TB15, Purple",
          "Red": "Woman, Modern, TB15, Red",
          "White": "Woman, Modern, TB15, White",
          "Yellow": "Woman, Modern, TB15, Yellow"
        }
      },
      "Woman, Post Apocalypse, Bazooka, TB25": {
        "Sizeless": {
          "Colorless": "Woman, Post Apocalypse, Bazooka, TB25"
        }
      },
      "Woman, Post Apocalypse, Shotgun, TB25": {
        "Sizeless": {
          "Colorless": "Woman, Post Apocalypse, Shotgun, TB25"
        }
      },
      "Woman, Post Apocalypse, TB15": {
        "Sizeless": {
          "Black": "Woman, Post Apocalypse, TB15, Black",
          "Blue": "Woman, Post Apocalypse, TB15, Blue",
          "Green": "Woman, Post Apocalypse, TB15, Green",
          "Orange": "Woman, Post Apocalypse, TB15, Orange",
          "Purple": "Woman, Post Apocalypse, TB15, Purple",
          "Red": "Woman, Post Apocalypse, TB15, Red",
          "White": "Woman, Post Apocalypse, TB15, White",
          "Yellow": "Woman, Post Apocalypse, TB15, Yellow"
        }
      },
      "Wraith, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Wraith, Fantasy, TB25"
        }
      },
      "Wraith, Halberd, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Wraith, Halberd, Fantasy, TB25"
        }
      },
      "Zombie 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Zombie 2, Fantasy, TB25"
        }
      },
      "Zombie 3, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Zombie 3, Fantasy, TB25"
        }
      },
      "Zombie, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Zombie, Fantasy, TB25"
        }
      },
      "Mine, Sea, TB25": {
        "Sizeless": {
          "Colorless": "Mine, Sea, TB25"
        }
      }
    },
    "minifig": {
      "Adventurer with Sword and Shield": {
        "Sizeless": {
          "Colorless": "Adventurer with Sword and Shield"
        }
      },
      "American Indian with Bow": {
        "Sizeless": {
          "Colorless": "American Indian with Bow"
        }
      },
      "Anti-Paladin": {
        "Sizeless": {
          "Colorless": "Anti-Paladin"
        }
      },
      "Arianna Moonshadow Enchantress": {
        "Sizeless": {
          "Colorless": "Arianna Moonshadow Enchantress"
        }
      },
      "Armored Ogre": {
        "Sizeless": {
          "Colorless": "Armored Ogre"
        }
      },
      "Balefire Demon w/ Sword": {
        "Sizeless": {
          "Colorless": "Balefire Demon w/ Sword"
        }
      },
      "Barbarian with Axe": {
        "Sizeless": {
          "Colorless": "Barbarian with Axe"
        }
      },
      "Barbarian with Sword & Shield": {
        "Sizeless": {
          "Colorless": "Barbarian with Sword & Shield"
        }
      },
      "Barbarian with Two Swords": {
        "Sizeless": {
          "Colorless": "Barbarian with Two Swords"
        }
      },
      "Brigand with Dagger": {
        "Sizeless": {
          "Colorless": "Brigand with Dagger"
        }
      },
      "Cavalry": {
        "Sizeless": {
          "Green": "Cavalry, Green"
        }
      },
      "Centaur Thrusting Spear": {
        "Sizeless": {
          "Colorless": "Centaur Thrusting Spear"
        }
      },
      "Chaos Death Master": {
        "Sizeless": {
          "Colorless": "Chaos Death Master"
        }
      },
      "Cleric": {
        "Sizeless": {
          "Colorless": "Cleric"
        }
      },
      "Death Knight with Polearm": {
        "Sizeless": {
          "Colorless": "Death Knight with Polearm"
        }
      },
      "Death Knight with Sword": {
        "Sizeless": {
          "Colorless": "Death Knight with Sword"
        }
      },
      "Dindaelus: Wizard with Staff": {
        "Sizeless": {
          "Colorless": "Dindaelus: Wizard with Staff"
        }
      },
      "Djin": {
        "Sizeless": {
          "Colorless": "Djin"
        }
      },
      "Dragon Familiar": {
        "Sizeless": {
          "Colorless": "Dragon Familiar"
        }
      },
      "Dwarf Fighter": {
        "Sizeless": {
          "Colorless": "Dwarf Fighter"
        }
      },
      "Dwarven Iron Golem": {
        "Sizeless": {
          "Colorless": "Dwarven Iron Golem"
        }
      },
      "Enchanter with Staff": {
        "Sizeless": {
          "Colorless": "Enchanter with Staff"
        }
      },
      "Evil Lord with Mace": {
        "Sizeless": {
          "Colorless": "Evil Lord with Mace"
        }
      },
      "Female Beast Master Warrior with Sword and Spear": {
        "Sizeless": {
          "Colorless": "Female Beast Master Warrior with Sword and Spear"
        }
      },
      "Female Gunslinger": {
        "Sizeless": {
          "Gray": "Female Gunslinger, Gray"
        }
      },
      "Fighter with Great Sword": {
        "Sizeless": {
          "Colorless": "Fighter with Great Sword"
        }
      },
      "Fire Elemental": {
        "Sizeless": {
          "Colorless": "Fire Elemental"
        }
      },
      "Four Armed Titan of Terror w/ Weapon Sprue": {
        "Sizeless": {
          "Colorless": "Four Armed Titan of Terror w/ Weapon Sprue"
        }
      },
      "Gelatinous Monster": {
        "Sizeless": {
          "Colorless": "Gelatinous Monster"
        }
      },
      "Ghost IV Hooded": {
        "Sizeless": {
          "Colorless": "Ghost IV Hooded"
        }
      },
      "Goatman Champion": {
        "Sizeless": {
          "Colorless": "Goatman Champion"
        }
      },
      "Goatman with Bow": {
        "Sizeless": {
          "Colorless": "Goatman with Bow"
        }
      },
      "Goatman With Spear & Shield": {
        "Sizeless": {
          "Colorless": "Goatman With Spear & Shield"
        }
      },
      "Goatman with Sword and Shield": {
        "Sizeless": {
          "Colorless": "Goatman with Sword and Shield"
        }
      },
      "Hippogriff": {
        "Sizeless": {
          "Colorless": "Hippogriff"
        }
      },
      "Lich with Staff": {
        "Sizeless": {
          "Colorless": "Lich with Staff"
        }
      },
      "Lizard Man on Rock Throne": {
        "Sizeless": {
          "Colorless": "Lizard Man on Rock Throne"
        }
      },
      "Lizard Man with War Club and Shield": {
        "Sizeless": {
          "Colorless": "Lizard Man with War Club and Shield"
        }
      },
      "Minotaur with Battle Axe": {
        "Sizeless": {
          "Colorless": "Minotaur with Battle Axe"
        }
      },
      "Ogre with Club & Shield": {
        "Sizeless": {
          "Colorless": "Ogre with Club & Shield"
        }
      },
      "Pinhead the Barbarian": {
        "Sizeless": {
          "Colorless": "Pinhead the Barbarian"
        }
      },
      "Ranger Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ranger Archer, Fantasy, TB25"
        }
      },
      "Ranger Firing Bow": {
        "Sizeless": {
          "Colorless": "Ranger Firing Bow"
        }
      },
      "Savage Orc Champion Great Hamm": {
        "Sizeless": {
          "Colorless": "Savage Orc Champion Great Hamm"
        }
      },
      "Savage Orc Chieftain": {
        "Sizeless": {
          "Colorless": "Savage Orc Chieftain"
        }
      },
      "Scarecrow A": {
        "Sizeless": {
          "Colorless": "Scarecrow A"
        }
      },
      "Scarecrow B": {
        "Sizeless": {
          "Colorless": "Scarecrow B"
        }
      },
      "Skeletal Crossbowman III": {
        "Sizeless": {
          "Colorless": "Skeletal Crossbowman III"
        }
      },
      "Skeleton Battle Axe": {
        "Sizeless": {
          "Colorless": "Skeleton Battle Axe"
        }
      },
      "The White Wizard": {
        "Sizeless": {
          "Colorless": "The White Wizard"
        }
      },
      "Two Headed Ogre w/ Captive": {
        "Sizeless": {
          "Colorless": "Two Headed Ogre w/ Captive"
        }
      },
      "Warbeast with Handler": {
        "Sizeless": {
          "Colorless": "Warbeast with Handler"
        }
      },
      "Wyvern II": {
        "Sizeless": {
          "Colorless": "Wyvern II"
        }
      }
    },
    "figurine": {
      "Avatar, Opaque": {
        "Sizeless": {
          "Black": "Avatar, Opaque, Black",
          "White": "Avatar, Opaque, White"
        }
      },
      "Avatar, Transparent": {
        "Sizeless": {
          "Black": "Avatar, Transparent, Black",
          "Blue": "Avatar, Transparent, Blue",
          "Green": "Avatar, Transparent, Green",
          "Orange": "Avatar, Transparent, Orange",
          "Purple": "Avatar, Transparent, Purple",
          "Red": "Avatar, Transparent, Red",
          "White": "Avatar, Transparent, White",
          "Yellow": "Avatar, Transparent, Yellow"
        }
      },
      "Avatar, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Avatar, Transparent, Clear"
        }
      },
      "Colonial Lumberjack": {
        "Sizeless": {
          "Blue": "Colonial Lumberjack, Blue",
          "Green": "Colonial Lumberjack, Green",
          "Orange": "Colonial Lumberjack, Orange",
          "Red": "Colonial Lumberjack, Red",
          "Yellow": "Colonial Lumberjack, Yellow"
        }
      },
      "Colonial Soldier": {
        "Sizeless": {
          "Blue": "Colonial Soldier, Blue",
          "Green": "Colonial Soldier, Green",
          "Orange": "Colonial Soldier, Orange",
          "Red": "Colonial Soldier, Red",
          "Yellow": "Colonial Soldier, Yellow"
        }
      },
      "Cone Pawn": {
        "Sizeless": {
          "Black": "Cone Pawn, Black"
        }
      },
      "Fedora Person, Black, Dark": {
        "Sizeless": {
          "Colorless": "Fedora Person, Black, Dark"
        }
      },
      "Fedora Person, Black, Light": {
        "Sizeless": {
          "Colorless": "Fedora Person, Black, Light"
        }
      },
      "Fedora Person": {
        "Medium": {
          "Black": "Fedora Person, Black, Medium",
          "Blue": "Fedora Person, Blue, Medium",
          "Red": "Fedora Person, Red, Medium",
          "White": "Fedora Person, White, Medium",
          "Yellow": "Fedora Person, Yellow, Medium"
        }
      },
      "Fedora Person, Blue, Dark": {
        "Sizeless": {
          "Colorless": "Fedora Person, Blue, Dark"
        }
      },
      "Fedora Person, Blue, Light": {
        "Sizeless": {
          "Colorless": "Fedora Person, Blue, Light"
        }
      },
      "Fedora Person, Red, Dark": {
        "Sizeless": {
          "Colorless": "Fedora Person, Red, Dark"
        }
      },
      "Fedora Person, Red, Light": {
        "Sizeless": {
          "Colorless": "Fedora Person, Red, Light"
        }
      },
      "Fedora Person, White, Dark": {
        "Sizeless": {
          "Colorless": "Fedora Person, White, Dark"
        }
      },
      "Fedora Person, White, Light": {
        "Sizeless": {
          "Colorless": "Fedora Person, White, Light"
        }
      },
      "Fedora Person, Yellow, Dark": {
        "Sizeless": {
          "Colorless": "Fedora Person, Yellow, Dark"
        }
      },
      "Fedora Person, Yellow, Light": {
        "Sizeless": {
          "Colorless": "Fedora Person, Yellow, Light"
        }
      },
      "Flat Cap, Black": {
        "Sizeless": {
          "Bronze": "Flat Cap, Black, Bronze",
          "Green": "Flat Cap, Black, Green",
          "Purple": "Flat Cap, Black, Purple"
        }
      },
      "Flat Cap, Blue": {
        "Sizeless": {
          "Bronze": "Flat Cap, Blue, Bronze",
          "Green": "Flat Cap, Blue, Green",
          "Purple": "Flat Cap, Blue, Purple"
        }
      },
      "Flat Cap, Red": {
        "Sizeless": {
          "Bronze": "Flat Cap, Red, Bronze",
          "Green": "Flat Cap, Red, Green",
          "Purple": "Flat Cap, Red, Purple"
        }
      },
      "Flat Cap, White": {
        "Sizeless": {
          "Bronze": "Flat Cap, White, Bronze",
          "Green": "Flat Cap, White, Green",
          "Purple": "Flat Cap, White, Purple"
        }
      },
      "Flat Cap, Yellow": {
        "Sizeless": {
          "Bronze": "Flat Cap, Yellow, Bronze",
          "Green": "Flat Cap, Yellow, Green",
          "Purple": "Flat Cap, Yellow, Purple"
        }
      },
      "Future Person": {
        "Sizeless": {
          "Orange": "Future Person, Orange",
          "Purple": "Future Person, Purple",
          "Yellow": "Future Person, Yellow"
        }
      },
      "Gunpod": {
        "Sizeless": {
          "Colorless": "Gunpod"
        }
      },
      "Halma": {
        "Sizeless": {
          "Black": "Halma, Black",
          "Blue": "Halma, Blue",
          "Green": "Halma, Green",
          "Orange": "Halma, Orange",
          "Purple": "Halma, Purple",
          "Red": "Halma, Red",
          "White": "Halma, White",
          "Yellow": "Halma, Yellow"
        }
      },
      "Halma, Natural": {
        "Large": {
          "Colorless": "Halma, Large, Natural"
        }
      },
      "Halma, Stackable": {
        "Sizeless": {
          "Blue": "Halma, Stackable, Blue",
          "Green": "Halma, Stackable, Green",
          "Red": "Halma, Stackable, Red",
          "White": "Halma, Stackable, White",
          "Yellow": "Halma, Stackable, Yellow"
        }
      },
      "Hatman Green": {
        "Sizeless": {
          "Green": "Hatman Green"
        }
      },
      "Human Figure": {
        "Sizeless": {
          "Orange": "Human Figure, Orange",
          "Purple": "Human Figure, Purple",
          "Red": "Human Figure, Red",
          "Yellow": "Human Figure, Yellow"
        }
      },
      "Hydra": {
        "Sizeless": {
          "Colorless": "Hydra"
        }
      },
      "Lookout": {
        "Sizeless": {
          "Blue": "Lookout, Blue",
          "Green": "Lookout, Green",
          "Orange": "Lookout, Orange",
          "Red": "Lookout, Red",
          "Yellow": "Lookout, Yellow"
        }
      },
      "Mafioso, Burnt": {
        "Sizeless": {
          "Orange": "Mafioso, Burnt Orange"
        }
      },
      "Mafioso": {
        "Sizeless": {
          "Green": "Mafioso, Green",
          "Purple": "Mafioso, Purple",
          "Red": "Mafioso, Red",
          "Yellow": "Mafioso, Yellow"
        }
      },
      "Miniature Base, 25mm Hex": {
        "Sizeless": {
          "Black": "Miniature Base, 25mm Hex, Black",
          "Blue": "Miniature Base, 25mm Hex, Blue",
          "Green": "Miniature Base, 25mm Hex, Green",
          "Orange": "Miniature Base, 25mm Hex, Orange",
          "Purple": "Miniature Base, 25mm Hex, Purple",
          "Red": "Miniature Base, 25mm Hex, Red",
          "White": "Miniature Base, 25mm Hex, White",
          "Yellow": "Miniature Base, 25mm Hex, Yellow"
        }
      },
      "Missionary": {
        "Large": {
          "Blue": "Missionary, Large, Blue",
          "Green": "Missionary, Large, Green",
          "Orange": "Missionary, Large, Orange",
          "Red": "Missionary, Large, Red",
          "Yellow": "Missionary, Large, Yellow"
        }
      },
      "Ninja": {
        "Sizeless": {
          "Brown": "Ninja, Brown",
          "Orange": "Ninja, Orange"
        }
      },
      "Noble": {
        "Sizeless": {
          "Blue": "Noble, Blue",
          "Green": "Noble, Green",
          "Red": "Noble, Red",
          "White": "Noble, White",
          "Yellow": "Noble, Yellow"
        }
      },
      "Paper Miniature Base Square": {
        "20mm": {
          "Colorless": "Paper Miniature Base Square, 20mm"
        }
      },
      "Paper Miniature Base, Angled": {
        "20mm": {
          "Colorless": "Paper Miniature Base, 20mm, Angled"
        }
      },
      "Paper Miniature Base": {
        "25mm": {
          "Black": "Paper Miniature Base, 25mm, Black",
          "Blue": "Paper Miniature Base, 25mm, Blue",
          "Green": "Paper Miniature Base, 25mm, Green",
          "Orange": "Paper Miniature Base, 25mm, Orange",
          "Purple": "Paper Miniature Base, 25mm, Purple",
          "Red": "Paper Miniature Base, 25mm, Red",
          "White": "Paper Miniature Base, 25mm, White",
          "Yellow": "Paper Miniature Base, 25mm, Yellow"
        }
      },
      "Paper Miniature Base, Clear": {
        "25mm": {
          "Colorless": "Paper Miniature Base, 25mm, Clear"
        }
      },
      "Paper Miniature Formation Tray, 10 x 4": {
        "20mm": {
          "Colorless": "Paper Miniature Formation Tray, 20mm, 10 x 4"
        }
      },
      "Paper Miniature Formation Tray, 5 x 2": {
        "20mm": {
          "Colorless": "Paper Miniature Formation Tray, 20mm, 5 x 2"
        }
      },
      "Paper Miniature Formation Tray, 5 x 2, Angled": {
        "20mm": {
          "Colorless": "Paper Miniature Formation Tray, 20mm, 5 x 2, Angled"
        }
      },
      "Paper Miniature Formation Tray, 5 x 4": {
        "20mm": {
          "Colorless": "Paper Miniature Formation Tray, 20mm, 5 x 4"
        }
      },
      "Paper Miniature Formation Tray, 5 x 4, Angled": {
        "20mm": {
          "Colorless": "Paper Miniature Formation Tray, 20mm, 5 x 4, Angled"
        }
      },
      "Peg Pawn": {
        "Sizeless": {
          "Black": "Peg Pawn, Black",
          "Blue": "Peg Pawn, Blue",
          "Green": "Peg Pawn, Green",
          "Orange": "Peg Pawn, Orange",
          "Purple": "Peg Pawn, Purple",
          "Red": "Peg Pawn, Red",
          "White": "Peg Pawn, White",
          "Yellow": "Peg Pawn, Yellow"
        }
      },
      "Shieldbearer": {
        "Sizeless": {
          "Blue": "Shieldbearer, Blue",
          "Green": "Shieldbearer, Green",
          "Purple": "Shieldbearer, Purple",
          "Yellow": "Shieldbearer, Yellow"
        }
      },
      "Skeleton Warrior": {
        "Sizeless": {
          "Black": "Skeleton Warrior, Black",
          "Blue": "Skeleton Warrior, Blue",
          "Pink": "Skeleton Warrior, Pink"
        }
      },
      "Skeleton Warrior, Tan": {
        "Sizeless": {
          "Colorless": "Skeleton Warrior, Tan"
        }
      },
      "Sticker Pawn, Opaque": {
        "Sizeless": {
          "Black": "Sticker Pawn, Opaque, Black",
          "Blue": "Sticker Pawn, Opaque, Blue",
          "Green": "Sticker Pawn, Opaque, Green",
          "Orange": "Sticker Pawn, Opaque, Orange",
          "Purple": "Sticker Pawn, Opaque, Purple",
          "Red": "Sticker Pawn, Opaque, Red",
          "White": "Sticker Pawn, Opaque, White",
          "Yellow": "Sticker Pawn, Opaque, Yellow"
        }
      },
      "Sticker Pawn, Transparent": {
        "Sizeless": {
          "Blue": "Sticker Pawn, Transparent, Blue",
          "Green": "Sticker Pawn, Transparent, Green",
          "Orange": "Sticker Pawn, Transparent, Orange",
          "Purple": "Sticker Pawn, Transparent, Purple",
          "Red": "Sticker Pawn, Transparent, Red",
          "Yellow": "Sticker Pawn, Transparent, Yellow"
        }
      },
      "Sticker Pawn, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Sticker Pawn, Transparent, Clear"
        }
      },
      "Warrior Monk": {
        "Sizeless": {
          "Purple": "Warrior Monk, Purple",
          "Red": "Warrior Monk, Red"
        }
      },
      "Woman, Mum": {
        "Sizeless": {
          "Colorless": "Woman, Mum"
        }
      },
      "Zombie Babe": {
        "Sizeless": {
          "Colorless": "Zombie Babe"
        }
      },
      "Zombie Cheerleader": {
        "Sizeless": {
          "Colorless": "Zombie Cheerleader"
        }
      },
      "Zombie Circus Clown": {
        "Sizeless": {
          "Colorless": "Zombie Circus Clown"
        }
      },
      "Zombie Clown": {
        "Sizeless": {
          "Colorless": "Zombie Clown"
        }
      },
      "Zombie Doctor": {
        "Sizeless": {
          "Colorless": "Zombie Doctor"
        }
      },
      "Zombie Dog": {
        "Sizeless": {
          "Colorless": "Zombie Dog"
        }
      },
      "Zombie Dude": {
        "Sizeless": {
          "Colorless": "Zombie Dude"
        }
      },
      "Zombie Granny": {
        "Sizeless": {
          "Colorless": "Zombie Granny"
        }
      },
      "Zombie Mullet": {
        "Sizeless": {
          "Colorless": "Zombie Mullet"
        }
      },
      "Zombie Professor": {
        "Sizeless": {
          "Colorless": "Zombie Professor"
        }
      },
      "Zombie Thriller": {
        "Sizeless": {
          "Colorless": "Zombie Thriller"
        }
      },
      "Zombie, Random": {
        "Sizeless": {
          "Colorless": "Zombie, Random"
        }
      },
      "Halma, Plastic": {
        "Sizeless": {
          "Black": "Halma, Plastic, Black",
          "Blue": "Halma, Plastic, Blue",
          "Orange": "Halma, Plastic, Orange",
          "Red": "Halma, Plastic, Red",
          "White": "Halma, Plastic, White",
          "Yellow": "Halma, Plastic, Yellow"
        }
      }
    },
    "animal": {
      "African Elephant": {
        "Sizeless": {
          "Colorless": "African Elephant"
        }
      },
      "Ant": {
        "Sizeless": {
          "Colorless": "Ant"
        }
      },
      "Bee, Wood": {
        "Sizeless": {
          "Colorless": "Bee, Wood"
        }
      },
      "Bird, TB15": {
        "Sizeless": {
          "Black": "Bird, TB15, Black",
          "Blue": "Bird, TB15, Blue",
          "Green": "Bird, TB15, Green",
          "Orange": "Bird, TB15, Orange",
          "Purple": "Bird, TB15, Purple",
          "Red": "Bird, TB15, Red",
          "White": "Bird, TB15, White",
          "Yellow": "Bird, TB15, Yellow"
        }
      },
      "Black Bear": {
        "Sizeless": {
          "Colorless": "Black Bear"
        }
      },
      "Bug": {
        "Sizeless": {
          "Black": "Bug, Black",
          "Blue": "Bug, Blue",
          "Green": "Bug, Green",
          "Orange": "Bug, Orange",
          "Purple": "Bug, Purple",
          "Red": "Bug, Red",
          "White": "Bug, White",
          "Yellow": "Bug, Yellow"
        }
      },
      "Bull, Wood": {
        "Sizeless": {
          "Brown": "Bull, Wood, Brown",
          "Orange": "Bull, Wood, Orange"
        }
      },
      "Bunny, TB15": {
        "Sizeless": {
          "Black": "Bunny, TB15, Black",
          "Blue": "Bunny, TB15, Blue",
          "Green": "Bunny, TB15, Green",
          "Orange": "Bunny, TB15, Orange",
          "Purple": "Bunny, TB15, Purple",
          "Red": "Bunny, TB15, Red",
          "White": "Bunny, TB15, White",
          "Yellow": "Bunny, TB15, Yellow"
        }
      },
      "Cat, Acrylic": {
        "Sizeless": {
          "Colorless": "Cat, Acrylic"
        }
      },
      "Cat, TB15": {
        "Sizeless": {
          "Black": "Cat, TB15, Black",
          "Blue": "Cat, TB15, Blue",
          "Green": "Cat, TB15, Green",
          "Orange": "Cat, TB15, Orange",
          "Purple": "Cat, TB15, Purple",
          "Red": "Cat, TB15, Red",
          "White": "Cat, TB15, White",
          "Yellow": "Cat, TB15, Yellow"
        }
      },
      "Cheetah": {
        "Sizeless": {
          "Colorless": "Cheetah"
        }
      },
      "Chicken, Acrylic": {
        "Sizeless": {
          "Colorless": "Chicken, Acrylic"
        }
      },
      "Cobra, Wood": {
        "Sizeless": {
          "Teal": "Cobra, Wood, Teal"
        }
      },
      "Cow": {
        "Sizeless": {
          "Black": "Cow, Black"
        }
      },
      "Cow, Half": {
        "Sizeless": {
          "Black": "Cow, Half Black",
          "Brown": "Cow, Half Brown"
        }
      },
      "Crab, Acrylic": {
        "Sizeless": {
          "Black": "Crab, Acrylic, Black",
          "Blue": "Crab, Acrylic, Blue",
          "Green": "Crab, Acrylic, Green",
          "Orange": "Crab, Acrylic, Orange",
          "Purple": "Crab, Acrylic, Purple",
          "Red": "Crab, Acrylic, Red",
          "White": "Crab, Acrylic, White",
          "Yellow": "Crab, Acrylic, Yellow"
        }
      },
      "Dinosaur Token, Wood": {
        "Sizeless": {
          "Blue": "Dinosaur Token, Wood, Blue",
          "Green": "Dinosaur Token, Wood, Green",
          "Orange": "Dinosaur Token, Wood, Orange",
          "Purple": "Dinosaur Token, Wood, Purple",
          "Red": "Dinosaur Token, Wood, Red"
        }
      },
      "Dinosaur Tokens, Wood": {
        "Sizeless": {
          "Pink": "Dinosaur Tokens, Wood, Pink"
        }
      },
      "Dinosaur, Ankylosaurus": {
        "Sizeless": {
          "Colorless": "Dinosaur, Ankylosaurus",
          "Pink": "Dinosaur, Ankylosaurus, Pink"
        }
      },
      "Dinosaur, Ankylosaurus, Wood": {
        "Sizeless": {
          "Blue": "Dinosaur, Ankylosaurus, Wood, Blue",
          "Green": "Dinosaur, Ankylosaurus, Wood, Green",
          "Orange": "Dinosaur, Ankylosaurus, Wood, Orange",
          "Pink": "Dinosaur, Ankylosaurus, Wood, Pink",
          "Purple": "Dinosaur, Ankylosaurus, Wood, Purple",
          "Red": "Dinosaur, Ankylosaurus, Wood, Red",
          "White": "Dinosaur, Ankylosaurus, Wood, White"
        }
      },
      "Dinosaur, Brontosaurus": {
        "Sizeless": {
          "Colorless": "Dinosaur, Brontosaurus"
        }
      },
      "Dinosaur, Pachycephalosaurus": {
        "Sizeless": {
          "Colorless": "Dinosaur, Pachycephalosaurus"
        }
      },
      "Dinosaur, Pterodactyl": {
        "Sizeless": {
          "Colorless": "Dinosaur, Pterodactyl"
        }
      },
      "Dinosaur, Spinosaurus": {
        "Sizeless": {
          "Orange": "Dinosaur, Spinosaurus, Orange"
        }
      },
      "Dinosaur, Stegosaurus": {
        "Sizeless": {
          "Colorless": "Dinosaur, Stegosaurus",
          "Green": "Dinosaur, Stegosaurus, Green"
        }
      },
      "Dinosaur, Triceratops": {
        "Sizeless": {
          "Colorless": "Dinosaur, Triceratops",
          "Red": "Dinosaur, Triceratops, Red"
        }
      },
      "Dinosaur, Tyrannosaurus": {
        "Sizeless": {
          "Colorless": "Dinosaur, Tyrannosaurus",
          "Blue": "Dinosaur, Tyrannosaurus, Blue",
          "Green": "Dinosaur, Tyrannosaurus, Green",
          "Orange": "Dinosaur, Tyrannosaurus, Orange",
          "Pink": "Dinosaur, Tyrannosaurus, Pink",
          "Purple": "Dinosaur, Tyrannosaurus, Purple",
          "Red": "Dinosaur, Tyrannosaurus, Red"
        }
      },
      "Dinosaur, Tyrannosaurus, Dark": {
        "Sizeless": {
          "Green": "Dinosaur, Tyrannosaurus, Dark Green"
        }
      },
      "Dinosaur, Velociraptor": {
        "Sizeless": {
          "Colorless": "Dinosaur, Velociraptor",
          "Gray": "Dinosaur, Velociraptor, Gray"
        }
      },
      "Dog, Acrylic": {
        "Sizeless": {
          "Colorless": "Dog, Acrylic"
        }
      },
      "Dog, Post Apocalypse, Armor, TB25": {
        "Sizeless": {
          "Colorless": "Dog, Post Apocalypse, Armor, TB25"
        }
      },
      "Donkey, Wood": {
        "Sizeless": {
          "Colorless": "Donkey, Wood"
        }
      },
      "Dove": {
        "Sizeless": {
          "Colorless": "Dove"
        }
      },
      "Dragon, Blue, Dark": {
        "Sizeless": {
          "Colorless": "Dragon, Blue, Dark"
        }
      },
      "Dragon, Blue, Light": {
        "Sizeless": {
          "Colorless": "Dragon, Blue, Light"
        }
      },
      "Dragon, Fantasy, TB15": {
        "Sizeless": {
          "Black": "Dragon, Fantasy, TB15, Black",
          "Blue": "Dragon, Fantasy, TB15, Blue",
          "Green": "Dragon, Fantasy, TB15, Green",
          "Orange": "Dragon, Fantasy, TB15, Orange",
          "Purple": "Dragon, Fantasy, TB15, Purple",
          "Red": "Dragon, Fantasy, TB15, Red",
          "White": "Dragon, Fantasy, TB15, White",
          "Yellow": "Dragon, Fantasy, TB15, Yellow"
        }
      },
      "Dragon, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "Dragon, Fantasy, TB50"
        }
      },
      "Dragon": {
        "Sizeless": {
          "Orange": "Dragon, Orange",
          "Red": "Dragon, Red"
        },
        "Small": {
          "Blue": "Dragon, Small, Blue",
          "Green": "Dragon, Small, Green",
          "Red": "Dragon, Small, Red",
          "Yellow": "Dragon, Small, Yellow"
        }
      },
      "Elephant with Rider": {
        "Sizeless": {
          "Green": "Elephant with Rider, Green",
          "Gray": "Elephant with Rider, Gray",
          "Orange": "Elephant with Rider, Orange",
          "Purple": "Elephant with Rider, Purple",
          "Red": "Elephant with Rider, Red",
          "Yellow": "Elephant with Rider, Yellow"
        }
      },
      "Fish, Wood": {
        "Sizeless": {
          "Yellow": "Fish, Wood, Yellow"
        }
      },
      "Frog Rider": {
        "Sizeless": {
          "Blue": "Frog Rider, Blue",
          "Brown": "Frog Rider, Brown",
          "Green": "Frog Rider, Green",
          "Red": "Frog Rider, Red",
          "Yellow": "Frog Rider, Yellow"
        }
      },
      "Frogfolk, Spear, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Frogfolk, Spear, Fantasy, TB25"
        }
      },
      "Goat, Acrylic": {
        "Sizeless": {
          "Colorless": "Goat, Acrylic"
        }
      },
      "Goat, Random": {
        "Sizeless": {
          "Colorless": "Goat, Random"
        }
      },
      "Gorilla": {
        "Sizeless": {
          "Colorless": "Gorilla"
        }
      },
      "Grick, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Grick, Fantasy, TB25"
        }
      },
      "Grizzly Bear": {
        "Sizeless": {
          "Colorless": "Grizzly Bear"
        }
      },
      "Handmade Fish": {
        "Sizeless": {
          "Colorless": "Handmade Fish"
        }
      },
      "Handmade Sheep": {
        "Sizeless": {
          "Colorless": "Handmade Sheep"
        }
      },
      "Horse, Acrylic": {
        "Sizeless": {
          "Colorless": "Horse, Acrylic"
        }
      },
      "Kitten": {
        "Sizeless": {
          "Brown": "Kitten, Brown",
          "White": "Kitten, White"
        }
      },
      "Kitten, White with Brown ": {
        "Sizeless": {
          "Colorless": "Kitten, White with Brown "
        }
      },
      "Lady Bug, Wood": {
        "Sizeless": {
          "Colorless": "Lady Bug, Wood"
        }
      },
      "Lion": {
        "Sizeless": {
          "Colorless": "Lion"
        }
      },
      "Lizardman, Javelin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Lizardman, Javelin, Fantasy, TB25"
        }
      },
      "Mouse, Acrylic": {
        "Sizeless": {
          "Colorless": "Mouse, Acrylic"
        }
      },
      "Mouse, Wood": {
        "Sizeless": {
          "Gray": "Mouse, Wood, Gray"
        }
      },
      "Pig, Mini, Black and": {
        "Sizeless": {
          "White": "Pig, Mini, Black and White"
        }
      },
      "Pig, Mini": {
        "Sizeless": {
          "Brown": "Pig, Mini, Brown",
          "Pink": "Pig, Mini, Pink"
        }
      },
      "Pig, TB15": {
        "Sizeless": {
          "Black": "Pig, TB15, Black",
          "Blue": "Pig, TB15, Blue",
          "Green": "Pig, TB15, Green",
          "Orange": "Pig, TB15, Orange",
          "Purple": "Pig, TB15, Purple",
          "Red": "Pig, TB15, Red",
          "White": "Pig, TB15, White",
          "Yellow": "Pig, TB15, Yellow"
        }
      },
      "Pig, Wood": {
        "Sizeless": {
          "Black": "Pig, Wood, Black",
          "Pink": "Pig, Wood, Pink"
        }
      },
      "Pigface Orc Halberd, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pigface Orc Halberd, Fantasy, TB25"
        }
      },
      "Polar Bear": {
        "Sizeless": {
          "Colorless": "Polar Bear"
        }
      },
      "Premium Cow": {
        "Sizeless": {
          "Colorless": "Premium Cow"
        }
      },
      "Premium Fish": {
        "Sizeless": {
          "Colorless": "Premium Fish"
        }
      },
      "Premium Pink Pig": {
        "Sizeless": {
          "Colorless": "Premium Pink Pig"
        }
      },
      "Premium Sheep": {
        "Sizeless": {
          "Colorless": "Premium Sheep"
        }
      },
      "Puppy, Black lab": {
        "Sizeless": {
          "Colorless": "Puppy, Black lab"
        }
      },
      "Puppy, Bulldog": {
        "Sizeless": {
          "Colorless": "Puppy, Bulldog"
        }
      },
      "Puppy, Mutt": {
        "Sizeless": {
          "Colorless": "Puppy, Mutt"
        }
      },
      "Puppy, Poodle": {
        "Sizeless": {
          "Colorless": "Puppy, Poodle"
        }
      },
      "Puppy, TB15": {
        "Sizeless": {
          "Black": "Puppy, TB15, Black",
          "Blue": "Puppy, TB15, Blue",
          "Green": "Puppy, TB15, Green",
          "Orange": "Puppy, TB15, Orange",
          "Purple": "Puppy, TB15, Purple",
          "Red": "Puppy, TB15, Red",
          "White": "Puppy, TB15, White",
          "Yellow": "Puppy, TB15, Yellow"
        }
      },
      "Puppy, Terrier": {
        "Sizeless": {
          "Colorless": "Puppy, Terrier"
        }
      },
      "Puppy, Yellow lab": {
        "Sizeless": {
          "Colorless": "Puppy, Yellow lab"
        }
      },
      "Puppy, Yorkie": {
        "Sizeless": {
          "Colorless": "Puppy, Yorkie"
        }
      },
      "Rabbit": {
        "Sizeless": {
          "Purple": "Rabbit, Purple"
        }
      },
      "Rat, Acrylic": {
        "Sizeless": {
          "Colorless": "Rat, Acrylic"
        }
      },
      "Rhinoceros": {
        "Sizeless": {
          "Colorless": "Rhinoceros"
        }
      },
      "Rooster": {
        "Sizeless": {
          "Black": "Rooster, Black",
          "Blue": "Rooster, Blue",
          "Green": "Rooster, Green",
          "Orange": "Rooster, Orange",
          "Purple": "Rooster, Purple",
          "Red": "Rooster, Red",
          "White": "Rooster, White",
          "Yellow": "Rooster, Yellow"
        }
      },
      "Sheep": {
        "Sizeless": {
          "Colorless": "Sheep"
        }
      },
      "Sheep, Random": {
        "Sizeless": {
          "Colorless": "Sheep, Random"
        }
      },
      "Spider": {
        "Sizeless": {
          "Colorless": "Spider"
        }
      },
      "Spider Eggs": {
        "Sizeless": {
          "Colorless": "Spider Eggs"
        }
      }
    },
    "vehicle": {
      "Acrylic Train Track": {
        "Sizeless": {
          "Black": "Acrylic Train Track, Black",
          "Blue": "Acrylic Train Track, Blue",
          "Green": "Acrylic Train Track, Green",
          "Orange": "Acrylic Train Track, Orange",
          "Purple": "Acrylic Train Track, Purple",
          "Red": "Acrylic Train Track, Red",
          "White": "Acrylic Train Track, White",
          "Yellow": "Acrylic Train Track, Yellow"
        }
      },
      "Acrylic Train, Box Car": {
        "Sizeless": {
          "Black": "Acrylic Train, Box Car, Black",
          "Blue": "Acrylic Train, Box Car, Blue",
          "Green": "Acrylic Train, Box Car, Green",
          "Orange": "Acrylic Train, Box Car, Orange",
          "Purple": "Acrylic Train, Box Car, Purple",
          "Red": "Acrylic Train, Box Car, Red",
          "White": "Acrylic Train, Box Car, White",
          "Yellow": "Acrylic Train, Box Car, Yellow"
        }
      },
      "Acrylic Train, Caboose": {
        "Sizeless": {
          "Black": "Acrylic Train, Caboose, Black",
          "Blue": "Acrylic Train, Caboose, Blue",
          "Green": "Acrylic Train, Caboose, Green",
          "Orange": "Acrylic Train, Caboose, Orange",
          "Purple": "Acrylic Train, Caboose, Purple",
          "Red": "Acrylic Train, Caboose, Red",
          "White": "Acrylic Train, Caboose, White",
          "Yellow": "Acrylic Train, Caboose, Yellow"
        }
      },
      "Acrylic Train, Coal Car": {
        "Sizeless": {
          "Black": "Acrylic Train, Coal Car, Black",
          "Blue": "Acrylic Train, Coal Car, Blue",
          "Green": "Acrylic Train, Coal Car, Green",
          "Orange": "Acrylic Train, Coal Car, Orange",
          "Purple": "Acrylic Train, Coal Car, Purple",
          "Red": "Acrylic Train, Coal Car, Red",
          "White": "Acrylic Train, Coal Car, White",
          "Yellow": "Acrylic Train, Coal Car, Yellow"
        }
      },
      "Acrylic Train, Flat Bed": {
        "Sizeless": {
          "Black": "Acrylic Train, Flat Bed, Black",
          "Blue": "Acrylic Train, Flat Bed, Blue",
          "Green": "Acrylic Train, Flat Bed, Green",
          "Orange": "Acrylic Train, Flat Bed, Orange",
          "Purple": "Acrylic Train, Flat Bed, Purple",
          "Red": "Acrylic Train, Flat Bed, Red",
          "White": "Acrylic Train, Flat Bed, White",
          "Yellow": "Acrylic Train, Flat Bed, Yellow"
        }
      },
      "Acrylic Train, Modern Engine": {
        "Sizeless": {
          "Black": "Acrylic Train, Modern Engine, Black",
          "Blue": "Acrylic Train, Modern Engine, Blue",
          "Green": "Acrylic Train, Modern Engine, Green",
          "Orange": "Acrylic Train, Modern Engine, Orange",
          "Purple": "Acrylic Train, Modern Engine, Purple",
          "Red": "Acrylic Train, Modern Engine, Red",
          "White": "Acrylic Train, Modern Engine, White",
          "Yellow": "Acrylic Train, Modern Engine, Yellow"
        }
      },
      "Acrylic Train, Passenger Car": {
        "Sizeless": {
          "Black": "Acrylic Train, Passenger Car, Black",
          "Blue": "Acrylic Train, Passenger Car, Blue",
          "Green": "Acrylic Train, Passenger Car, Green",
          "Orange": "Acrylic Train, Passenger Car, Orange",
          "Purple": "Acrylic Train, Passenger Car, Purple",
          "Red": "Acrylic Train, Passenger Car, Red",
          "White": "Acrylic Train, Passenger Car, White",
          "Yellow": "Acrylic Train, Passenger Car, Yellow"
        }
      },
      "Acrylic Train, Steam Engine": {
        "Sizeless": {
          "Black": "Acrylic Train, Steam Engine, Black",
          "Blue": "Acrylic Train, Steam Engine, Blue",
          "Green": "Acrylic Train, Steam Engine, Green",
          "Orange": "Acrylic Train, Steam Engine, Orange",
          "Purple": "Acrylic Train, Steam Engine, Purple",
          "Red": "Acrylic Train, Steam Engine, Red",
          "White": "Acrylic Train, Steam Engine, White",
          "Yellow": "Acrylic Train, Steam Engine, Yellow"
        }
      },
      "Acrylic Train, Tank Car": {
        "Sizeless": {
          "Black": "Acrylic Train, Tank Car, Black",
          "Blue": "Acrylic Train, Tank Car, Blue",
          "Green": "Acrylic Train, Tank Car, Green",
          "Orange": "Acrylic Train, Tank Car, Orange",
          "Purple": "Acrylic Train, Tank Car, Purple",
          "Red": "Acrylic Train, Tank Car, Red",
          "White": "Acrylic Train, Tank Car, White",
          "Yellow": "Acrylic Train, Tank Car, Yellow"
        }
      },
      "Airplane": {
        "Large": {
          "Black": "Airplane, Large, Black",
          "Blue": "Airplane, Large, Blue",
          "Green": "Airplane, Large, Green",
          "Orange": "Airplane, Large, Orange",
          "Purple": "Airplane, Large, Purple",
          "Red": "Airplane, Large, Red",
          "White": "Airplane, Large, White",
          "Yellow": "Airplane, Large, Yellow"
        },
        "Small": {
          "Black": "Airplane, Small, Black",
          "Blue": "Airplane, Small, Blue",
          "Orange": "Airplane, Small, Orange",
          "Purple": "Airplane, Small, Purple",
          "Red": "Airplane, Small, Red",
          "White": "Airplane, Small, White",
          "Yellow": "Airplane, Small, Yellow"
        }
      },
      "Bulldozer, Acrylic": {
        "Sizeless": {
          "Colorless": "Bulldozer, Acrylic"
        }
      },
      "Car": {
        "Sizeless": {
          "Black": "Car, Black",
          "Blue": "Car, Blue",
          "Green": "Car, Green",
          "Orange": "Car, Orange",
          "Purple": "Car, Purple",
          "Red": "Car, Red",
          "White": "Car, White",
          "Yellow": "Car, Yellow"
        }
      },
      "Car, Muscle": {
        "Sizeless": {
          "Black": "Car, Muscle, Black",
          "Blue": "Car, Muscle, Blue",
          "Green": "Car, Muscle, Green",
          "Orange": "Car, Muscle, Orange",
          "Purple": "Car, Muscle, Purple",
          "Red": "Car, Muscle, Red",
          "White": "Car, Muscle, White",
          "Yellow": "Car, Muscle, Yellow"
        }
      },
      "Car, Race": {
        "Sizeless": {
          "Black": "Car, Race, Black",
          "Blue": "Car, Race, Blue",
          "Green": "Car, Race, Green",
          "Orange": "Car, Race, Orange",
          "Purple": "Car, Race, Purple",
          "Red": "Car, Race, Red",
          "White": "Car, Race, White",
          "Yellow": "Car, Race, Yellow"
        }
      },
      "Car, Sporty": {
        "Sizeless": {
          "Blue": "Car, Sporty, Blue",
          "Yellow": "Car, Sporty, Yellow"
        }
      },
      "Car, Vintage Jalopy": {
        "Sizeless": {
          "Orange": "Car, Vintage Jalopy, Orange"
        }
      },
      "Car, Vintage Roadster": {
        "Sizeless": {
          "Yellow": "Car, Vintage Roadster, Yellow"
        }
      },
      "Container Ship": {
        "Sizeless": {
          "Blue": "Container Ship, Blue",
          "Green": "Container Ship, Green",
          "Gray": "Container Ship, Gray",
          "Red": "Container Ship, Red",
          "Yellow": "Container Ship, Yellow"
        }
      },
      "Fighter Ship, Set of 6": {
        "6": {
          "Colorless": "Fighter Ship, Set of 6"
        }
      },
      "Future Tank": {
        "Sizeless": {
          "Black": "Future Tank, Black",
          "Blue": "Future Tank, Blue",
          "Green": "Future Tank, Green",
          "Orange": "Future Tank, Orange",
          "Purple": "Future Tank, Purple",
          "Red": "Future Tank, Red",
          "White": "Future Tank, White",
          "Yellow": "Future Tank, Yellow"
        }
      },
      "Helicopter, Acrylic": {
        "Sizeless": {
          "Colorless": "Helicopter, Acrylic"
        }
      },
      "Hot Rod": {
        "Sizeless": {
          "Black": "Hot Rod, Black",
          "Blue": "Hot Rod, Blue",
          "Green": "Hot Rod, Green",
          "Orange": "Hot Rod, Orange",
          "Purple": "Hot Rod, Purple",
          "Red": "Hot Rod, Red",
          "White": "Hot Rod, White",
          "Yellow": "Hot Rod, Yellow"
        }
      },
      "Limo": {
        "Sizeless": {
          "Blue": "Limo, Blue",
          "Green": "Limo, Green",
          "Red": "Limo, Red",
          "Yellow": "Limo, Yellow"
        }
      },
      "Locomotive Train Engine": {
        "Sizeless": {
          "Black": "Locomotive Train Engine, Black",
          "Green": "Locomotive Train Engine, Green",
          "Orange": "Locomotive Train Engine, Orange"
        }
      },
      "Locomotive Train Engine, Light": {
        "Sizeless": {
          "Blue": "Locomotive Train Engine, Light Blue"
        }
      },
      "Locomotive Train Engine, Tan": {
        "Sizeless": {
          "Colorless": "Locomotive Train Engine, Tan"
        }
      },
      "Locomotive": {
        "Sizeless": {
          "Black": "Locomotive, Black",
          "Blue": "Locomotive, Blue",
          "Green": "Locomotive, Green",
          "Orange": "Locomotive, Orange",
          "Purple": "Locomotive, Purple",
          "Red": "Locomotive, Red",
          "White": "Locomotive, White",
          "Yellow": "Locomotive, Yellow"
        }
      },
      "Motor Boat": {
        "Sizeless": {
          "Black": "Motor Boat, Black",
          "Blue": "Motor Boat, Blue",
          "Green": "Motor Boat, Green",
          "Orange": "Motor Boat, Orange",
          "Purple": "Motor Boat, Purple",
          "Red": "Motor Boat, Red",
          "White": "Motor Boat, White",
          "Yellow": "Motor Boat, Yellow"
        }
      },
      "Motorcycle": {
        "Sizeless": {
          "Black": "Motorcycle, Black",
          "Blue": "Motorcycle, Blue",
          "Green": "Motorcycle, Green",
          "Orange": "Motorcycle, Orange",
          "Purple": "Motorcycle, Purple",
          "Red": "Motorcycle, Red",
          "White": "Motorcycle, White",
          "Yellow": "Motorcycle, Yellow"
        }
      },
      "Muscle Car, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "Muscle Car, Post Apocalypse"
        }
      },
      "Push Cart": {
        "Sizeless": {
          "Black": "Push Cart, Black",
          "Blue": "Push Cart, Blue",
          "Green": "Push Cart, Green",
          "Orange": "Push Cart, Orange",
          "Purple": "Push Cart, Purple",
          "Red": "Push Cart, Red",
          "White": "Push Cart, White",
          "Yellow": "Push Cart, Yellow"
        }
      },
      "Race Car": {
        "Sizeless": {
          "Black": "Race Car, Black",
          "Blue": "Race Car, Blue",
          "Green": "Race Car, Green",
          "Orange": "Race Car, Orange",
          "Purple": "Race Car, Purple",
          "Red": "Race Car, Red",
          "Yellow": "Race Car, Yellow"
        }
      },
      "Rocket": {
        "Sizeless": {
          "Black": "Rocket, Black",
          "Blue": "Rocket, Blue",
          "Green": "Rocket, Green",
          "Orange": "Rocket, Orange",
          "Purple": "Rocket, Purple",
          "Red": "Rocket, Red",
          "White": "Rocket, White",
          "Yellow": "Rocket, Yellow"
        }
      },
      "Sailboat": {
        "Sizeless": {
          "Black": "Sailboat, Black",
          "Blue": "Sailboat, Blue",
          "Green": "Sailboat, Green",
          "Orange": "Sailboat, Orange",
          "Purple": "Sailboat, Purple",
          "Red": "Sailboat, Red",
          "White": "Sailboat, White",
          "Yellow": "Sailboat, Yellow"
        }
      },
      "Semi Truck, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "Semi Truck, Post Apocalypse"
        }
      },
      "Ship, Air, Steampunk": {
        "Sizeless": {
          "Black": "Ship, Air, Steampunk, Black",
          "Blue": "Ship, Air, Steampunk, Blue",
          "Green": "Ship, Air, Steampunk, Green",
          "Orange": "Ship, Air, Steampunk, Orange",
          "Purple": "Ship, Air, Steampunk, Purple",
          "Red": "Ship, Air, Steampunk, Red",
          "White": "Ship, Air, Steampunk, White",
          "Yellow": "Ship, Air, Steampunk, Yellow"
        }
      },
      "Ship, Modern, Aircraft Carrier": {
        "Sizeless": {
          "Black": "Ship, Modern, Aircraft Carrier, Black",
          "Green": "Ship, Modern, Aircraft Carrier, Green",
          "Orange": "Ship, Modern, Aircraft Carrier, Orange",
          "Purple": "Ship, Modern, Aircraft Carrier, Purple",
          "White": "Ship, Modern, Aircraft Carrier, White"
        }
      },
      "Ship, Modern, Battleship": {
        "Sizeless": {
          "Black": "Ship, Modern, Battleship, Black",
          "Green": "Ship, Modern, Battleship, Green",
          "Orange": "Ship, Modern, Battleship, Orange",
          "Purple": "Ship, Modern, Battleship, Purple",
          "White": "Ship, Modern, Battleship, White"
        }
      },
      "Ship, Modern, Container": {
        "Sizeless": {
          "Black": "Ship, Modern, Container, Black",
          "Green": "Ship, Modern, Container, Green",
          "Orange": "Ship, Modern, Container, Orange",
          "Purple": "Ship, Modern, Container, Purple",
          "White": "Ship, Modern, Container, White"
        }
      },
      "Ship, Modern, Cruiser": {
        "Sizeless": {
          "Black": "Ship, Modern, Cruiser, Black",
          "Green": "Ship, Modern, Cruiser, Green",
          "Orange": "Ship, Modern, Cruiser, Orange",
          "Purple": "Ship, Modern, Cruiser, Purple",
          "White": "Ship, Modern, Cruiser, White"
        }
      },
      "Ship, Modern, Destroyer": {
        "Sizeless": {
          "Black": "Ship, Modern, Destroyer, Black",
          "Green": "Ship, Modern, Destroyer, Green",
          "Orange": "Ship, Modern, Destroyer, Orange",
          "Purple": "Ship, Modern, Destroyer, Purple",
          "White": "Ship, Modern, Destroyer, White"
        }
      },
      "Ship, Modern, Submarine": {
        "Sizeless": {
          "Black": "Ship, Modern, Submarine, Black",
          "Green": "Ship, Modern, Submarine, Green",
          "Orange": "Ship, Modern, Submarine, Orange",
          "Purple": "Ship, Modern, Submarine, Purple",
          "White": "Ship, Modern, Submarine, White"
        }
      },
      "Ship, Modern, Transport": {
        "Sizeless": {
          "Black": "Ship, Modern, Transport, Black",
          "Green": "Ship, Modern, Transport, Green",
          "Orange": "Ship, Modern, Transport, Orange",
          "Purple": "Ship, Modern, Transport, Purple",
          "White": "Ship, Modern, Transport, White"
        }
      },
      "Ship, Sea, British": {
        "Sizeless": {
          "Black": "Ship, Sea, British, Black",
          "Blue": "Ship, Sea, British, Blue",
          "Green": "Ship, Sea, British, Green",
          "Orange": "Ship, Sea, British, Orange",
          "Purple": "Ship, Sea, British, Purple",
          "Red": "Ship, Sea, British, Red",
          "White": "Ship, Sea, British, White",
          "Yellow": "Ship, Sea, British, Yellow"
        }
      },
      "Ship, Sea, Pirate": {
        "Sizeless": {
          "Black": "Ship, Sea, Pirate, Black",
          "Blue": "Ship, Sea, Pirate, Blue",
          "Green": "Ship, Sea, Pirate, Green",
          "Orange": "Ship, Sea, Pirate, Orange",
          "Purple": "Ship, Sea, Pirate, Purple",
          "Red": "Ship, Sea, Pirate, Red",
          "White": "Ship, Sea, Pirate, White",
          "Yellow": "Ship, Sea, Pirate, Yellow"
        }
      },
      "Ship, Sea, Viking, Longboat": {
        "Sizeless": {
          "Black": "Ship, Sea, Viking, Longboat, Black",
          "Blue": "Ship, Sea, Viking, Longboat, Blue",
          "Green": "Ship, Sea, Viking, Longboat, Green",
          "Orange": "Ship, Sea, Viking, Longboat, Orange",
          "Purple": "Ship, Sea, Viking, Longboat, Purple",
          "Red": "Ship, Sea, Viking, Longboat, Red",
          "White": "Ship, Sea, Viking, Longboat, White",
          "Yellow": "Ship, Sea, Viking, Longboat, Yellow"
        }
      },
      "Ship, Space, Fighter": {
        "Sizeless": {
          "Black": "Ship, Space, Fighter, Black",
          "Blue": "Ship, Space, Fighter, Blue",
          "Green": "Ship, Space, Fighter, Green",
          "Orange": "Ship, Space, Fighter, Orange",
          "Purple": "Ship, Space, Fighter, Purple",
          "Red": "Ship, Space, Fighter, Red",
          "White": "Ship, Space, Fighter, White",
          "Yellow": "Ship, Space, Fighter, Yellow"
        }
      },
      "Ship, Space, Freighter": {
        "Sizeless": {
          "Black": "Ship, Space, Freighter, Black",
          "Blue": "Ship, Space, Freighter, Blue",
          "Green": "Ship, Space, Freighter, Green",
          "Orange": "Ship, Space, Freighter, Orange",
          "Purple": "Ship, Space, Freighter, Purple",
          "Red": "Ship, Space, Freighter, Red",
          "White": "Ship, Space, Freighter, White",
          "Yellow": "Ship, Space, Freighter, Yellow"
        }
      },
      "Ship, Space, Smuggler": {
        "Sizeless": {
          "Black": "Ship, Space, Smuggler, Black",
          "Blue": "Ship, Space, Smuggler, Blue",
          "Green": "Ship, Space, Smuggler, Green",
          "Orange": "Ship, Space, Smuggler, Orange",
          "Purple": "Ship, Space, Smuggler, Purple",
          "Red": "Ship, Space, Smuggler, Red",
          "White": "Ship, Space, Smuggler, White",
          "Yellow": "Ship, Space, Smuggler, Yellow"
        }
      },
      "Ship, Space, Transport": {
        "Sizeless": {
          "Black": "Ship, Space, Transport, Black",
          "Blue": "Ship, Space, Transport, Blue",
          "Green": "Ship, Space, Transport, Green",
          "Orange": "Ship, Space, Transport, Orange",
          "Purple": "Ship, Space, Transport, Purple",
          "Red": "Ship, Space, Transport, Red",
          "White": "Ship, Space, Transport, White",
          "Yellow": "Ship, Space, Transport, Yellow"
        }
      },
      "Ship, Space, UFO": {
        "Sizeless": {
          "Black": "Ship, Space, UFO, Black",
          "Blue": "Ship, Space, UFO, Blue",
          "Green": "Ship, Space, UFO, Green",
          "Orange": "Ship, Space, UFO, Orange",
          "Purple": "Ship, Space, UFO, Purple",
          "Red": "Ship, Space, UFO, Red",
          "Silver": "Ship, Space, UFO, Silver",
          "White": "Ship, Space, UFO, White",
          "Yellow": "Ship, Space, UFO, Yellow"
        }
      },
      "Sprue, Military, Beige": {
        "Sizeless": {
          "Colorless": "Sprue, Military, Beige"
        }
      },
      "Sprue, Military": {
        "Sizeless": {
          "Blue": "Sprue, Military, Blue",
          "Brown": "Sprue, Military, Brown",
          "Green": "Sprue, Military, Green",
          "Gray": "Sprue, Military, Gray",
          "Red": "Sprue, Military, Red"
        }
      },
      "Submarine": {
        "Sizeless": {
          "Black": "Submarine, Black",
          "Blue": "Submarine, Blue",
          "Green": "Submarine, Green",
          "Orange": "Submarine, Orange",
          "Purple": "Submarine, Purple",
          "Red": "Submarine, Red",
          "White": "Submarine, White",
          "Yellow": "Submarine, Yellow"
        }
      },
      "SUV, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "SUV, Post Apocalypse"
        }
      },
      "Tank": {
        "Sizeless": {
          "Black": "Tank, Black",
          "Blue": "Tank, Blue",
          "Brown": "Tank, Brown",
          "Green": "Tank, Green",
          "Orange": "Tank, Orange",
          "Purple": "Tank, Purple",
          "Red": "Tank, Red",
          "White": "Tank, White",
          "Yellow": "Tank, Yellow"
        }
      },
      "Tank, Clear": {
        "Sizeless": {
          "Colorless": "Tank, Clear"
        }
      },
      "Tank, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "Tank, Post Apocalypse"
        }
      },
      "Train Engine, Wood": {
        "Sizeless": {
          "Blue": "Train Engine, Wood, Blue",
          "Orange": "Train Engine, Wood, Orange",
          "Purple": "Train Engine, Wood, Purple",
          "Red": "Train Engine, Wood, Red",
          "White": "Train Engine, Wood, White",
          "Yellow": "Train Engine, Wood, Yellow"
        }
      },
      "Transport Ship, Set of 6": {
        "6": {
          "Colorless": "Transport Ship, Set of 6"
        }
      },
      "Truck, Flatbed": {
        "Sizeless": {
          "Black": "Truck, Flatbed, Black",
          "Blue": "Truck, Flatbed, Blue",
          "Green": "Truck, Flatbed, Green",
          "Orange": "Truck, Flatbed, Orange",
          "Purple": "Truck, Flatbed, Purple",
          "Red": "Truck, Flatbed, Red",
          "White": "Truck, Flatbed, White",
          "Yellow": "Truck, Flatbed, Yellow"
        }
      },
      "Truck, Wood": {
        "Sizeless": {
          "Blue": "Truck, Wood, Blue",
          "Green": "Truck, Wood, Green",
          "Gray": "Truck, Wood, Gray",
          "Red": "Truck, Wood, Red",
          "Yellow": "Truck, Wood, Yellow"
        }
      },
      "Van, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "Van, Post Apocalypse"
        }
      },
      "Future Tank, Tan": {
        "Sizeless": {
          "Colorless": "Future Tank, Tan"
        }
      }
    },
    "casino": {
      "Dealer Button": {
        "Sizeless": {
          "Colorless": "Dealer Button"
        }
      },
      "Poker Chip, Fancy": {
        "19mm": {
          "Black": "Poker Chip, 19mm, Fancy, Black",
          "Blue": "Poker Chip, 19mm, Fancy, Blue",
          "Green": "Poker Chip, 19mm, Fancy, Green",
          "Purple": "Poker Chip, 19mm, Fancy, Purple",
          "Red": "Poker Chip, 19mm, Fancy, Red",
          "Yellow": "Poker Chip, 19mm, Fancy, Yellow"
        }
      },
      "Poker Chip": {
        "Sizeless": {
          "Black": "Poker Chip, Black",
          "Blue": "Poker Chip, Blue",
          "Green": "Poker Chip, Green",
          "Orange": "Poker Chip, Orange",
          "Purple": "Poker Chip, Purple",
          "Red": "Poker Chip, Red",
          "White": "Poker Chip, White",
          "Yellow": "Poker Chip, Yellow"
        }
      },
      "Poker Chip, Light": {
        "Sizeless": {
          "Blue": "Poker Chip, Light Blue"
        }
      },
      "Suits, Clubs": {
        "Sizeless": {
          "Colorless": "Suits, Clubs"
        }
      },
      "Suits, Diamonds": {
        "Sizeless": {
          "Colorless": "Suits, Diamonds"
        }
      },
      "Suits, Hearts": {
        "Sizeless": {
          "Colorless": "Suits, Hearts"
        }
      },
      "Suits, Spades": {
        "Sizeless": {
          "Colorless": "Suits, Spades"
        }
      },
      "Token Chip": {
        "Sizeless": {
          "Black": "Token Chip, Black",
          "Blue": "Token Chip, Blue",
          "Green": "Token Chip, Green",
          "Orange": "Token Chip, Orange",
          "Purple": "Token Chip, Purple",
          "Red": "Token Chip, Red",
          "White": "Token Chip, White",
          "Yellow": "Token Chip, Yellow"
        }
      },
      "Token Chip, Indented": {
        "Sizeless": {
          "Orange": "Token Chip, Indented, Orange"
        }
      }
    },
    "money": {
      "Blank Money, Play": {
        "Sizeless": {
          "Colorless": "Blank Money, Play"
        }
      },
      "Cash, $1": {
        "Sizeless": {
          "Colorless": "Cash, $1"
        }
      },
      "Cash, $10": {
        "Sizeless": {
          "Colorless": "Cash, $10"
        }
      },
      "Cash, $100": {
        "Sizeless": {
          "Colorless": "Cash, $100"
        }
      },
      "Cash, $100K": {
        "Sizeless": {
          "Colorless": "Cash, $100K"
        }
      },
      "Cash, $10K": {
        "Sizeless": {
          "Colorless": "Cash, $10K"
        }
      },
      "Cash, $1K": {
        "Sizeless": {
          "Colorless": "Cash, $1K"
        }
      },
      "Cash, $1M": {
        "Sizeless": {
          "Colorless": "Cash, $1M"
        }
      },
      "Cash, $20": {
        "Sizeless": {
          "Colorless": "Cash, $20"
        }
      },
      "Cash, $5": {
        "Sizeless": {
          "Colorless": "Cash, $5"
        }
      },
      "Cash, $50": {
        "Sizeless": {
          "Colorless": "Cash, $50"
        }
      },
      "Cash, $500": {
        "Sizeless": {
          "Colorless": "Cash, $500"
        }
      },
      "Cash, $500K": {
        "Sizeless": {
          "Colorless": "Cash, $500K"
        }
      },
      "Cash, $50K": {
        "Sizeless": {
          "Colorless": "Cash, $50K"
        }
      },
      "Cash, $5K": {
        "Sizeless": {
          "Colorless": "Cash, $5K"
        }
      },
      "City Coin": {
        "1": {
          "Colorless": "City Coin, 1"
        },
        "5": {
          "Colorless": "City Coin, 5"
        }
      },
      "Coin, 50 points": {
        "Sizeless": {
          "Colorless": "Coin, 50 points"
        }
      },
      "Coin, 5x": {
        "Sizeless": {
          "Colorless": "Coin, 5x"
        }
      },
      "Coin, Ancient Russian": {
        "22mm": {
          "Colorless": "Coin, Ancient Russian, 22mm"
        }
      },
      "Coin, Chinese": {
        "20mm": {
          "Colorless": "Coin, Chinese, 20mm"
        },
        "23mm": {
          "Colorless": "Coin, Chinese, 23mm"
        }
      },
      "Coin, Dime": {
        "Sizeless": {
          "Colorless": "Coin, Dime"
        }
      },
      "Coin, Dwarven": {
        "Sizeless": {
          "Colorless": "Coin, Dwarven"
        }
      },
      "Coin, Fantasy": {
        "1": {
          "Colorless": "Coin, Fantasy, 1"
        },
        "5": {
          "Colorless": "Coin, Fantasy, 5"
        },
        "10": {
          "Colorless": "Coin, Fantasy, 10"
        }
      },
      "Coin": {
        "Sizeless": {
          "Gold": "Coin, Gold",
          "Green": "Coin, Green",
          "Purple": "Coin, Purple"
        }
      },
      "Coin, Half dollar": {
        "Sizeless": {
          "Colorless": "Coin, Half dollar"
        }
      },
      "Coin, Medieval": {
        "Sizeless": {
          "Bronze": "Coin, Medieval, Bronze",
          "Gold": "Coin, Medieval, Gold",
          "Silver": "Coin, Medieval, Silver"
        }
      },
      "Coin, Nickel": {
        "Sizeless": {
          "Colorless": "Coin, Nickel"
        }
      },
      "Coin, Penny": {
        "Sizeless": {
          "Colorless": "Coin, Penny"
        }
      },
      "Coin, Pirate": {
        "35mm": {
          "Colorless": "Coin, Pirate, 35mm"
        }
      },
      "Coin, Quarter": {
        "Sizeless": {
          "Colorless": "Coin, Quarter"
        }
      },
      "Coin, Roman": {
        "18mm": {
          "Colorless": "Coin, Roman, 18mm"
        }
      },
      "Coin, Sacagawea Dollar": {
        "Sizeless": {
          "Colorless": "Coin, Sacagawea Dollar"
        }
      },
      "Coin, Timeless": {
        "1": {
          "Colorless": "Coin, Timeless, 1"
        },
        "5": {
          "Colorless": "Coin, Timeless, 5"
        },
        "10": {
          "Colorless": "Coin, Timeless, 10"
        }
      },
      "Doubloon, Metal": {
        "Sizeless": {
          "Gold": "Doubloon, Metal, Gold",
          "Silver": "Doubloon, Metal, Silver"
        }
      },
      "Doubloons": {
        "Sizeless": {
          "Colorless": "Doubloons"
        }
      },
      "Fantasy Coin 20": {
        "20": {
          "Colorless": "Fantasy Coin 20"
        }
      },
      "Fantasy Coin 5": {
        "5": {
          "Colorless": "Fantasy Coin 5"
        }
      },
      "Future Coin": {
        "1": {
          "Colorless": "Future Coin, 1"
        },
        "5": {
          "Colorless": "Future Coin, 5"
        }
      },
      "Medieval Coin 2": {
        "2": {
          "Colorless": "Medieval Coin 2"
        }
      },
      "Medieval Coin 20": {
        "20": {
          "Colorless": "Medieval Coin 20"
        }
      },
      "Money Pack": {
        "Sizeless": {
          "Orange": "Money Pack, Orange",
          "Pink": "Money Pack, Pink"
        }
      },
      "Old West Coin": {
        "Sizeless": {
          "Bronze": "Old West Coin, Bronze",
          "Gold": "Old West Coin, Gold",
          "Silver": "Old West Coin, Silver"
        }
      },
      "Sci-Fi Coin": {
        "Sizeless": {
          "Bronze": "Sci-Fi Coin, Bronze",
          "Gold": "Sci-Fi Coin, Gold",
          "Silver": "Sci-Fi Coin, Silver"
        }
      }
    },
    "utility": {
      "Card Stand": {
        "Sizeless": {
          "White": "Card Stand, White",
          "Black": "Card Stand, Black",
          "Blue": "Card Stand, Blue",
          "Green": "Card Stand, Green",
          "Red": "Card Stand, Red",
          "Yellow": "Card Stand, Yellow"
        }
      },
      "Badge Holder w/String Lanyard (box of 100)": {
        "Sizeless": {
          "Colorless": "Badge Holder w/String Lanyard (box of 100)"
        }
      },
      "Box Band, 6\"": {
        "Sizeless": {
          "Blue": "Box Band, 6\", Blue",
          "Green": "Box Band, 6\", Green",
          "Red": "Box Band, 6\", Red"
        }
      },
      "Box Band, 8\"": {
        "Sizeless": {
          "Blue": "Box Band, 8\", Blue",
          "Green": "Box Band, 8\", Green",
          "Red": "Box Band, 8\", Red"
        }
      },
      "Box Band, 9\"": {
        "Sizeless": {
          "Blue": "Box Band, 9\", Blue",
          "Green": "Box Band, 9\", Green",
          "Red": "Box Band, 9\", Red"
        }
      },
      "Card Holder": {
        "Sizeless": {
          "Colorless": "Card Holder"
        }
      },
      "Character Stand": {
        "Sizeless": {
          "Blue": "Character Stand, Blue",
          "Green": "Character Stand, Green",
          "Purple": "Character Stand, Purple",
          "Red": "Character Stand, Red",
          "Yellow": "Character Stand, Yellow"
        }
      },
      "Character Stand, Clear": {
        "Sizeless": {
          "Colorless": "Character Stand, Clear"
        }
      },
      "Decoder Strips": {
        "Sizeless": {
          "Colorless": "Decoder Strips"
        }
      },
      "Digital Timer": {
        "Sizeless": {
          "Colorless": "Digital Timer"
        }
      },
      "Direction Finder, Transparent": {
        "Sizeless": {
          "Black": "Direction Finder, Transparent, Black"
        }
      },
      "Game Stand": {
        "Sizeless": {
          "Black": "Game Stand, Black",
          "Blue": "Game Stand, Blue",
          "Green": "Game Stand, Green",
          "Orange": "Game Stand, Orange",
          "Purple": "Game Stand, Purple",
          "Red": "Game Stand, Red",
          "White": "Game Stand, White",
          "Yellow": "Game Stand, Yellow"
        }
      },
      "Magnifying Glass, 5X": {
        "Sizeless": {
          "Colorless": "Magnifying Glass, 5X"
        }
      },
      "Marker, Dry-Erase, Fine": {
        "Sizeless": {
          "Black": "Marker, Dry-Erase, Fine, Black",
          "Blue": "Marker, Dry-Erase, Fine, Blue",
          "Green": "Marker, Dry-Erase, Fine, Green",
          "Red": "Marker, Dry-Erase, Fine, Red"
        }
      },
      "Notepad": {
        "Sizeless": {
          "Colorless": "Notepad"
        }
      },
      "Pencil": {
        "Sizeless": {
          "Colorless": "Pencil"
        }
      },
      "Rivet": {
        "Sizeless": {
          "Black": "Rivet, Black"
        }
      },
      "Rubber Bands": {
        "Sizeless": {
          "Colorless": "Rubber Bands"
        }
      },
      "Sand Timer, 10 Seconds": {
        "Sizeless": {
          "Colorless": "Sand Timer, 10 Seconds"
        }
      },
      "Sand Timer, 120 seconds": {
        "Sizeless": {
          "Colorless": "Sand Timer, 120 seconds"
        }
      },
      "Sand Timer, 180 seconds": {
        "Sizeless": {
          "Colorless": "Sand Timer, 180 seconds"
        }
      },
      "Sand Timer, 30 seconds": {
        "Sizeless": {
          "Colorless": "Sand Timer, 30 seconds"
        }
      },
      "Sand Timer, 60 seconds": {
        "Sizeless": {
          "Colorless": "Sand Timer, 60 seconds"
        }
      },
      "Sand Timer, 90 seconds": {
        "Sizeless": {
          "Colorless": "Sand Timer, 90 seconds"
        }
      },
      "Screw, 6mm x 3mm": {
        "Sizeless": {
          "Black": "Screw, 6mm x 3mm, Black"
        }
      },
      "Screw, 8mm x 5mm": {
        "Sizeless": {
          "Black": "Screw, 8mm x 5mm, Black"
        }
      },
      "Sharpies": {
        "Sizeless": {
          "Colorless": "Sharpies"
        }
      },
      "Slider Clip": {
        "Sizeless": {
          "Black": "Slider Clip, Black",
          "Blue": "Slider Clip, Blue",
          "Green": "Slider Clip, Green",
          "Orange": "Slider Clip, Orange",
          "Purple": "Slider Clip, Purple",
          "Red": "Slider Clip, Red",
          "White": "Slider Clip, White",
          "Yellow": "Slider Clip, Yellow"
        }
      },
      "Slider Clip, Chipboard": {
        "Sizeless": {
          "Black": "Slider Clip, Chipboard, Black",
          "Blue": "Slider Clip, Chipboard, Blue",
          "Green": "Slider Clip, Chipboard, Green",
          "Orange": "Slider Clip, Chipboard, Orange",
          "Purple": "Slider Clip, Chipboard, Purple",
          "Red": "Slider Clip, Chipboard, Red",
          "White": "Slider Clip, Chipboard, White",
          "Yellow": "Slider Clip, Chipboard, Yellow"
        }
      },
      "Snap & Stack Condition Marker": {
        "Sizeless": {
          "Black": "Snap & Stack Condition Marker, Black",
          "Blue": "Snap & Stack Condition Marker, Blue",
          "Green": "Snap & Stack Condition Marker, Green",
          "Pink": "Snap & Stack Condition Marker, Pink",
          "White": "Snap & Stack Condition Marker, White",
          "Yellow": "Snap & Stack Condition Marker, Yellow"
        }
      },
      "Spinner": {
        "Sizeless": {
          "Black": "Spinner, Black",
          "Red": "Spinner, Red",
          "White": "Spinner, White"
        }
      },
      "Tape Measure": {
        "Sizeless": {
          "Colorless": "Tape Measure"
        }
      },
      "Tile Rack": {
        "Sizeless": {
          "Colorless": "Tile Rack"
        }
      },
      "Horizontal Game Master's Screen": {
        "Sizeless": {
          "Colorless": "Horizontal Game Master's Screen"
        }
      },
      "Stand, Chipboard, 4-way": {
        "Sizeless": {
          "Black": "Stand, Chipboard, 4-way, Black"
        }
      },
      "Vertical Game Master's Screen": {
        "Sizeless": {
          "Colorless": "Vertical Game Master's Screen"
        }
      }
    },
    "vial": {
      "Empty Vial": {
        "Sizeless": {
          "Colorless": "Empty Vial"
        }
      },
      "Fillable Vial": {
        "Sizeless": {
          "Colorless": "Fillable Vial"
        }
      },
      "Vial Liquid, Fluorescent": {
        "Sizeless": {
          "Blue": "Vial Liquid, Fluorescent Blue",
          "Green": "Vial Liquid, Fluorescent Green",
          "Orange": "Vial Liquid, Fluorescent Orange",
          "Red": "Vial Liquid, Fluorescent Red",
          "Yellow": "Vial Liquid, Fluorescent Yellow"
        }
      },
      "Vial Liquid, Opaque": {
        "Sizeless": {
          "Black": "Vial Liquid, Opaque Black",
          "Brown": "Vial Liquid, Opaque Brown",
          "Gray": "Vial Liquid, Opaque Gray",
          "Green": "Vial Liquid, Opaque Green",
          "Orange": "Vial Liquid, Opaque Orange",
          "Purple": "Vial Liquid, Opaque Purple",
          "Red": "Vial Liquid, Opaque Red",
          "White": "Vial Liquid, Opaque White",
          "Yellow": "Vial Liquid, Opaque Yellow"
        }
      },
      "Vial Liquid, Opaque  1": {
        "1": {
          "Blue": "Vial Liquid, Opaque Blue 1"
        }
      },
      "Vial Liquid, Opaque  2": {
        "2": {
          "Blue": "Vial Liquid, Opaque Blue 2"
        }
      },
      "Vial Liquid, Opaque  3": {
        "3": {
          "Blue": "Vial Liquid, Opaque Blue 3"
        }
      },
      "Vial Liquid, Opaque Ivory": {
        "Sizeless": {
          "Colorless": "Vial Liquid, Opaque Ivory"
        }
      },
      "Vial Liquid, Silver Mirror": {
        "Sizeless": {
          "Colorless": "Vial Liquid, Silver Mirror"
        }
      },
      "Vial Liquid, Transparent": {
        "Sizeless": {
          "Black": "Vial Liquid, Transparent, Black",
          "Blue": "Vial Liquid, Transparent, Blue",
          "Green": "Vial Liquid, Transparent, Green",
          "Orange": "Vial Liquid, Transparent, Orange",
          "Purple": "Vial Liquid, Transparent, Purple",
          "Red": "Vial Liquid, Transparent, Red",
          "Yellow": "Vial Liquid, Transparent, Yellow"
        }
      }
    },
    "symbol": {
      "Atom Symbol": {
        "Sizeless": {
          "Colorless": "Atom Symbol"
        }
      },
      "Exclamation Mark": {
        "Sizeless": {
          "Colorless": "Exclamation Mark"
        }
      },
      "Nuclear Symbol": {
        "Sizeless": {
          "Colorless": "Nuclear Symbol"
        }
      },
      "Question Mark": {
        "Sizeless": {
          "Colorless": "Question Mark"
        }
      },
      "Roman Numeral I": {
        "Sizeless": {
          "Black": "Roman Numeral I, Black",
          "Blue": "Roman Numeral I, Blue",
          "Brown": "Roman Numeral I, Brown",
          "Green": "Roman Numeral I, Green",
          "Red": "Roman Numeral I, Red",
          "Yellow": "Roman Numeral I, Yellow"
        }
      },
      "Roman Numeral I, Grey": {
        "Large": {
          "Colorless": "Roman Numeral I, Grey, Large"
        }
      },
      "Roman Numeral III": {
        "Sizeless": {
          "Yellow": "Roman Numeral III, Yellow"
        }
      },
      "Roman Numeral V": {
        "Sizeless": {
          "Green": "Roman Numeral V, Green",
          "Yellow": "Roman Numeral V, Yellow"
        }
      },
      "Universal No": {
        "Sizeless": {
          "Colorless": "Universal No"
        }
      },
      "Universal Yes": {
        "Sizeless": {
          "Colorless": "Universal Yes"
        }
      }
    },
    "bodypart": {
      "Bloody Remains": {
        "Sizeless": {
          "Colorless": "Bloody Remains"
        }
      },
      "Brain Organ": {
        "Sizeless": {
          "Pink": "Brain Organ, Pink"
        }
      },
      "Broken Heart": {
        "Sizeless": {
          "Colorless": "Broken Heart"
        }
      },
      "Fist": {
        "Sizeless": {
          "Colorless": "Fist"
        }
      },
      "Foot": {
        "Sizeless": {
          "Brown": "Foot, Brown"
        }
      },
      "Heart Organ": {
        "Sizeless": {
          "Red": "Heart Organ, Red"
        }
      },
      "Heart, Flat": {
        "Sizeless": {
          "Black": "Heart, Flat, Black",
          "Blue": "Heart, Flat, Blue",
          "Green": "Heart, Flat, Green",
          "Orange": "Heart, Flat, Orange",
          "Purple": "Heart, Flat, Purple",
          "Red": "Heart, Flat, Red",
          "White": "Heart, Flat, White",
          "Yellow": "Heart, Flat, Yellow"
        }
      },
      "Heart, Wood": {
        "Sizeless": {
          "Red": "Heart, Wood, Red"
        }
      },
      "Skull": {
        "Sizeless": {
          "Colorless": "Skull"
        }
      }
    },
    "resource": {
      "Flame": {
        "Sizeless": {
          "Colorless": "Flame"
        }
      },
      "Jewel, Clear": {
        "Sizeless": {
          "Colorless": "Jewel, Clear"
        }
      },
      "Jewel": {
        "Sizeless": {
          "Yellow": "Jewel, Yellow",
          "Green": "Jewel, Green",
          "Blue": "Jewel, Blue",
          "Orange": "Jewel, Orange",
          "Purple": "Jewel, Purple",
          "Red": "Jewel, Red"
        }
      },
      "Acorn": {
        "Sizeless": {
          "Brown": "Acorn, Brown",
          "Yellow": "Acorn, Yellow"
        }
      },
      "AK-47": {
        "Sizeless": {
          "Colorless": "AK-47"
        }
      },
      "Barrel": {
        "Sizeless": {
          "Colorless": "Barrel"
        }
      },
      "Barrel, Wood": {
        "Sizeless": {
          "Colorless": "Barrel, Wood"
        }
      },
      "Bolt": {
        "Sizeless": {
          "Colorless": "Bolt"
        }
      },
      "Bow and Arrow": {
        "Sizeless": {
          "Colorless": "Bow and Arrow"
        }
      },
      "Bowling Pin": {
        "Large": {
          "Black": "Bowling Pin, Large, Black",
          "Blue": "Bowling Pin, Large, Blue",
          "Green": "Bowling Pin, Large, Green",
          "Orange": "Bowling Pin, Large, Orange",
          "Purple": "Bowling Pin, Large, Purple",
          "Red": "Bowling Pin, Large, Red",
          "White": "Bowling Pin, Large, White",
          "Yellow": "Bowling Pin, Large, Yellow"
        },
        "Small": {
          "Black": "Bowling Pin, Small, Black",
          "Blue": "Bowling Pin, Small, Blue",
          "Green": "Bowling Pin, Small, Green",
          "Orange": "Bowling Pin, Small, Orange",
          "Purple": "Bowling Pin, Small, Purple",
          "Red": "Bowling Pin, Small, Red",
          "White": "Bowling Pin, Small, White",
          "Yellow": "Bowling Pin, Small, Yellow"
        }
      },
      "Bowling Pin, Clear": {
        "Large": {
          "Colorless": "Bowling Pin, Large, Clear"
        }
      },
      "Bread Basket": {
        "Sizeless": {
          "Colorless": "Bread Basket"
        }
      },
      "Bread, Wood, Dark": {
        "Sizeless": {
          "Brown": "Bread, Wood, Dark Brown"
        }
      },
      "Bread, Wood, Light": {
        "Sizeless": {
          "Brown": "Bread, Wood, Light Brown"
        }
      },
      "Brick Tower": {
        "Sizeless": {
          "Gray": "Brick Tower, Gray"
        }
      },
      "Brick, Wood, 2 Holes": {
        "Sizeless": {
          "Red": "Brick, Wood, 2 Holes, Red"
        }
      },
      "Brick, Wood": {
        "Large": {
          "Colorless": "Brick, Wood, Large"
        },
        "Sizeless": {
          "Red": "Brick, Wood, Red"
        }
      },
      "Buddha": {
        "Sizeless": {
          "Colorless": "Buddha"
        }
      },
      "Bullet": {
        "Sizeless": {
          "Gray": "Bullet, Gray"
        }
      },
      "Button": {
        "Large": {
          "Blue": "Button, Large, Blue",
          "Green": "Button, Large, Green",
          "Gray": "Button, Large, Gray",
          "Pink": "Button, Large, Pink",
          "Yellow": "Button, Large, Yellow"
        },
        "Sizeless": {
          "Purple": "Button, Purple",
          "White": "Button, White",
          "Yellow": "Button, Yellow"
        }
      },
      "Carrot": {
        "Sizeless": {
          "Colorless": "Carrot"
        }
      },
      "Cauldron": {
        "Sizeless": {
          "Colorless": "Cauldron"
        }
      },
      "Cheese Wedge": {
        "Sizeless": {
          "Colorless": "Cheese Wedge"
        }
      },
      "Chest": {
        "Sizeless": {
          "Blue": "Chest, Blue",
          "Bronze": "Chest, Bronze",
          "Green": "Chest, Green",
          "Gray": "Chest, Gray",
          "Red": "Chest, Red"
        }
      },
      "Chevron": {
        "20mm": {
          "Black": "Chevron, 20mm, Black",
          "Blue": "Chevron, 20mm, Blue",
          "Green": "Chevron, 20mm, Green",
          "Orange": "Chevron, 20mm, Orange",
          "Purple": "Chevron, 20mm, Purple",
          "Red": "Chevron, 20mm, Red",
          "White": "Chevron, 20mm, White",
          "Yellow": "Chevron, 20mm, Yellow"
        },
        "8mm": {
          "Black": "Chevron, 8mm, Black",
          "Blue": "Chevron, 8mm, Blue",
          "Green": "Chevron, 8mm, Green",
          "Orange": "Chevron, 8mm, Orange",
          "Purple": "Chevron, 8mm, Purple",
          "Red": "Chevron, 8mm, Red",
          "White": "Chevron, 8mm, White",
          "Yellow": "Chevron, 8mm, Yellow"
        }
      },
      "Clay, Wood": {
        "Sizeless": {
          "Colorless": "Clay, Wood"
        }
      },
      "Coal, Wood": {
        "Sizeless": {
          "Colorless": "Coal, Wood"
        }
      },
      "Cobalt, Wood": {
        "Sizeless": {
          "Colorless": "Cobalt, Wood"
        }
      },
      "Crate": {
        "Sizeless": {
          "Colorless": "Crate"
        }
      },
      "Crescent Wrench": {
        "Sizeless": {
          "Colorless": "Crescent Wrench"
        }
      },
      "Crown": {
        "Sizeless": {
          "Colorless": "Crown"
        }
      },
      "Crystal, Opaque": {
        "Sizeless": {
          "Black": "Crystal, Opaque, Black",
          "Gold": "Crystal, Opaque, Gold",
          "Silver": "Crystal, Opaque, Silver",
          "White": "Crystal, Opaque, White"
        }
      },
      "Crystal, Transparent": {
        "Sizeless": {
          "Black": "Crystal, Transparent, Black",
          "Blue": "Crystal, Transparent, Blue",
          "Green": "Crystal, Transparent, Green",
          "Orange": "Crystal, Transparent, Orange",
          "Purple": "Crystal, Transparent, Purple",
          "Red": "Crystal, Transparent, Red",
          "White": "Crystal, Transparent, White",
          "Yellow": "Crystal, Transparent, Yellow"
        }
      },
      "Crystal, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Crystal, Transparent, Clear"
        }
      },
      "Drop": {
        "Sizeless": {
          "Black": "Drop, Black",
          "Blue": "Drop, Blue",
          "Green": "Drop, Green",
          "Orange": "Drop, Orange",
          "Purple": "Drop, Purple",
          "Red": "Drop, Red",
          "White": "Drop, White",
          "Yellow": "Drop, Yellow"
        }
      },
      "Drumstick": {
        "Sizeless": {
          "Orange": "Drumstick, Orange"
        }
      },
      "Egg": {
        "Sizeless": {
          "Blue": "Egg, Blue",
          "Green": "Egg, Green",
          "Purple": "Egg, Purple",
          "White": "Egg, White"
        }
      },
      "Egg, Natural": {
        "Sizeless": {
          "Colorless": "Egg, Natural"
        }
      },
      "Egg, Rose": {
        "Sizeless": {
          "Colorless": "Egg, Rose"
        }
      },
      "Empty Bottle": {
        "Sizeless": {
          "Colorless": "Empty Bottle"
        }
      },
      "Fang": {
        "Sizeless": {
          "Colorless": "Fang"
        }
      },
      "Fire Axe": {
        "Sizeless": {
          "Colorless": "Fire Axe"
        }
      },
      "Flag": {
        "Sizeless": {
          "Black": "Flag, Black",
          "Blue": "Flag, Blue",
          "Green": "Flag, Green",
          "Orange": "Flag, Orange",
          "Purple": "Flag, Purple",
          "Red": "Flag, Red",
          "White": "Flag, White",
          "Yellow": "Flag, Yellow"
        }
      },
      "Flame Base, Logs": {
        "Sizeless": {
          "Colorless": "Flame Base, Logs"
        }
      },
      "Flame Base, Smoke": {
        "Sizeless": {
          "Colorless": "Flame Base, Smoke"
        }
      },
      "Flame, Free-Standing": {
        "Sizeless": {
          "Colorless": "Flame, Free-Standing"
        }
      },
      "Flat Star": {
        "Sizeless": {
          "Black": "Flat Star, Black",
          "Blue": "Flat Star, Blue",
          "Green": "Flat Star, Green",
          "Orange": "Flat Star, Orange",
          "Purple": "Flat Star, Purple",
          "Red": "Flat Star, Red",
          "White": "Flat Star, White",
          "Yellow": "Flat Star, Yellow"
        }
      },
      "Frag Grenade": {
        "Sizeless": {
          "Colorless": "Frag Grenade"
        }
      },
      "Gavel": {
        "Sizeless": {
          "Colorless": "Gavel"
        }
      },
      "Gear": {
        "Sizeless": {
          "Colorless": "Gear",
          "Bronze": "Gear, Bronze",
          "Gold": "Gear, Gold",
          "Silver": "Gear, Silver"
        }
      },
      "Gem": {
        "Sizeless": {
          "Black": "Gem, Black",
          "Blue": "Gem, Blue",
          "Green": "Gem, Green",
          "Orange": "Gem, Orange",
          "Purple": "Gem, Purple",
          "Red": "Gem, Red",
          "White": "Gem, White",
          "Yellow": "Gem, Yellow"
        }
      },
      "Gem, Clear": {
        "Sizeless": {
          "Colorless": "Gem, Clear"
        }
      },
      "Gem, Light": {
        "Sizeless": {
          "Green": "Gem, Light Green"
        }
      },
      "Grain Sack, Wood": {
        "Sizeless": {
          "Colorless": "Grain Sack, Wood"
        }
      },
      "Handmade Carrot": {
        "Sizeless": {
          "Colorless": "Handmade Carrot"
        }
      },
      "Handmade Steak": {
        "Sizeless": {
          "Colorless": "Handmade Steak"
        }
      },
      "Herb": {
        "Sizeless": {
          "Black": "Herb, Black",
          "Blue": "Herb, Blue",
          "Green": "Herb, Green",
          "Orange": "Herb, Orange",
          "Purple": "Herb, Purple",
          "Red": "Herb, Red",
          "White": "Herb, White",
          "Yellow": "Herb, Yellow"
        }
      },
      "Hex Nut": {
        "Sizeless": {
          "Colorless": "Hex Nut"
        }
      },
      "Hex Stacker": {
        "Sizeless": {
          "Black": "Hex Stacker, Black",
          "Blue": "Hex Stacker, Blue",
          "Green": "Hex Stacker, Green",
          "Orange": "Hex Stacker, Orange",
          "Purple": "Hex Stacker, Purple",
          "Red": "Hex Stacker, Red",
          "White": "Hex Stacker, White",
          "Yellow": "Hex Stacker, Yellow"
        }
      },
      "Hexbox": {
        "20mm": {
          "Blue": "Hexbox, 20mm, Blue"
        }
      },
      "Hexbox, Dark": {
        "20mm": {
          "Red": "Hexbox, 20mm, Dark Red"
        }
      },
      "Hexbox, Mustard": {
        "20mm": {
          "Colorless": "Hexbox, 20mm, Mustard"
        }
      },
      "I-Beam": {
        "Sizeless": {
          "Colorless": "I-Beam"
        }
      },
      "Ingot, Wood, Aluminum": {
        "Sizeless": {
          "Colorless": "Ingot, Wood, Aluminum"
        }
      },
      "Ingot, Wood, Brass": {
        "Sizeless": {
          "Colorless": "Ingot, Wood, Brass"
        }
      },
      "Ingot, Wood, Cobalt": {
        "Sizeless": {
          "Colorless": "Ingot, Wood, Cobalt"
        }
      },
      "Ingot, Wood, Copper": {
        "Sizeless": {
          "Colorless": "Ingot, Wood, Copper"
        }
      },
      "Ingot, Wood": {
        "Sizeless": {
          "Gold": "Ingot, Wood, Gold",
          "Silver": "Ingot, Wood, Silver"
        }
      },
      "Ingot, Wood, Iron": {
        "Sizeless": {
          "Colorless": "Ingot, Wood, Iron"
        }
      },
      "Ingot, Wood, Steel": {
        "Sizeless": {
          "Colorless": "Ingot, Wood, Steel"
        }
      },
      "Joystick": {
        "Sizeless": {
          "Black": "Joystick, Black",
          "Blue": "Joystick, Blue",
          "Green": "Joystick, Green",
          "Orange": "Joystick, Orange",
          "Purple": "Joystick, Purple",
          "Red": "Joystick, Red",
          "White": "Joystick, White",
          "Yellow": "Joystick, Yellow"
        }
      },
      "Joystick, Headless": {
        "Sizeless": {
          "Black": "Joystick, Headless, Black"
        }
      },
      "Keycard, Fluorescent": {
        "Sizeless": {
          "Blue": "Keycard, Fluorescent Blue",
          "Green": "Keycard, Fluorescent Green",
          "Red": "Keycard, Fluorescent Red",
          "Yellow": "Keycard, Fluorescent Yellow"
        }
      },
      "Large Star": {
        "Large": {
          "Gold": "Large Star, Gold"
        }
      },
      "Leather": {
        "Sizeless": {
          "Black": "Leather, Black",
          "Brown": "Leather, Brown",
          "White": "Leather, White"
        }
      },
      "Light Bulb": {
        "Sizeless": {
          "Blue": "Light Bulb, Blue",
          "Gold": "Light Bulb, Gold",
          "Green": "Light Bulb, Green"
        }
      },
      "Light Bulb, Salmon": {
        "Sizeless": {
          "Colorless": "Light Bulb, Salmon"
        }
      },
      "Light Bulb, Taupe": {
        "Sizeless": {
          "Colorless": "Light Bulb, Taupe"
        }
      },
      "Lightning Bolt": {
        "Sizeless": {
          "Black": "Lightning Bolt, Black",
          "Blue": "Lightning Bolt, Blue",
          "Green": "Lightning Bolt, Green",
          "Orange": "Lightning Bolt, Orange",
          "Purple": "Lightning Bolt, Purple",
          "Red": "Lightning Bolt, Red",
          "White": "Lightning Bolt, White",
          "Yellow": "Lightning Bolt, Yellow"
        },
        "Large": {
          "Orange": "Lightning Bolt, Large, Orange"
        }
      },
      "Mushroom Cloud": {
        "Sizeless": {
          "Colorless": "Mushroom Cloud"
        }
      },
      "Octbox": {
        "10mm": {
          "Black": "Octbox, 10mm, Black",
          "Blue": "Octbox, 10mm, Blue",
          "Green": "Octbox, 10mm, Green",
          "Orange": "Octbox, 10mm, Orange",
          "Purple": "Octbox, 10mm, Purple",
          "Red": "Octbox, 10mm, Red",
          "White": "Octbox, 10mm, White",
          "Yellow": "Octbox, 10mm, Yellow"
        },
        "7mm": {
          "Yellow": "Octbox, 7mm, Yellow"
        }
      },
      "Octbox, 10mm x 7mm": {
        "Sizeless": {
          "Blue": "Octbox, 10mm x 7mm, Blue",
          "Gray": "Octbox, 10mm x 7mm, Gray",
          "Purple": "Octbox, 10mm x 7mm, Purple"
        }
      },
      "Oil Barrel": {
        "Sizeless": {
          "Colorless": "Oil Barrel"
        }
      },
      "Oil Drum, Wood": {
        "Sizeless": {
          "Blue": "Oil Drum, Wood, Blue"
        }
      },
      "Padlock Key": {
        "Sizeless": {
          "Black": "Padlock Key, Black",
          "Blue": "Padlock Key, Blue",
          "Green": "Padlock Key, Green",
          "Orange": "Padlock Key, Orange",
          "Purple": "Padlock Key, Purple",
          "Red": "Padlock Key, Red",
          "White": "Padlock Key, White",
          "Yellow": "Padlock Key, Yellow"
        }
      },
      "Padlock, Locked": {
        "Sizeless": {
          "Black": "Padlock, Locked, Black",
          "Blue": "Padlock, Locked, Blue",
          "Green": "Padlock, Locked, Green",
          "Orange": "Padlock, Locked, Orange",
          "Purple": "Padlock, Locked, Purple",
          "Red": "Padlock, Locked, Red",
          "White": "Padlock, Locked, White",
          "Yellow": "Padlock, Locked, Yellow"
        }
      },
      "Padlock, Unlocked": {
        "Sizeless": {
          "Black": "Padlock, Unlocked, Black",
          "Blue": "Padlock, Unlocked, Blue",
          "Green": "Padlock, Unlocked, Green",
          "Orange": "Padlock, Unlocked, Orange",
          "Purple": "Padlock, Unlocked, Purple",
          "Red": "Padlock, Unlocked, Red",
          "White": "Padlock, Unlocked, White",
          "Yellow": "Padlock, Unlocked, Yellow"
        }
      },
      "Premium Bread": {
        "Sizeless": {
          "Colorless": "Premium Bread"
        }
      },
      "Premium Steak": {
        "Sizeless": {
          "Colorless": "Premium Steak"
        }
      },
      "Pumpkin, Wood": {
        "Sizeless": {
          "Colorless": "Pumpkin, Wood"
        }
      },
      "Radiation Mask": {
        "Sizeless": {
          "Colorless": "Radiation Mask"
        }
      },
      "Ring": {
        "Sizeless": {
          "Black": "Ring, Black",
          "Blue": "Ring, Blue",
          "Green": "Ring, Green",
          "Orange": "Ring, Orange",
          "Purple": "Ring, Purple",
          "Red": "Ring, Red",
          "White": "Ring, White",
          "Yellow": "Ring, Yellow"
        }
      },
      "Rope Coil": {
        "Sizeless": {
          "Colorless": "Rope Coil"
        }
      },
      "Sack": {
        "Sizeless": {
          "Gold": "Sack, Gold"
        }
      },
      "Sake": {
        "Sizeless": {
          "Colorless": "Sake"
        }
      },
      "Sheriff Badge": {
        "Sizeless": {
          "Gold": "Sheriff Badge, Gold",
          "Silver": "Sheriff Badge, Silver"
        }
      },
      "Shotgun": {
        "Sizeless": {
          "Colorless": "Shotgun"
        }
      },
      "Stacker Cone": {
        "Sizeless": {
          "Black": "Stacker Cone, Black",
          "Blue": "Stacker Cone, Blue",
          "Green": "Stacker Cone, Green",
          "Orange": "Stacker Cone, Orange",
          "Purple": "Stacker Cone, Purple",
          "Red": "Stacker Cone, Red",
          "White": "Stacker Cone, White",
          "Yellow": "Stacker Cone, Yellow"
        }
      },
      "Stacker": {
        "19mm": {
          "Black": "Stacker, 19mm, Black",
          "Blue": "Stacker, 19mm, Blue",
          "Green": "Stacker, 19mm, Green",
          "Orange": "Stacker, 19mm, Orange",
          "Purple": "Stacker, 19mm, Purple",
          "Red": "Stacker, 19mm, Red",
          "White": "Stacker, 19mm, White",
          "Yellow": "Stacker, 19mm, Yellow"
        },
        "Sizeless": {
          "Black": "Stacker, Black",
          "Blue": "Stacker, Blue",
          "Green": "Stacker, Green",
          "Orange": "Stacker, Orange",
          "Purple": "Stacker, Purple",
          "Red": "Stacker, Red",
          "White": "Stacker, White",
          "Yellow": "Stacker, Yellow"
        }
      },
      "Star, Wood": {
        "Sizeless": {
          "Black": "Star, Wood, Black",
          "Green": "Star, Wood, Green",
          "Purple": "Star, Wood, Purple",
          "Red": "Star, Wood, Red"
        }
      },
      "Stick, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "Stick, Acrylic, Opaque, Black",
          "Gold": "Stick, Acrylic, Opaque, Gold",
          "Silver": "Stick, Acrylic, Opaque, Silver",
          "White": "Stick, Acrylic, Opaque, White"
        }
      },
      "Stick, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "Stick, Acrylic, Transparent, Black",
          "Blue": "Stick, Acrylic, Transparent, Blue",
          "Green": "Stick, Acrylic, Transparent, Green",
          "orange": "Stick, Acrylic, Transparent, orange",
          "Purple": "Stick, Acrylic, Transparent, Purple",
          "Red": "Stick, Acrylic, Transparent, Red",
          "White": "Stick, Acrylic, Transparent, White",
          "Yellow": "Stick, Acrylic, Transparent, Yellow"
        }
      },
      "Stick, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "Stick, Acrylic, Transparent, Clear"
        }
      },
      "Stick, Wood": {
        "Sizeless": {
          "Black": "Stick, Wood, Black",
          "Blue": "Stick, Wood, Blue",
          "Green": "Stick, Wood, Green",
          "Orange": "Stick, Wood, Orange",
          "Purple": "Stick, Wood, Purple",
          "Red": "Stick, Wood, Red",
          "White": "Stick, Wood, White",
          "Yellow": "Stick, Wood, Yellow"
        }
      },
      "Stone Arrowhead": {
        "Sizeless": {
          "Colorless": "Stone Arrowhead"
        }
      },
      "Stone, Wood": {
        "Sizeless": {
          "Colorless": "Stone, Wood"
        }
      },
      "Sword": {
        "Sizeless": {
          "Colorless": "Sword"
        }
      },
      "Tablet, Stone": {
        "Sizeless": {
          "Colorless": "Tablet, Stone"
        }
      },
      "Tactical Knife": {
        "Sizeless": {
          "Colorless": "Tactical Knife"
        }
      },
      "Thimble ": {
        "Sizeless": {
          "Colorless": "Thimble "
        }
      },
      "Thin Star": {
        "Sizeless": {
          "Gray": "Thin Star, Gray"
        }
      },
      "Triangle": {
        "Sizeless": {
          "Black": "Triangle, Black",
          "Blue": "Triangle, Blue",
          "Green": "Triangle, Green",
          "Pink": "Triangle, Pink"
        }
      },
      "Triangle, Hollow": {
        "Sizeless": {
          "Colorless": "Triangle, Hollow"
        }
      },
      "Wood Logs": {
        "Sizeless": {
          "Colorless": "Wood Logs"
        }
      },
      "Wood Pile": {
        "Sizeless": {
          "Colorless": "Wood Pile"
        }
      },
      "D6, Alchemy": {
        "Sizeless": {
          "Orange": "D6, Alchemy, Orange"
        }
      },
      "D6, Damage": {
        "Sizeless": {
          "Black": "D6, Damage, Black"
        }
      },
      "D6, Industry": {
        "Sizeless": {
          "Gray": "D6, Industry, Gray"
        }
      },
      "D6, Nature": {
        "Sizeless": {
          "Green": "D6, Nature, Green"
        }
      },
      "D6, Oxygen": {
        "Sizeless": {
          "Blue": "D6, Oxygen, Blue"
        }
      },
      "D6, Temperature": {
        "Sizeless": {
          "Red": "D6, Temperature, Red"
        }
      },
      "LED": {
        "Sizeless": {
          "Black": "LED, Black",
          "Blue": "LED, Blue",
          "Green": "LED, Green",
          "Orange": "LED, Orange",
          "Purple": "LED, Purple",
          "Red": "LED, Red",
          "White": "LED, White",
          "Yellow": "LED, Yellow"
        }
      },
      "Premium Carrot": {
        "Sizeless": {
          "Colorless": "Premium Carrot"
        }
      },
      "Premium Cheese Wedge": {
        "Sizeless": {
          "Colorless": "Premium Cheese Wedge"
        }
      }
    },
    "NO_CATEGORY": {
      "Bible": {
        "Sizeless": {
          "Colorless": "Bible"
        }
      },
      "Chess Set, Half": {
        "Sizeless": {
          "Black": "Chess Set, Half, Black",
          "Blue": "Chess Set, Half, Blue",
          "Green": "Chess Set, Half, Green",
          "Orange": "Chess Set, Half, Orange",
          "Purple": "Chess Set, Half, Purple",
          "Red": "Chess Set, Half, Red",
          "White": "Chess Set, Half, White",
          "Yellow": "Chess Set, Half, Yellow"
        }
      },
      "Cog's 2024 Calendar": {
        "Sizeless": {
          "Colorless": "Cog's 2024 Calendar"
        }
      },
      "deadEarth Player's Handbook": {
        "Sizeless": {
          "Colorless": "deadEarth Player's Handbook"
        }
      },
      "Designers Table Cover": {
        "Sizeless": {
          "Colorless": "Designers Table Cover"
        }
      },
      "Dominoes": {
        "Small": {
          "Colorless": "Dominoes, Small"
        }
      },
      "Dynamite": {
        "Sizeless": {
          "Colorless": "Dynamite"
        }
      },
      "Electricity Symbol": {
        "Sizeless": {
          "Green": "Electricity Symbol, Green"
        }
      },
      "Explorer, Set of 3 (Assorted Colors)": {
        "Sizeless": {
          "Colorless": "Explorer, Set of 3 (Assorted Colors)"
        }
      },
      "Fail Faster Playtesting Journal": {
        "Sizeless": {
          "Colorless": "Fail Faster Playtesting Journal"
        }
      },
      "Figures, Missionary, Set of 5": {
        "5": {
          "Colorless": "Figures, Missionary, Set of 5"
        }
      },
      "Figures, Sci-Fi, Set of 10": {
        "10": {
          "Colorless": "Figures, Sci-Fi, Set of 10"
        }
      },
      "Figures, Soldier, Set of 5": {
        "5": {
          "Colorless": "Figures, Soldier, Set of 5"
        }
      },
      "Figures, Steampunk, Set of 14": {
        "14": {
          "Colorless": "Figures, Steampunk, Set of 14"
        }
      },
      "Galley Longship": {
        "Sizeless": {
          "Green": "Galley Longship, Green"
        }
      },
      "Game Master's Screen": {
        "Sizeless": {
          "Colorless": "Game Master's Screen"
        }
      },
      "Gift Certificate $25": {
        "Sizeless": {
          "Colorless": "Gift Certificate $25"
        }
      },
      "Gift Certificate $5": {
        "Sizeless": {
          "Colorless": "Gift Certificate $5"
        }
      },
      "Glue Dots Sheet": {
        "Sizeless": {
          "Colorless": "Glue Dots Sheet"
        }
      },
      "Landmark Base": {
        "Sizeless": {
          "Colorless": "Landmark Base"
        }
      },
      "Male Farmer": {
        "Sizeless": {
          "Purple": "Male Farmer, Purple"
        }
      },
      "Mini Storage Box": {
        "Sizeless": {
          "Purple": "Mini Storage Box, Purple"
        }
      },
      "Musketeer": {
        "Sizeless": {
          "Colorless": "Musketeer"
        }
      },
      "Pernicious Puzzle #1": {
        "Sizeless": {
          "Colorless": "Pernicious Puzzle #1"
        }
      },
      "Sheet of 1\" Gold Scratch Off Circle Stickers": {
        "Sizeless": {
          "Colorless": "Sheet of 1\" Gold Scratch Off Circle Stickers"
        }
      },
      "Sheet of 1\" Silver Scratch Off Circle Stickers": {
        "Sizeless": {
          "Colorless": "Sheet of 1\" Silver Scratch Off Circle Stickers"
        }
      },
      "Sheet of Rectangle Scratch Off Sitckers": {
        "Sizeless": {
          "Colorless": "Sheet of Rectangle Scratch Off Sitckers"
        }
      },
      "Space Ranger Guns": {
        "Sizeless": {
          "Colorless": "Space Ranger Guns"
        }
      },
      "Space Ranger II w/ Armament": {
        "Sizeless": {
          "Colorless": "Space Ranger II w/ Armament"
        }
      },
      "Space Ranger w/ Armament": {
        "Sizeless": {
          "Colorless": "Space Ranger w/ Armament"
        }
      },
      "Sprue, Ages, Beige": {
        "Sizeless": {
          "Colorless": "Sprue, Ages, Beige"
        }
      },
      "Sprue, Ages": {
        "Sizeless": {
          "Black": "Sprue, Ages, Black",
          "Purple": "Sprue, Ages, Purple",
          "Yellow": "Sprue, Ages, Yellow"
        }
      },
      "Sprue, Ages, Tan": {
        "Sizeless": {
          "Colorless": "Sprue, Ages, Tan"
        }
      },
      "Sprue, Civil War Horse": {
        "Sizeless": {
          "Black": "Sprue, Civil War Horse, Black",
          "Brown": "Sprue, Civil War Horse, Brown"
        }
      },
      "Sprue, Civil War Military": {
        "Sizeless": {
          "Blue": "Sprue, Civil War Military, Blue",
          "Gray": "Sprue, Civil War Military, Gray",
          "Red": "Sprue, Civil War Military, Red"
        }
      },
      "Sprue, Civil War Military, Lt": {
        "Sizeless": {
          "Blue": "Sprue, Civil War Military, Lt Blue"
        }
      },
      "Sprue, Civilization": {
        "Sizeless": {
          "Blue": "Sprue, Civilization, Blue",
          "Green": "Sprue, Civilization, Green",
          "Gray": "Sprue, Civilization, Gray",
          "Purple": "Sprue, Civilization, Purple",
          "Yellow": "Sprue, Civilization, Yellow"
        }
      },
      "Sprue, Egypt Myth": {
        "Sizeless": {
          "Brown": "Sprue, Egypt Myth, Brown"
        }
      },
      "Sprue, Norse Myth, Dk": {
        "Sizeless": {
          "Blue": "Sprue, Norse Myth, Dk Blue"
        }
      },
      "Sprue, Norse Myth, Lt": {
        "Sizeless": {
          "Blue": "Sprue, Norse Myth, Lt Blue"
        }
      },
      "Sprue, Norse Myth, Med": {
        "Sizeless": {
          "Blue": "Sprue, Norse Myth, Med Blue"
        }
      },
      "Stake Bed Truck": {
        "Sizeless": {
          "Black": "Stake Bed Truck, Black"
        }
      },
      "Standee, TGC": {
        "Sizeless": {
          "Colorless": "Standee, TGC"
        }
      },
      "TCID Lockdown Minimum Security Promo Pack": {
        "Sizeless": {
          "Colorless": "TCID Lockdown Minimum Security Promo Pack"
        }
      },
      "TGC Follies - Shamrock Pack": {
        "Sizeless": {
          "Colorless": "TGC Follies - Shamrock Pack"
        }
      },
      "Woman, High Society": {
        "Sizeless": {
          "Colorless": "Woman, High Society"
        }
      },
      "Black 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Black 7 Piece Dice Set"
        }
      },
      "Blue 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Blue 7 Piece Dice Set"
        }
      },
      "Green 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Green 7 Piece Dice Set"
        }
      },
      "InFUNity Tile, Hat": {
        "Sizeless": {
          "Black": "InFUNity Tile, Hat, Black",
          "Blue": "InFUNity Tile, Hat, Blue",
          "Green": "InFUNity Tile, Hat, Green",
          "Orange": "InFUNity Tile, Hat, Orange",
          "Purple": "InFUNity Tile, Hat, Purple",
          "Red": "InFUNity Tile, Hat, Red",
          "White": "InFUNity Tile, Hat, White",
          "Yellow": "InFUNity Tile, Hat, Yellow"
        }
      },
      "InFUNity Tile, Turtle": {
        "Sizeless": {
          "Black": "InFUNity Tile, Turtle, Black",
          "Blue": "InFUNity Tile, Turtle, Blue",
          "Green": "InFUNity Tile, Turtle, Green",
          "Orange": "InFUNity Tile, Turtle, Orange",
          "Purple": "InFUNity Tile, Turtle, Purple",
          "Red": "InFUNity Tile, Turtle, Red",
          "White": "InFUNity Tile, Turtle, White",
          "Yellow": "InFUNity Tile, Turtle, Yellow"
        }
      },
      "Orange 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Orange 7 Piece Dice Set"
        }
      },
      "Phase Shift Games | Boblin's Rebellion | 1-4 players": {
        "Sizeless": {
          "Colorless": "Phase Shift Games | Boblin's Rebellion | 1-4 players"
        }
      },
      "Phase Shift Games | Flutter | 2-5 players": {
        "Sizeless": {
          "Colorless": "Phase Shift Games | Flutter | 2-5 players"
        }
      },
      "Phase Shift Games | Obelus | 2 players": {
        "Sizeless": {
          "Colorless": "Phase Shift Games | Obelus | 2 players"
        }
      },
      "Purple 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Purple 7 Piece Dice Set"
        }
      },
      "Red 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Red 7 Piece Dice Set"
        }
      },
      "White 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "White 7 Piece Dice Set"
        }
      },
      "Yellow 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Yellow 7 Piece Dice Set"
        }
      }
    }
  },
  "CUSTOM": {
    "packaging": {
      "Mint Tin": {
        "Sizeless": {
          "Colorless": "Mint Tin"
        }
      },
      "Small Stout Box": {
        "Small": {
          "Colorless": "Small Stout Box"
        }
      },
      "Medium Stout Box": {
        "Medium": {
          "Colorless": "Medium Stout Box"
        }
      },
      "Large Stout Box": {
        "Large": {
          "Colorless": "Large Stout Box"
        }
      },
      "Poker Booster": {
        "Sizeless": {
          "Colorless": "Poker Booster"
        }
      },
      "Poker Tuck Box 36": {
        "36": {
          "Colorless": "Poker Tuck Box 36"
        }
      },
      "Poker Tuck Box 54": {
        "54": {
          "Colorless": "Poker Tuck Box 54"
        }
      },
      "Poker Tuck Box 72": {
        "72": {
          "Colorless": "Poker Tuck Box 72"
        }
      },
      "Poker Tuck Box 90": {
        "90": {
          "Colorless": "Poker Tuck Box 90"
        }
      },
      "Poker Tuck Box 108": {
        "108": {
          "Colorless": "Poker Tuck Box 108"
        }
      },
      "Bridge Hook Box 108": {
        "108": {
          "Colorless": "Bridge Hook Box 108"
        }
      },
      "Bridge Hook Box 54": {
        "54": {
          "Colorless": "Bridge Hook Box 54"
        }
      },
      "Bridge Tuck Box 108": {
        "108": {
          "Colorless": "Bridge Tuck Box 108"
        }
      },
      "Bridge Tuck Box 54": {
        "54": {
          "Colorless": "Bridge Tuck Box 54"
        }
      },
      "Jumbo Hook Box 36": {
        "36": {
          "Colorless": "Jumbo Hook Box 36"
        }
      },
      "Jumbo Hook Box 90": {
        "90": {
          "Colorless": "Jumbo Hook Box 90"
        }
      },
      "Jumbo Tuck Box 90": {
        "90": {
          "Colorless": "Jumbo Tuck Box 90"
        }
      },
      "Large Prototype Box": {
        "Large": {
          "Colorless": "Large Prototype Box"
        }
      },
      "Large Retail Box": {
        "Large": {
          "Colorless": "Large Retail Box"
        }
      },
      "Large Stout Box Top": {
        "Large": {
          "Colorless": "Large Stout Box Top"
        }
      },
      "Large Stout Box Top And Side": {
        "Large": {
          "Colorless": "Large Stout Box Top And Side"
        }
      },
      "Medium Pro Box": {
        "Medium": {
          "Colorless": "Medium Pro Box"
        }
      },
      "Medium Prototype Box": {
        "Medium": {
          "Colorless": "Medium Prototype Box"
        }
      },
      "Medium Stout Box Top And Side": {
        "Medium": {
          "Colorless": "Medium Stout Box Top And Side"
        }
      },
      "Mint Tin Sticker": {
        "Sizeless": {
          "Colorless": "Mint Tin Sticker"
        }
      },
      "Poker Booster Box": {
        "Sizeless": {
          "Colorless": "Poker Booster Box"
        }
      },
      "Poker Envelope": {
        "Sizeless": {
          "Colorless": "Poker Envelope"
        }
      },
      "Poker Hook Box 108": {
        "108": {
          "Colorless": "Poker Hook Box 108"
        }
      },
      "Poker Hook Box 36": {
        "36": {
          "Colorless": "Poker Hook Box 36"
        }
      },
      "Poker Hook Box 18": {
        "18": {
          "Colorless": "Poker Hook Box 18"
        }
      },
      "Poker Hook Box 54": {
        "54": {
          "Colorless": "Poker Hook Box 54"
        }
      },
      "Poker Hook Box 72": {
        "72": {
          "Colorless": "Poker Hook Box 72"
        }
      },
      "Poker Hook Box 90": {
        "90": {
          "Colorless": "Poker Hook Box 90"
        }
      },
      "Small Pro Box": {
        "Small": {
          "Colorless": "Small Pro Box"
        }
      },
      "Small Prototype Box": {
        "Small": {
          "Colorless": "Small Prototype Box"
        }
      },
      "Square Hook Box 48": {
        "48": {
          "Colorless": "Square Hook Box 48"
        }
      },
      "Square Hook Box 96": {
        "96": {
          "Colorless": "Square Hook Box 96"
        }
      },
      "Square Tuck Box 48": {
        "48": {
          "Colorless": "Square Tuck Box 48"
        }
      },
      "Square Tuck Box 96": {
        "96": {
          "Colorless": "Square Tuck Box 96"
        }
      },
      "Tarot Hook Box 40": {
        "40": {
          "Colorless": "Tarot Hook Box 40"
        }
      },
      "Tarot Hook Box 90": {
        "90": {
          "Colorless": "Tarot Hook Box 90"
        }
      },
      "Tarot Tuck Box 40": {
        "40": {
          "Colorless": "Tarot Tuck Box 40"
        }
      },
      "Tarot Tuck Box 90": {
        "90": {
          "Colorless": "Tarot Tuck Box 90"
        }
      },
      "Tall Mint Tin": {
        "Tall": {
          "Colorless": "Tall Mint Tin"
        }
      },
      "VHS Box": {
        "Sizeless": {
          "Colorless": "VHS Box"
        }
      }
    },
    "stickers": {
      "Custom Large Sticker": {
        "Sizeless": {
          "Colorless": "Custom Large Sticker"
        }
      },
      "Custom Medium Sticker": {
        "Sizeless": {
          "Colorless": "Custom Medium Sticker"
        }
      },
      "Custom Mini Sticker": {
        "Sizeless": {
          "Colorless": "Custom Mini Sticker"
        }
      },
      "Custom Small Sticker": {
        "Sizeless": {
          "Colorless": "Custom Small Sticker"
        }
      },
      "Meeple Sticker": {
        "Sizeless": {
          "Colorless": "Meeple Sticker"
        }
      },
      "Pawn Sticker": {
        "Sizeless": {
          "Colorless": "Pawn Sticker"
        }
      }
    },
    "deck": {
      "Business Deck": {
        "Sizeless": {
          "Colorless": "Business Deck"
        }
      },
      "Poker Deck": {
        "Sizeless": {
          "Colorless": "Poker Deck"
        }
      },
      "Jumbo Deck": {
        "Sizeless": {
          "Colorless": "Jumbo Deck"
        }
      },
      "Mini Deck": {
        "Sizeless": {
          "Colorless": "Mini Deck"
        }
      },
      "Micro Deck": {
        "Sizeless": {
          "Colorless": "Micro Deck"
        }
      },
      "Mint Tin Deck": {
        "Sizeless": {
          "Colorless": "Mint Tin Deck"
        }
      },
      "Hex Deck": {
        "Sizeless": {
          "Colorless": "Hex Deck"
        }
      },
      "Bridge Deck": {
        "Sizeless": {
          "Colorless": "Bridge Deck"
        }
      },
      "Card Crafting Deck": {
        "Sizeless": {
          "Colorless": "Card Crafting Deck"
        }
      },
      "Circle Deck": {
        "Sizeless": {
          "Colorless": "Circle Deck"
        }
      },
      "Clear Card Crafting Deck": {
        "Sizeless": {
          "Colorless": "Clear Card Crafting Deck"
        }
      },
      "Clear Euro Poker Deck": {
        "Sizeless": {
          "Colorless": "Clear Euro Poker Deck"
        }
      },
      "Deck Box": {
        "Sizeless": {
          "Colorless": "Deck Box"
        }
      },
      "Deck Box Top And Side": {
        "Sizeless": {
          "Colorless": "Deck Box Top And Side"
        }
      },
      "Divider Deck": {
        "Sizeless": {
          "Colorless": "Divider Deck"
        }
      },
      "Domino Deck": {
        "Sizeless": {
          "Colorless": "Domino Deck"
        }
      },
      "Euro Poker Deck": {
        "Sizeless": {
          "Colorless": "Euro Poker Deck"
        }
      },
      "Euro Square Deck": {
        "Sizeless": {
          "Colorless": "Euro Square Deck"
        }
      },
      "Foil Euro Poker Deck": {
        "Sizeless": {
          "Colorless": "Foil Euro Poker Deck"
        }
      },
      "Foil Poker Deck": {
        "Sizeless": {
          "Colorless": "Foil Poker Deck"
        }
      },
      "Foil Tarot Deck": {
        "Sizeless": {
          "Colorless": "Foil Tarot Deck"
        }
      },
      "Play Money": {
        "Sizeless": {
          "Colorless": "Play Money"
        }
      },
      "Small Pro Tarot Insert": {
        "Small": {
          "Colorless": "Small Pro Tarot Insert"
        }
      },
      "Small Square Deck": {
        "Small": {
          "Colorless": "Small Square Deck"
        }
      },
      "Small Stout Tarot Insert": {
        "Small": {
          "Colorless": "Small Stout Tarot Insert"
        }
      },
      "Square Deck": {
        "Sizeless": {
          "Colorless": "Square Deck"
        }
      },
      "Tarot Deck": {
        "Sizeless": {
          "Colorless": "Tarot Deck"
        }
      },
      "Trading Deck": {
        "Sizeless": {
          "Colorless": "Trading Deck"
        }
      },
      "US Game Deck": {
        "Sizeless": {
          "Colorless": "US Game Deck"
        }
      }
    },
    "die": {
      "Custom Color D4": {
        "Sizeless": {
          "Colorless": "Custom Color D4"
        }
      },
      "Custom Color D6": {
        "Sizeless": {
          "Colorless": "Custom Color D6"
        }
      },
      "Custom Color D8": {
        "Sizeless": {
          "Colorless": "Custom Color D8"
        }
      },
      "Custom Wood D6": {
        "Sizeless": {
          "Colorless": "Custom Wood D6"
        }
      },
      "Dice Sticker": {
        "Sizeless": {
          "Colorless": "Dice Sticker"
        }
      }
    },
    "premium": {},
    "board": {
      "Domino Board": {
        "Sizeless": {
          "Colorless": "Domino Board"
        }
      },
      "Accordion Board": {
        "Sizeless": {
          "Colorless": "Accordion Board"
        }
      },
      "Bi Fold Board": {
        "Sizeless": {
          "Colorless": "Bi Fold Board"
        }
      },
      "Half Board": {
        "Sizeless": {
          "Colorless": "Half Board"
        }
      },
      "Large Square Board": {
        "Large": {
          "Colorless": "Large Square Board"
        }
      },
      "Medium Six Fold Board": {
        "Medium": {
          "Colorless": "Medium Six Fold Board"
        }
      },
      "Quad Fold Board": {
        "Sizeless": {
          "Colorless": "Quad Fold Board"
        }
      },
      "Quarter Board": {
        "Sizeless": {
          "Colorless": "Quarter Board"
        }
      },
      "Six Fold Board": {
        "Sizeless": {
          "Colorless": "Six Fold Board"
        }
      },
      "Skinny Board": {
        "Sizeless": {
          "Colorless": "Skinny Board"
        }
      },
      "Sliver Board": {
        "Sizeless": {
          "Colorless": "Sliver Board"
        }
      },
      "Small Square Board": {
        "Small": {
          "Colorless": "Small Square Board"
        }
      },
      "Square Board": {
        "Sizeless": {
          "Colorless": "Square Board"
        }
      },
      "Strip Board": {
        "Sizeless": {
          "Colorless": "Strip Board"
        }
      },
      "Large Dual Layer Board": {
        "Large": {
          "Colorless": "Large Dual Layer Board"
        }
      },
      "Large Quad Fold Board": {
        "Large": {
          "Colorless": "Large Quad Fold Board"
        }
      },
      "Medium Dual Layer Board": {
        "Medium": {
          "Colorless": "Medium Dual Layer Board"
        }
      },
      "Small Dual Layer Board": {
        "Small": {
          "Colorless": "Small Dual Layer Board"
        }
      }
    },
    "token": {
      "Hex Shard": {
        "Sizeless": {
          "Colorless": "Hex Shard"
        }
      },
      "Circle Shard": {
        "Sizeless": {
          "Colorless": "Circle Shard"
        }
      },
      "Square Shard": {
        "Sizeless": {
          "Colorless": "Square Shard"
        }
      },
      "Small Square Chit": {
        "Small": {
          "Colorless": "Small Square Chit"
        }
      },
      "Medium Square Chit": {
        "Medium": {
          "Colorless": "Medium Square Chit"
        }
      },
      "Large Square Chit": {
        "Large": {
          "Colorless": "Large Square Chit"
        }
      },
      "Small Circle Chit": {
        "Small": {
          "Colorless": "Small Circle Chit"
        }
      },
      "Medium Circle Chit": {
        "Medium": {
          "Colorless": "Medium Circle Chit"
        }
      },
      "Large Circle Chit": {
        "Large": {
          "Colorless": "Large Circle Chit"
        }
      },
      "Mini Hex Tile": {
        "Sizeless": {
          "Colorless": "Mini Hex Tile"
        }
      },
      "Small Hex Tile": {
        "Small": {
          "Colorless": "Small Hex Tile"
        }
      },
      "Medium Hex Tile": {
        "Medium": {
          "Colorless": "Medium Hex Tile"
        }
      },
      "Large Hex Tile": {
        "Large": {
          "Colorless": "Large Hex Tile"
        }
      },
      "Arrow Chit": {
        "Sizeless": {
          "Colorless": "Arrow Chit"
        }
      },
      "Bullseye Chit": {
        "Sizeless": {
          "Colorless": "Bullseye Chit"
        }
      },
      "Custom Printed Meeple": {
        "Sizeless": {
          "Colorless": "Custom Printed Meeple"
        }
      },
      "Domino Chit": {
        "Sizeless": {
          "Colorless": "Domino Chit"
        }
      },
      "Domino Tile": {
        "Sizeless": {
          "Colorless": "Domino Tile"
        }
      },
      "Large Ring": {
        "Large": {
          "Colorless": "Large Ring"
        }
      },
      "Large Square Tile": {
        "Large": {
          "Colorless": "Large Square Tile"
        }
      },
      "Large Standee": {
        "Large": {
          "Colorless": "Large Standee"
        }
      },
      "Medium Ring": {
        "Medium": {
          "Colorless": "Medium Ring"
        }
      },
      "Medium Square Tile": {
        "Medium": {
          "Colorless": "Medium Square Tile"
        }
      },
      "Medium Standee": {
        "Medium": {
          "Colorless": "Medium Standee"
        }
      },
      "Medium Triangle Chit": {
        "Medium": {
          "Colorless": "Medium Triangle Chit"
        }
      },
      "Mini Circle Tile": {
        "Sizeless": {
          "Colorless": "Mini Circle Tile"
        }
      },
      "Mini Square Tile": {
        "Sizeless": {
          "Colorless": "Mini Square Tile"
        }
      },
      "Small Ring": {
        "Small": {
          "Colorless": "Small Ring"
        }
      },
      "Small Square Tile": {
        "Small": {
          "Colorless": "Small Square Tile"
        }
      },
      "Small Standee": {
        "Small": {
          "Colorless": "Small Standee"
        }
      },
      "Strip Chit": {
        "Sizeless": {
          "Colorless": "Strip Chit"
        }
      },
      "Token Sticker": {
        "Sizeless": {
          "Colorless": "Token Sticker"
        }
      },
      "Tombstone Shard": {
        "Sizeless": {
          "Colorless": "Tombstone Shard"
        }
      },
      "Triangle Tile": {
        "Sizeless": {
          "Colorless": "Triangle Tile"
        }
      }
    },
    "mat": {
      "Bi Fold Mat": {
        "Sizeless": {
          "Colorless": "Bi Fold Mat"
        }
      },
      "Domino Mat": {
        "Sizeless": {
          "Colorless": "Domino Mat"
        }
      },
      "Big Mat": {
        "Sizeless": {
          "Colorless": "Big Mat"
        }
      },
      "Flower Mat": {
        "Sizeless": {
          "Colorless": "Flower Mat"
        }
      },
      "Half Mat": {
        "Sizeless": {
          "Colorless": "Half Mat"
        }
      },
      "Hex Mat": {
        "Sizeless": {
          "Colorless": "Hex Mat"
        }
      },
      "Invader Mat": {
        "Sizeless": {
          "Colorless": "Invader Mat"
        }
      },
      "Large Hex Mat": {
        "Large": {
          "Colorless": "Large Hex Mat"
        }
      },
      "Large Square Mat": {
        "Large": {
          "Colorless": "Large Square Mat"
        }
      },
      "Medium Game Mat": {
        "Medium": {
          "Colorless": "Medium Game Mat"
        }
      },
      "Placard Mat": {
        "Sizeless": {
          "Colorless": "Placard Mat"
        }
      },
      "Postcard Mat": {
        "Sizeless": {
          "Colorless": "Postcard Mat"
        }
      },
      "Quad Fold Mat": {
        "Sizeless": {
          "Colorless": "Quad Fold Mat"
        }
      },
      "Quarter Mat": {
        "Sizeless": {
          "Colorless": "Quarter Mat"
        }
      },
      "Skinny Mat": {
        "Sizeless": {
          "Colorless": "Skinny Mat"
        }
      },
      "Sliver Mat": {
        "Sizeless": {
          "Colorless": "Sliver Mat"
        }
      },
      "Slopeside Bi Fold Mat": {
        "Sizeless": {
          "Colorless": "Slopeside Bi Fold Mat"
        }
      },
      "Small Bi Fold Mat": {
        "Small": {
          "Colorless": "Small Bi Fold Mat"
        }
      },
      "Small Game Mat": {
        "Small": {
          "Colorless": "Small Game Mat"
        }
      },
      "Small Quad Fold Mat": {
        "Small": {
          "Colorless": "Small Quad Fold Mat"
        }
      },
      "Small Square Mat": {
        "Small": {
          "Colorless": "Small Square Mat"
        }
      },
      "Spinner Mat": {
        "Sizeless": {
          "Colorless": "Spinner Mat"
        }
      },
      "Square Mat": {
        "Sizeless": {
          "Colorless": "Square Mat"
        }
      },
      "Strip Mat": {
        "Sizeless": {
          "Colorless": "Strip Mat"
        }
      },
      "USGame Mat": {
        "Sizeless": {
          "Colorless": "USGame Mat"
        }
      }
    },
    "document": {
      "Mint Tin Accordion 4": {
        "4": {
          "Colorless": "Mint Tin Accordion 4"
        }
      },
      "Mint Tin Accordion 6": {
        "6": {
          "Colorless": "Mint Tin Accordion 6"
        }
      },
      "Mint Tin Accordion 8": {
        "8": {
          "Colorless": "Mint Tin Accordion 8"
        }
      },
      "Poker Folio": {
        "Sizeless": {
          "Colorless": "Poker Folio"
        }
      },
      "Mint Tin Folio": {
        "Sizeless": {
          "Colorless": "Mint Tin Folio"
        }
      },
      "Bridge Folio": {
        "Sizeless": {
          "Colorless": "Bridge Folio"
        }
      },
      "Document": {
        "Sizeless": {
          "Colorless": "Document"
        }
      },
      "Jumbo Booklet": {
        "Sizeless": {
          "Colorless": "Jumbo Booklet"
        }
      },
      "Large Booklet": {
        "Large": {
          "Colorless": "Large Booklet"
        }
      },
      "Large Score Pad Color": {
        "Large": {
          "Colorless": "Large Score Pad Color"
        }
      },
      "Medium Booklet": {
        "Medium": {
          "Colorless": "Medium Booklet"
        }
      },
      "Medium Folio": {
        "Medium": {
          "Colorless": "Medium Folio"
        }
      },
      "Medium Mat Book": {
        "Medium": {
          "Colorless": "Medium Mat Book"
        }
      },
      "Medium Score Pad Color": {
        "Medium": {
          "Colorless": "Medium Score Pad Color"
        }
      },
      "Small Booklet": {
        "Small": {
          "Colorless": "Small Booklet"
        }
      },
      "Small Folio": {
        "Small": {
          "Colorless": "Small Folio"
        }
      },
      "Small Score Pad Color": {
        "Small": {
          "Colorless": "Small Score Pad Color"
        }
      },
      "Square Folio": {
        "Sizeless": {
          "Colorless": "Square Folio"
        }
      },
      "Tall Booklet": {
        "Tall": {
          "Colorless": "Tall Booklet"
        }
      },
      "Tarot Booklet": {
        "Sizeless": {
          "Colorless": "Tarot Booklet"
        }
      },
      "Tarot Folio": {
        "Sizeless": {
          "Colorless": "Tarot Folio"
        }
      },
      "Digest Perfect Bound Book": {
        "Sizeless": {
          "Colorless": "Digest Perfect Bound Book"
        }
      },
      "Jumbo Coil Book": {
        "Sizeless": {
          "Colorless": "Jumbo Coil Book"
        }
      },
      "Letter Perfect Bound Book": {
        "Sizeless": {
          "Colorless": "Letter Perfect Bound Book"
        }
      },
      "Medium Coil Book": {
        "Medium": {
          "Colorless": "Medium Coil Book"
        }
      }
    },
    "blank": {},
    "screen": {
      "Large Screen": {
        "Large": {
          "Colorless": "Large Screen"
        }
      },
      "Medium Screen": {
        "Medium": {
          "Colorless": "Medium Screen"
        }
      },
      "Small Screen": {
        "Small": {
          "Colorless": "Small Screen"
        }
      }
    },
    "dial": {
      "Dual Dial": {
        "Sizeless": {
          "Colorless": "Dual Dial"
        }
      },
      "Small Dial": {
        "Small": {
          "Colorless": "Small Dial"
        }
      }
    },
    "NO_CATEGORY": {
      "Acrylic Shape 125": {
        "125": {
          "Colorless": "Acrylic Shape 125"
        }
      },
      "Acrylic Shape 250": {
        "250": {
          "Colorless": "Acrylic Shape 250"
        }
      },
      "Custom Large Cardstock": {
        "Sizeless": {
          "Colorless": "Custom Large Cardstock"
        }
      },
      "Custom Large Punchout": {
        "Sizeless": {
          "Colorless": "Custom Large Punchout"
        }
      },
      "Custom Medium Cardstock": {
        "Sizeless": {
          "Colorless": "Custom Medium Cardstock"
        }
      },
      "Custom Medium Punchout": {
        "Sizeless": {
          "Colorless": "Custom Medium Punchout"
        }
      },
      "Custom Mini Cardstock": {
        "Sizeless": {
          "Colorless": "Custom Mini Cardstock"
        }
      },
      "Custom Small Cardstock": {
        "Sizeless": {
          "Colorless": "Custom Small Cardstock"
        }
      },
      "Custom Small Punchout": {
        "Sizeless": {
          "Colorless": "Custom Small Punchout"
        }
      },
      "Large Acrylic Shape 125": {
        "Large": {
          "Colorless": "Large Acrylic Shape 125"
        }
      }
    }
  }
}
  module.exports = { COMPONENT_CATEGORIES }