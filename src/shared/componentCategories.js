const COMPONENT_CATEGORIES = {
  "STOCK": {
    "dice": {
      "D6": {
        "8mm": {
          "White": "D68mmWhite",
          "Black": "D68mmBlack",
          "Blue": "D68mmBlue",
          "Green": "D68mmGreen",
          "Red": "D68mmRed"
        },
        "16mm": {
          "Yellow": "D616mmYellow",
          "Blue": "D616mmBlue",
          "Black": "D616mmBlack",
          "Green": "D616mmGreen",
          "Purple": "D616mmPurple",
          "Red": "D616mmRed",
          "White": "D616mmWhite",
          "Wood": "D616mmWood"
        },
        "12mm": {
          "Blue": "D612mmBlue",
          "Green": "D612mmGreen",
          "Red": "D612mmRed",
          "White": "D612mmWhite",
          "Yellow": "D612mmYellow",
          "Caramel": "D612mmCaramel"
        },
        "14mm": {
          "Black": "D614mmBlack"
        }
      },
      "D6, Clear": {
        "12mm": {
          "Colorless": "D612mmClear"
        }
      },
      "D12": {
        "Sizeless": {
          "White": "D12White",
          "Black": "D12Black",
          "Blue": "D12Blue",
          "Green": "D12Green",
          "Red": "D12Red",
          "Yellow": "D12Yellow"
        }
      },
      "D20": {
        "Sizeless": {
          "Black": "D20Black",
          "Yellow": "D20Yellow",
          "White": "D20White",
          "Blue": "D20Blue",
          "Green": "D20Green",
          "Red": "D20Red"
        }
      },
      "D10": {
        "Sizeless": {
          "Black": "D10Black",
          "Blue": "D10Blue",
          "Green": "D10Green",
          "Red": "D10Red",
          "White": "D10White",
          "Yellow": "D10Yellow"
        }
      },
      "D10x10": {
        "Sizeless": {
          "Black": "D10x10Black"
        }
      },
      "D10x10, Black on": {
        "Sizeless": {
          "Red": "D10x10BlackonRed"
        }
      },
      "D10x10, White on": {
        "Sizeless": {
          "Red": "D10x10WhiteonRed"
        }
      },
      "D12, Body Parts": {
        "Sizeless": {
          "Colorless": "D12BodyParts"
        }
      },
      "D3, Rounded, Numeral": {
        "16mm": {
          "Black": "D316mmRoundedNumeralBlack",
          "Blue": "D316mmRoundedNumeralBlue",
          "Green": "D316mmRoundedNumeralGreen",
          "Red": "D316mmRoundedNumeralRed",
          "White": "D316mmRoundedNumeralWhite",
          "Yellow": "D316mmRoundedNumeralYellow"
        }
      },
      "D4": {
        "Sizeless": {
          "Black": "D4Black",
          "Blue": "D4Blue",
          "Green": "D4Green",
          "Orange": "D4Orange",
          "Red": "D4Red",
          "White": "D4White",
          "Yellow": "D4Yellow"
        }
      },
      "D4, Blank": {
        "Sizeless": {
          "Colorless": "D4Blank"
        }
      },
      "D6, Marbled": {
        "12mm": {
          "Black": "D612mmMarbledBlack",
          "Green": "D612mmMarbledGreen"
        }
      },
      "D6, Rounded": {
        "12mm": {
          "Blue": "D612mmRoundedBlue"
        }
      },
      "D6, Rounded, /Black": {
        "12mm": {
          "Blue": "D612mmRoundedBlue/Black",
          "Golden": "D612mmRoundedGolden/Black",
          "Purple": "D612mmRoundedPurple/Black",
          "White": "D612mmRoundedWhite/Black"
        }
      },
      "D6, Rounded, /Blue": {
        "12mm": {
          "Orange": "D612mmRoundedOrange/Blue"
        }
      },
      "D6, Transparent": {
        "12mm": {
          "Black": "D612mmTransparentBlack",
          "Blue": "D612mmTransparentBlue",
          "Green": "D612mmTransparentGreen",
          "Orange": "D612mmTransparentOrange",
          "Purple": "D612mmTransparentPurple",
          "Red": "D612mmTransparentRed",
          "Yellow": "D612mmTransparentYellow"
        }
      },
      "D6, Bold Numeral": {
        "15mm": {
          "Red": "D615mmBoldNumeralRed"
        }
      },
      "D6, Numeral": {
        "15mm": {
          "Blue": "D615mmNumeralBlue",
          "Green": "D615mmNumeralGreen",
          "Gray": "D615mmNumeralGray"
        },
        "16mm": {
          "Black": "D616mmNumeralBlack"
        }
      },
      "D6, Betrayal": {
        "16mm": {
          "Colorless": "D616mmBetrayal"
        }
      },
      "D6, Binary": {
        "16mm": {
          "Colorless": "D616mmBinary"
        }
      },
      "D6, Black on": {
        "16mm": {
          "Blue": "D616mmBlackonBlue",
          "Pink": "D616mmBlackonPink"
        }
      },
      "D6, Blank": {
        "16mm": {
          "Black": "D616mmBlankBlack",
          "Blue": "D616mmBlankBlue",
          "Green": "D616mmBlankGreen",
          "Orange": "D616mmBlankOrange",
          "Purple": "D616mmBlankPurple",
          "Red": "D616mmBlankRed",
          "White": "D616mmBlankWhite",
          "Yellow": "D616mmBlankYellow"
        }
      },
      "D6, Blank, Wood, Dark": {
        "16mm": {
          "Colorless": "D616mmBlankWoodDark"
        }
      },
      "D6, Lightning Bolt": {
        "16mm": {
          "Black": "D616mmLightningBoltBlack",
          "Blue": "D616mmLightningBoltBlue",
          "Brown": "D616mmLightningBoltBrown",
          "Green": "D616mmLightningBoltGreen",
          "Yellow": "D616mmLightningBoltYellow"
        }
      },
      "D6, Rounded, Pearl": {
        "16mm": {
          "Black": "D616mmRoundedBlackPearl",
          "Blue": "D616mmRoundedBluePearl",
          "Brown": "D616mmRoundedBrownPearl",
          "Green": "D616mmRoundedGreenPearl",
          "White": "D616mmRoundedWhitePearl"
        }
      },
      "D6, Rounded, Opaque": {
        "16mm": {
          "Brown": "D616mmRoundedBrownOpaque",
          "Orange": "D616mmRoundedOrangeOpaque"
        }
      },
      "D6, Sicherman, High": {
        "16mm": {
          "Colorless": "D616mmSichermanHigh"
        }
      },
      "D6, Sicherman, Low": {
        "16mm": {
          "Colorless": "D616mmSichermanLow"
        }
      },
      "D6, Symbol": {
        "16mm": {
          "Ivory": "D616mmSymbolIvory"
        }
      },
      "D6, Animal Symbols": {
        "25mm": {
          "Colorless": "D625mmAnimalSymbols"
        }
      },
      "D6, Alien, Black on": {
        "Sizeless": {
          "Green": "D6AlienBlackonGreen"
        }
      },
      "D6, Alien, Red on": {
        "Sizeless": {
          "Green": "D6AlienRedonGreen"
        }
      },
      "D6, Colors": {
        "Sizeless": {
          "Colorless": "D6Colors"
        }
      },
      "D6, Dinosaur": {
        "Sizeless": {
          "Colorless": "D6Dinosaur"
        }
      },
      "D6, Emotion": {
        "Sizeless": {
          "Colorless": "D6Emotion"
        }
      },
      "D6, Indented, Blank": {
        "Sizeless": {
          "Blue": "D6IndentedBlankBlue",
          "Dark Blue": "D6IndentedBlankDarkBlue",
          "Green": "D6IndentedBlankGreen",
          "Lavender": "D6IndentedBlankLavender",
          "Light Blue": "D6IndentedBlankLightBlue",
          "Lime Green": "D6IndentedBlankLimeGreen",
          "Orange": "D6IndentedBlankOrange",
          "Purple": "D6IndentedBlankPurple",
          "Red": "D6IndentedBlankRed",
          "White": "D6IndentedBlankWhite",
          "Yellow": "D6IndentedBlankYellow"
        }
      },
      "D6, Interrogative": {
        "Sizeless": {
          "Colorless": "D6Interrogative"
        }
      },
      "D6, Natural Shapes": {
        "Sizeless": {
          "Colorless": "D6NaturalShapes"
        }
      },
      "D6, Negative Counter": {
        "Sizeless": {
          "Colorless": "D6NegativeCounter"
        }
      },
      "D6, Parts of Speech": {
        "Sizeless": {
          "Colorless": "D6PartsofSpeech"
        }
      },
      "D6, Positive Counter": {
        "Sizeless": {
          "Colorless": "D6PositiveCounter"
        }
      },
      "D6, Shapes": {
        "Sizeless": {
          "Colorless": "D6Shapes"
        }
      },
      "D6, Species": {
        "Sizeless": {
          "Colorless": "D6Species"
        }
      },
      "D6, Train": {
        "18mm": {
          "White": "D6Train18mmWhite"
        }
      },
      "D6, Woodland Animals": {
        "Sizeless": {
          "Colorless": "D6WoodlandAnimals"
        }
      },
      "D8": {
        "Sizeless": {
          "Black": "D8Black",
          "Blue": "D8Blue",
          "Green": "D8Green",
          "Red": "D8Red",
          "White": "D8White",
          "Yellow": "D8Yellow"
        }
      },
      "D8, Blank": {
        "Sizeless": {
          "Colorless": "D8Blank"
        }
      },
      "D8, Compass": {
        "Sizeless": {
          "Colorless": "D8Compass"
        }
      },
      "Rocket Dice": {
        "Sizeless": {
          "Black": "RocketDiceBlack",
          "Blue": "RocketDiceBlue",
          "Brown": "RocketDiceBrown",
          "Green": "RocketDiceGreen",
          "Gray": "RocketDiceGray",
          "Pink": "RocketDicePink",
          "Purple": "RocketDicePurple",
          "Red": "RocketDiceRed",
          "White": "RocketDiceWhite"
        }
      },
      "Rocket Dice, Frost": {
        "Sizeless": {
          "White": "RocketDiceFrostWhite"
        }
      },
      "D16": {
        "Sizeless": {
          "Purple": "D16Purple"
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
          "Colorless": "BrokenColumn"
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
          "Colorless": "ComputerDesk"
        }
      },
      "Fence, Wicker": {
        "Sizeless": {
          "Colorless": "FenceWicker"
        }
      },
      "Handmade Brick": {
        "Sizeless": {
          "Colorless": "HandmadeBrick"
        }
      },
      "Handmade Campfire": {
        "Sizeless": {
          "Colorless": "HandmadeCampfire"
        }
      },
      "Handmade Coal": {
        "Sizeless": {
          "Colorless": "HandmadeCoal"
        }
      },
      "Handmade Corn": {
        "Sizeless": {
          "Colorless": "HandmadeCorn"
        }
      },
      "Handmade Fence": {
        "Sizeless": {
          "Colorless": "HandmadeFence"
        }
      },
      "Handmade Grape": {
        "Sizeless": {
          "Colorless": "HandmadeGrape"
        }
      },
      "Handmade Oil Drum": {
        "Sizeless": {
          "Colorless": "HandmadeOilDrum"
        }
      },
      "Handmade Pumpkin": {
        "Sizeless": {
          "Colorless": "HandmadePumpkin"
        }
      },
      "Handmade Reed": {
        "Sizeless": {
          "Colorless": "HandmadeReed"
        }
      },
      "Handmade Skull": {
        "Sizeless": {
          "Colorless": "HandmadeSkull"
        }
      },
      "Handmade Trash Can": {
        "Sizeless": {
          "Colorless": "HandmadeTrashCan"
        }
      },
      "Handmade Trough": {
        "Sizeless": {
          "Colorless": "HandmadeTrough"
        }
      },
      "Handmade Uranium Rod": {
        "Sizeless": {
          "Colorless": "HandmadeUraniumRod"
        }
      },
      "Handmade Wheat": {
        "Sizeless": {
          "Colorless": "HandmadeWheat"
        }
      },
      "Lamp Post": {
        "Sizeless": {
          "Colorless": "LampPost"
        }
      },
      "Lantern": {
        "Sizeless": {
          "Colorless": "Lantern"
        }
      },
      "Treasure Chest (closed)": {
        "Large": {
          "Colorless": "LargeTreasureChest(closed)"
        }
      },
      "Notice Board": {
        "Sizeless": {
          "Colorless": "NoticeBoard"
        }
      },
      "Pentagram": {
        "Sizeless": {
          "Colorless": "Pentagram"
        }
      },
      "Premium Apple": {
        "Sizeless": {
          "Colorless": "PremiumApple"
        }
      },
      "Premium Axe": {
        "Sizeless": {
          "Colorless": "PremiumAxe"
        }
      },
      "Premium Barrel": {
        "Sizeless": {
          "Colorless": "PremiumBarrel"
        }
      },
      "Premium Bee": {
        "Sizeless": {
          "Colorless": "PremiumBee"
        }
      },
      "Premium Blue Cloth Bundle": {
        "Sizeless": {
          "Colorless": "PremiumBlueClothBundle"
        }
      },
      "Premium Brain": {
        "Sizeless": {
          "Colorless": "PremiumBrain"
        }
      },
      "Premium Brick": {
        "Sizeless": {
          "Colorless": "PremiumBrick"
        }
      },
      "Premium Brown Spice Sack": {
        "Sizeless": {
          "Colorless": "PremiumBrownSpiceSack"
        }
      },
      "Premium Buckler": {
        "Sizeless": {
          "Colorless": "PremiumBuckler"
        }
      },
      "Premium Campfire": {
        "Sizeless": {
          "Colorless": "PremiumCampfire"
        }
      },
      "Premium Cinder Block": {
        "Sizeless": {
          "Colorless": "PremiumCinderBlock"
        }
      },
      "Premium Coal": {
        "Sizeless": {
          "Colorless": "PremiumCoal"
        }
      },
      "Premium Copper Ingot": {
        "Sizeless": {
          "Colorless": "PremiumCopperIngot"
        }
      },
      "Premium Corn": {
        "Sizeless": {
          "Colorless": "PremiumCorn"
        }
      },
      "Premium Crate": {
        "Sizeless": {
          "Colorless": "PremiumCrate"
        }
      },
      "Premium Dog": {
        "Sizeless": {
          "Colorless": "PremiumDog"
        }
      },
      "Premium Energy Cell": {
        "Sizeless": {
          "Colorless": "PremiumEnergyCell"
        }
      },
      "Premium Fur Bundle": {
        "Sizeless": {
          "Colorless": "PremiumFurBundle"
        }
      },
      "Premium Gold Ingot": {
        "Sizeless": {
          "Colorless": "PremiumGoldIngot"
        }
      },
      "Premium Gold Nugget": {
        "Sizeless": {
          "Colorless": "PremiumGoldNugget"
        }
      },
      "Premium Grain Sack": {
        "Sizeless": {
          "Colorless": "PremiumGrainSack"
        }
      },
      "Premium Green Spice Sack": {
        "Sizeless": {
          "Colorless": "PremiumGreenSpiceSack"
        }
      },
      "Premium Heart": {
        "Sizeless": {
          "Colorless": "PremiumHeart"
        }
      },
      "Premium Horse": {
        "Sizeless": {
          "Colorless": "PremiumHorse"
        }
      },
      "Premium Iron Ingot": {
        "Sizeless": {
          "Colorless": "PremiumIronIngot"
        }
      },
      "Premium Leather Bag": {
        "Sizeless": {
          "Colorless": "PremiumLeatherBag"
        }
      },
      "Premium Leather Scroll": {
        "Sizeless": {
          "Colorless": "PremiumLeatherScroll"
        }
      },
      "Premium LP Gas Can": {
        "Sizeless": {
          "Colorless": "PremiumLPGasCan"
        }
      },
      "Premium Magnifying Glass": {
        "Sizeless": {
          "Colorless": "PremiumMagnifyingGlass"
        }
      },
      "Premium Marble Tile": {
        "Sizeless": {
          "Colorless": "PremiumMarbleTile"
        }
      },
      "Premium Oil Drum": {
        "Sizeless": {
          "Colorless": "PremiumOilDrum"
        }
      },
      "Premium Orange Cloth Bundle": {
        "Sizeless": {
          "Colorless": "PremiumOrangeClothBundle"
        }
      },
      "Premium Ore": {
        "Sizeless": {
          "Colorless": "PremiumOre"
        }
      },
      "Premium Potion Bottle": {
        "Sizeless": {
          "Colorless": "PremiumPotionBottle"
        }
      },
      "Premium Pumpkin": {
        "Sizeless": {
          "Colorless": "PremiumPumpkin"
        }
      },
      "Premium Purple Cloth Bundle": {
        "Sizeless": {
          "Colorless": "PremiumPurpleClothBundle"
        }
      },
      "Premium Red Spice Sack": {
        "Sizeless": {
          "Colorless": "PremiumRedSpiceSack"
        }
      },
      "Premium Sealed Scroll": {
        "Sizeless": {
          "Colorless": "PremiumSealedScroll"
        }
      },
      "Premium Skull": {
        "Sizeless": {
          "Colorless": "PremiumSkull"
        }
      },
      "Premium Space Crate": {
        "Sizeless": {
          "Colorless": "PremiumSpaceCrate"
        }
      },
      "Premium Tome": {
        "Sizeless": {
          "Colorless": "PremiumTome"
        }
      },
      "Premium Trash Can": {
        "Sizeless": {
          "Colorless": "PremiumTrashCan"
        }
      },
      "Premium Treasure Chest": {
        "Sizeless": {
          "Colorless": "PremiumTreasureChest"
        }
      },
      "Premium Uranium Rod": {
        "Sizeless": {
          "Colorless": "PremiumUraniumRod"
        }
      },
      "Premium Water Bucket": {
        "Sizeless": {
          "Colorless": "PremiumWaterBucket"
        }
      },
      "Premium White Cloth Bundle": {
        "Sizeless": {
          "Colorless": "PremiumWhiteClothBundle"
        }
      },
      "Premium White Spice Sack": {
        "Sizeless": {
          "Colorless": "PremiumWhiteSpiceSack"
        }
      },
      "Premium": {
        "Sizeless": {
          "Wood": "PremiumWood"
        }
      },
      "Premium Yarn Ball": {
        "Sizeless": {
          "Colorless": "PremiumYarnBall"
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
          "Brown": "T-BarBrown"
        }
      },
      "Table": {
        "Sizeless": {
          "Orange": "TableOrange"
        }
      },
      "Toilet Paper": {
        "Sizeless": {
          "Colorless": "ToiletPaper"
        }
      },
      "Tombstone": {
        "Sizeless": {
          "Colorless": "Tombstone"
        }
      },
      "Top Hat": {
        "Sizeless": {
          "Colorless": "TopHat"
        }
      },
      "Traffic Cone": {
        "Sizeless": {
          "Colorless": "TrafficCone"
        }
      },
      "Treasure Chest Container": {
        "Sizeless": {
          "Colorless": "TreasureChestContainer"
        }
      },
      "Valve Control Station": {
        "Sizeless": {
          "Colorless": "ValveControlStation"
        }
      },
      "Walker Driver, Space": {
        "Sizeless": {
          "Colorless": "WalkerDriverSpace"
        }
      },
      "Wall, Sandbags": {
        "Sizeless": {
          "Colorless": "WallSandbags"
        }
      },
      "Wall, Stone": {
        "Sizeless": {
          "Colorless": "WallStone"
        }
      },
      "Premium Beer Mug": {
        "Sizeless": {
          "Colorless": "PremiumBeerMug"
        }
      },
      "Premium Blood Droplet": {
        "Sizeless": {
          "Colorless": "PremiumBloodDroplet"
        }
      },
      "Premium Blue Tome": {
        "Sizeless": {
          "Colorless": "PremiumBlueTome"
        }
      },
      "Premium Brown Mushroom": {
        "Sizeless": {
          "Colorless": "PremiumBrownMushroom"
        }
      },
      "Premium Bullet": {
        "Sizeless": {
          "Colorless": "PremiumBullet"
        }
      },
      "Premium Coffee Bean": {
        "Sizeless": {
          "Colorless": "PremiumCoffeeBean"
        }
      },
      "Premium Deflector Shield": {
        "Sizeless": {
          "Colorless": "PremiumDeflectorShield"
        }
      },
      "Premium Explosion": {
        "Sizeless": {
          "Colorless": "PremiumExplosion"
        }
      },
      "Premium Gas Can": {
        "Sizeless": {
          "Colorless": "PremiumGasCan"
        }
      },
      "Premium Green Leaf": {
        "Sizeless": {
          "Colorless": "PremiumGreenLeaf"
        }
      },
      "Premium Hammer": {
        "Sizeless": {
          "Colorless": "PremiumHammer"
        }
      },
      "Premium Ice Crystals": {
        "Sizeless": {
          "Colorless": "PremiumIceCrystals"
        }
      },
      "Premium Med Kit": {
        "Sizeless": {
          "Colorless": "PremiumMedKit"
        }
      },
      "Premium Milk Bottle": {
        "Sizeless": {
          "Colorless": "PremiumMilkBottle"
        }
      },
      "Premium Mushroom": {
        "Sizeless": {
          "Colorless": "PremiumMushroom"
        }
      },
      "Premium Orange Tome": {
        "Sizeless": {
          "Colorless": "PremiumOrangeTome"
        }
      },
      "Premium Pile of Bones": {
        "Sizeless": {
          "Colorless": "PremiumPileofBones"
        }
      },
      "Premium Present": {
        "Sizeless": {
          "Colorless": "PremiumPresent"
        }
      },
      "Premium Purple Grapes": {
        "Sizeless": {
          "Colorless": "PremiumPurpleGrapes"
        }
      },
      "Premium Smoke Cloud": {
        "Sizeless": {
          "Colorless": "PremiumSmokeCloud"
        }
      },
      "Premium Stone": {
        "Sizeless": {
          "Colorless": "PremiumStone"
        }
      },
      "Premium Tech Tablet": {
        "Sizeless": {
          "Colorless": "PremiumTechTablet"
        }
      },
      "Premium Tentacle": {
        "Sizeless": {
          "Colorless": "PremiumTentacle"
        }
      },
      "Premium Toxic Waste": {
        "Sizeless": {
          "Colorless": "PremiumToxicWaste"
        }
      },
      "Premium Water Droplet": {
        "Sizeless": {
          "Colorless": "PremiumWaterDroplet"
        }
      },
      "Premium Wheat Bundle": {
        "Sizeless": {
          "Colorless": "PremiumWheatBundle"
        }
      },
      "Premium White Sheaf": {
        "Sizeless": {
          "Colorless": "PremiumWhiteSheaf"
        }
      },
      "Premium Wrench": {
        "Sizeless": {
          "Colorless": "PremiumWrench"
        }
      }
    },
    "packaging": {
      "Box Insert, Pro": {
        "Medium": {
          "Colorless": "BoxInsertProMedium"
        },
        "Small": {
          "Colorless": "BoxInsertProSmall"
        }
      },
      "Box Insert, Stout": {
        "Small": {
          "Colorless": "BoxInsertStoutSmall"
        }
      },
      "Card Envelope": {
        "Sizeless": {
          "Colorless": "CardEnvelope",
          "White": "CardEnvelopeWhite"
        }
      },
      "Clear Poker Tuck Box": {
        "41": {
          "Colorless": "ClearPokerTuckBox(41)"
        },
        "66": {
          "Colorless": "ClearPokerTuckBox(66)"
        },
        "200": {
          "Colorless": "ClearPokerTuckBox(200)"
        }
      },
      "Deck Box, Blank": {
        "Sizeless": {
          "Colorless": "DeckBoxBlank"
        }
      },
      "Euro Poker Tin": {
        "Sizeless": {
          "Colorless": "EuroPokerTin"
        }
      },
      "Hang Tabs, Triangle (pack of 20)": {
        "Sizeless": {
          "Colorless": "HangTabsTriangle(packof20)"
        }
      },
      "Blank Mint Tin": {
        "Sizeless": {
          "Colorless": "MintTin"
        }
      },
      "Mint Tin Ribbon": {
        "Sizeless": {
          "Colorless": "MintTinRibbon"
        }
      },
      "Mint Tin": {
        "Tall": {
          "Colorless": "MintTinTall"
        }
      },
      "Parts Bowl": {
        "70mm": {
          "Colorless": "PartsBowl70mm"
        }
      },
      "Parts Tray": {
        "Sizeless": {
          "Colorless": "PartsTray"
        }
      },
      "Storage Jar, Round, Clear": {
        "Sizeless": {
          "Colorless": "StorageJarRoundClear"
        }
      },
      "Storage Jar, Tin": {
        "Sizeless": {
          "Colorless": "StorageJarTin"
        }
      },
      "Deck Storage, Clear": {
        "Sizeless": {
          "Colorless": "DeckStorageClear"
        }
      },
      "Black Tin": {
        "Large": {
          "Colorless": "LargeBlackTin"
        }
      }
    },
    "sleeve": {
      "Jumbo Sleeve Pack": {
        "100": {
          "Colorless": "JumboSleevePack(100)"
        }
      },
      "Mini Sleeve Pack": {
        "100": {
          "Colorless": "MiniSleevePack(100)"
        }
      },
      "Tarot Sleeve Pack": {
        "100": {
          "Colorless": "TarotSleevePack(100)"
        }
      },
      "Bridge Sleeve Pack": {
        "100": {
          "Colorless": "BridgeSleevePack(100)"
        }
      },
      "Poker Sleeve Pack": {
        "100": {
          "Colorless": "PokerSleevePack(100)"
        }
      }
    },
    "baggies": {
      "11 X 11 Baggies": {
        "Sizeless": {
          "Colorless": "11X11Baggies"
        }
      },
      "3 X 4 Baggies": {
        "Sizeless": {
          "Colorless": "3X4Baggies"
        }
      },
      "4 X 10 Baggies": {
        "Sizeless": {
          "Colorless": "4X10Baggies"
        }
      },
      "4 X 5 Baggies": {
        "Sizeless": {
          "Colorless": "4X5Baggies"
        }
      },
      "4 X 6 Baggies": {
        "Sizeless": {
          "Colorless": "4X6Baggies"
        }
      },
      "5 X 5 Baggies": {
        "Sizeless": {
          "Colorless": "5X5Baggies"
        }
      },
      "5 X 7 Baggies": {
        "Sizeless": {
          "Colorless": "5X7Baggies"
        }
      },
      "6 X 10 Baggies": {
        "Sizeless": {
          "Colorless": "6X10Baggies"
        }
      },
      "7 X 12 Baggies": {
        "Sizeless": {
          "Colorless": "7X12Baggies"
        }
      },
      "9 X 12 Baggies": {
        "Sizeless": {
          "Colorless": "9X12Baggies"
        }
      },
      "Burlap Bag": {
        "Small": {
          "Black": "BurlapBagSmallBlack",
          "Green": "BurlapBagSmallGreen",
          "Red": "BurlapBagSmallRed",
          "White": "BurlapBagSmallWhite"
        }
      },
      "Cotton Bag": {
        "Small": {
          "White": "CottonBagSmallWhite"
        }
      },
      "Grab Bag": {
        "Sizeless": {
          "Colorless": "GrabBag"
        }
      },
      "Grab Bag, Premium": {
        "Sizeless": {
          "Colorless": "GrabBagPremium"
        }
      },
      "Parts Bag, Fancy": {
        "Sizeless": {
          "Gold": "PartsBagFancyGold",
          "Silver": "PartsBagFancySilver"
        }
      },
      "Parts Bag": {
        "Large": {
          "Black": "PartsBagLargeBlack",
          "Blue": "PartsBagLargeBlue",
          "Red": "PartsBagLargeRed"
        },
        "Medium": {
          "Black": "PartsBagMediumBlack",
          "Blue": "PartsBagMediumBlue",
          "Brown": "PartsBagMediumBrown",
          "Green": "PartsBagMediumGreen",
          "Gray": "PartsBagMediumGray",
          "Purple": "PartsBagMediumPurple",
          "Red": "PartsBagMediumRed"
        },
        "Small": {
          "Black": "PartsBagSmallBlack",
          "Blue": "PartsBagSmallBlue",
          "Brown": "PartsBagSmallBrown",
          "Gray": "PartsBagSmallGray",
          "Green": "PartsBagSmallGreen",
          "Purple": "PartsBagSmallPurple",
          "Red": "PartsBagSmallRed"
        },
        "Tall": {
          "Black": "PartsBagTallBlack"
        }
      },
      "Parts Bag, Large Cloth": {
        "Sizeless": {
          "Black": "PartsBagLargeClothBlack"
        }
      }
    },
    "cube": {
      "Cube": {
        "8mm": {
          "Green": "Cube8mmGreen",
          "Orange": "Cube8mmOrange",
          "Black": "Cube8mmBlack",
          "Blue": "Cube8mmBlue",
          "White": "Cube8mmWhite",
          "Red": "Cube8mmRed",
          "Purple": "Cube8mmPurple",
          "Brown": "Cube8mmBrown",
          "Gray": "Cube8mmGray",
          "Light Pink": "Cube8mmLightPink",
          "Natural": "Cube8mmNatural",
          "Pink": "Cube8mmPink",
          "Yellow": "Cube8mmYellow"
        },
        "10mm": {
          "Black": "Cube10mmBlack",
          "Blue": "Cube10mmBlue",
          "Brown": "Cube10mmBrown",
          "Green": "Cube10mmGreen",
          "Gray": "Cube10mmGray",
          "Mustard": "Cube10mmMustard",
          "Orange": "Cube10mmOrange",
          "Pink": "Cube10mmPink",
          "Purple": "Cube10mmPurple",
          "Red": "Cube10mmRed",
          "White": "Cube10mmWhite",
          "Yellow": "Cube10mmYellow"
        },
        "15mm": {
          "Red": "Cube15mmRed"
        },
        "13mm": {
          "Blue": "Cube13mmBlue",
          "Green": "Cube13mmGreen",
          "Red": "Cube13mmRed",
          "Yellow": "Cube13mmYellow"
        }
      },
      "Block 1x1": {
        "Sizeless": {
          "Black": "Block1x1Black",
          "Blue": "Block1x1Blue",
          "Red": "Block1x1Red",
          "White": "Block1x1White",
          "Yellow": "Block1x1Yellow"
        }
      },
      "Block 1x2": {
        "Sizeless": {
          "Black": "Block1x2Black",
          "Blue": "Block1x2Blue",
          "Red": "Block1x2Red",
          "White": "Block1x2White",
          "Yellow": "Block1x2Yellow"
        }
      },
      "Block 1x3": {
        "Sizeless": {
          "Black": "Block1x3Black",
          "Blue": "Block1x3Blue",
          "Red": "Block1x3Red",
          "White": "Block1x3White",
          "Yellow": "Block1x3Yellow"
        }
      },
      "Cube, Bright": {
        "8mm": {
          "Yellow": "Cube8mmBrightYellow"
        }
      },
      "Cube, Metal": {
        "8mm": {
          "Bronze": "CubeMetalBronze8mm",
          "Gold": "CubeMetalGold8mm",
          "Silver": "CubeMetalSilver8mm"
        }
      },
      "D6": {
        "12mm": {
          "Black": "D612mmBlack"
        }
      },
      "Flatbed Truck, Wood": {
        "Sizeless": {
          "Black": "FlatbedTruckWoodBlack"
        }
      },
      "Future Cube": {
        "Sizeless": {
          "Orange": "FutureCubeOrange",
          "Purple": "FutureCubePurple",
          "Red": "FutureCubeRed",
          "Yellow": "FutureCubeYellow",
          "Blue": "FutureCubeBlue"
        }
      },
      "Ice Cube": {
        "10mm": {
          "Copper": "IceCube10mmCopper"
        },
        "8mm": {
          "Copper": "IceCube8mmCopper"
        }
      },
      "Ice Cube, Opaque": {
        "10mm": {
          "Black": "IceCube10mmOpaqueBlack",
          "Gold": "IceCube10mmOpaqueGold",
          "Silver": "IceCube10mmOpaqueSilver",
          "White": "IceCube10mmOpaqueWhite"
        },
        "12mm": {
          "Black": "IceCube12mmOpaqueBlack",
          "Gold": "IceCube12mmOpaqueGold",
          "Silver": "IceCube12mmOpaqueSilver",
          "White": "IceCube12mmOpaqueWhite"
        },
        "8mm": {
          "Black": "IceCube8mmOpaqueBlack",
          "Gold": "IceCube8mmOpaqueGold",
          "Silver": "IceCube8mmOpaqueSilver",
          "White": "IceCube8mmOpaqueWhite"
        }
      },
      "Ice Cube, Transparent": {
        "10mm": {
          "Black": "IceCube10mmTransparentBlack",
          "Blue": "IceCube10mmTransparentBlue",
          "Green": "IceCube10mmTransparentGreen",
          "Orange": "IceCube10mmTransparentOrange",
          "Purple": "IceCube10mmTransparentPurple",
          "Red": "IceCube10mmTransparentRed",
          "White": "IceCube10mmTransparentWhite",
          "Yellow": "IceCube10mmTransparentYellow"
        },
        "12mm": {
          "Black": "IceCube12mmTransparentBlack",
          "Blue": "IceCube12mmTransparentBlue",
          "Green": "IceCube12mmTransparentGreen",
          "Orange": "IceCube12mmTransparentOrange",
          "Purple": "IceCube12mmTransparentPurple",
          "Red": "IceCube12mmTransparentRed",
          "White": "IceCube12mmTransparentWhite",
          "Yellow": "IceCube12mmTransparentYellow"
        },
        "8mm": {
          "Black": "IceCube8mmTransparentBlack",
          "Blue": "IceCube8mmTransparentBlue",
          "Green": "IceCube8mmTransparentGreen",
          "Orange": "IceCube8mmTransparentOrange",
          "Purple": "IceCube8mmTransparentPurple",
          "Red": "IceCube8mmTransparentRed",
          "White": "IceCube8mmTransparentWhite",
          "Yellow": "IceCube8mmTransparentYellow"
        }
      },
      "Ice Cube, Transparent, Clear": {
        "10mm": {
          "Colorless": "IceCube10mmTransparentClear"
        },
        "12mm": {
          "Colorless": "IceCube12mmTransparentClear"
        },
        "8mm": {
          "Colorless": "IceCube8mmTransparentClear"
        }
      },
      "Qubit": {
        "Sizeless": {
          "Black": "QubitBlack",
          "Blue": "QubitBlue",
          "Green": "QubitGreen",
          "Orange": "QubitOrange",
          "Purple": "QubitPurple",
          "Red": "QubitRed",
          "White": "QubitWhite",
          "Yellow": "QubitYellow"
        }
      }
    },
    "tube": {
      "Cylinder": {
        "10mm x 10mm": {
          "Black": "Cylinder10mmx10mmBlack",
          "Blue": "Cylinder10mmx10mmBlue",
          "Green": "Cylinder10mmx10mmGreen",
          "Orange": "Cylinder10mmx10mmOrange",
          "Purple": "Cylinder10mmx10mmPurple",
          "Red": "Cylinder10mmx10mmRed",
          "White": "Cylinder10mmx10mmWhite",
          "Yellow": "Cylinder10mmx10mmYellow"
        },
        "8mm x 15mm": {
          "Yellow": "Cylinder15mmx8mmYellow"
        },
        "10mm x 18mm": {
          "Yellow": "Cylinder18mmx10mmYellow"
        },
        "14mm x 30mm": {
          "Natural": "Cylinder30mmx14mmNatural"
        },
        "30mm x 15mm": {
          "Blue": "Cylinder30mmx15mmBlue",
          "Yellow": "Cylinder30mmx15mmYellow"
        }
      },
      "Disc": {
        "14mm x 10mm": {
          "Blue": "Disc14mmx10mmBlue",
          "Purple": "Disc14mmx10mmPurple",
          "Red": "Disc14mmx10mmRed"
        },
        "14mm x 4mm": {
          "Black": "Disc14mmx4mmBlack",
          "Green": "Disc14mmx4mmGreen",
          "Light Blue": "Disc14mmx4mmLightBlue",
          "Light Purple": "Disc14mmx4mmLightPurple",
          "Red": "Disc14mmx4mmRed",
          "Yellow": "Disc14mmx4mmYellow"
        },
        "15mm x 5mm": {
          "Black": "Disc15mmx5mmBlack",
          "Blue": "Disc15mmx5mmBlue",
          "Green": "Disc15mmx5mmGreen",
          "Red": "Disc15mmx5mmRed"
        },
        "15mm x 6mm": {
          "Lime Green": "Disc15mmx6mmLimeGreen",
          "Orange": "Disc15mmx6mmOrange",
          "Red": "Disc15mmx6mmRed",
          "Yellow": "Disc15mmx6mmYellow"
        },
        "16mm x 10mm": {
          "Blue": "Disc16mmx10mmBlue",
          "Brown": "Disc16mmx10mmBrown",
          "Green": "Disc16mmx10mmGreen",
          "Purple": "Disc16mmx10mmPurple",
          "Red": "Disc16mmx10mmRed",
          "Yellow": "Disc16mmx10mmYellow"
        },
        "16mm x 4mm": {
          "Black": "Disc16mmx4mmBlack",
          "Blue": "Disc16mmx4mmBlue",
          "Green": "Disc16mmx4mmGreen",
          "Orange": "Disc16mmx4mmOrange",
          "Purple": "Disc16mmx4mmPurple",
          "Red": "Disc16mmx4mmRed",
          "White": "Disc16mmx4mmWhite",
          "Yellow": "Disc16mmx4mmYellow"
        },
        "16mm x 6mm": {
          "Light Purple": "Disc16mmx6mmLightPurple",
          "Orange": "Disc16mmx6mmOrange"
        },
        "16mm x 8mm": {
          "Mint": "Disc16mmx8mmMint",
          "Pink": "Disc16mmx8mmPink",
          "Purple": "Disc16mmx8mmPurple",
          "Tan": "Disc16mmx8mmTan",
          "Yellow": "Disc16mmx8mmYellow"
        },
        "17mm x 10mm": {
          "Apricot": "Disc17mmx10mmApricot",
          "Green": "Disc17mmx10mmGreen"
        },
        "18mm x 5mm": {
          "Red": "Disc18mmx5mmRed"
        },
        "30mm x 5mm": {
          "Blue": "Disc30mmx5mmBlue"
        }
      },
      "Disc, Clear": {
        "18mm x 3mm": {
          "Colorless": "Disc18mmx3mmClear"
        },
        "18mm x 6mm": {
          "Colorless": "Disc18mmx6mmClear"
        },
        "25mm x 3mm": {
          "Colorless": "Disc25mmx3mmClear"
        },
        "25mm x 6mm": {
          "Colorless": "Disc25mmx6mmClear"
        }
      },
      "Disc, Fluorescent": {
        "18mm x 3mm": {
          "Blue": "Disc18mmx3mmfluorescentblue",
          "Green": "Disc18mmx3mmFluorescentGreen",
          "Orange": "Disc18mmx3mmFluorescentOrange",
          "Red": "Disc18mmx3mmFluorescentRed",
          "Yellow": "Disc18mmx3mmFluorescentYellow"
        },
        "18mm x 6mm": {
          "Blue": "Disc18mmx6mmFluorescentBlue",
          "Green": "Disc18mmx6mmFluorescentGreen",
          "Orange": "Disc18mmx6mmFluorescentOrange",
          "Red": "Disc18mmx6mmFluorescentRed",
          "Yellow": "Disc18mmx6mmFluorescentYellow"
        },
        "25mm x 3mm": {
          "Blue": "Disc25mmx3mmFluorescentBlue",
          "Green": "Disc25mmx3mmFluorescentGreen",
          "Orange": "Disc25mmx3mmFluorescentOrange",
          "Red": "Disc25mmx3mmFluorescentRed",
          "Yellow": "Disc25mmx3mmFluorescentYellow"
        },
        "25mm x 6mm": {
          "Blue": "Disc25mmx6mmFluorescentBlue",
          "Green": "Disc25mmx6mmFluorescentGreen",
          "Orange": "Disc25mmx6mmFluorescentOrange",
          "Red": "Disc25mmx6mmFluorescentRed",
          "Yellow": "Disc25mmx6mmFluorescentYellow"
        }
      },
      "Disc, Transparent": {
        "18mm x 3mm": {
          "Blue": "Disc18mmx3mmTransparentBlue",
          "Green": "Disc18mmx3mmTransparentGreen",
          "Gray": "Disc18mmx3mmTransparentGray",
          "Orange": "Disc18mmx3mmTransparentOrange",
          "Purple": "Disc18mmx3mmTransparentPurple",
          "Red": "Disc18mmx3mmTransparentRed",
          "Yellow": "Disc18mmx3mmTransparentYellow"
        },
        "18mm x 6mm": {
          "Blue": "Disc18mmx6mmTransparentBlue",
          "Green": "Disc18mmx6mmTransparentGreen",
          "Gray": "Disc18mmx6mmTransparentGray",
          "Orange": "Disc18mmx6mmTransparentOrange",
          "Purple": "Disc18mmx6mmTransparentPurple",
          "Red": "Disc18mmx6mmTransparentRed",
          "Yellow": "Disc18mmx6mmTransparentYellow"
        },
        "25mm x 3mm": {
          "Blue": "Disc25mmx3mmTransparentBlue",
          "Green": "Disc25mmx3mmTransparentGreen",
          "Gray": "Disc25mmx3mmTransparentGray",
          "Orange": "Disc25mmx3mmTransparentOrange",
          "Red": "Disc25mmx3mmTransparentRed",
          "Purple": "Disc25mmx3mmTransparentPurple",
          "Yellow": "Disc25mmx3mmTransparentYellow"
        },
        "25mm x 6mm": {
          "Blue": "Disc25mmx6mmTransparentBlue",
          "Green": "Disc25mmx6mmTransparentGreen",
          "Gray": "Disc25mmx6mmTransparentGray",
          "Orange": "Disc25mmx6mmTransparentOrange",
          "Purple": "Disc25mmx6mmTransparentPurple",
          "Red": "Disc25mmx6mmTransparentRed",
          "Yellow": "Disc25mmx6mmTransparentYellow"
        }
      },
      "Disc, Pastel": {
        "20mm x 5mm": {
          "Blue": "Disc20mmx5mmPastelBlue",
          "Orange": "Disc20mmx5mmPastelOrange",
          "Purple": "Disc20mmx5mmPastelPurple",
          "Pink": "Disc20mmx5mmPastelPink"
        }
      },
      "Game Designer’s Ruler": {
        "Sizeless": {
          "Colorless": "GameDesigner’sRuler"
        }
      },
      "Pizza Disc": {
        "Sizeless": {
          "Yellow": "PizzaDiscYellow"
        }
      },
      "Wink, Opaque": {
        "20mm": {
          "Black": "Wink20mmBlack",
          "White": "Wink20mmOpaqueWhite"
        },
        "22mm": {
          "Black": "Wink22mmOpaqueBlack",
          "White": "Wink22mmOpaqueWhite"
        }
      },
      "Wink, Translucent": {
        "20mm": {
          "Blue": "Wink20mmTranslucentBlue",
          "Green": "Wink20mmTranslucentGreen"
        },
        "22mm": {
          "Black": "Wink22mmTranslucentBlack",
          "Blue": "Wink22mmTranslucentBlue",
          "Green": "Wink22mmTranslucentGreen",
          "Orange": "Wink22mmTranslucentOrange",
          "Purple": "Wink22mmTranslucentPurple",
          "Red": "Wink22mmTranslucentRed",
          "Yellow": "Wink22mmTranslucentYellow"
        }
      }
    },
    "blank": {
      "Blank Board, Accordion": {
        "Sizeless": {
          "Colorless": "BlankBoardAccordion"
        }
      },
      "Blank Board, Bi-Fold": {
        "Sizeless": {
          "Colorless": "BlankBoardBi-Fold"
        }
      },
      "Blank Board, Domino": {
        "Sizeless": {
          "Colorless": "BlankBoardDomino"
        }
      },
      "Blank Board, Half": {
        "Sizeless": {
          "Colorless": "BlankBoardHalf"
        }
      },
      "Blank Board, Six-Fold": {
        "Medium": {
          "Colorless": "BlankBoardMediumSix-Fold"
        },
        "Sizeless": {
          "Colorless": "BlankBoardSix-Fold"
        }
      },
      "Blank Board, Quad-Fold, 18 inch": {
        "Sizeless": {
          "Colorless": "BlankBoardQuad-Fold18inch"
        }
      },
      "Blank Board, Skinny": {
        "Sizeless": {
          "Colorless": "BlankBoardSkinny"
        }
      },
      "Blank Board, Sliver": {
        "Sizeless": {
          "Colorless": "BlankBoardSliver"
        }
      },
      "Blank Board, Square": {
        "Sizeless": {
          "Colorless": "BlankBoardSquare"
        },
        "Large": {
          "Colorless": "BlankBoardSquareLarge"
        },
        "Small": {
          "Colorless": "BlankBoardSquareSmall"
        }
      },
      "Blank Board, Strip": {
        "Sizeless": {
          "Colorless": "BlankBoardStrip"
        }
      },
      "Blank Box, Hook, Bridge": {
        "54": {
          "Colorless": "BlankBoxHookBridge(54)"
        },
        "108": {
          "Colorless": "BlankBoxHookBridge(108)"
        }
      },
      "Blank Box, Hook, Jumbo": {
        "36": {
          "Colorless": "BlankBoxHookJumbo(36)"
        },
        "90": {
          "Colorless": "BlankBoxHookJumbo(90)"
        }
      },
      "Blank Box, Hook, Poker": {
        "18": {
          "Colorless": "BlankBoxHookPoker(18)"
        },
        "36": {
          "Colorless": "BlankBoxHookPoker(36)"
        },
        "54": {
          "Colorless": "BlankBoxHookPoker(54)"
        },
        "72": {
          "Colorless": "BlankBoxHookPoker(72)"
        },
        "90": {
          "Colorless": "BlankBoxHookPoker(90)"
        },
        "108": {
          "Colorless": "BlankBoxHookPoker(108)"
        }
      },
      "Blank Box, Hook, Square": {
        "48": {
          "Colorless": "BlankBoxHookSquare(48)"
        },
        "96": {
          "Colorless": "BlankBoxHookSquare(96)"
        }
      },
      "Blank Box, Hook, Tarot": {
        "40": {
          "Colorless": "BlankBoxHookTarot(40)"
        },
        "90": {
          "Colorless": "BlankBoxHookTarot(90)"
        }
      },
      "Blank Box, Pro": {
        "Medium": {
          "Colorless": "BlankBoxProMedium"
        },
        "Small": {
          "Colorless": "BlankBoxProSmall"
        }
      },
      "Blank Box, Prototype": {
        "Large": {
          "Colorless": "BlankBoxPrototypeLarge"
        },
        "Medium": {
          "Colorless": "BlankBoxPrototypeMedium"
        },
        "Small": {
          "Colorless": "BlankBoxPrototypeSmall"
        }
      },
      "Blank Box, Retail": {
        "Large": {
          "Colorless": "BlankBoxRetailLarge"
        }
      },
      "Blank Box, Tuck, Bridge": {
        "54": {
          "Colorless": "BlankBoxTuckBridge(54)"
        },
        "108": {
          "Colorless": "BlankBoxTuckBridge(108)"
        }
      },
      "Blank Box, Tuck, Jumbo": {
        "90": {
          "Colorless": "BlankBoxTuckJumbo(90)"
        }
      },
      "Blank Box, Tuck, Poker": {
        "36": {
          "Colorless": "BlankBoxTuckPoker(36)"
        },
        "54": {
          "Colorless": "BlankBoxTuckPoker(54)"
        },
        "72": {
          "Colorless": "BlankBoxTuckPoker(72)"
        },
        "90": {
          "Colorless": "BlankBoxTuckPoker(90)"
        },
        "108": {
          "Colorless": "BlankBoxTuckPoker(108)"
        }
      },
      "Blank Box, Tuck, Square": {
        "48": {
          "Colorless": "BlankBoxTuckSquare(48)"
        },
        "96": {
          "Colorless": "BlankBoxTuckSquare(96)"
        }
      },
      "Blank Box, Tuck, Tarot": {
        "40": {
          "Colorless": "BlankBoxTuckTarot(40)"
        },
        "90": {
          "Colorless": "BlankBoxTuckTarot(90)"
        }
      },
      "Blank Bridge Card": {
        "Sizeless": {
          "Colorless": "BlankBridgeCard"
        }
      },
      "Blank Business Card": {
        "Sizeless": {
          "Colorless": "BlankBusinessCard"
        }
      },
      "Blank Chit, Arrow": {
        "Sizeless": {
          "Colorless": "BlankChitArrow"
        }
      },
      "Blank Chit, Bullseye": {
        "Sizeless": {
          "Colorless": "BlankChitBullseye"
        }
      },
      "Blank Chit, Circle": {
        "Large": {
          "Colorless": "BlankChitCircleLarge"
        },
        "Medium": {
          "Colorless": "BlankChitCircleMedium"
        },
        "Small": {
          "Colorless": "BlankChitCircleSmall"
        }
      },
      "Blank Chit, Domino": {
        "Sizeless": {
          "Colorless": "BlankChitDomino"
        }
      },
      "Blank Chit, Square": {
        "Large": {
          "Colorless": "BlankChitSquareLarge"
        },
        "Medium": {
          "Colorless": "BlankChitSquareMedium"
        },
        "Small": {
          "Colorless": "BlankChitSquareSmall"
        }
      },
      "Blank Chit, Triangle": {
        "Medium": {
          "Colorless": "BlankChitTriangleMedium"
        }
      },
      "Blank Circle Card": {
        "Sizeless": {
          "Colorless": "BlankCircleCard"
        }
      },
      "Blank Circle Shard": {
        "Sizeless": {
          "Colorless": "BlankCircleShard"
        }
      },
      "Blank Clear Euro Poker Card": {
        "Sizeless": {
          "Colorless": "BlankClearEuroPokerCard"
        }
      },
      "Blank Divider Card": {
        "Sizeless": {
          "Colorless": "BlankDividerCard"
        }
      },
      "Blank Document": {
        "Sizeless": {
          "Colorless": "BlankDocument"
        }
      },
      "Blank Domino Card": {
        "Sizeless": {
          "Colorless": "BlankDominoCard"
        }
      },
      "Blank Dual Dial": {
        "Sizeless": {
          "Colorless": "BlankDualDial"
        }
      },
      "Blank Euro Poker": {
        "Sizeless": {
          "Colorless": "BlankEuroPoker"
        }
      },
      "Blank Euro Square Card": {
        "Sizeless": {
          "Colorless": "BlankEuroSquareCard"
        }
      },
      "Blank Foil Poker Card": {
        "Sizeless": {
          "Colorless": "BlankFoilPokerCard"
        }
      },
      "Blank Foil Tarot Card": {
        "Sizeless": {
          "Colorless": "BlankFoilTarotCard"
        }
      },
      "Blank Folio, Bridge": {
        "Sizeless": {
          "Colorless": "BlankFolioBridge"
        }
      },
      "Blank Folio": {
        "Medium": {
          "Colorless": "BlankFolioMedium"
        },
        "Small": {
          "Colorless": "BlankFolioSmall"
        }
      },
      "Blank Folio, Mint Tin": {
        "Sizeless": {
          "Colorless": "BlankFolioMintTin"
        }
      },
      "Blank Folio, Poker": {
        "Sizeless": {
          "Colorless": "BlankFolioPoker"
        }
      },
      "Blank Folio, Square": {
        "Sizeless": {
          "Colorless": "BlankFolioSquare"
        }
      },
      "Blank Folio, Tarot": {
        "Sizeless": {
          "Colorless": "BlankFolioTarot"
        }
      },
      "Blank Hex Card": {
        "Sizeless": {
          "Colorless": "BlankHexCard"
        }
      },
      "Blank Hex Shard": {
        "Sizeless": {
          "Colorless": "BlankHexShard"
        }
      },
      "Blank Jumbo Card": {
        "Sizeless": {
          "Colorless": "BlankJumboCard"
        }
      },
      "Blank Mat, Big": {
        "Sizeless": {
          "Colorless": "BlankMatBig"
        }
      },
      "Blank Mat, Domino": {
        "Sizeless": {
          "Colorless": "BlankMatDomino"
        }
      },
      "Blank Mat, Flower": {
        "Sizeless": {
          "Colorless": "BlankMatFlower"
        }
      },
      "Blank Mat, Half": {
        "Sizeless": {
          "Colorless": "BlankMatHalf"
        }
      },
      "Blank Mat, Hex": {
        "Sizeless": {
          "Colorless": "BlankMatHex"
        },
        "Large": {
          "Colorless": "BlankMatHexLarge"
        }
      },
      "Blank Mat, Invader": {
        "Sizeless": {
          "Colorless": "BlankMatInvader"
        }
      },
      "Blank Mat, Postcard": {
        "Sizeless": {
          "Colorless": "BlankMatPostcard"
        }
      },
      "Blank Mat, Quarter": {
        "Sizeless": {
          "Colorless": "BlankMatQuarter"
        }
      },
      "Blank Mat, Skinny": {
        "Sizeless": {
          "Colorless": "BlankMatSkinny"
        }
      },
      "Blank Mat, Sliver": {
        "Sizeless": {
          "Colorless": "BlankMatSliver"
        }
      },
      "Blank Mat, Small Bi-fold": {
        "Sizeless": {
          "Colorless": "BlankMatSmallBi-fold"
        }
      },
      "Blank Mat, Spinner": {
        "Sizeless": {
          "Colorless": "BlankMatSpinner"
        }
      },
      "Blank Mat, Square": {
        "Sizeless": {
          "Colorless": "BlankMatSquare"
        },
        "Large": {
          "Colorless": "BlankMatSquareLarge"
        },
        "Small": {
          "Colorless": "BlankMatSquareSmall"
        }
      },
      "Blank Mat, Strip": {
        "Sizeless": {
          "Colorless": "BlankMatStrip"
        }
      },
      "Blank Micro Card (slug)": {
        "Sizeless": {
          "Colorless": "BlankMicroCard(slug)"
        }
      },
      "Blank Mini Card": {
        "Sizeless": {
          "Colorless": "BlankMiniCard"
        }
      },
      "Blank Mint Tin Accordion (4 Panel)": {
        "Sizeless": {
          "Colorless": "BlankMintTinAccordion(4Panel)"
        }
      },
      "Blank Mint Tin Accordion (6 Panel)": {
        "Sizeless": {
          "Colorless": "BlankMintTinAccordion(6Panel)"
        }
      },
      "Blank Mint Tin Accordion (8 Panel)": {
        "Sizeless": {
          "Colorless": "BlankMintTinAccordion(8Panel)"
        }
      },
      "Blank Mint Tin Card": {
        "Sizeless": {
          "Colorless": "BlankMintTinCard"
        }
      },
      "Blank Poker Card": {
        "Sizeless": {
          "Colorless": "BlankPokerCard"
        }
      },
      "Blank Ring": {
        "Large": {
          "Colorless": "BlankRingLarge"
        },
        "Medium": {
          "Colorless": "BlankRingMedium"
        },
        "Small": {
          "Colorless": "BlankRingSmall"
        }
      },
      "Blank Screen": {
        "Large": {
          "Colorless": "BlankScreenLarge"
        },
        "Medium": {
          "Colorless": "BlankScreenMedium"
        },
        "Small": {
          "Colorless": "BlankScreenSmall"
        }
      },
      "Blank Small Dial": {
        "Sizeless": {
          "Colorless": "BlankSmallDial"
        }
      },
      "Blank Small Pro Tarot Insert": {
        "Sizeless": {
          "Colorless": "BlankSmallProTarotInsert"
        }
      },
      "Blank Small Square Card": {
        "Sizeless": {
          "Colorless": "BlankSmallSquareCard"
        }
      },
      "Blank Small Stout Tarot Insert": {
        "Sizeless": {
          "Colorless": "BlankSmallStoutTarotInsert"
        }
      },
      "Blank Square Card": {
        "Sizeless": {
          "Colorless": "BlankSquareCard"
        }
      },
      "Blank Square Shard": {
        "Sizeless": {
          "Colorless": "BlankSquareShard"
        }
      },
      "Blank Standee": {
        "Large": {
          "Colorless": "BlankStandeeLarge"
        },
        "Medium": {
          "Colorless": "BlankStandeeMedium"
        },
        "Small": {
          "Colorless": "BlankStandeeSmall"
        }
      },
      "Blank Stickers, Meeple": {
        "Sizeless": {
          "Colorless": "BlankStickersMeeple"
        }
      },
      "Blank Stickers, Pawn": {
        "Sizeless": {
          "Colorless": "BlankStickersPawn"
        }
      },
      "Blank Stickers, Sheet, Dice": {
        "Sizeless": {
          "Colorless": "BlankStickersSheetDice"
        }
      },
      "Blank Stickers, Sheet, Token": {
        "Sizeless": {
          "Colorless": "BlankStickersSheetToken"
        }
      },
      "Blank Tarot Card": {
        "Sizeless": {
          "Colorless": "BlankTarotCard"
        }
      },
      "Blank Tile, Circle, Mini": {
        "Sizeless": {
          "Colorless": "BlankTileCircleMini"
        }
      },
      "Blank Tile, Domino": {
        "Sizeless": {
          "Colorless": "BlankTileDomino"
        }
      },
      "Blank Tile, Hex": {
        "Large": {
          "Colorless": "BlankTileHexLarge"
        },
        "Medium": {
          "Colorless": "BlankTileHexMedium"
        },
        "Small": {
          "Colorless": "BlankTileHexSmall"
        }
      },
      "Blank Tile, Hex, Mini": {
        "Sizeless": {
          "Colorless": "BlankTileHexMini"
        }
      },
      "Blank Tile, Square": {
        "Large": {
          "Colorless": "BlankTileSquareLarge"
        },
        "Medium": {
          "Colorless": "BlankTileSquareMedium"
        },
        "Small": {
          "Colorless": "BlankTileSquareSmall"
        }
      },
      "Blank Tile, Square, Mini": {
        "Sizeless": {
          "Colorless": "BlankTileSquareMini"
        }
      },
      "Blank Tile, Triangle": {
        "Sizeless": {
          "Colorless": "BlankTileTriangle"
        }
      },
      "Blank Tombstone Shard": {
        "Sizeless": {
          "Colorless": "BlankTombstoneShard"
        }
      },
      "Blank US Game Card": {
        "Sizeless": {
          "Colorless": "BlankUSGameCard"
        }
      },
      "Blank US Game Mat": {
        "Sizeless": {
          "Colorless": "BlankUSGameMat"
        }
      },
      "Blank Large Stout Box": {
        "Sizeless": {
          "Colorless": "LargeStoutBox"
        }
      },
      "Stout Box, Blank": {
        "Medium": {
          "Colorless": "MediumStoutBoxBlank"
        }
      },
      "Blank Small Stout Box": {
        "Sizeless": {
          "Colorless": "SmallStoutBox"
        }
      },
      "Snaplock Box, Micro": {
        "Sizeless": {
          "Colorless": "SnaplockBoxMicro"
        }
      },
      "Snaplock Box, Mini": {
        "Sizeless": {
          "Colorless": "SnaplockBoxMini"
        }
      },
      "Snaplock Box, Organizer": {
        "Sizeless": {
          "Colorless": "SnaplockBoxOrganizer"
        }
      },
      "Snaplock Box, Poker, 100+ Card": {
        "Sizeless": {
          "Colorless": "SnaplockBoxPoker100+Card"
        }
      },
      "Blank Euro Poker Card": {
        "Sizeless": {
          "Colorless": "BlankEuroPokerCard"
        }
      },
      "Blank VHS Box": {
        "Sizeless": {
          "Colorless": "BlankVHSBox"
        }
      },
      "Quad Fold Game Board": {
        "Large": {
          "Colorless": "LargeQuadFoldGameBoard"
        }
      }
    },
    "building": {
      "Victorian Miniature": {
        "Sizeless": {
          "Yellow": "VictorianMiniatureYellow",
          "Blue": "VictorianMiniatureBlue",
          "Green": "VictorianMiniatureGreen",
          "Red": "VictorianMiniatureRed"
        }
      },
      "House, Wood": {
        "Sizeless": {
          "Black": "HouseWoodBlack",
          "Blue": "HouseWoodBlue",
          "Green": "HouseWoodGreen",
          "Orange": "HouseWoodOrange",
          "White": "HouseWoodWhite",
          "Red": "HouseWoodRed",
          "Purple": "HouseWoodPurple",
          "Natural": "HouseWoodNatural",
          "Yellow": "HouseWoodYellow"
        }
      },
      "Building": {
        "Small": {
          "Black": "BuildingSmallBlack",
          "Blue": "BuildingSmallBlue",
          "Green": "BuildingSmallGreen",
          "Orange": "BuildingSmallOrange",
          "Purple": "BuildingSmallPurple",
          "Red": "BuildingSmallRed",
          "White": "BuildingSmallWhite",
          "Yellow": "BuildingSmallYellow"
        }
      },
      "Building, Side Door": {
        "Small": {
          "Black": "BuildingSmallSideDoorBlack",
          "Blue": "BuildingSmallSideDoorBlue",
          "Green": "BuildingSmallSideDoorGreen",
          "Orange": "BuildingSmallSideDoorOrange",
          "Purple": "BuildingSmallSideDoorPurple",
          "Red": "BuildingSmallSideDoorRed",
          "White": "BuildingSmallSideDoorWhite",
          "Yellow": "BuildingSmallSideDoorYellow"
        }
      },
      "Business Miniature": {
        "Sizeless": {
          "Blue": "BusinessMiniatureBlue",
          "Green": "BusinessMiniatureGreen",
          "Red": "BusinessMiniatureRed",
          "Yellow": "BusinessMiniatureYellow"
        }
      },
      "Card Connector, 120-degree": {
        "Sizeless": {
          "Black": "CardConnector120-degreeBlack",
          "Blue": "CardConnector120-degreeBlue",
          "Green": "CardConnector120-degreeGreen",
          "Orange": "CardConnector120-degreeOrange",
          "Purple": "CardConnector120-degreePurple",
          "Red": "CardConnector120-degreeRed",
          "White": "CardConnector120-degreeWhite",
          "Yellow": "CardConnector120-degreeYellow"
        }
      },
      "Card Connector, 90-degree": {
        "Sizeless": {
          "Black": "CardConnector90-degreeBlack",
          "Blue": "CardConnector90-degreeBlue",
          "Green": "CardConnector90-degreeGreen",
          "Orange": "CardConnector90-degreeOrange",
          "Purple": "CardConnector90-degreePurple",
          "Red": "CardConnector90-degreeRed",
          "White": "CardConnector90-degreeWhite",
          "Yellow": "CardConnector90-degreeYellow"
        }
      },
      "Castle Room, Catwalks": {
        "Sizeless": {
          "Colorless": "CastleRoomCatwalks"
        }
      },
      "Castle Room, Chambers": {
        "Sizeless": {
          "Colorless": "CastleRoomChambers"
        }
      },
      "Castle Room, Outpost": {
        "Sizeless": {
          "Colorless": "CastleRoomOutpost"
        }
      },
      "Castle Room, Sanctuary": {
        "Sizeless": {
          "Colorless": "CastleRoomSanctuary"
        }
      },
      "Castle Room, Tower": {
        "Sizeless": {
          "Colorless": "CastleRoomTower"
        }
      },
      "Castle Room, Veranda": {
        "Sizeless": {
          "Colorless": "CastleRoomVeranda"
        }
      },
      "Castle Tower": {
        "Sizeless": {
          "Colorless": "CastleTower"
        }
      },
      "Castle": {
        "Sizeless": {
          "Black": "CastleBlack",
          "Blue": "CastleBlue",
          "Green": "CastleGreen",
          "Orange": "CastleOrange",
          "Purple": "CastlePurple",
          "Red": "CastleRed",
          "White": "CastleWhite",
          "Yellow": "CastleYellow"
        }
      },
      "Cathedral": {
        "Sizeless": {
          "Black": "CathedralBlack",
          "Blue": "CathedralBlue",
          "Green": "CathedralGreen",
          "Orange": "CathedralOrange",
          "Purple": "CathedralPurple",
          "Red": "CathedralRed",
          "White": "CathedralWhite",
          "Yellow": "CathedralYellow"
        }
      },
      "Church, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "ChurchAcrylicOpaqueBlack",
          "Gold": "ChurchAcrylicOpaqueGold",
          "Silver": "ChurchAcrylicOpaqueSilver",
          "White": "ChurchAcrylicOpaqueWhite"
        }
      },
      "Church, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "ChurchAcrylicTransparentBlack",
          "Blue": "ChurchAcrylicTransparentBlue",
          "Green": "ChurchAcrylicTransparentGreen",
          "Orange": "ChurchAcrylicTransparentOrange",
          "Purple": "ChurchAcrylicTransparentPurple",
          "Red": "ChurchAcrylicTransparentRed",
          "White": "ChurchAcrylicTransparentWhite",
          "Yellow": "ChurchAcrylicTransparentYellow"
        }
      },
      "Church, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "ChurchAcrylicTransparentClear"
        }
      },
      "Church, Plastic": {
        "Sizeless": {
          "Blue": "ChurchPlasticBlue",
          "Orange": "ChurchPlasticOrange",
          "Red": "ChurchPlasticRed",
          "White": "ChurchPlasticWhite"
        }
      },
      "Church, Wood": {
        "Sizeless": {
          "Black": "ChurchWoodBlack",
          "Blue": "ChurchWoodBlue",
          "Green": "ChurchWoodGreen",
          "Orange": "ChurchWoodOrange",
          "Purple": "ChurchWoodPurple",
          "Red": "ChurchWoodRed",
          "White": "ChurchWoodWhite",
          "Yellow": "ChurchWoodYellow"
        }
      },
      "Command Center": {
        "Sizeless": {
          "Black": "CommandCenterBlack",
          "Blue": "CommandCenterBlue",
          "Green": "CommandCenterGreen",
          "Orange": "CommandCenterOrange",
          "Purple": "CommandCenterPurple",
          "Red": "CommandCenterRed",
          "White": "CommandCenterWhite",
          "Yellow": "CommandCenterYellow"
        }
      },
      "Donjon Pagoda": {
        "Sizeless": {
          "Black": "DonjonPagodaBlack",
          "Blue": "DonjonPagodaBlue",
          "Green": "DonjonPagodaGreen",
          "Orange": "DonjonPagodaOrange",
          "Purple": "DonjonPagodaPurple",
          "Red": "DonjonPagodaRed",
          "White": "DonjonPagodaWhite",
          "Yellow": "DonjonPagodaYellow"
        }
      },
      "Future Dome": {
        "Sizeless": {
          "Blue": "FutureDomeBlue",
          "Green": "FutureDomeGreen",
          "Orange": "FutureDomeOrange",
          "Purple": "FutureDomePurple",
          "Red": "FutureDomeRed",
          "Yellow": "FutureDomeYellow"
        }
      },
      "Future Pyramid": {
        "Sizeless": {
          "Green": "FuturePyramidGreen",
          "Orange": "FuturePyramidOrange",
          "Purple": "FuturePyramidPurple",
          "Red": "FuturePyramidRed",
          "Yellow": "FuturePyramidYellow"
        }
      },
      "Harbor": {
        "Sizeless": {
          "Black": "HarborBlack",
          "Blue": "HarborBlue",
          "Green": "HarborGreen",
          "Orange": "HarborOrange",
          "Purple": "HarborPurple",
          "Red": "HarborRed",
          "White": "HarborWhite",
          "Yellow": "HarborYellow"
        }
      },
      "Henhouse": {
        "Sizeless": {
          "Black": "HenhouseBlack",
          "Blue": "HenhouseBlue",
          "Green": "HenhouseGreen",
          "Orange": "HenhouseOrange",
          "Purple": "HenhousePurple",
          "Red": "HenhouseRed",
          "White": "HenhouseWhite",
          "Yellow": "HenhouseYellow"
        }
      },
      "Hinged Stone Door": {
        "Sizeless": {
          "Blue": "HingedStoneDoorBlue",
          "Bronze": "HingedStoneDoorBronze",
          "Green": "HingedStoneDoorGreen",
          "Gray": "HingedStoneDoorGray",
          "Red": "HingedStoneDoorRed"
        }
      },
      "Hotel": {
        "Sizeless": {
          "Black": "HotelBlack",
          "Blue": "HotelBlue",
          "Green": "HotelGreen",
          "Orange": "HotelOrange",
          "Purple": "HotelPurple",
          "Red": "HotelRed",
          "White": "HotelWhite",
          "Yellow": "HotelYellow"
        }
      },
      "House, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "HouseAcrylicOpaqueBlack",
          "Gold": "HouseAcrylicOpaqueGold",
          "Silver": "HouseAcrylicOpaqueSilver",
          "White": "HouseAcrylicOpaqueWhite"
        }
      },
      "House, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "HouseAcrylicTransparentBlack",
          "Blue": "HouseAcrylicTransparentBlue",
          "Green": "HouseAcrylicTransparentGreen",
          "Orange": "HouseAcrylicTransparentOrange",
          "Purple": "HouseAcrylicTransparentPurple",
          "Red": "HouseAcrylicTransparentRed",
          "Yellow": "HouseAcrylicTransparentYellow"
        }
      },
      "House, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "HouseAcrylicTransparentClear"
        }
      },
      "House": {
        "Sizeless": {
          "Black": "HouseBlack",
          "Blue": "HouseBlue",
          "Green": "HouseGreen",
          "Orange": "HouseOrange",
          "Purple": "HousePurple",
          "Red": "HouseRed",
          "White": "HouseWhite",
          "Yellow": "HouseYellow"
        }
      },
      "Hut": {
        "Large": {
          "Colorless": "HutLarge"
        },
        "Small": {
          "Colorless": "HutSmall"
        }
      },
      "Laboratory": {
        "Sizeless": {
          "Black": "LaboratoryBlack",
          "Blue": "LaboratoryBlue",
          "Green": "LaboratoryGreen",
          "Orange": "LaboratoryOrange",
          "Purple": "LaboratoryPurple",
          "Red": "LaboratoryRed",
          "White": "LaboratoryWhite",
          "Yellow": "LaboratoryYellow"
        }
      },
      "Marketplace": {
        "Sizeless": {
          "Black": "MarketplaceBlack",
          "Blue": "MarketplaceBlue",
          "Green": "MarketplaceGreen",
          "Orange": "MarketplaceOrange",
          "Purple": "MarketplacePurple",
          "Red": "MarketplaceRed",
          "White": "MarketplaceWhite",
          "Yellow": "MarketplaceYellow"
        }
      },
      "Mine": {
        "Sizeless": {
          "Black": "MineBlack",
          "Blue": "MineBlue",
          "Green": "MineGreen",
          "Orange": "MineOrange",
          "Purple": "MinePurple",
          "Red": "MineRed",
          "White": "MineWhite",
          "Yellow": "MineYellow"
        }
      },
      "Observatory": {
        "Sizeless": {
          "Black": "ObservatoryBlack",
          "Blue": "ObservatoryBlue",
          "Green": "ObservatoryGreen",
          "Orange": "ObservatoryOrange",
          "Purple": "ObservatoryPurple",
          "Red": "ObservatoryRed",
          "White": "ObservatoryWhite",
          "Yellow": "ObservatoryYellow"
        }
      },
      "Plastic Castle": {
        "Sizeless": {
          "Red": "PlasticCastleRed"
        }
      },
      "Pyramid": {
        "Sizeless": {
          "Black": "PyramidBlack",
          "Blue": "PyramidBlue",
          "Purple": "PyramidPurple",
          "Red": "PyramidRed",
          "White": "PyramidWhite",
          "Yellow": "PyramidYellow"
        }
      },
      "Taj Mahal Palace, Set of": {
        "5": {
          "Colorless": "TajMahalPalaceSetof5"
        }
      },
      "Tower Stacker": {
        "Sizeless": {
          "Black": "TowerStackerBlack",
          "Blue": "TowerStackerBlue",
          "Green": "TowerStackerGreen",
          "Orange": "TowerStackerOrange",
          "Purple": "TowerStackerPurple",
          "Red": "TowerStackerRed",
          "White": "TowerStackerWhite",
          "Yellow": "TowerStackerYellow"
        }
      },
      "Trellis of Grapes": {
        "Sizeless": {
          "Blue": "TrellisofGrapesBlue",
          "Green": "TrellisofGrapesGreen",
          "Orange": "TrellisofGrapesOrange",
          "White": "TrellisofGrapesWhite"
        }
      },
      "Water Mill": {
        "Sizeless": {
          "Black": "WaterMillBlack",
          "Blue": "WaterMillBlue",
          "Green": "WaterMillGreen",
          "Orange": "WaterMillOrange",
          "Purple": "WaterMillPurple",
          "Red": "WaterMillRed",
          "White": "WaterMillWhite",
          "Yellow": "WaterMillYellow"
        }
      },
      "Windmill": {
        "Sizeless": {
          "Black": "WindmillBlack",
          "Blue": "WindmillBlue",
          "Green": "WindmillGreen",
          "Orange": "WindmillOrange",
          "Purple": "WindmillPurple",
          "Red": "WindmillRed",
          "White": "WindmillWhite",
          "Yellow": "WindmillYellow"
        }
      },
      "Wood Cabin": {
        "Sizeless": {
          "Brown": "WoodCabinBrown"
        }
      },
      "Skyscraper": {
        "Sizeless": {
          "Black": "SkyscraperBlack",
          "Blue": "SkyscraperBlue",
          "Green": "SkyscraperGreen",
          "Orange": "SkyscraperOrange",
          "Purple": "SkyscraperPurple",
          "Red": "SkyscraperRed",
          "White": "SkyscraperWhite",
          "Yellow": "SkyscraperYellow"
        }
      }
    },
    "meeple": {
      "Armored Guard": {
        "Sizeless": {
          "Colorless": "ArmoredGuard"
        }
      },
      "Aztec, Character Meeple": {
        "Sizeless": {
          "Colorless": "Aztec-CharacterMeeple"
        }
      },
      "Big People": {
        "Sizeless": {
          "Blue": "BigPeopleBlue"
        }
      },
      "Bust, Wood": {
        "Sizeless": {
          "Blue": "BustWoodBlue",
          "Green": "BustWoodGreen"
        }
      },
      "Bust, Wood, Collared": {
        "Sizeless": {
          "Blue": "BustWoodCollaredBlue",
          "Green": "BustWoodCollaredGreen"
        }
      },
      "Cleric, Character Meeple": {
        "Sizeless": {
          "Colorless": "Cleric-CharacterMeeple"
        }
      },
      "Cowboy, Character Meeple": {
        "Sizeless": {
          "Black": "CowboyBlack-CharacterMeeple",
          "Blue": "CowboyBlue-CharacterMeeple",
          "Green": "CowboyGreen-CharacterMeeple",
          "Orange": "CowboyOrange-CharacterMeeple",
          "Purple": "CowboyPurple-CharacterMeeple",
          "Red": "CowboyRed-CharacterMeeple",
          "White": "CowboyWhite-CharacterMeeple",
          "Yellow": "CowboyYellow-CharacterMeeple"
        }
      },
      "Doctor, Character Meeple": {
        "Sizeless": {
          "Colorless": "Doctor-CharacterMeeple"
        }
      },
      "Dwarf, Character Meeple": {
        "Sizeless": {
          "Blue": "DwarfBlue-CharacterMeeple",
          "Green": "DwarfGreen-CharacterMeeple",
          "Orange": "DwarfOrange-CharacterMeeple",
          "Purple": "DwarfPurple-CharacterMeeple",
          "Red": "DwarfRed-CharacterMeeple",
          "Yellow": "DwarfYellow-CharacterMeeple"
        }
      },
      "Elf, Character Meeple": {
        "Sizeless": {
          "Colorless": "Elf-CharacterMeeple"
        }
      },
      "Farmer, Female, Character Meeple": {
        "Sizeless": {
          "Blue": "FarmerFemaleBlue-CharacterMeeple",
          "Green": "FarmerFemaleGreen-CharacterMeeple",
          "Orange": "FarmerFemaleOrange-CharacterMeeple",
          "Purple": "FarmerFemalePurple-CharacterMeeple",
          "Red": "FarmerFemaleRed-CharacterMeeple",
          "Yellow": "FarmerFemaleYellow-CharacterMeeple"
        }
      },
      "Farmer, Male, Character Meeple": {
        "Sizeless": {
          "Blue": "FarmerMaleBlue-CharacterMeeple",
          "Green": "FarmerMaleGreen-CharacterMeeple",
          "Orange": "FarmerMaleOrange-CharacterMeeple",
          "Purple": "FarmerMalePurple-CharacterMeeple",
          "Red": "FarmerMaleRed-CharacterMeeple",
          "Yellow": "FarmerMaleYellow-CharacterMeeple"
        }
      },
      "Fedora Wearer": {
        "Sizeless": {
          "Black": "FedoraWearerBlack"
        }
      },
      "Female Farmer": {
        "Sizeless": {
          "Green": "FemaleFarmerGreen",
          "Orange": "FemaleFarmerOrange",
          "Purple": "FemaleFarmerPurple",
          "White": "FemaleFarmerWhite",
          "Yellow": "FemaleFarmerYellow"
        }
      },
      "Figure, Wood": {
        "Sizeless": {
          "Green": "FigureWoodGreen",
          "White": "FigureWoodWhite"
        }
      },
      "Fire Elemental, Character Meeple": {
        "Sizeless": {
          "Colorless": "FireElemental-CharacterMeeple"
        }
      },
      "Firefighter, Character Meeple": {
        "Sizeless": {
          "Colorless": "Firefighter-CharacterMeeple"
        }
      },
      "Footman": {
        "Sizeless": {
          "Blue": "FootmanBlue",
          "Green": "FootmanGreen",
          "Red": "FootmanRed",
          "Yellow": "FootmanYellow"
        }
      },
      "Gangster": {
        "Sizeless": {
          "Blue": "GangsterBlue",
          "Green": "GangsterGreen",
          "Orange": "GangsterOrange",
          "Yellow": "GangsterYellow"
        }
      },
      "Geisha, Character Meeple": {
        "Sizeless": {
          "Colorless": "Geisha-CharacterMeeple"
        }
      },
      "Gentleman": {
        "Sizeless": {
          "Gold": "GentlemanGold"
        }
      },
      "Ghost": {
        "Sizeless": {
          "White": "GhostWhite"
        }
      },
      "Gnome": {
        "Sizeless": {
          "Blue": "GnomeBlue"
        }
      },
      "Guard Robot": {
        "Sizeless": {
          "Black": "GuardRobotBlack",
          "Green": "GuardRobotGreen",
          "Red": "GuardRobotRed",
          "Yellow": "GuardRobotYellow"
        }
      },
      "Halfling, Character Meeple": {
        "Sizeless": {
          "Colorless": "Halfling-CharacterMeeple"
        }
      },
      "Hazmat, Character Meeple": {
        "Sizeless": {
          "Colorless": "Hazmat-CharacterMeeple"
        }
      },
      "Ice Elemental, Character Meeple": {
        "Sizeless": {
          "Colorless": "IceElemental-CharacterMeeple"
        }
      },
      "Lab Assistant, Character Meeple": {
        "Sizeless": {
          "Colorless": "LabAssistant-CharacterMeeple"
        }
      },
      "Maasai, Character Meeple": {
        "Sizeless": {
          "Colorless": "Maasai-CharacterMeeple"
        }
      },
      "Man In Black, Character Meeple": {
        "Sizeless": {
          "Colorless": "ManInBlack-CharacterMeeple"
        }
      },
      "Medic, Character Meeple": {
        "Sizeless": {
          "Colorless": "Medic-CharacterMeeple"
        }
      },
      "Meeple, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "MeepleAcrylicOpaqueBlack",
          "Gold": "MeepleAcrylicOpaqueGold",
          "Silver": "MeepleAcrylicOpaqueSilver",
          "White": "MeepleAcrylicOpaqueWhite"
        },
        "Large": {
          "Black": "MeepleLargeAcrylicOpaqueBlack",
          "Gold": "MeepleLargeAcrylicOpaqueGold",
          "Silver": "MeepleLargeAcrylicOpaqueSilver",
          "White": "MeepleLargeAcrylicOpaqueWhite"
        }
      },
      "Meeple, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "MeepleAcrylicTransparentBlack",
          "Blue": "MeepleAcrylicTransparentBlue",
          "Green": "MeepleAcrylicTransparentGreen",
          "Orange": "MeepleAcrylicTransparentOrange",
          "Purple": "MeepleAcrylicTransparentPurple",
          "Red": "MeepleAcrylicTransparentRed",
          "White": "MeepleAcrylicTransparentWhite",
          "Yellow": "MeepleAcrylicTransparentYellow"
        },
        "Large": {
          "Black": "MeepleLargeAcrylicTransparentBlack",
          "Blue": "MeepleLargeAcrylicTransparentBlue",
          "Green": "MeepleLargeAcrylicTransparentGreen",
          "Orange": "MeepleLargeAcrylicTransparentOrange",
          "Purple": "MeepleLargeAcrylicTransparentPurple",
          "Red": "MeepleLargeAcrylicTransparentRed",
          "White": "MeepleLargeAcrylicTransparentWhite",
          "Yellow": "MeepleLargeAcrylicTransparentYellow"
        }
      },
      "Meeple, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "MeepleAcrylicTransparentClear"
        },
        "Large": {
          "Colorless": "MeepleLargeAcrylicTransparentClear"
        }
      },
      "Meeple, Wood": {
        "Large": {
          "Black": "MeepleLargeWoodBlack",
          "Blue": "MeepleLargeWoodBlue",
          "Green": "MeepleLargeWoodGreen",
          "Orange": "MeepleLargeWoodOrange",
          "Purple": "MeepleLargeWoodPurple",
          "Red": "MeepleLargeWoodRed",
          "White": "MeepleLargeWoodWhite",
          "Yellow": "MeepleLargeWoodYellow"
        },
        "Sizeless": {
          "Black": "MeepleWoodBlack",
          "Blue": "MeepleWoodBlue",
          "Green": "MeepleWoodGreen",
          "Orange": "MeepleWoodOrange",
          "Purple": "MeepleWoodPurple",
          "Red": "MeepleWoodRed",
          "White": "MeepleWoodWhite",
          "Yellow": "MeepleWoodYellow"
        }
      },
      "Meeple, Mini, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "MeepleMiniAcrylicOpaqueBlack",
          "Gold": "MeepleMiniAcrylicOpaqueGold",
          "Silver": "MeepleMiniAcrylicOpaqueSilver",
          "White": "MeepleMiniAcrylicOpaqueWhite"
        }
      },
      "Meeple, Mini, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "MeepleMiniAcrylicTransparentBlack",
          "Blue": "MeepleMiniAcrylicTransparentBlue",
          "Green": "MeepleMiniAcrylicTransparentGreen",
          "Orange": "MeepleMiniAcrylicTransparentOrange",
          "Purple": "MeepleMiniAcrylicTransparentPurple",
          "Red": "MeepleMiniAcrylicTransparentRed",
          "Yellow": "MeepleMiniAcrylicTransparentYellow"
        }
      },
      "Meeple, Mini, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "MeepleMiniAcrylicTransparentClear"
        }
      },
      "Meeple, Mini, Wood": {
        "Sizeless": {
          "Black": "MeepleMiniWoodBlack",
          "Blue": "MeepleMiniWoodBlue",
          "Green": "MeepleMiniWoodGreen",
          "Orange": "MeepleMiniWoodOrange",
          "Purple": "MeepleMiniWoodPurple",
          "Red": "MeepleMiniWoodRed",
          "White": "MeepleMiniWoodWhite",
          "Yellow": "MeepleMiniWoodYellow"
        }
      },
      "Meeple, Thick": {
        "Sizeless": {
          "Blue": "MeepleThickBlue",
          "Orange": "MeepleThickOrange",
          "Purple": "MeepleThickPurple",
          "Red": "MeepleThickRed",
          "Teal": "MeepleThickTeal",
          "Yellow": "MeepleThickYellow"
        }
      },
      "Mongol, Character Meeple": {
        "Sizeless": {
          "Colorless": "Mongol-CharacterMeeple"
        }
      },
      "Ninja, Character Meeple": {
        "Sizeless": {
          "Black": "NinjaBlack-CharacterMeeple",
          "Blue": "NinjaBlue-CharacterMeeple",
          "Green": "NinjaGreen-CharacterMeeple",
          "Orange": "NinjaOrange-CharacterMeeple",
          "Purple": "NinjaPurple-CharacterMeeple",
          "Red": "NinjaRed-CharacterMeeple",
          "White": "NinjaWhite-CharacterMeeple",
          "Yellow": "NinjaYellow-CharacterMeeple"
        }
      },
      "Nurse, Character Meeple": {
        "Sizeless": {
          "Colorless": "Nurse-CharacterMeeple"
        }
      },
      "Office Worker, Character Meeple": {
        "Sizeless": {
          "Blue": "OfficeWorkerBlue-CharacterMeeple",
          "Purple": "OfficeWorkerPurple-CharacterMeeple"
        }
      },
      "Outlaw, Character Meeple": {
        "Sizeless": {
          "Colorless": "Outlaw-CharacterMeeple"
        }
      },
      "Peasant": {
        "Sizeless": {
          "Purple": "PeasantPurple"
        }
      },
      "People": {
        "Sizeless": {
          "Black": "PeopleBlack",
          "Blue": "PeopleBlue",
          "Green": "PeopleGreen",
          "Orange": "PeopleOrange",
          "Purple": "PeoplePurple",
          "Red": "PeopleRed",
          "White": "PeopleWhite",
          "Yellow": "PeopleYellow"
        },
        "Tall": {
          "Black": "TallPeopleBlack",
          "Blue": "TallPeopleBlue",
          "Green": "TallPeopleGreen",
          "Orange": "TallPeopleOrange",
          "Purple": "TallPeoplePurple",
          "Red": "TallPeopleRed",
          "White": "TallPeopleWhite",
          "Yellow": "TallPeopleYellow"
        }
      },
      "People, Thick": {
        "Sizeless": {
          "Green": "PeopleThickGreen",
          "Purple": "PeopleThickPurple"
        },
        "Tall": {
          "Green": "TallPeopleThickGreen",
          "Gray": "TallPeopleThickGray",
          "Purple": "TallPeopleThickPurple",
          "Red": "TallPeopleThickRed",
          "Yellow": "TallPeopleThickYellow"
        }
      },
      "Person with Hat": {
        "Sizeless": {
          "Teal": "PersonwithHatTeal"
        }
      },
      "Pirate, Character Meeple": {
        "Sizeless": {
          "Blue": "PirateBlue-CharacterMeeple",
          "Green": "PirateGreen-CharacterMeeple",
          "Orange": "PirateOrange-CharacterMeeple",
          "Purple": "PiratePurple-CharacterMeeple",
          "Red": "PirateRed-CharacterMeeple",
          "Yellow": "PirateYellow-CharacterMeeple"
        }
      },
      "Police, Character Meeple": {
        "Sizeless": {
          "Colorless": "Police-CharacterMeeple"
        }
      },
      "Renegade, Character Meeple": {
        "Sizeless": {
          "Colorless": "Renegade-CharacterMeeple"
        }
      },
      "Robot": {
        "Sizeless": {
          "Silver": "RobotSilver"
        }
      },
      "Rogue, Character Meeple": {
        "Sizeless": {
          "Colorless": "Rogue-CharacterMeeple"
        }
      },
      "Scientist, Character Meeple": {
        "Sizeless": {
          "Colorless": "Scientist-CharacterMeeple"
        }
      },
      "Sheriff, Character Meeple": {
        "Sizeless": {
          "Colorless": "Sheriff-CharacterMeeple"
        }
      },
      "Skeleton, Character Meeple": {
        "Sizeless": {
          "Colorless": "Skeleton-CharacterMeeple"
        }
      },
      "Soldier, Character Meeple": {
        "Sizeless": {
          "Blue": "SoldierBlue-CharacterMeeple",
          "Green": "SoldierGreen-CharacterMeeple"
        }
      },
      "Speedster": {
        "Sizeless": {
          "Red": "SpeedsterRed"
        }
      },
      "Swordsman, Character Meeple": {
        "Sizeless": {
          "Black": "SwordsmanBlack-CharacterMeeple",
          "Blue": "SwordsmanBlue-CharacterMeeple",
          "Green": "SwordsmanGreen-CharacterMeeple",
          "Orange": "SwordsmanOrange-CharacterMeeple",
          "Purple": "SwordsmanPurple-CharacterMeeple",
          "Red": "SwordsmanRed-CharacterMeeple",
          "White": "SwordsmanWhite-CharacterMeeple",
          "Yellow": "SwordsmanYellow-CharacterMeeple"
        }
      },
      "Thief, Character Meeple": {
        "Sizeless": {
          "Colorless": "Thief-CharacterMeeple"
        }
      },
      "Tiki Idol": {
        "Sizeless": {
          "Yellow": "TikiIdolYellow"
        }
      },
      "Vampire, Character Meeple": {
        "Sizeless": {
          "Colorless": "Vampire-CharacterMeeple"
        }
      },
      "Villager, Character Meeple": {
        "Sizeless": {
          "Black": "VillagerBlack-CharacterMeeple",
          "Blue": "VillagerBlue-CharacterMeeple",
          "Green": "VillagerGreen-CharacterMeeple",
          "Orange": "VillagerOrange-CharacterMeeple",
          "Purple": "VillagerPurple-CharacterMeeple",
          "Red": "VillagerRed-CharacterMeeple",
          "White": "VillagerWhite-CharacterMeeple",
          "Yellow": "VillagerYellow-CharacterMeeple"
        }
      },
      "Wizard, Character Meeple": {
        "Sizeless": {
          "Blue": "WizardBlue-CharacterMeeple",
          "Green": "WizardGreen-CharacterMeeple",
          "Orange": "WizardOrange-CharacterMeeple",
          "Purple": "WizardPurple-CharacterMeeple",
          "Red": "WizardRed-CharacterMeeple",
          "Yellow": "WizardYellow-CharacterMeeple"
        }
      },
      "Worker, Single Bag": {
        "Sizeless": {
          "Blue": "WorkerSingleBagBlue",
          "Green": "WorkerSingleBagGreen",
          "Orange": "WorkerSingleBagOrange",
          "Purple": "WorkerSingleBagPurple",
          "White": "WorkerSingleBagWhite",
          "Yellow": "WorkerSingleBagYellow"
        }
      },
      "Yeti, Character Meeple": {
        "Sizeless": {
          "Colorless": "Yeti-CharacterMeeple"
        }
      }
    },
    "TB": {
      "Adventuress, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "AdventuressFantasyTB25"
        }
      },
      "Alice, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "AliceFantasyTB25"
        }
      },
      "Alien, Grey, TB15": {
        "Sizeless": {
          "Black": "AlienGreyTB15Black",
          "Blue": "AlienGreyTB15Blue",
          "Green": "AlienGreyTB15Green",
          "Gray": "AlienGreyTB15Gray",
          "Orange": "AlienGreyTB15Orange",
          "Purple": "AlienGreyTB15Purple",
          "Red": "AlienGreyTB15Red",
          "White": "AlienGreyTB15White",
          "Yellow": "AlienGreyTB15Yellow"
        }
      },
      "Alien, Space, TB25": {
        "Sizeless": {
          "Colorless": "AlienSpaceTB25"
        }
      },
      "Amphisbaena, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "AmphisbaenaFantasyTB25"
        }
      },
      "Ankheg, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "AnkhegFantasyTB50"
        }
      },
      "Astronaut TB15": {
        "Sizeless": {
          "Black": "AstronautTB15Black"
        }
      },
      "Astronaut, TB15": {
        "Sizeless": {
          "Blue": "AstronautTB15Blue",
          "Green": "AstronautTB15Green",
          "Orange": "AstronautTB15Orange",
          "Purple": "AstronautTB15Purple",
          "Red": "AstronautTB15Red",
          "White": "AstronautTB15White",
          "Yellow": "AstronautTB15Yellow"
        }
      },
      "Barbarian Duel, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "BarbarianDuelFantasyTB25"
        }
      },
      "Barbarian, Nordic, Historic, TB25": {
        "Sizeless": {
          "Colorless": "BarbarianNordicHistoricTB25"
        }
      },
      "Base Shoe, TB15": {
        "Sizeless": {
          "Black": "BaseShoeTB15Black",
          "Blue": "BaseShoeTB15Blue",
          "Green": "BaseShoeTB15Green",
          "Orange": "BaseShoeTB15Orange",
          "Purple": "BaseShoeTB15Purple",
          "Red": "BaseShoeTB15Red",
          "White": "BaseShoeTB15White",
          "Yellow": "BaseShoeTB15Yellow"
        }
      },
      "Base Shoe, TB25": {
        "Sizeless": {
          "Black": "BaseShoeTB25Black",
          "Blue": "BaseShoeTB25Blue",
          "Green": "BaseShoeTB25Green",
          "Orange": "BaseShoeTB25Orange",
          "Purple": "BaseShoeTB25Purple",
          "Red": "BaseShoeTB25Red",
          "White": "BaseShoeTB25White",
          "Yellow": "BaseShoeTB25Yellow"
        }
      },
      "Battle Priest, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "BattlePriestFantasyTB25"
        }
      },
      "Berehynia, TB25": {
        "Sizeless": {
          "Colorless": "BerehyniaTB25"
        }
      },
      "Blight Twig, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "BlightTwigFantasyTB25"
        }
      },
      "Bog Beast, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "BogBeastFantasyTB25"
        }
      },
      "Caveman, TB15": {
        "Sizeless": {
          "Black": "CavemanTB15Black",
          "Blue": "CavemanTB15Blue",
          "Green": "CavemanTB15Green",
          "Orange": "CavemanTB15Orange",
          "Purple": "CavemanTB15Purple",
          "Red": "CavemanTB15Red",
          "White": "CavemanTB15White",
          "Yellow": "CavemanTB15Yellow"
        }
      },
      "Cavewoman, TB15": {
        "Sizeless": {
          "Black": "CavewomanTB15Black",
          "Blue": "CavewomanTB15Blue",
          "Green": "CavewomanTB15Green",
          "Orange": "CavewomanTB15Orange",
          "Purple": "CavewomanTB15Purple",
          "Red": "CavewomanTB15Red",
          "White": "CavewomanTB15White",
          "Yellow": "CavewomanTB15Yellow"
        }
      },
      "Chest, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "ChestFantasyTB25"
        }
      },
      "Creepy Hand, TB25": {
        "Sizeless": {
          "Colorless": "CreepyHandTB25"
        }
      },
      "Dark Elf Sorcerer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DarkElfSorcererFantasyTB25"
        }
      },
      "Dark Warrior 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DarkWarrior1FantasyTB25"
        }
      },
      "Dark Warrior 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DarkWarrior2FantasyTB25"
        }
      },
      "Drider, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "DriderFantasyTB50"
        }
      },
      "Dwarf Axe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DwarfAxeFantasyTB25"
        }
      },
      "Dwarf Minigun, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DwarfMinigunFantasyTB25"
        }
      },
      "Dwarf Paladin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DwarfPaladinFantasyTB25"
        }
      },
      "Dwarf Rifleman, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "DwarfRiflemanFantasyTB25"
        }
      },
      "Dwarf, Pistol, Space, TB25": {
        "Sizeless": {
          "Colorless": "DwarfPistolSpaceTB25"
        }
      },
      "Elf Archer 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "ElfArcher2FantasyTB25"
        }
      },
      "Elf Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "ElfArcherFantasyTB25"
        }
      },
      "Female Assassin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "FemaleAssassinFantasyTB25"
        }
      },
      "Female Elf Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "FemaleElfArcherFantasyTB25"
        }
      },
      "Female Elf Mage, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "FemaleElfMageFantasyTB25"
        }
      },
      "Fire, TB25": {
        "Sizeless": {
          "Colorless": "FireTB25"
        }
      },
      "Flute Girl, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "FluteGirlFantasyTB25"
        }
      },
      "Future Soldier, TB15": {
        "Sizeless": {
          "Black": "FutureSoldierTB15Black",
          "Blue": "FutureSoldierTB15Blue",
          "Green": "FutureSoldierTB15Green",
          "Orange": "FutureSoldierTB15Orange",
          "Purple": "FutureSoldierTB15Purple",
          "Red": "FutureSoldierTB15Red",
          "White": "FutureSoldierTB15White",
          "Yellow": "FutureSoldierTB15Yellow"
        }
      },
      "Ghost Bunny, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GhostBunnyFantasyTB25"
        }
      },
      "Ghost, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GhostFantasyTB25"
        }
      },
      "Ghoul 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Ghoul2FantasyTB25"
        }
      },
      "Ghoul, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GhoulFantasyTB25"
        }
      },
      "Giant Rat 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GiantRat1FantasyTB25"
        }
      },
      "Giant Rat 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GiantRat2FantasyTB25"
        }
      },
      "Gnoll Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnollArcherFantasyTB25"
        }
      },
      "Gnoll, Axe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnollAxeFantasyTB25"
        }
      },
      "Gnoll, Flail, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnollFlailFantasyTB25"
        }
      },
      "Gnome, Crossbow, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnomeCrossbowFantasyTB25"
        }
      },
      "Gnome, Sword, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnomeSwordFantasyTB25"
        }
      },
      "Gnome, TB15": {
        "Sizeless": {
          "Black": "GnomeTB15Black",
          "Blue": "GnomeTB15Blue",
          "Green": "GnomeTB15Green",
          "Orange": "GnomeTB15Orange",
          "Purple": "GnomeTB15Purple",
          "Red": "GnomeTB15Red",
          "White": "GnomeTB15White",
          "Yellow": "GnomeTB15Yellow"
        }
      },
      "Gnomette, Hammer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnometteHammerFantasyTB25"
        }
      },
      "Gnomette, Mage, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GnometteMageFantasyTB25"
        }
      },
      "Goblin Archer Draw Bald, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinArcherDrawBaldFantasyTB25"
        }
      },
      "Goblin Archer, Draw, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinArcherDrawFantasyTB25"
        }
      },
      "Goblin Chieftain, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinChieftainFantasyTB25"
        }
      },
      "Goblin Sling 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinSling1FantasyTB25"
        }
      },
      "Goblin Warlock, Fantasy, TB25": {
        "Sizeless": {
          "Yellow": "GoblinWarlockFantasyTB25Yellow"
        }
      },
      "Goblin, Defensive, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinDefensiveFantasyTB25"
        }
      },
      "Goblin, Jester, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinJesterFantasyTB25"
        }
      },
      "Goblin, Offensive, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GoblinOffensiveFantasyTB25"
        }
      },
      "Grim Reaper, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GrimReaperFantasyTB25"
        }
      },
      "Guard 1, Space, TB25": {
        "Sizeless": {
          "Colorless": "Guard1SpaceTB25"
        }
      },
      "Guard 2, Space, TB25": {
        "Sizeless": {
          "Colorless": "Guard2SpaceTB25"
        }
      },
      "Guard, Heavy, Space, TB25": {
        "Sizeless": {
          "Colorless": "GuardHeavySpaceTB25"
        }
      },
      "Hag, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HagFantasyTB25"
        }
      },
      "Halfling Pirate, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HalflingPirateFantasyTB25"
        }
      },
      "Halfling, Space, TB25": {
        "Sizeless": {
          "Colorless": "HalflingSpaceTB25"
        }
      },
      "Harpy 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Harpy2FantasyTB25"
        }
      },
      "Harpy, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HarpyFantasyTB25"
        }
      },
      "Hobgoblin, Crossbow 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HobgoblinCrossbow2FantasyTB25"
        }
      },
      "Hobgoblin, Crossbow, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HobgoblinCrossbowFantasyTB25"
        }
      },
      "Hobgoblin, Sword 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HobgoblinSword2FantasyTB25"
        }
      },
      "Hobgoblin, Sword, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HobgoblinSwordFantasyTB25"
        }
      },
      "Hooded Stranger, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "HoodedStrangerFantasyTB25"
        }
      },
      "Imp, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "ImpFantasyTB25"
        }
      },
      "Insect Warrior, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "InsectWarriorFantasyTB25"
        }
      },
      "Knight Wolfrib, Historic, TB25": {
        "Sizeless": {
          "Colorless": "KnightWolfribHistoricTB25"
        }
      },
      "Knight, Lance, Space, TB25": {
        "Sizeless": {
          "Colorless": "KnightLanceSpaceTB25"
        }
      },
      "Kobold, Pickaxe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "KoboldPickaxeFantasyTB25"
        }
      },
      "Krampus, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "KrampusFantasyTB25"
        }
      },
      "Lich, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "LichFantasyTB25"
        }
      },
      "Man, American Revolution, TB15": {
        "Sizeless": {
          "Black": "ManAmericanRevolutionTB15Black",
          "Blue": "ManAmericanRevolutionTB15Blue",
          "Green": "ManAmericanRevolutionTB15Green",
          "Orange": "ManAmericanRevolutionTB15Orange",
          "Purple": "ManAmericanRevolutionTB15Purple",
          "Red": "ManAmericanRevolutionTB15Red",
          "White": "ManAmericanRevolutionTB15White",
          "Yellow": "ManAmericanRevolutionTB15Yellow"
        }
      },
      "Man, Iroquois, TB15": {
        "Sizeless": {
          "Black": "ManIroquoisTB15Black",
          "Blue": "ManIroquoisTB15Blue",
          "Green": "ManIroquoisTB15Green",
          "Orange": "ManIroquoisTB15Orange",
          "Purple": "ManIroquoisTB15Purple",
          "Red": "ManIroquoisTB15Red",
          "White": "ManIroquoisTB15White",
          "Yellow": "ManIroquoisTB15Yellow"
        }
      },
      "Man, Modern, Chainsaw, TB25": {
        "Sizeless": {
          "Colorless": "ManModernChainsawTB25"
        }
      },
      "Man, Modern, Flashlight, TB25": {
        "Sizeless": {
          "Colorless": "ManModernFlashlightTB25"
        }
      },
      "Man, Modern, Shotgun, TB25": {
        "Sizeless": {
          "Colorless": "ManModernShotgunTB25"
        }
      },
      "Man, Modern, TB15": {
        "Sizeless": {
          "Black": "ManModernTB15Black",
          "Blue": "ManModernTB15Blue",
          "Green": "ManModernTB15Green",
          "Orange": "ManModernTB15Orange",
          "Purple": "ManModernTB15Purple",
          "Red": "ManModernTB15Red",
          "White": "ManModernTB15White",
          "Yellow": "ManModernTB15Yellow"
        }
      },
      "Man, Post Apocalypse, Archer, TB25": {
        "Sizeless": {
          "Colorless": "ManPostApocalypseArcherTB25"
        }
      },
      "Man, Post Apocalypse, Dual SMG, TB25": {
        "Sizeless": {
          "Colorless": "ManPostApocalypseDualSMGTB25"
        }
      },
      "Man, Post Apocalypse, Hammer, TB25": {
        "Sizeless": {
          "Colorless": "ManPostApocalypseHammerTB25"
        }
      },
      "Man, Post Apocalypse, TB15": {
        "Sizeless": {
          "Black": "ManPostApocalypseTB15Black",
          "Blue": "ManPostApocalypseTB15Blue",
          "Green": "ManPostApocalypseTB15Green",
          "Orange": "ManPostApocalypseTB15Orange",
          "Purple": "ManPostApocalypseTB15Purple",
          "Red": "ManPostApocalypseTB15Red",
          "White": "ManPostApocalypseTB15White",
          "Yellow": "ManPostApocalypseTB15Yellow"
        }
      },
      "Man, Samurai Armor, TB15": {
        "Sizeless": {
          "Black": "ManSamuraiArmorTB15Black",
          "Blue": "ManSamuraiArmorTB15Blue",
          "Green": "ManSamuraiArmorTB15Green",
          "Orange": "ManSamuraiArmorTB15Orange",
          "Purple": "ManSamuraiArmorTB15Purple",
          "Red": "ManSamuraiArmorTB15Red",
          "White": "ManSamuraiArmorTB15White",
          "Yellow": "ManSamuraiArmorTB15Yellow"
        }
      },
      "Mech, TB15": {
        "Sizeless": {
          "Black": "MechTB15Black",
          "Blue": "MechTB15Blue",
          "Green": "MechTB15Green",
          "Orange": "MechTB15Orange",
          "Purple": "MechTB15Purple",
          "Red": "MechTB15Red",
          "White": "MechTB15White",
          "Yellow": "MechTB15Yellow"
        }
      },
      "Medic, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "MedicFantasyTB25"
        }
      },
      "Mermaid, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "MermaidFantasyTB25"
        }
      },
      "Monk, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "MonkFantasyTB25"
        }
      },
      "Norse Maiden, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "NorseMaidenFantasyTB25"
        }
      },
      "Nothic, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "NothicFantasyTB25"
        }
      },
      "Obelisk, TB25": {
        "Sizeless": {
          "Colorless": "ObeliskTB25"
        }
      },
      "Ogre, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "OgreFantasyTB25"
        }
      },
      "Opossum Druid, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "OpossumDruidFantasyTB25"
        }
      },
      "Orc Scimitar, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "OrcScimitarFantasyTB25"
        }
      },
      "Orc Shaman, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "OrcShamanFantasyTB25"
        }
      },
      "Owlbear, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "OwlbearFantasyTB50"
        }
      },
      "Pirate 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate1FantasyTB25"
        }
      },
      "Pirate 2, Female, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate2FemaleFantasyTB25"
        }
      },
      "Pirate 3, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate3FantasyTB25"
        }
      },
      "Pirate 4, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Pirate4FantasyTB25"
        }
      },
      "Pit Fiend, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "PitFiendFantasyTB50"
        }
      },
      "Putler, TB25": {
        "Sizeless": {
          "Colorless": "PutlerTB25"
        }
      },
      "Ratcatcher, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "RatcatcherFantasyTB25"
        }
      },
      "Ratfolk, Assassin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "RatfolkAssassinFantasyTB25"
        }
      },
      "Robot, Detective, Space, TB25": {
        "Sizeless": {
          "Colorless": "RobotDetectiveSpaceTB25"
        }
      },
      "Robot, Wizard, Space, TB25": {
        "Sizeless": {
          "Colorless": "RobotWizardSpaceTB25"
        }
      },
      "Samurai Armor, Historic, TB25": {
        "Sizeless": {
          "Colorless": "SamuraiArmorHistoricTB25"
        }
      },
      "Skeleton Archer 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonArcher2FantasyTB25"
        }
      },
      "Skeleton Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonArcherFantasyTB25"
        }
      },
      "Skeleton Axe, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonAxeFantasyTB25"
        }
      },
      "Skeleton Sword 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonSword2FantasyTB25"
        }
      },
      "Skeleton Sword 3, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonSword3FantasyTB25"
        }
      },
      "Skeleton Sword, Armored, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonSwordArmoredFantasyTB25"
        }
      },
      "Skeleton Sword, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "SkeletonSwordFantasyTB25"
        }
      },
      "Snowman 1, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Snowman1FantasyTB25"
        }
      },
      "Snowman 2 Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Snowman2FantasyTB25"
        }
      },
      "Spider, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "SpiderFantasyTB50"
        }
      },
      "Stand, Chipboard, TB15": {
        "Sizeless": {
          "Black": "StandChipboardTB15Black",
          "Blue": "StandChipboardTB15Blue",
          "Green": "StandChipboardTB15Green",
          "Orange": "StandChipboardTB15Orange",
          "Purple": "StandChipboardTB15Purple",
          "Red": "StandChipboardTB15Red",
          "White": "StandChipboardTB15White",
          "Yellow": "StandChipboardTB15Yellow"
        }
      },
      "Tentacle Portal, TB25": {
        "Sizeless": {
          "Colorless": "TentaclePortalTB25"
        }
      },
      "Tiefling Female Mage, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "TieflingFemaleMageFantasyTB25"
        }
      },
      "Troll, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "TrollFantasyTB50"
        }
      },
      "Trophy, TB15": {
        "Sizeless": {
          "Bronze": "TrophyTB15Bronze",
          "Gold": "TrophyTB15Gold",
          "Silver": "TrophyTB15Silver"
        }
      },
      "Walker, Space, TB50": {
        "Sizeless": {
          "Colorless": "WalkerSpaceTB50"
        }
      },
      "Wereshark, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "WeresharkFantasyTB25"
        }
      },
      "Werewolf, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "WerewolfFantasyTB25"
        }
      },
      "Wilhelm Tell, Crossbowman, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "WilhelmTellCrossbowmanFantasyTB25"
        }
      },
      "Wizard Old, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "WizardOldFantasyTB25"
        }
      },
      "Woman, Modern, Baseball Bat, TB25": {
        "Sizeless": {
          "Colorless": "WomanModernBaseballBatTB25"
        }
      },
      "Woman, Modern, Handgun, TB25": {
        "Sizeless": {
          "Colorless": "WomanModernHandgunTB25"
        }
      },
      "Woman, Modern, TB15": {
        "Sizeless": {
          "Black": "WomanModernTB15Black",
          "Blue": "WomanModernTB15Blue",
          "Green": "WomanModernTB15Green",
          "Orange": "WomanModernTB15Orange",
          "Purple": "WomanModernTB15Purple",
          "Red": "WomanModernTB15Red",
          "White": "WomanModernTB15White",
          "Yellow": "WomanModernTB15Yellow"
        }
      },
      "Woman, Post Apocalypse, Bazooka, TB25": {
        "Sizeless": {
          "Colorless": "WomanPostApocalypseBazookaTB25"
        }
      },
      "Woman, Post Apocalypse, Shotgun, TB25": {
        "Sizeless": {
          "Colorless": "WomanPostApocalypseShotgunTB25"
        }
      },
      "Woman, Post Apocalypse, TB15": {
        "Sizeless": {
          "Black": "WomanPostApocalypseTB15Black",
          "Blue": "WomanPostApocalypseTB15Blue",
          "Green": "WomanPostApocalypseTB15Green",
          "Orange": "WomanPostApocalypseTB15Orange",
          "Purple": "WomanPostApocalypseTB15Purple",
          "Red": "WomanPostApocalypseTB15Red",
          "White": "WomanPostApocalypseTB15White",
          "Yellow": "WomanPostApocalypseTB15Yellow"
        }
      },
      "Wraith, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "WraithFantasyTB25"
        }
      },
      "Wraith, Halberd, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "WraithHalberdFantasyTB25"
        }
      },
      "Zombie 2, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Zombie2FantasyTB25"
        }
      },
      "Zombie 3, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "Zombie3FantasyTB25"
        }
      },
      "Zombie, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "ZombieFantasyTB25"
        }
      },
      "Mine, Sea, TB25": {
        "Sizeless": {
          "Colorless": "MineSeaTB25"
        }
      }
    },
    "minifig": {
      "Adventurer with Sword and Shield": {
        "Sizeless": {
          "Colorless": "AdventurerwithSwordandShield"
        }
      },
      "American Indian with Bow": {
        "Sizeless": {
          "Colorless": "AmericanIndianwithBow"
        }
      },
      "Anti-Paladin": {
        "Sizeless": {
          "Colorless": "Anti-Paladin"
        }
      },
      "Arianna Moonshadow Enchantress": {
        "Sizeless": {
          "Colorless": "AriannaMoonshadowEnchantress"
        }
      },
      "Armored Ogre": {
        "Sizeless": {
          "Colorless": "ArmoredOgre"
        }
      },
      "Balefire Demon w/ Sword": {
        "Sizeless": {
          "Colorless": "BalefireDemonw/Sword"
        }
      },
      "Barbarian with Axe": {
        "Sizeless": {
          "Colorless": "BarbarianwithAxe"
        }
      },
      "Barbarian with Sword & Shield": {
        "Sizeless": {
          "Colorless": "BarbarianwithSword&Shield"
        }
      },
      "Barbarian with Two Swords": {
        "Sizeless": {
          "Colorless": "BarbarianwithTwoSwords"
        }
      },
      "Brigand with Dagger": {
        "Sizeless": {
          "Colorless": "BrigandwithDagger"
        }
      },
      "Cavalry": {
        "Sizeless": {
          "Green": "CavalryGreen"
        }
      },
      "Centaur Thrusting Spear": {
        "Sizeless": {
          "Colorless": "CentaurThrustingSpear"
        }
      },
      "Chaos Death Master": {
        "Sizeless": {
          "Colorless": "ChaosDeathMaster"
        }
      },
      "Cleric": {
        "Sizeless": {
          "Colorless": "Cleric"
        }
      },
      "Death Knight with Polearm": {
        "Sizeless": {
          "Colorless": "DeathKnightwithPolearm"
        }
      },
      "Death Knight with Sword": {
        "Sizeless": {
          "Colorless": "DeathKnightwithSword"
        }
      },
      "Dindaelus: Wizard with Staff": {
        "Sizeless": {
          "Colorless": "Dindaelus:WizardwithStaff"
        }
      },
      "Djin": {
        "Sizeless": {
          "Colorless": "Djin"
        }
      },
      "Dragon Familiar": {
        "Sizeless": {
          "Colorless": "DragonFamiliar"
        }
      },
      "Dwarf Fighter": {
        "Sizeless": {
          "Colorless": "DwarfFighter"
        }
      },
      "Dwarven Iron Golem": {
        "Sizeless": {
          "Colorless": "DwarvenIronGolem"
        }
      },
      "Enchanter with Staff": {
        "Sizeless": {
          "Colorless": "EnchanterwithStaff"
        }
      },
      "Evil Lord with Mace": {
        "Sizeless": {
          "Colorless": "EvilLordwithMace"
        }
      },
      "Female Beast Master Warrior with Sword and Spear": {
        "Sizeless": {
          "Colorless": "FemaleBeastMasterWarriorwithSwordandSpear"
        }
      },
      "Female Gunslinger": {
        "Sizeless": {
          "Gray": "FemaleGunslingerGray"
        }
      },
      "Fighter with Great Sword": {
        "Sizeless": {
          "Colorless": "FighterwithGreatSword"
        }
      },
      "Fire Elemental": {
        "Sizeless": {
          "Colorless": "FireElemental"
        }
      },
      "Four Armed Titan of Terror w/ Weapon Sprue": {
        "Sizeless": {
          "Colorless": "FourArmedTitanofTerrorw/WeaponSprue"
        }
      },
      "Gelatinous Monster": {
        "Sizeless": {
          "Colorless": "GelatinousCube"
        }
      },
      "Ghost IV Hooded": {
        "Sizeless": {
          "Colorless": "GhostIVHooded"
        }
      },
      "Goatman Champion": {
        "Sizeless": {
          "Colorless": "GoatmanChampion"
        }
      },
      "Goatman with Bow": {
        "Sizeless": {
          "Colorless": "GoatmanwithBow"
        }
      },
      "Goatman With Spear & Shield": {
        "Sizeless": {
          "Colorless": "GoatmanWithSpear&Shield"
        }
      },
      "Goatman with Sword and Shield": {
        "Sizeless": {
          "Colorless": "GoatmanwithSwordandShield"
        }
      },
      "Hippogriff": {
        "Sizeless": {
          "Colorless": "Hippogriff"
        }
      },
      "Lich with Staff": {
        "Sizeless": {
          "Colorless": "LichwithStaff"
        }
      },
      "Lizard Man on Rock Throne": {
        "Sizeless": {
          "Colorless": "LizardManonRockThrone"
        }
      },
      "Lizard Man with War Club and Shield": {
        "Sizeless": {
          "Colorless": "LizardManwithWarClubandShield"
        }
      },
      "Minotaur with Battle Axe": {
        "Sizeless": {
          "Colorless": "MinotaurwithBattleAxe"
        }
      },
      "Ogre with Club & Shield": {
        "Sizeless": {
          "Colorless": "OgrewithClub&Shield"
        }
      },
      "Pinhead the Barbarian": {
        "Sizeless": {
          "Colorless": "PinheadtheBarbarian"
        }
      },
      "Ranger Archer, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "RangerArcherFantasyTB25"
        }
      },
      "Ranger Firing Bow": {
        "Sizeless": {
          "Colorless": "RangerFiringBow"
        }
      },
      "Savage Orc Champion Great Hamm": {
        "Sizeless": {
          "Colorless": "SavageOrcChampionGreatHamm"
        }
      },
      "Savage Orc Chieftain": {
        "Sizeless": {
          "Colorless": "SavageOrcChieftain"
        }
      },
      "Scarecrow A": {
        "Sizeless": {
          "Colorless": "ScarecrowA"
        }
      },
      "Scarecrow B": {
        "Sizeless": {
          "Colorless": "ScarecrowB"
        }
      },
      "Skeletal Crossbowman III": {
        "Sizeless": {
          "Colorless": "SkeletalCrossbowmanIII"
        }
      },
      "Skeleton Battle Axe": {
        "Sizeless": {
          "Colorless": "SkeletonBattleAxe"
        }
      },
      "The White Wizard": {
        "Sizeless": {
          "Colorless": "TheWhiteWizard"
        }
      },
      "Two Headed Ogre w/ Captive": {
        "Sizeless": {
          "Colorless": "TwoHeadedOgrew/Captive"
        }
      },
      "Warbeast with Handler": {
        "Sizeless": {
          "Colorless": "WarbeastwithHandler"
        }
      },
      "Wyvern II": {
        "Sizeless": {
          "Colorless": "WyvernII"
        }
      }
    },
    "figurine": {
      "Avatar, Opaque": {
        "Sizeless": {
          "Black": "AvatarOpaqueBlack",
          "White": "AvatarOpaqueWhite"
        }
      },
      "Avatar, Transparent": {
        "Sizeless": {
          "Black": "AvatarTransparentBlack",
          "Blue": "AvatarTransparentBlue",
          "Green": "AvatarTransparentGreen",
          "Orange": "AvatarTransparentOrange",
          "Purple": "AvatarTransparentPurple",
          "Red": "AvatarTransparentRed",
          "White": "AvatarTransparentWhite",
          "Yellow": "AvatarTransparentYellow"
        }
      },
      "Avatar, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "AvatarTransparentClear"
        }
      },
      "Colonial Lumberjack": {
        "Sizeless": {
          "Blue": "ColonialLumberjackBlue",
          "Green": "ColonialLumberjackGreen",
          "Orange": "ColonialLumberjackOrange",
          "Red": "ColonialLumberjackRed",
          "Yellow": "ColonialLumberjackYellow"
        }
      },
      "Colonial Soldier": {
        "Sizeless": {
          "Blue": "ColonialSoldierBlue",
          "Green": "ColonialSoldierGreen",
          "Orange": "ColonialSoldierOrange",
          "Red": "ColonialSoldierRed",
          "Yellow": "ColonialSoldierYellow"
        }
      },
      "Cone Pawn": {
        "Sizeless": {
          "Black": "ConePawnBlack"
        }
      },
      "Fedora Person, Black, Dark": {
        "Sizeless": {
          "Colorless": "FedoraPersonBlackDark"
        }
      },
      "Fedora Person, Black, Light": {
        "Sizeless": {
          "Colorless": "FedoraPersonBlackLight"
        }
      },
      "Fedora Person": {
        "Medium": {
          "Black": "FedoraPersonBlackMedium",
          "Blue": "FedoraPersonBlueMedium",
          "Red": "FedoraPersonRedMedium",
          "White": "FedoraPersonWhiteMedium",
          "Yellow": "FedoraPersonYellowMedium"
        }
      },
      "Fedora Person, Blue, Dark": {
        "Sizeless": {
          "Colorless": "FedoraPersonBlueDark"
        }
      },
      "Fedora Person, Blue, Light": {
        "Sizeless": {
          "Colorless": "FedoraPersonBlueLight"
        }
      },
      "Fedora Person, Red, Dark": {
        "Sizeless": {
          "Colorless": "FedoraPersonRedDark"
        }
      },
      "Fedora Person, Red, Light": {
        "Sizeless": {
          "Colorless": "FedoraPersonRedLight"
        }
      },
      "Fedora Person, White, Dark": {
        "Sizeless": {
          "Colorless": "FedoraPersonWhiteDark"
        }
      },
      "Fedora Person, White, Light": {
        "Sizeless": {
          "Colorless": "FedoraPersonWhiteLight"
        }
      },
      "Fedora Person, Yellow, Dark": {
        "Sizeless": {
          "Colorless": "FedoraPersonYellowDark"
        }
      },
      "Fedora Person, Yellow, Light": {
        "Sizeless": {
          "Colorless": "FedoraPersonYellowLight"
        }
      },
      "Flat Cap, Black": {
        "Sizeless": {
          "Bronze": "FlatCapBlackBronze",
          "Green": "FlatCapBlackGreen",
          "Purple": "FlatCapBlackPurple"
        }
      },
      "Flat Cap, Blue": {
        "Sizeless": {
          "Bronze": "FlatCapBlueBronze",
          "Green": "FlatCapBlueGreen",
          "Purple": "FlatCapBluePurple"
        }
      },
      "Flat Cap, Red": {
        "Sizeless": {
          "Bronze": "FlatCapRedBronze",
          "Green": "FlatCapRedGreen",
          "Purple": "FlatCapRedPurple"
        }
      },
      "Flat Cap, White": {
        "Sizeless": {
          "Bronze": "FlatCapWhiteBronze",
          "Green": "FlatCapWhiteGreen",
          "Purple": "FlatCapWhitePurple"
        }
      },
      "Flat Cap, Yellow": {
        "Sizeless": {
          "Bronze": "FlatCapYellowBronze",
          "Green": "FlatCapYellowGreen",
          "Purple": "FlatCapYellowPurple"
        }
      },
      "Future Person": {
        "Sizeless": {
          "Orange": "FuturePersonOrange",
          "Purple": "FuturePersonPurple",
          "Yellow": "FuturePersonYellow"
        }
      },
      "Gunpod": {
        "Sizeless": {
          "Colorless": "Gunpod"
        }
      },
      "Halma": {
        "Sizeless": {
          "Black": "HalmaBlack",
          "Blue": "HalmaBlue",
          "Green": "HalmaGreen",
          "Orange": "HalmaOrange",
          "Purple": "HalmaPurple",
          "Red": "HalmaRed",
          "White": "HalmaWhite",
          "Yellow": "HalmaYellow"
        },
        "Large": {
          "Natural": "HalmaLargeNatural"
        }
      },
      "Halma, Stackable": {
        "Sizeless": {
          "Blue": "HalmaStackableBlue",
          "Green": "HalmaStackableGreen",
          "Red": "HalmaStackableRed",
          "White": "HalmaStackableWhite",
          "Yellow": "HalmaStackableYellow"
        }
      },
      "Hatman": {
        "Sizeless": {
          "Green": "HatmanGreen"
        }
      },
      "Human Figure": {
        "Sizeless": {
          "Orange": "HumanFigureOrange",
          "Purple": "HumanFigurePurple",
          "Red": "HumanFigureRed",
          "Yellow": "HumanFigureYellow"
        }
      },
      "Hydra": {
        "Sizeless": {
          "Colorless": "Hydra"
        }
      },
      "Lookout": {
        "Sizeless": {
          "Blue": "LookoutBlue",
          "Green": "LookoutGreen",
          "Orange": "LookoutOrange",
          "Red": "LookoutRed",
          "Yellow": "LookoutYellow"
        }
      },
      "Mafioso, Burnt": {
        "Sizeless": {
          "Orange": "MafiosoBurntOrange"
        }
      },
      "Mafioso": {
        "Sizeless": {
          "Green": "MafiosoGreen",
          "Purple": "MafiosoPurple",
          "Red": "MafiosoRed",
          "Yellow": "MafiosoYellow"
        }
      },
      "Miniature Base, 25mm Hex": {
        "Sizeless": {
          "Black": "MiniatureBase25mmHexBlack",
          "Blue": "MiniatureBase25mmHexBlue",
          "Green": "MiniatureBase25mmHexGreen",
          "Orange": "MiniatureBase25mmHexOrange",
          "Purple": "MiniatureBase25mmHexPurple",
          "Red": "MiniatureBase25mmHexRed",
          "White": "MiniatureBase25mmHexWhite",
          "Yellow": "MiniatureBase25mmHexYellow"
        }
      },
      "Missionary": {
        "Large": {
          "Blue": "MissionaryLargeBlue",
          "Green": "MissionaryLargeGreen",
          "Orange": "MissionaryLargeOrange",
          "Red": "MissionaryLargeRed",
          "Yellow": "MissionaryLargeYellow"
        }
      },
      "Ninja": {
        "Sizeless": {
          "Brown": "NinjaBrown",
          "Orange": "NinjaOrange"
        }
      },
      "Noble": {
        "Sizeless": {
          "Blue": "NobleBlue",
          "Green": "NobleGreen",
          "Red": "NobleRed",
          "White": "NobleWhite",
          "Yellow": "NobleYellow"
        }
      },
      "Paper Miniature Base Square": {
        "20mm": {
          "Colorless": "PaperMiniatureBaseSquare20mm"
        }
      },
      "Paper Miniature Base, Angled": {
        "20mm": {
          "Colorless": "PaperMiniatureBase20mmAngled"
        }
      },
      "Paper Miniature Base": {
        "25mm": {
          "Black": "PaperMiniatureBase25mmBlack",
          "Blue": "PaperMiniatureBase25mmBlue",
          "Green": "PaperMiniatureBase25mmGreen",
          "Orange": "PaperMiniatureBase25mmOrange",
          "Purple": "PaperMiniatureBase25mmPurple",
          "Red": "PaperMiniatureBase25mmRed",
          "White": "PaperMiniatureBase25mmWhite",
          "Yellow": "PaperMiniatureBase25mmYellow"
        }
      },
      "Paper Miniature Base, Clear": {
        "25mm": {
          "Colorless": "PaperMiniatureBase25mmClear"
        }
      },
      "Paper Miniature Formation Tray, 10 x 4": {
        "20mm": {
          "Colorless": "PaperMiniatureFormationTray20mm10x4"
        }
      },
      "Paper Miniature Formation Tray, 5 x 2": {
        "20mm": {
          "Colorless": "PaperMiniatureFormationTray20mm5x2"
        }
      },
      "Paper Miniature Formation Tray, 5 x 2, Angled": {
        "20mm": {
          "Colorless": "PaperMiniatureFormationTray20mm5x2Angled"
        }
      },
      "Paper Miniature Formation Tray, 5 x 4": {
        "20mm": {
          "Colorless": "PaperMiniatureFormationTray20mm5x4"
        }
      },
      "Paper Miniature Formation Tray, 5 x 4, Angled": {
        "20mm": {
          "Colorless": "PaperMiniatureFormationTray20mm5x4Angled"
        }
      },
      "Peg Pawn": {
        "Sizeless": {
          "Black": "PegPawnBlack",
          "Blue": "PegPawnBlue",
          "Green": "PegPawnGreen",
          "Orange": "PegPawnOrange",
          "Purple": "PegPawnPurple",
          "Red": "PegPawnRed",
          "White": "PegPawnWhite",
          "Yellow": "PegPawnYellow"
        }
      },
      "Shieldbearer": {
        "Sizeless": {
          "Blue": "ShieldbearerBlue",
          "Green": "ShieldbearerGreen",
          "Purple": "ShieldbearerPurple",
          "Yellow": "ShieldbearerYellow"
        }
      },
      "Skeleton Warrior": {
        "Sizeless": {
          "Black": "SkeletonWarriorBlack",
          "Blue": "SkeletonWarriorBlue",
          "Pink": "SkeletonWarriorPink",
          "Tan": "SkeletonWarriorTan"
        }
      },
      "Sticker Pawn, Opaque": {
        "Sizeless": {
          "Black": "StickerPawnOpaqueBlack",
          "Blue": "StickerPawnOpaqueBlue",
          "Green": "StickerPawnOpaqueGreen",
          "Orange": "StickerPawnOpaqueOrange",
          "Purple": "StickerPawnOpaquePurple",
          "Red": "StickerPawnOpaqueRed",
          "White": "StickerPawnOpaqueWhite",
          "Yellow": "StickerPawnOpaqueYellow"
        }
      },
      "Sticker Pawn, Transparent": {
        "Sizeless": {
          "Blue": "StickerPawnTransparentBlue",
          "Green": "StickerPawnTransparentGreen",
          "Orange": "StickerPawnTransparentOrange",
          "Purple": "StickerPawnTransparentPurple",
          "Red": "StickerPawnTransparentRed",
          "Yellow": "StickerPawnTransparentYellow"
        }
      },
      "Sticker Pawn, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "StickerPawnTransparentClear"
        }
      },
      "Warrior Monk": {
        "Sizeless": {
          "Purple": "WarriorMonkPurple",
          "Red": "WarriorMonkRed"
        }
      },
      "Woman, Mum": {
        "Sizeless": {
          "Colorless": "WomanMum"
        }
      },
      "Zombie Babe": {
        "Sizeless": {
          "Colorless": "ZombieBabe"
        }
      },
      "Zombie Cheerleader": {
        "Sizeless": {
          "Colorless": "ZombieCheerleader"
        }
      },
      "Zombie Circus Clown": {
        "Sizeless": {
          "Colorless": "ZombieCircusClown"
        }
      },
      "Zombie Clown": {
        "Sizeless": {
          "Colorless": "ZombieClown"
        }
      },
      "Zombie Doctor": {
        "Sizeless": {
          "Colorless": "ZombieDoctor"
        }
      },
      "Zombie Dog": {
        "Sizeless": {
          "Colorless": "ZombieDog"
        }
      },
      "Zombie Dude": {
        "Sizeless": {
          "Colorless": "ZombieDude"
        }
      },
      "Zombie Granny": {
        "Sizeless": {
          "Colorless": "ZombieGranny"
        }
      },
      "Zombie Mullet": {
        "Sizeless": {
          "Colorless": "ZombieMullet"
        }
      },
      "Zombie Professor": {
        "Sizeless": {
          "Colorless": "ZombieProfessor"
        }
      },
      "Zombie Thriller": {
        "Sizeless": {
          "Colorless": "ZombieThriller"
        }
      },
      "Zombie, Random": {
        "Sizeless": {
          "Colorless": "ZombieRandom"
        }
      },
      "Halma, Plastic": {
        "Sizeless": {
          "Black": "HalmaPlasticBlack",
          "Blue": "HalmaPlasticBlue",
          "Orange": "HalmaPlasticOrange",
          "Red": "HalmaPlasticRed",
          "White": "HalmaPlasticWhite",
          "Yellow": "HalmaPlasticYellow"
        }
      }
    },
    "animal": {
      "African Elephant": {
        "Sizeless": {
          "Colorless": "AfricanElephant"
        }
      },
      "Ant": {
        "Sizeless": {
          "Colorless": "Ant"
        }
      },
      "Bee": {
        "Sizeless": {
          "Wood": "BeeWood"
        }
      },
      "Bird, TB15": {
        "Sizeless": {
          "Black": "BirdTB15Black",
          "Blue": "BirdTB15Blue",
          "Green": "BirdTB15Green",
          "Orange": "BirdTB15Orange",
          "Purple": "BirdTB15Purple",
          "Red": "BirdTB15Red",
          "White": "BirdTB15White",
          "Yellow": "BirdTB15Yellow"
        }
      },
      "Black Bear": {
        "Sizeless": {
          "Colorless": "BlackBear"
        }
      },
      "Bug": {
        "Sizeless": {
          "Black": "BugBlack",
          "Blue": "BugBlue",
          "Green": "BugGreen",
          "Orange": "BugOrange",
          "Purple": "BugPurple",
          "Red": "BugRed",
          "White": "BugWhite",
          "Yellow": "BugYellow"
        }
      },
      "Bull, Wood": {
        "Sizeless": {
          "Brown": "BullWoodBrown",
          "Orange": "BullWoodOrange"
        }
      },
      "Bunny, TB15": {
        "Sizeless": {
          "Black": "BunnyTB15Black",
          "Blue": "BunnyTB15Blue",
          "Green": "BunnyTB15Green",
          "Orange": "BunnyTB15Orange",
          "Purple": "BunnyTB15Purple",
          "Red": "BunnyTB15Red",
          "White": "BunnyTB15White",
          "Yellow": "BunnyTB15Yellow"
        }
      },
      "Cat, Acrylic": {
        "Sizeless": {
          "Colorless": "CatAcrylic"
        }
      },
      "Cat, TB15": {
        "Sizeless": {
          "Black": "CatTB15Black",
          "Blue": "CatTB15Blue",
          "Green": "CatTB15Green",
          "Orange": "CatTB15Orange",
          "Purple": "CatTB15Purple",
          "Red": "CatTB15Red",
          "White": "CatTB15White",
          "Yellow": "CatTB15Yellow"
        }
      },
      "Cheetah": {
        "Sizeless": {
          "Colorless": "Cheetah"
        }
      },
      "Chicken, Acrylic": {
        "Sizeless": {
          "Colorless": "ChickenAcrylic"
        }
      },
      "Cobra, Wood": {
        "Sizeless": {
          "Teal": "CobraWoodTeal"
        }
      },
      "Cow": {
        "Sizeless": {
          "Black": "CowBlack"
        }
      },
      "Cow, Half": {
        "Sizeless": {
          "Black": "CowHalfBlack",
          "Brown": "CowHalfBrown"
        }
      },
      "Crab, Acrylic": {
        "Sizeless": {
          "Black": "CrabAcrylicBlack",
          "Blue": "CrabAcrylicBlue",
          "Green": "CrabAcrylicGreen",
          "Orange": "CrabAcrylicOrange",
          "Purple": "CrabAcrylicPurple",
          "Red": "CrabAcrylicRed",
          "White": "CrabAcrylicWhite",
          "Yellow": "CrabAcrylicYellow"
        }
      },
      "Dinosaur Token, Wood": {
        "Sizeless": {
          "Blue": "DinosaurTokenWoodBlue",
          "Green": "DinosaurTokenWoodGreen",
          "Orange": "DinosaurTokenWoodOrange",
          "Purple": "DinosaurTokenWoodPurple",
          "Red": "DinosaurTokenWoodRed"
        }
      },
      "Dinosaur Tokens, Wood": {
        "Sizeless": {
          "Pink": "DinosaurTokensWoodPink"
        }
      },
      "Dinosaur, Ankylosaurus": {
        "Sizeless": {
          "Colorless": "DinosaurAnkylosaurus",
          "Pink": "DinosaurAnkylosaurusPink"
        }
      },
      "Dinosaur, Ankylosaurus, Wood": {
        "Sizeless": {
          "Blue": "DinosaurAnkylosaurusWoodBlue",
          "Green": "DinosaurAnkylosaurusWoodGreen",
          "Orange": "DinosaurAnkylosaurusWoodOrange",
          "Pink": "DinosaurAnkylosaurusWoodPink",
          "Purple": "DinosaurAnkylosaurusWoodPurple",
          "Red": "DinosaurAnkylosaurusWoodRed",
          "White": "DinosaurAnkylosaurusWoodWhite"
        }
      },
      "Dinosaur, Brontosaurus": {
        "Sizeless": {
          "Colorless": "DinosaurBrontosaurus"
        }
      },
      "Dinosaur, Pachycephalosaurus": {
        "Sizeless": {
          "Colorless": "DinosaurPachycephalosaurus"
        }
      },
      "Dinosaur, Pterodactyl": {
        "Sizeless": {
          "Colorless": "DinosaurPterodactyl"
        }
      },
      "Dinosaur, Spinosaurus": {
        "Sizeless": {
          "Orange": "DinosaurSpinosaurusOrange"
        }
      },
      "Dinosaur, Stegosaurus": {
        "Sizeless": {
          "Colorless": "DinosaurStegosaurus",
          "Green": "DinosaurStegosaurusGreen"
        }
      },
      "Dinosaur, Triceratops": {
        "Sizeless": {
          "Colorless": "DinosaurTriceratops",
          "Red": "DinosaurTriceratopsRed"
        }
      },
      "Dinosaur, Tyrannosaurus": {
        "Sizeless": {
          "Colorless": "DinosaurTyrannosaurus",
          "Blue": "DinosaurTyrannosaurusBlue",
          "Dark Green": "DinosaurTyrannosaurusDarkGreen",
          "Green": "DinosaurTyrannosaurusGreen",
          "Orange": "DinosaurTyrannosaurusOrange",
          "Pink": "DinosaurTyrannosaurusPink",
          "Purple": "DinosaurTyrannosaurusPurple",
          "Red": "DinosaurTyrannosaurusRed"
        }
      },
      "Dinosaur, Velociraptor": {
        "Sizeless": {
          "Colorless": "DinosaurVelociraptor",
          "Gray": "DinosaurVelociraptorGray"
        }
      },
      "Dog, Acrylic": {
        "Sizeless": {
          "Colorless": "DogAcrylic"
        }
      },
      "Dog, Post Apocalypse, Armor, TB25": {
        "Sizeless": {
          "Colorless": "DogPostApocalypseArmorTB25"
        }
      },
      "Donkey": {
        "Sizeless": {
          "Wood": "DonkeyWood"
        }
      },
      "Dove": {
        "Sizeless": {
          "Colorless": "Dove"
        }
      },
      "Dragon, Blue, Dark": {
        "Sizeless": {
          "Colorless": "DragonBlueDark"
        }
      },
      "Dragon, Blue, Light": {
        "Sizeless": {
          "Colorless": "DragonBlueLight"
        }
      },
      "Dragon, Fantasy, TB15": {
        "Sizeless": {
          "Black": "DragonFantasyTB15Black",
          "Blue": "DragonFantasyTB15Blue",
          "Green": "DragonFantasyTB15Green",
          "Orange": "DragonFantasyTB15Orange",
          "Purple": "DragonFantasyTB15Purple",
          "Red": "DragonFantasyTB15Red",
          "White": "DragonFantasyTB15White",
          "Yellow": "DragonFantasyTB15Yellow"
        }
      },
      "Dragon, Fantasy, TB50": {
        "Sizeless": {
          "Colorless": "DragonFantasyTB50"
        }
      },
      "Dragon": {
        "Sizeless": {
          "Orange": "DragonOrange",
          "Red": "DragonRed"
        },
        "Small": {
          "Blue": "DragonSmallBlue",
          "Green": "DragonSmallGreen",
          "Red": "DragonSmallRed",
          "Yellow": "DragonSmallYellow"
        }
      },
      "Elephant with Rider": {
        "Sizeless": {
          "Green": "ElephantwithRiderGreen",
          "Gray": "ElephantwithRiderGray",
          "Orange": "ElephantwithRiderOrange",
          "Purple": "ElephantwithRiderPurple",
          "Red": "ElephantwithRiderRed",
          "Yellow": "ElephantwithRiderYellow"
        }
      },
      "Fish, Wood": {
        "Sizeless": {
          "Yellow": "FishWoodYellow"
        }
      },
      "Frog Rider": {
        "Sizeless": {
          "Blue": "FrogRiderBlue",
          "Brown": "FrogRiderBrown",
          "Green": "FrogRiderGreen",
          "Red": "FrogRiderRed",
          "Yellow": "FrogRiderYellow"
        }
      },
      "Frogfolk, Spear, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "FrogfolkSpearFantasyTB25"
        }
      },
      "Goat, Acrylic": {
        "Sizeless": {
          "Colorless": "GoatAcrylic"
        }
      },
      "Goat, Random": {
        "Sizeless": {
          "Colorless": "GoatRandom"
        }
      },
      "Gorilla": {
        "Sizeless": {
          "Colorless": "Gorilla"
        }
      },
      "Grick, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "GrickFantasyTB25"
        }
      },
      "Grizzly Bear": {
        "Sizeless": {
          "Colorless": "GrizzlyBear"
        }
      },
      "Handmade Fish": {
        "Sizeless": {
          "Colorless": "HandmadeFish"
        }
      },
      "Handmade Sheep": {
        "Sizeless": {
          "Colorless": "HandmadeSheep"
        }
      },
      "Horse, Acrylic": {
        "Sizeless": {
          "Colorless": "HorseAcrylic"
        }
      },
      "Kitten": {
        "Sizeless": {
          "Brown": "KittenBrown",
          "White": "KittenWhite"
        }
      },
      "Kitten, White with Brown ": {
        "Sizeless": {
          "Colorless": "KittenWhitewithBrown"
        }
      },
      "Lady Bug": {
        "Sizeless": {
          "Wood": "LadyBugWood"
        }
      },
      "Lion": {
        "Sizeless": {
          "Colorless": "Lion"
        }
      },
      "Lizardman, Javelin, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "LizardmanJavelinFantasyTB25"
        }
      },
      "Mouse, Acrylic": {
        "Sizeless": {
          "Colorless": "MouseAcrylic"
        }
      },
      "Mouse, Wood": {
        "Sizeless": {
          "Gray": "MouseWoodGray"
        }
      },
      "Pig, Mini, Black and": {
        "Sizeless": {
          "White": "PigMiniBlackandWhite"
        }
      },
      "Pig, Mini": {
        "Sizeless": {
          "Brown": "PigMiniBrown",
          "Pink": "PigMiniPink"
        }
      },
      "Pig, TB15": {
        "Sizeless": {
          "Black": "PigTB15Black",
          "Blue": "PigTB15Blue",
          "Green": "PigTB15Green",
          "Orange": "PigTB15Orange",
          "Purple": "PigTB15Purple",
          "Red": "PigTB15Red",
          "White": "PigTB15White",
          "Yellow": "PigTB15Yellow"
        }
      },
      "Pig, Wood": {
        "Sizeless": {
          "Black": "PigWoodBlack",
          "Pink": "PigWoodPink"
        }
      },
      "Pigface Orc Halberd, Fantasy, TB25": {
        "Sizeless": {
          "Colorless": "PigfaceOrcHalberdFantasyTB25"
        }
      },
      "Polar Bear": {
        "Sizeless": {
          "Colorless": "PolarBear"
        }
      },
      "Premium Cow": {
        "Sizeless": {
          "Colorless": "PremiumCow"
        }
      },
      "Premium Fish": {
        "Sizeless": {
          "Colorless": "PremiumFish"
        }
      },
      "Premium Pink Pig": {
        "Sizeless": {
          "Colorless": "PremiumPinkPig"
        }
      },
      "Premium Sheep": {
        "Sizeless": {
          "Colorless": "PremiumSheep"
        }
      },
      "Puppy, Black lab": {
        "Sizeless": {
          "Colorless": "PuppyBlacklab"
        }
      },
      "Puppy, Bulldog": {
        "Sizeless": {
          "Colorless": "PuppyBulldog"
        }
      },
      "Puppy, Mutt": {
        "Sizeless": {
          "Colorless": "PuppyMutt"
        }
      },
      "Puppy, Poodle": {
        "Sizeless": {
          "Colorless": "PuppyPoodle"
        }
      },
      "Puppy, TB15": {
        "Sizeless": {
          "Black": "PuppyTB15Black",
          "Blue": "PuppyTB15Blue",
          "Green": "PuppyTB15Green",
          "Orange": "PuppyTB15Orange",
          "Purple": "PuppyTB15Purple",
          "Red": "PuppyTB15Red",
          "White": "PuppyTB15White",
          "Yellow": "PuppyTB15Yellow"
        }
      },
      "Puppy, Terrier": {
        "Sizeless": {
          "Colorless": "PuppyTerrier"
        }
      },
      "Puppy, Yellow lab": {
        "Sizeless": {
          "Colorless": "PuppyYellowlab"
        }
      },
      "Puppy, Yorkie": {
        "Sizeless": {
          "Colorless": "PuppyYorkie"
        }
      },
      "Rabbit": {
        "Sizeless": {
          "Purple": "RabbitPurple"
        }
      },
      "Rat, Acrylic": {
        "Sizeless": {
          "Colorless": "RatAcrylic"
        }
      },
      "Rhinoceros": {
        "Sizeless": {
          "Colorless": "Rhinoceros"
        }
      },
      "Rooster": {
        "Sizeless": {
          "Black": "RoosterBlack",
          "Blue": "RoosterBlue",
          "Green": "RoosterGreen",
          "Orange": "RoosterOrange",
          "Purple": "RoosterPurple",
          "Red": "RoosterRed",
          "White": "RoosterWhite",
          "Yellow": "RoosterYellow"
        }
      },
      "Sheep": {
        "Sizeless": {
          "Colorless": "Sheep"
        }
      },
      "Sheep, Random": {
        "Sizeless": {
          "Colorless": "SheepRandom"
        }
      },
      "Spider": {
        "Sizeless": {
          "Colorless": "Spider"
        }
      },
      "Spider Eggs": {
        "Sizeless": {
          "Colorless": "SpiderEggs"
        }
      }
    },
    "vehicle": {
      "Acrylic Train Track": {
        "Sizeless": {
          "Black": "AcrylicTrainTrackBlack",
          "Blue": "AcrylicTrainTrackBlue",
          "Green": "AcrylicTrainTrackGreen",
          "Orange": "AcrylicTrainTrackOrange",
          "Purple": "AcrylicTrainTrackPurple",
          "Red": "AcrylicTrainTrackRed",
          "White": "AcrylicTrainTrackWhite",
          "Yellow": "AcrylicTrainTrackYellow"
        }
      },
      "Acrylic Train, Box Car": {
        "Sizeless": {
          "Black": "AcrylicTrainBoxCarBlack",
          "Blue": "AcrylicTrainBoxCarBlue",
          "Green": "AcrylicTrainBoxCarGreen",
          "Orange": "AcrylicTrainBoxCarOrange",
          "Purple": "AcrylicTrainBoxCarPurple",
          "Red": "AcrylicTrainBoxCarRed",
          "White": "AcrylicTrainBoxCarWhite",
          "Yellow": "AcrylicTrainBoxCarYellow"
        }
      },
      "Acrylic Train, Caboose": {
        "Sizeless": {
          "Black": "AcrylicTrainCabooseBlack",
          "Blue": "AcrylicTrainCabooseBlue",
          "Green": "AcrylicTrainCabooseGreen",
          "Orange": "AcrylicTrainCabooseOrange",
          "Purple": "AcrylicTrainCaboosePurple",
          "Red": "AcrylicTrainCabooseRed",
          "White": "AcrylicTrainCabooseWhite",
          "Yellow": "AcrylicTrainCabooseYellow"
        }
      },
      "Acrylic Train, Coal Car": {
        "Sizeless": {
          "Black": "AcrylicTrainCoalCarBlack",
          "Blue": "AcrylicTrainCoalCarBlue",
          "Green": "AcrylicTrainCoalCarGreen",
          "Orange": "AcrylicTrainCoalCarOrange",
          "Purple": "AcrylicTrainCoalCarPurple",
          "Red": "AcrylicTrainCoalCarRed",
          "White": "AcrylicTrainCoalCarWhite",
          "Yellow": "AcrylicTrainCoalCarYellow"
        }
      },
      "Acrylic Train, Flat Bed": {
        "Sizeless": {
          "Black": "AcrylicTrainFlatBedBlack",
          "Blue": "AcrylicTrainFlatBedBlue",
          "Green": "AcrylicTrainFlatBedGreen",
          "Orange": "AcrylicTrainFlatBedOrange",
          "Purple": "AcrylicTrainFlatBedPurple",
          "Red": "AcrylicTrainFlatBedRed",
          "White": "AcrylicTrainFlatBedWhite",
          "Yellow": "AcrylicTrainFlatBedYellow"
        }
      },
      "Acrylic Train, Modern Engine": {
        "Sizeless": {
          "Black": "AcrylicTrainModernEngineBlack",
          "Blue": "AcrylicTrainModernEngineBlue",
          "Green": "AcrylicTrainModernEngineGreen",
          "Orange": "AcrylicTrainModernEngineOrange",
          "Purple": "AcrylicTrainModernEnginePurple",
          "Red": "AcrylicTrainModernEngineRed",
          "White": "AcrylicTrainModernEngineWhite",
          "Yellow": "AcrylicTrainModernEngineYellow"
        }
      },
      "Acrylic Train, Passenger Car": {
        "Sizeless": {
          "Black": "AcrylicTrainPassengerCarBlack",
          "Blue": "AcrylicTrainPassengerCarBlue",
          "Green": "AcrylicTrainPassengerCarGreen",
          "Orange": "AcrylicTrainPassengerCarOrange",
          "Purple": "AcrylicTrainPassengerCarPurple",
          "Red": "AcrylicTrainPassengerCarRed",
          "White": "AcrylicTrainPassengerCarWhite",
          "Yellow": "AcrylicTrainPassengerCarYellow"
        }
      },
      "Acrylic Train, Steam Engine": {
        "Sizeless": {
          "Black": "AcrylicTrainSteamEngineBlack",
          "Blue": "AcrylicTrainSteamEngineBlue",
          "Green": "AcrylicTrainSteamEngineGreen",
          "Orange": "AcrylicTrainSteamEngineOrange",
          "Purple": "AcrylicTrainSteamEnginePurple",
          "Red": "AcrylicTrainSteamEngineRed",
          "White": "AcrylicTrainSteamEngineWhite",
          "Yellow": "AcrylicTrainSteamEngineYellow"
        }
      },
      "Acrylic Train, Tank Car": {
        "Sizeless": {
          "Black": "AcrylicTrainTankCarBlack",
          "Blue": "AcrylicTrainTankCarBlue",
          "Green": "AcrylicTrainTankCarGreen",
          "Orange": "AcrylicTrainTankCarOrange",
          "Purple": "AcrylicTrainTankCarPurple",
          "Red": "AcrylicTrainTankCarRed",
          "White": "AcrylicTrainTankCarWhite",
          "Yellow": "AcrylicTrainTankCarYellow"
        }
      },
      "Airplane": {
        "Large": {
          "Black": "AirplaneLargeBlack",
          "Blue": "AirplaneLargeBlue",
          "Green": "AirplaneLargeGreen",
          "Orange": "AirplaneLargeOrange",
          "Purple": "AirplaneLargePurple",
          "Red": "AirplaneLargeRed",
          "White": "AirplaneLargeWhite",
          "Yellow": "AirplaneLargeYellow"
        },
        "Small": {
          "Black": "AirplaneSmallBlack",
          "Blue": "AirplaneSmallBlue",
          "Orange": "AirplaneSmallOrange",
          "Purple": "AirplaneSmallPurple",
          "Red": "AirplaneSmallRed",
          "White": "AirplaneSmallWhite",
          "Yellow": "AirplaneSmallYellow"
        }
      },
      "Bulldozer, Acrylic": {
        "Sizeless": {
          "Colorless": "BulldozerAcrylic"
        }
      },
      "Car": {
        "Sizeless": {
          "Black": "CarBlack",
          "Blue": "CarBlue",
          "Green": "CarGreen",
          "Orange": "CarOrange",
          "Purple": "CarPurple",
          "Red": "CarRed",
          "White": "CarWhite",
          "Yellow": "CarYellow"
        }
      },
      "Car, Muscle": {
        "Sizeless": {
          "Black": "CarMuscleBlack",
          "Blue": "CarMuscleBlue",
          "Green": "CarMuscleGreen",
          "Orange": "CarMuscleOrange",
          "Purple": "CarMusclePurple",
          "Red": "CarMuscleRed",
          "White": "CarMuscleWhite",
          "Yellow": "CarMuscleYellow"
        }
      },
      "Car, Race": {
        "Sizeless": {
          "Black": "CarRaceBlack",
          "Blue": "CarRaceBlue",
          "Green": "CarRaceGreen",
          "Orange": "CarRaceOrange",
          "Purple": "CarRacePurple",
          "Red": "CarRaceRed",
          "White": "CarRaceWhite",
          "Yellow": "CarRaceYellow"
        }
      },
      "Car, Sporty": {
        "Sizeless": {
          "Blue": "CarSportyBlue",
          "Yellow": "CarSportyYellow"
        }
      },
      "Car, Vintage Jalopy": {
        "Sizeless": {
          "Orange": "CarVintageJalopyOrange"
        }
      },
      "Car, Vintage Roadster": {
        "Sizeless": {
          "Yellow": "CarVintageRoadsterYellow"
        }
      },
      "Container Ship": {
        "Sizeless": {
          "Blue": "ContainerShipBlue",
          "Green": "ContainerShipGreen",
          "Gray": "ContainerShipGray",
          "Red": "ContainerShipRed",
          "Yellow": "ContainerShipYellow"
        }
      },
      "Fighter Ship, Set of": {
        "6": {
          "Colorless": "FighterShipSetof6"
        }
      },
      "Future Tank": {
        "Sizeless": {
          "Black": "FutureTankBlack",
          "Blue": "FutureTankBlue",
          "Green": "FutureTankGreen",
          "Orange": "FutureTankOrange",
          "Purple": "FutureTankPurple",
          "Red": "FutureTankRed",
          "White": "FutureTankWhite",
          "Yellow": "FutureTankYellow",
          "Tan": "FutureTankTan"
        }
      },
      "Helicopter, Acrylic": {
        "Sizeless": {
          "Colorless": "HelicopterAcrylic"
        }
      },
      "Hot Rod": {
        "Sizeless": {
          "Black": "HotRodBlack",
          "Blue": "HotRodBlue",
          "Green": "HotRodGreen",
          "Orange": "HotRodOrange",
          "Purple": "HotRodPurple",
          "Red": "HotRodRed",
          "White": "HotRodWhite",
          "Yellow": "HotRodYellow"
        }
      },
      "Limo": {
        "Sizeless": {
          "Blue": "LimoBlue",
          "Green": "LimoGreen",
          "Red": "LimoRed",
          "Yellow": "LimoYellow"
        }
      },
      "Locomotive Train Engine": {
        "Sizeless": {
          "Black": "LocomotiveTrainEngineBlack",
          "Green": "LocomotiveTrainEngineGreen",
          "Light Blue": "LocomotiveTrainEngineLightBlue",
          "Orange": "LocomotiveTrainEngineOrange",
          "Tan": "LocomotiveTrainEngineTan"
        }
      },
      "Locomotive": {
        "Sizeless": {
          "Black": "LocomotiveBlack",
          "Blue": "LocomotiveBlue",
          "Green": "LocomotiveGreen",
          "Orange": "LocomotiveOrange",
          "Purple": "LocomotivePurple",
          "Red": "LocomotiveRed",
          "White": "LocomotiveWhite",
          "Yellow": "LocomotiveYellow"
        }
      },
      "Motor Boat": {
        "Sizeless": {
          "Black": "MotorBoatBlack",
          "Blue": "MotorBoatBlue",
          "Green": "MotorBoatGreen",
          "Orange": "MotorBoatOrange",
          "Purple": "MotorBoatPurple",
          "Red": "MotorBoatRed",
          "White": "MotorBoatWhite",
          "Yellow": "MotorBoatYellow"
        }
      },
      "Motorcycle": {
        "Sizeless": {
          "Black": "MotorcycleBlack",
          "Blue": "MotorcycleBlue",
          "Green": "MotorcycleGreen",
          "Orange": "MotorcycleOrange",
          "Purple": "MotorcyclePurple",
          "Red": "MotorcycleRed",
          "White": "MotorcycleWhite",
          "Yellow": "MotorcycleYellow"
        }
      },
      "Muscle Car, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "MuscleCarPostApocalypse"
        }
      },
      "Push Cart": {
        "Sizeless": {
          "Black": "PushCartBlack",
          "Blue": "PushCartBlue",
          "Green": "PushCartGreen",
          "Orange": "PushCartOrange",
          "Purple": "PushCartPurple",
          "Red": "PushCartRed",
          "White": "PushCartWhite",
          "Yellow": "PushCartYellow"
        }
      },
      "Race Car": {
        "Sizeless": {
          "Black": "RaceCarBlack",
          "Blue": "RaceCarBlue",
          "Green": "RaceCarGreen",
          "Orange": "RaceCarOrange",
          "Purple": "RaceCarPurple",
          "Red": "RaceCarRed",
          "Yellow": "RaceCarYellow"
        }
      },
      "Rocket": {
        "Sizeless": {
          "Black": "RocketBlack",
          "Blue": "RocketBlue",
          "Green": "RocketGreen",
          "Orange": "RocketOrange",
          "Purple": "RocketPurple",
          "Red": "RocketRed",
          "White": "RocketWhite",
          "Yellow": "RocketYellow"
        }
      },
      "Sailboat": {
        "Sizeless": {
          "Black": "SailboatBlack",
          "Blue": "SailboatBlue",
          "Green": "SailboatGreen",
          "Orange": "SailboatOrange",
          "Purple": "SailboatPurple",
          "Red": "SailboatRed",
          "White": "SailboatWhite",
          "Yellow": "SailboatYellow"
        }
      },
      "Semi Truck, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "SemiTruckPostApocalypse"
        }
      },
      "Ship, Air, Steampunk": {
        "Sizeless": {
          "Black": "ShipAirSteampunkBlack",
          "Blue": "ShipAirSteampunkBlue",
          "Green": "ShipAirSteampunkGreen",
          "Orange": "ShipAirSteampunkOrange",
          "Purple": "ShipAirSteampunkPurple",
          "Red": "ShipAirSteampunkRed",
          "White": "ShipAirSteampunkWhite",
          "Yellow": "ShipAirSteampunkYellow"
        }
      },
      "Ship, Modern, Aircraft Carrier": {
        "Sizeless": {
          "Black": "ShipModernAircraftCarrierBlack",
          "Green": "ShipModernAircraftCarrierGreen",
          "Orange": "ShipModernAircraftCarrierOrange",
          "Purple": "ShipModernAircraftCarrierPurple",
          "White": "ShipModernAircraftCarrierWhite"
        }
      },
      "Ship, Modern, Battleship": {
        "Sizeless": {
          "Black": "ShipModernBattleshipBlack",
          "Green": "ShipModernBattleshipGreen",
          "Orange": "ShipModernBattleshipOrange",
          "Purple": "ShipModernBattleshipPurple",
          "White": "ShipModernBattleshipWhite"
        }
      },
      "Ship, Modern, Container": {
        "Sizeless": {
          "Black": "ShipModernContainerBlack",
          "Green": "ShipModernContainerGreen",
          "Orange": "ShipModernContainerOrange",
          "Purple": "ShipModernContainerPurple",
          "White": "ShipModernContainerWhite"
        }
      },
      "Ship, Modern, Cruiser": {
        "Sizeless": {
          "Black": "ShipModernCruiserBlack",
          "Green": "ShipModernCruiserGreen",
          "Orange": "ShipModernCruiserOrange",
          "Purple": "ShipModernCruiserPurple",
          "White": "ShipModernCruiserWhite"
        }
      },
      "Ship, Modern, Destroyer": {
        "Sizeless": {
          "Black": "ShipModernDestroyerBlack",
          "Green": "ShipModernDestroyerGreen",
          "Orange": "ShipModernDestroyerOrange",
          "Purple": "ShipModernDestroyerPurple",
          "White": "ShipModernDestroyerWhite"
        }
      },
      "Ship, Modern, Submarine": {
        "Sizeless": {
          "Black": "ShipModernSubmarineBlack",
          "Green": "ShipModernSubmarineGreen",
          "Orange": "ShipModernSubmarineOrange",
          "Purple": "ShipModernSubmarinePurple",
          "White": "ShipModernSubmarineWhite"
        }
      },
      "Ship, Modern, Transport": {
        "Sizeless": {
          "Black": "ShipModernTransportBlack",
          "Green": "ShipModernTransportGreen",
          "Orange": "ShipModernTransportOrange",
          "Purple": "ShipModernTransportPurple",
          "White": "ShipModernTransportWhite"
        }
      },
      "Ship, Sea, British": {
        "Sizeless": {
          "Black": "ShipSeaBritishBlack",
          "Blue": "ShipSeaBritishBlue",
          "Green": "ShipSeaBritishGreen",
          "Orange": "ShipSeaBritishOrange",
          "Purple": "ShipSeaBritishPurple",
          "Red": "ShipSeaBritishRed",
          "White": "ShipSeaBritishWhite",
          "Yellow": "ShipSeaBritishYellow"
        }
      },
      "Ship, Sea, Pirate": {
        "Sizeless": {
          "Black": "ShipSeaPirateBlack",
          "Blue": "ShipSeaPirateBlue",
          "Green": "ShipSeaPirateGreen",
          "Orange": "ShipSeaPirateOrange",
          "Purple": "ShipSeaPiratePurple",
          "Red": "ShipSeaPirateRed",
          "White": "ShipSeaPirateWhite",
          "Yellow": "ShipSeaPirateYellow"
        }
      },
      "Ship, Sea, Viking, Longboat": {
        "Sizeless": {
          "Black": "ShipSeaVikingLongboatBlack",
          "Blue": "ShipSeaVikingLongboatBlue",
          "Green": "ShipSeaVikingLongboatGreen",
          "Orange": "ShipSeaVikingLongboatOrange",
          "Purple": "ShipSeaVikingLongboatPurple",
          "Red": "ShipSeaVikingLongboatRed",
          "White": "ShipSeaVikingLongboatWhite",
          "Yellow": "ShipSeaVikingLongboatYellow"
        }
      },
      "Ship, Space, Fighter": {
        "Sizeless": {
          "Black": "ShipSpaceFighterBlack",
          "Blue": "ShipSpaceFighterBlue",
          "Green": "ShipSpaceFighterGreen",
          "Orange": "ShipSpaceFighterOrange",
          "Purple": "ShipSpaceFighterPurple",
          "Red": "ShipSpaceFighterRed",
          "White": "ShipSpaceFighterWhite",
          "Yellow": "ShipSpaceFighterYellow"
        }
      },
      "Ship, Space, Freighter": {
        "Sizeless": {
          "Black": "ShipSpaceFreighterBlack",
          "Blue": "ShipSpaceFreighterBlue",
          "Green": "ShipSpaceFreighterGreen",
          "Orange": "ShipSpaceFreighterOrange",
          "Purple": "ShipSpaceFreighterPurple",
          "Red": "ShipSpaceFreighterRed",
          "White": "ShipSpaceFreighterWhite",
          "Yellow": "ShipSpaceFreighterYellow"
        }
      },
      "Ship, Space, Smuggler": {
        "Sizeless": {
          "Black": "ShipSpaceSmugglerBlack",
          "Blue": "ShipSpaceSmugglerBlue",
          "Green": "ShipSpaceSmugglerGreen",
          "Orange": "ShipSpaceSmugglerOrange",
          "Purple": "ShipSpaceSmugglerPurple",
          "Red": "ShipSpaceSmugglerRed",
          "White": "ShipSpaceSmugglerWhite",
          "Yellow": "ShipSpaceSmugglerYellow"
        }
      },
      "Ship, Space, Transport": {
        "Sizeless": {
          "Black": "ShipSpaceTransportBlack",
          "Blue": "ShipSpaceTransportBlue",
          "Green": "ShipSpaceTransportGreen",
          "Orange": "ShipSpaceTransportOrange",
          "Purple": "ShipSpaceTransportPurple",
          "Red": "ShipSpaceTransportRed",
          "White": "ShipSpaceTransportWhite",
          "Yellow": "ShipSpaceTransportYellow"
        }
      },
      "Ship, Space, UFO": {
        "Sizeless": {
          "Black": "ShipSpaceUFOBlack",
          "Blue": "ShipSpaceUFOBlue",
          "Green": "ShipSpaceUFOGreen",
          "Orange": "ShipSpaceUFOOrange",
          "Purple": "ShipSpaceUFOPurple",
          "Red": "ShipSpaceUFORed",
          "Silver": "ShipSpaceUFOSilver",
          "White": "ShipSpaceUFOWhite",
          "Yellow": "ShipSpaceUFOYellow"
        }
      },
      "Sprue, Military, Beige": {
        "Sizeless": {
          "Colorless": "SprueMilitaryBeige"
        }
      },
      "Sprue, Military": {
        "Sizeless": {
          "Blue": "SprueMilitaryBlue",
          "Brown": "SprueMilitaryBrown",
          "Green": "SprueMilitaryGreen",
          "Gray": "SprueMilitaryGray",
          "Red": "SprueMilitaryRed"
        }
      },
      "Submarine": {
        "Sizeless": {
          "Black": "SubmarineBlack",
          "Blue": "SubmarineBlue",
          "Green": "SubmarineGreen",
          "Orange": "SubmarineOrange",
          "Purple": "SubmarinePurple",
          "Red": "SubmarineRed",
          "White": "SubmarineWhite",
          "Yellow": "SubmarineYellow"
        }
      },
      "SUV, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "SUVPostApocalypse"
        }
      },
      "Tank": {
        "Sizeless": {
          "Black": "TankBlack",
          "Blue": "TankBlue",
          "Brown": "TankBrown",
          "Green": "TankGreen",
          "Orange": "TankOrange",
          "Purple": "TankPurple",
          "Red": "TankRed",
          "White": "TankWhite",
          "Yellow": "TankYellow"
        }
      },
      "Tank, Clear": {
        "Sizeless": {
          "Colorless": "TankClear"
        }
      },
      "Tank, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "TankPostApocalypse"
        }
      },
      "Train Engine, Wood": {
        "Sizeless": {
          "Blue": "TrainEngineWoodBlue",
          "Orange": "TrainEngineWoodOrange",
          "Purple": "TrainEngineWoodPurple",
          "Red": "TrainEngineWoodRed",
          "White": "TrainEngineWoodWhite",
          "Yellow": "TrainEngineWoodYellow"
        }
      },
      "Transport Ship, Set of": {
        "6": {
          "Colorless": "TransportShipSetof6"
        }
      },
      "Truck, Flatbed": {
        "Sizeless": {
          "Black": "TruckFlatbedBlack",
          "Blue": "TruckFlatbedBlue",
          "Green": "TruckFlatbedGreen",
          "Orange": "TruckFlatbedOrange",
          "Purple": "TruckFlatbedPurple",
          "Red": "TruckFlatbedRed",
          "White": "TruckFlatbedWhite",
          "Yellow": "TruckFlatbedYellow"
        }
      },
      "Truck, Wood": {
        "Sizeless": {
          "Blue": "TruckWoodBlue",
          "Green": "TruckWoodGreen",
          "Gray": "TruckWoodGray",
          "Red": "TruckWoodRed",
          "Yellow": "TruckWoodYellow"
        }
      },
      "Van, Post Apocalypse": {
        "Sizeless": {
          "Colorless": "VanPostApocalypse"
        }
      }
    },
    "casino": {
      "Dealer Button": {
        "Sizeless": {
          "Colorless": "DealerButton"
        }
      },
      "Poker Chip, Fancy": {
        "19mm": {
          "Black": "PokerChip19mmFancyBlack",
          "Blue": "PokerChip19mmFancyBlue",
          "Green": "PokerChip19mmFancyGreen",
          "Purple": "PokerChip19mmFancyPurple",
          "Red": "PokerChip19mmFancyRed",
          "Yellow": "PokerChip19mmFancyYellow"
        }
      },
      "Poker Chip": {
        "Sizeless": {
          "Black": "PokerChipBlack",
          "Blue": "PokerChipBlue",
          "Green": "PokerChipGreen",
          "Light Blue": "PokerChipLightBlue",
          "Orange": "PokerChipOrange",
          "Purple": "PokerChipPurple",
          "Red": "PokerChipRed",
          "White": "PokerChipWhite",
          "Yellow": "PokerChipYellow"
        }
      },
      "Suits, Clubs": {
        "Sizeless": {
          "Colorless": "SuitsClubs"
        }
      },
      "Suits, Diamonds": {
        "Sizeless": {
          "Colorless": "SuitsDiamonds"
        }
      },
      "Suits, Hearts": {
        "Sizeless": {
          "Colorless": "SuitsHearts"
        }
      },
      "Suits, Spades": {
        "Sizeless": {
          "Colorless": "SuitsSpades"
        }
      },
      "Token Chip": {
        "Sizeless": {
          "Black": "TokenChipBlack",
          "Blue": "TokenChipBlue",
          "Green": "TokenChipGreen",
          "Orange": "TokenChipOrange",
          "Purple": "TokenChipPurple",
          "Red": "TokenChipRed",
          "White": "TokenChipWhite",
          "Yellow": "TokenChipYellow"
        }
      },
      "Token Chip, Indented": {
        "Sizeless": {
          "Orange": "TokenChipIndentedOrange"
        }
      }
    },
    "money": {
      "Blank Money, Play": {
        "Sizeless": {
          "Colorless": "BlankMoneyPlay"
        }
      },
      "Cash": {
        "1": {
          "Colorless": "Cash$1"
        },
        "5": {
          "Colorless": "Cash$5"
        },
        "10": {
          "Colorless": "Cash$10"
        },
        "20": {
          "Colorless": "Cash$20"
        },
        "50": {
          "Colorless": "Cash$50"
        },
        "100": {
          "Colorless": "Cash$100"
        },
        "500": {
          "Colorless": "Cash$500"
        },
        "100K": {
          "Colorless": "Cash$100K"
        },
        "10K": {
          "Colorless": "Cash$10K"
        },
        "1K": {
          "Colorless": "Cash$1K"
        },
        "1M": {
          "Colorless": "Cash$1M"
        },
        "500K": {
          "Colorless": "Cash$500K"
        },
        "50K": {
          "Colorless": "Cash$50K"
        },
        "5K": {
          "Colorless": "Cash$5K"
        }
      },
      "City Coin": {
        "1": {
          "Colorless": "CityCoin1"
        },
        "5": {
          "Colorless": "CityCoin5"
        }
      },
      "Coin, 50 points": {
        "Sizeless": {
          "Colorless": "Coin50points"
        }
      },
      "Coin, 5x": {
        "Sizeless": {
          "Colorless": "Coin5x"
        }
      },
      "Coin, Ancient Russian": {
        "22mm": {
          "Colorless": "CoinAncientRussian22mm"
        }
      },
      "Coin, Chinese": {
        "20mm": {
          "Colorless": "CoinChinese20mm"
        },
        "23mm": {
          "Colorless": "CoinChinese23mm"
        }
      },
      "Coin, Dime": {
        "Sizeless": {
          "Colorless": "CoinDime"
        }
      },
      "Coin, Dwarven": {
        "Sizeless": {
          "Colorless": "CoinDwarven"
        }
      },
      "Coin, Fantasy": {
        "1": {
          "Colorless": "CoinFantasy1"
        },
        "5": {
          "Colorless": "CoinFantasy5"
        },
        "10": {
          "Colorless": "CoinFantasy10"
        }
      },
      "Coin": {
        "Sizeless": {
          "Gold": "CoinGold",
          "Green": "CoinGreen",
          "Purple": "CoinPurple"
        }
      },
      "Coin, Half dollar": {
        "Sizeless": {
          "Colorless": "CoinHalfdollar"
        }
      },
      "Coin, Medieval": {
        "Sizeless": {
          "Bronze": "CoinMedievalBronze",
          "Gold": "CoinMedievalGold",
          "Silver": "CoinMedievalSilver"
        }
      },
      "Coin, Nickel": {
        "Sizeless": {
          "Colorless": "CoinNickel"
        }
      },
      "Coin, Penny": {
        "Sizeless": {
          "Colorless": "CoinPenny"
        }
      },
      "Coin, Pirate": {
        "35mm": {
          "Colorless": "CoinPirate35mm"
        }
      },
      "Coin, Quarter": {
        "Sizeless": {
          "Colorless": "CoinQuarter"
        }
      },
      "Coin, Roman": {
        "18mm": {
          "Colorless": "CoinRoman18mm"
        }
      },
      "Coin, Sacagawea Dollar": {
        "Sizeless": {
          "Colorless": "CoinSacagaweaDollar"
        }
      },
      "Coin, Timeless": {
        "1": {
          "Colorless": "CoinTimeless1"
        },
        "5": {
          "Colorless": "CoinTimeless5"
        },
        "10": {
          "Colorless": "CoinTimeless10"
        }
      },
      "Doubloon, Metal": {
        "Sizeless": {
          "Gold": "DoubloonMetalGold",
          "Silver": "DoubloonMetalSilver"
        }
      },
      "Doubloons": {
        "Sizeless": {
          "Colorless": "Doubloons"
        }
      },
      "Fantasy Coin": {
        "5": {
          "Colorless": "FantasyCoin5"
        },
        "20": {
          "Colorless": "FantasyCoin20"
        }
      },
      "Future Coin": {
        "1": {
          "Colorless": "FutureCoin1"
        },
        "5": {
          "Colorless": "FutureCoin5"
        }
      },
      "Medieval Coin": {
        "2": {
          "Colorless": "MedievalCoin2"
        },
        "20": {
          "Colorless": "MedievalCoin20"
        }
      },
      "Money Pack": {
        "Sizeless": {
          "Orange": "MoneyPackOrange",
          "Pink": "MoneyPackPink"
        }
      },
      "Old West Coin": {
        "Sizeless": {
          "Bronze": "OldWestCoinBronze",
          "Gold": "OldWestCoinGold",
          "Silver": "OldWestCoinSilver"
        }
      },
      "Sci-Fi Coin": {
        "Sizeless": {
          "Bronze": "Sci-FiCoinBronze",
          "Gold": "Sci-FiCoinGold",
          "Silver": "Sci-FiCoinSilver"
        }
      }
    },
    "utility": {
      "Card Stand": {
        "Sizeless": {
          "White": "CardStandWhite",
          "Black": "CardStandBlack",
          "Blue": "CardStandBlue",
          "Green": "CardStandGreen",
          "Red": "CardStandRed",
          "Yellow": "CardStandYellow"
        }
      },
      "Badge Holder w/String Lanyard (box of 100)": {
        "Sizeless": {
          "Colorless": "BadgeHolderw/StringLanyard(boxof100)"
        }
      },
      "Box Band, 6\"": {
        "Sizeless": {
          "Blue": "BoxBand6\"Blue",
          "Green": "BoxBand6\"Green",
          "Red": "BoxBand6\"Red"
        }
      },
      "Box Band, 8\"": {
        "Sizeless": {
          "Blue": "BoxBand8\"Blue",
          "Green": "BoxBand8\"Green",
          "Red": "BoxBand8\"Red"
        }
      },
      "Box Band, 9\"": {
        "Sizeless": {
          "Blue": "BoxBand9\"Blue",
          "Green": "BoxBand9\"Green",
          "Red": "BoxBand9\"Red"
        }
      },
      "Card Holder": {
        "Sizeless": {
          "Colorless": "CardHolder"
        }
      },
      "Character Stand": {
        "Sizeless": {
          "Blue": "CharacterStandBlue",
          "Green": "CharacterStandGreen",
          "Purple": "CharacterStandPurple",
          "Red": "CharacterStandRed",
          "Yellow": "CharacterStandYellow"
        }
      },
      "Character Stand, Clear": {
        "Sizeless": {
          "Colorless": "CharacterStandClear"
        }
      },
      "Decoder Strips": {
        "Sizeless": {
          "Colorless": "DecoderStrips"
        }
      },
      "Digital Timer": {
        "Sizeless": {
          "Colorless": "DigitalTimer"
        }
      },
      "Direction Finder, Transparent": {
        "Sizeless": {
          "Black": "DirectionFinderTransparentBlack"
        }
      },
      "Game Stand": {
        "Sizeless": {
          "Black": "GameStandBlack",
          "Blue": "GameStandBlue",
          "Green": "GameStandGreen",
          "Orange": "GameStandOrange",
          "Purple": "GameStandPurple",
          "Red": "GameStandRed",
          "White": "GameStandWhite",
          "Yellow": "GameStandYellow"
        }
      },
      "Magnifying Glass, 5X": {
        "Sizeless": {
          "Colorless": "MagnifyingGlass5X"
        }
      },
      "Marker, Dry-Erase, Fine": {
        "Sizeless": {
          "Black": "MarkerDry-EraseFineBlack",
          "Blue": "MarkerDry-EraseFineBlue",
          "Green": "MarkerDry-EraseFineGreen",
          "Red": "MarkerDry-EraseFineRed"
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
          "Black": "RivetBlack"
        }
      },
      "Rubber Bands": {
        "Sizeless": {
          "Colorless": "RubberBands"
        }
      },
      "Sand Timer, 10 Seconds": {
        "Sizeless": {
          "Colorless": "SandTimer10Seconds"
        }
      },
      "Sand Timer, 120 seconds": {
        "Sizeless": {
          "Colorless": "SandTimer120seconds"
        }
      },
      "Sand Timer, 180 seconds": {
        "Sizeless": {
          "Colorless": "SandTimer180seconds"
        }
      },
      "Sand Timer, 30 seconds": {
        "Sizeless": {
          "Colorless": "SandTimer30seconds"
        }
      },
      "Sand Timer, 60 seconds": {
        "Sizeless": {
          "Colorless": "SandTimer60seconds"
        }
      },
      "Sand Timer, 90 seconds": {
        "Sizeless": {
          "Colorless": "SandTimer90seconds"
        }
      },
      "Screw": {
        "6mm x 3mm": {
          "Black": "Screw6mmx3mmBlack"
        },
        "8mm x 5mm": {
          "Black": "Screw8mmx5mmBlack"
        }
      },
      "Sharpies": {
        "Sizeless": {
          "Colorless": "Sharpies"
        }
      },
      "Slider Clip": {
        "Sizeless": {
          "Black": "SliderClipBlack",
          "Blue": "SliderClipBlue",
          "Green": "SliderClipGreen",
          "Orange": "SliderClipOrange",
          "Purple": "SliderClipPurple",
          "Red": "SliderClipRed",
          "White": "SliderClipWhite",
          "Yellow": "SliderClipYellow"
        }
      },
      "Slider Clip, Chipboard": {
        "Sizeless": {
          "Black": "SliderClipChipboardBlack",
          "Blue": "SliderClipChipboardBlue",
          "Green": "SliderClipChipboardGreen",
          "Orange": "SliderClipChipboardOrange",
          "Purple": "SliderClipChipboardPurple",
          "Red": "SliderClipChipboardRed",
          "White": "SliderClipChipboardWhite",
          "Yellow": "SliderClipChipboardYellow"
        }
      },
      "Snap & Stack Condition Marker": {
        "Sizeless": {
          "Black": "Snap&StackConditionMarkerBlack",
          "Blue": "Snap&StackConditionMarkerBlue",
          "Green": "Snap&StackConditionMarkerGreen",
          "Pink": "Snap&StackConditionMarkerPink",
          "White": "Snap&StackConditionMarkerWhite",
          "Yellow": "Snap&StackConditionMarkerYellow"
        }
      },
      "Spinner": {
        "Sizeless": {
          "Black": "SpinnerBlack",
          "Red": "SpinnerRed",
          "White": "SpinnerWhite"
        }
      },
      "Tape Measure": {
        "Sizeless": {
          "Colorless": "TapeMeasure"
        }
      },
      "Tile Rack": {
        "Sizeless": {
          "Colorless": "TileRack"
        }
      },
      "Horizontal Game Master's Screen": {
        "Sizeless": {
          "Colorless": "HorizontalGameMaster'sScreen"
        }
      },
      "Stand, Chipboard, 4-way": {
        "Sizeless": {
          "Black": "StandChipboard4-wayBlack"
        }
      },
      "Vertical Game Master's Screen": {
        "Sizeless": {
          "Colorless": "VerticalGameMaster'sScreen"
        }
      }
    },
    "vial": {
      "Empty Vial": {
        "Sizeless": {
          "Colorless": "EmptyVial"
        }
      },
      "Fillable Vial": {
        "Sizeless": {
          "Colorless": "FillableVial"
        }
      },
      "Vial Liquid, Fluorescent": {
        "Sizeless": {
          "Blue": "VialLiquidFluorescentBlue",
          "Green": "VialLiquidFluorescentGreen",
          "Orange": "VialLiquidFluorescentOrange",
          "Red": "VialLiquidFluorescentRed",
          "Yellow": "VialLiquidFluorescentYellow"
        }
      },
      "Vial Liquid, Opaque": {
        "1": {
          "Blue": "VialLiquidOpaqueBlue1"
        },
        "2": {
          "Blue": "VialLiquidOpaqueBlue2"
        },
        "3": {
          "Blue": "VialLiquidOpaqueBlue3"
        },
        "Sizeless": {
          "Black": "VialLiquidOpaqueBlack",
          "Brown": "VialLiquidOpaqueBrown",
          "Gray": "VialLiquidOpaqueGray",
          "Green": "VialLiquidOpaqueGreen",
          "Ivory": "VialLiquidOpaqueIvory",
          "Orange": "VialLiquidOpaqueOrange",
          "Purple": "VialLiquidOpaquePurple",
          "Red": "VialLiquidOpaqueRed",
          "White": "VialLiquidOpaqueWhite",
          "Yellow": "VialLiquidOpaqueYellow"
        }
      },
      "Vial Liquid, Silver Mirror": {
        "Sizeless": {
          "Colorless": "VialLiquidSilverMirror"
        }
      },
      "Vial Liquid, Transparent": {
        "Sizeless": {
          "Black": "VialLiquidTransparentBlack",
          "Blue": "VialLiquidTransparentBlue",
          "Green": "VialLiquidTransparentGreen",
          "Orange": "VialLiquidTransparentOrange",
          "Purple": "VialLiquidTransparentPurple",
          "Red": "VialLiquidTransparentRed",
          "Yellow": "VialLiquidTransparentYellow"
        }
      }
    },
    "symbol": {
      "Atom Symbol": {
        "Sizeless": {
          "Colorless": "AtomSymbol"
        }
      },
      "Exclamation Mark": {
        "Sizeless": {
          "Colorless": "ExclamationMark"
        }
      },
      "Nuclear Symbol": {
        "Sizeless": {
          "Colorless": "NuclearSymbol"
        }
      },
      "Question Mark": {
        "Sizeless": {
          "Colorless": "QuestionMark"
        }
      },
      "Roman Numeral I": {
        "Sizeless": {
          "Black": "RomanNumeralIBlack",
          "Blue": "RomanNumeralIBlue",
          "Brown": "RomanNumeralIBrown",
          "Green": "RomanNumeralIGreen",
          "Red": "RomanNumeralIRed",
          "Yellow": "RomanNumeralIYellow"
        }
      },
      "Roman Numeral I, Grey": {
        "Large": {
          "Colorless": "RomanNumeralIGreyLarge"
        }
      },
      "Roman Numeral III": {
        "Sizeless": {
          "Yellow": "RomanNumeralIIIYellow"
        }
      },
      "Roman Numeral V": {
        "Sizeless": {
          "Green": "RomanNumeralVGreen",
          "Yellow": "RomanNumeralVYellow"
        }
      },
      "Universal No": {
        "Sizeless": {
          "Colorless": "UniversalNo"
        }
      },
      "Universal Yes": {
        "Sizeless": {
          "Colorless": "UniversalYes"
        }
      }
    },
    "bodypart": {
      "Bloody Remains": {
        "Sizeless": {
          "Colorless": "BloodyRemains"
        }
      },
      "Brain Organ": {
        "Sizeless": {
          "Pink": "BrainOrganPink"
        }
      },
      "Broken Heart": {
        "Sizeless": {
          "Colorless": "BrokenHeart"
        }
      },
      "Fist": {
        "Sizeless": {
          "Colorless": "Fist"
        }
      },
      "Foot": {
        "Sizeless": {
          "Brown": "FootBrown"
        }
      },
      "Heart Organ": {
        "Sizeless": {
          "Red": "HeartOrganRed"
        }
      },
      "Heart, Flat": {
        "Sizeless": {
          "Black": "HeartFlatBlack",
          "Blue": "HeartFlatBlue",
          "Green": "HeartFlatGreen",
          "Orange": "HeartFlatOrange",
          "Purple": "HeartFlatPurple",
          "Red": "HeartFlatRed",
          "White": "HeartFlatWhite",
          "Yellow": "HeartFlatYellow"
        }
      },
      "Heart, Wood": {
        "Sizeless": {
          "Red": "HeartWoodRed"
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
          "Colorless": "JewelClear"
        }
      },
      "Jewel": {
        "Sizeless": {
          "Yellow": "JewelYellow",
          "Green": "JewelGreen",
          "Blue": "JewelBlue",
          "Orange": "JewelOrange",
          "Purple": "JewelPurple",
          "Red": "JewelRed"
        }
      },
      "Acorn": {
        "Sizeless": {
          "Brown": "AcornBrown",
          "Yellow": "AcornYellow"
        }
      },
      "AK-47": {
        "Sizeless": {
          "Colorless": "AK-47"
        }
      },
      "Barrel": {
        "Sizeless": {
          "Colorless": "Barrel",
          "Wood": "BarrelWood"
        }
      },
      "Bolt": {
        "Sizeless": {
          "Colorless": "Bolt"
        }
      },
      "Bow and Arrow": {
        "Sizeless": {
          "Colorless": "BowandArrow"
        }
      },
      "Bowling Pin": {
        "Large": {
          "Black": "BowlingPinLargeBlack",
          "Blue": "BowlingPinLargeBlue",
          "Green": "BowlingPinLargeGreen",
          "Orange": "BowlingPinLargeOrange",
          "Purple": "BowlingPinLargePurple",
          "Red": "BowlingPinLargeRed",
          "White": "BowlingPinLargeWhite",
          "Yellow": "BowlingPinLargeYellow"
        },
        "Small": {
          "Black": "BowlingPinSmallBlack",
          "Blue": "BowlingPinSmallBlue",
          "Green": "BowlingPinSmallGreen",
          "Orange": "BowlingPinSmallOrange",
          "Purple": "BowlingPinSmallPurple",
          "Red": "BowlingPinSmallRed",
          "White": "BowlingPinSmallWhite",
          "Yellow": "BowlingPinSmallYellow"
        }
      },
      "Bowling Pin, Clear": {
        "Large": {
          "Colorless": "BowlingPinLargeClear"
        }
      },
      "Bread Basket": {
        "Sizeless": {
          "Colorless": "BreadBasket"
        }
      },
      "Bread, Wood": {
        "Sizeless": {
          "Dark Brown": "BreadWoodDarkBrown",
          "Light Brown": "BreadWoodLightBrown"
        }
      },
      "Brick Tower": {
        "Sizeless": {
          "Gray": "BrickTowerGray"
        }
      },
      "Brick, Wood, 2 Holes": {
        "Sizeless": {
          "Red": "BrickWood2HolesRed"
        }
      },
      "Brick": {
        "Large": {
          "Wood": "BrickWoodLarge"
        }
      },
      "Brick, Wood": {
        "Sizeless": {
          "Red": "BrickWoodRed"
        }
      },
      "Buddha": {
        "Sizeless": {
          "Colorless": "Buddha"
        }
      },
      "Bullet": {
        "Sizeless": {
          "Gray": "BulletGray"
        }
      },
      "Button": {
        "Large": {
          "Blue": "ButtonLargeBlue",
          "Green": "ButtonLargeGreen",
          "Gray": "ButtonLargeGray",
          "Pink": "ButtonLargePink",
          "Yellow": "ButtonLargeYellow"
        },
        "Sizeless": {
          "Purple": "ButtonPurple",
          "White": "ButtonWhite",
          "Yellow": "ButtonYellow"
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
          "Colorless": "CheeseWedge"
        }
      },
      "Chest": {
        "Sizeless": {
          "Blue": "ChestBlue",
          "Bronze": "ChestBronze",
          "Green": "ChestGreen",
          "Gray": "ChestGray",
          "Red": "ChestRed"
        }
      },
      "Chevron": {
        "20mm": {
          "Black": "Chevron20mmBlack",
          "Blue": "Chevron20mmBlue",
          "Green": "Chevron20mmGreen",
          "Orange": "Chevron20mmOrange",
          "Purple": "Chevron20mmPurple",
          "Red": "Chevron20mmRed",
          "White": "Chevron20mmWhite",
          "Yellow": "Chevron20mmYellow"
        },
        "8mm": {
          "Black": "Chevron8mmBlack",
          "Blue": "Chevron8mmBlue",
          "Green": "Chevron8mmGreen",
          "Orange": "Chevron8mmOrange",
          "Purple": "Chevron8mmPurple",
          "Red": "Chevron8mmRed",
          "White": "Chevron8mmWhite",
          "Yellow": "Chevron8mmYellow"
        }
      },
      "Clay": {
        "Sizeless": {
          "Wood": "ClayWood"
        }
      },
      "Coal": {
        "Sizeless": {
          "Wood": "CoalWood"
        }
      },
      "Cobalt": {
        "Sizeless": {
          "Wood": "CobaltWood"
        }
      },
      "Crate": {
        "Sizeless": {
          "Colorless": "Crate"
        }
      },
      "Crescent Wrench": {
        "Sizeless": {
          "Colorless": "CrescentWrench"
        }
      },
      "Crown": {
        "Sizeless": {
          "Colorless": "Crown"
        }
      },
      "Crystal, Opaque": {
        "Sizeless": {
          "Black": "CrystalOpaqueBlack",
          "Gold": "CrystalOpaqueGold",
          "Silver": "CrystalOpaqueSilver",
          "White": "CrystalOpaqueWhite"
        }
      },
      "Crystal, Transparent": {
        "Sizeless": {
          "Black": "CrystalTransparentBlack",
          "Blue": "CrystalTransparentBlue",
          "Green": "CrystalTransparentGreen",
          "Orange": "CrystalTransparentOrange",
          "Purple": "CrystalTransparentPurple",
          "Red": "CrystalTransparentRed",
          "White": "CrystalTransparentWhite",
          "Yellow": "CrystalTransparentYellow"
        }
      },
      "Crystal, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "CrystalTransparentClear"
        }
      },
      "Drop": {
        "Sizeless": {
          "Black": "DropBlack",
          "Blue": "DropBlue",
          "Green": "DropGreen",
          "Orange": "DropOrange",
          "Purple": "DropPurple",
          "Red": "DropRed",
          "White": "DropWhite",
          "Yellow": "DropYellow"
        }
      },
      "Drumstick": {
        "Sizeless": {
          "Orange": "DrumstickOrange"
        }
      },
      "Egg": {
        "Sizeless": {
          "Blue": "EggBlue",
          "Green": "EggGreen",
          "Natural": "EggNatural",
          "Purple": "EggPurple",
          "Rose": "EggRose",
          "White": "EggWhite"
        }
      },
      "Empty Bottle": {
        "Sizeless": {
          "Colorless": "EmptyBottle"
        }
      },
      "Fang": {
        "Sizeless": {
          "Colorless": "Fang"
        }
      },
      "Fire Axe": {
        "Sizeless": {
          "Colorless": "FireAxe"
        }
      },
      "Flag": {
        "Sizeless": {
          "Black": "FlagBlack",
          "Blue": "FlagBlue",
          "Green": "FlagGreen",
          "Orange": "FlagOrange",
          "Purple": "FlagPurple",
          "Red": "FlagRed",
          "White": "FlagWhite",
          "Yellow": "FlagYellow"
        }
      },
      "Flame Base, Logs": {
        "Sizeless": {
          "Colorless": "FlameBaseLogs"
        }
      },
      "Flame Base, Smoke": {
        "Sizeless": {
          "Colorless": "FlameBaseSmoke"
        }
      },
      "Flame, Free-Standing": {
        "Sizeless": {
          "Colorless": "FlameFree-Standing"
        }
      },
      "Flat Star": {
        "Sizeless": {
          "Black": "FlatStarBlack",
          "Blue": "FlatStarBlue",
          "Green": "FlatStarGreen",
          "Orange": "FlatStarOrange",
          "Purple": "FlatStarPurple",
          "Red": "FlatStarRed",
          "White": "FlatStarWhite",
          "Yellow": "FlatStarYellow"
        }
      },
      "Frag Grenade": {
        "Sizeless": {
          "Colorless": "FragGrenade"
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
          "Bronze": "GearBronze",
          "Gold": "GearGold",
          "Silver": "GearSilver"
        }
      },
      "Gem": {
        "Sizeless": {
          "Black": "GemBlack",
          "Blue": "GemBlue",
          "Green": "GemGreen",
          "Light Green": "GemLightGreen",
          "Orange": "GemOrange",
          "Purple": "GemPurple",
          "Red": "GemRed",
          "White": "GemWhite",
          "Yellow": "GemYellow"
        }
      },
      "Gem, Clear": {
        "Sizeless": {
          "Colorless": "GemClear"
        }
      },
      "Grain Sack": {
        "Sizeless": {
          "Wood": "GrainSackWood"
        }
      },
      "Handmade Carrot": {
        "Sizeless": {
          "Colorless": "HandmadeCarrot"
        }
      },
      "Handmade Steak": {
        "Sizeless": {
          "Colorless": "HandmadeSteak"
        }
      },
      "Herb": {
        "Sizeless": {
          "Black": "HerbBlack",
          "Blue": "HerbBlue",
          "Green": "HerbGreen",
          "Orange": "HerbOrange",
          "Purple": "HerbPurple",
          "Red": "HerbRed",
          "White": "HerbWhite",
          "Yellow": "HerbYellow"
        }
      },
      "Hex Nut": {
        "Sizeless": {
          "Colorless": "HexNut"
        }
      },
      "Hex Stacker": {
        "Sizeless": {
          "Black": "HexStackerBlack",
          "Blue": "HexStackerBlue",
          "Green": "HexStackerGreen",
          "Orange": "HexStackerOrange",
          "Purple": "HexStackerPurple",
          "Red": "HexStackerRed",
          "White": "HexStackerWhite",
          "Yellow": "HexStackerYellow"
        }
      },
      "Hexbox": {
        "20mm": {
          "Blue": "Hexbox20mmBlue",
          "Dark Red": "Hexbox20mmDarkRed",
          "Mustard": "Hexbox20mmMustard"
        }
      },
      "I-Beam": {
        "Sizeless": {
          "Colorless": "I-Beam"
        }
      },
      "Ingot, Wood, Aluminum": {
        "Sizeless": {
          "Colorless": "IngotWoodAluminum"
        }
      },
      "Ingot, Wood, Brass": {
        "Sizeless": {
          "Colorless": "IngotWoodBrass"
        }
      },
      "Ingot, Wood, Cobalt": {
        "Sizeless": {
          "Colorless": "IngotWoodCobalt"
        }
      },
      "Ingot, Wood": {
        "Sizeless": {
          "Copper": "IngotWoodCopper",
          "Gold": "IngotWoodGold",
          "Silver": "IngotWoodSilver"
        }
      },
      "Ingot, Wood, Iron": {
        "Sizeless": {
          "Colorless": "IngotWoodIron"
        }
      },
      "Ingot, Wood, Steel": {
        "Sizeless": {
          "Colorless": "IngotWoodSteel"
        }
      },
      "Joystick": {
        "Sizeless": {
          "Black": "JoystickBlack",
          "Blue": "JoystickBlue",
          "Green": "JoystickGreen",
          "Orange": "JoystickOrange",
          "Purple": "JoystickPurple",
          "Red": "JoystickRed",
          "White": "JoystickWhite",
          "Yellow": "JoystickYellow"
        }
      },
      "Joystick, Headless": {
        "Sizeless": {
          "Black": "JoystickHeadlessBlack"
        }
      },
      "Keycard, Fluorescent": {
        "Sizeless": {
          "Blue": "KeycardFluorescentBlue",
          "Green": "KeycardFluorescentGreen",
          "Red": "KeycardFluorescentRed",
          "Yellow": "KeycardFluorescentYellow"
        }
      },
      "Star": {
        "Large": {
          "Gold": "LargeStarGold"
        }
      },
      "Leather": {
        "Sizeless": {
          "Black": "LeatherBlack",
          "Brown": "LeatherBrown",
          "White": "LeatherWhite"
        }
      },
      "Light Bulb": {
        "Sizeless": {
          "Blue": "LightBulbBlue",
          "Gold": "LightBulbGold",
          "Green": "LightBulbGreen",
          "Salmon": "LightBulbSalmon",
          "Taupe": "LightBulbTaupe"
        }
      },
      "Lightning Bolt": {
        "Sizeless": {
          "Black": "LightningBoltBlack",
          "Blue": "LightningBoltBlue",
          "Green": "LightningBoltGreen",
          "Orange": "LightningBoltOrange",
          "Purple": "LightningBoltPurple",
          "Red": "LightningBoltRed",
          "White": "LightningBoltWhite",
          "Yellow": "LightningBoltYellow"
        },
        "Large": {
          "Orange": "LightningBoltLargeOrange"
        }
      },
      "Mushroom Cloud": {
        "Sizeless": {
          "Colorless": "MushroomCloud"
        }
      },
      "Octbox": {
        "10mm": {
          "Black": "Octbox10mmBlack",
          "Blue": "Octbox10mmBlue",
          "Green": "Octbox10mmGreen",
          "Orange": "Octbox10mmOrange",
          "Purple": "Octbox10mmPurple",
          "Red": "Octbox10mmRed",
          "White": "Octbox10mmWhite",
          "Yellow": "Octbox10mmYellow"
        },
        "10mm x 7mm": {
          "Blue": "Octbox7mmBlue",
          "Gray": "Octbox7mmGray",
          "Purple": "Octbox7mmPurple"
        },
        "7mm": {
          "Yellow": "Octbox7mmYellow"
        }
      },
      "Oil Barrel": {
        "Sizeless": {
          "Colorless": "OilBarrel"
        }
      },
      "Oil Drum, Wood": {
        "Sizeless": {
          "Blue": "OilDrumWoodBlue"
        }
      },
      "Padlock Key": {
        "Sizeless": {
          "Black": "PadlockKeyBlack",
          "Blue": "PadlockKeyBlue",
          "Green": "PadlockKeyGreen",
          "Orange": "PadlockKeyOrange",
          "Purple": "PadlockKeyPurple",
          "Red": "PadlockKeyRed",
          "White": "PadlockKeyWhite",
          "Yellow": "PadlockKeyYellow"
        }
      },
      "Padlock, Locked": {
        "Sizeless": {
          "Black": "PadlockLockedBlack",
          "Blue": "PadlockLockedBlue",
          "Green": "PadlockLockedGreen",
          "Orange": "PadlockLockedOrange",
          "Purple": "PadlockLockedPurple",
          "Red": "PadlockLockedRed",
          "White": "PadlockLockedWhite",
          "Yellow": "PadlockLockedYellow"
        }
      },
      "Padlock, Unlocked": {
        "Sizeless": {
          "Black": "PadlockUnlockedBlack",
          "Blue": "PadlockUnlockedBlue",
          "Green": "PadlockUnlockedGreen",
          "Orange": "PadlockUnlockedOrange",
          "Purple": "PadlockUnlockedPurple",
          "Red": "PadlockUnlockedRed",
          "White": "PadlockUnlockedWhite",
          "Yellow": "PadlockUnlockedYellow"
        }
      },
      "Premium Bread": {
        "Sizeless": {
          "Colorless": "PremiumBread"
        }
      },
      "Premium Steak": {
        "Sizeless": {
          "Colorless": "PremiumSteak"
        }
      },
      "Pumpkin": {
        "Sizeless": {
          "Wood": "PumpkinWood"
        }
      },
      "Radiation Mask": {
        "Sizeless": {
          "Colorless": "RadiationMask"
        }
      },
      "Ring": {
        "Sizeless": {
          "Black": "RingBlack",
          "Blue": "RingBlue",
          "Green": "RingGreen",
          "Orange": "RingOrange",
          "Purple": "RingPurple",
          "Red": "RingRed",
          "White": "RingWhite",
          "Yellow": "RingYellow"
        }
      },
      "Rope Coil": {
        "Sizeless": {
          "Colorless": "RopeCoil"
        }
      },
      "Sack": {
        "Sizeless": {
          "Gold": "SackGold"
        }
      },
      "Sake": {
        "Sizeless": {
          "Colorless": "Sake"
        }
      },
      "Sheriff Badge": {
        "Sizeless": {
          "Gold": "SheriffBadgeGold",
          "Silver": "SheriffBadgeSilver"
        }
      },
      "Shotgun": {
        "Sizeless": {
          "Colorless": "Shotgun"
        }
      },
      "Stacker Cone": {
        "Sizeless": {
          "Black": "StackerConeBlack",
          "Blue": "StackerConeBlue",
          "Green": "StackerConeGreen",
          "Orange": "StackerConeOrange",
          "Purple": "StackerConePurple",
          "Red": "StackerConeRed",
          "White": "StackerConeWhite",
          "Yellow": "StackerConeYellow"
        }
      },
      "Stacker": {
        "19mm": {
          "Black": "Stacker19mmBlack",
          "Blue": "Stacker19mmBlue",
          "Green": "Stacker19mmGreen",
          "Orange": "Stacker19mmOrange",
          "Purple": "Stacker19mmPurple",
          "Red": "Stacker19mmRed",
          "White": "Stacker19mmWhite",
          "Yellow": "Stacker19mmYellow"
        },
        "Sizeless": {
          "Black": "StackerBlack",
          "Blue": "StackerBlue",
          "Green": "StackerGreen",
          "Orange": "StackerOrange",
          "Purple": "StackerPurple",
          "Red": "StackerRed",
          "White": "StackerWhite",
          "Yellow": "StackerYellow"
        }
      },
      "Star, Wood": {
        "Sizeless": {
          "Black": "StarWoodBlack",
          "Green": "StarWoodGreen",
          "Purple": "StarWoodPurple",
          "Red": "StarWoodRed"
        }
      },
      "Stick, Acrylic, Opaque": {
        "Sizeless": {
          "Black": "StickAcrylicOpaqueBlack",
          "Gold": "StickAcrylicOpaqueGold",
          "Silver": "StickAcrylicOpaqueSilver",
          "White": "StickAcrylicOpaqueWhite"
        }
      },
      "Stick, Acrylic, Transparent": {
        "Sizeless": {
          "Black": "StickAcrylicTransparentBlack",
          "Blue": "StickAcrylicTransparentBlue",
          "Green": "StickAcrylicTransparentGreen",
          "orange": "StickAcrylicTransparentorange",
          "Purple": "StickAcrylicTransparentPurple",
          "Red": "StickAcrylicTransparentRed",
          "White": "StickAcrylicTransparentWhite",
          "Yellow": "StickAcrylicTransparentYellow"
        }
      },
      "Stick, Acrylic, Transparent, Clear": {
        "Sizeless": {
          "Colorless": "StickAcrylicTransparentClear"
        }
      },
      "Stick, Wood": {
        "Sizeless": {
          "Black": "StickWoodBlack",
          "Blue": "StickWoodBlue",
          "Green": "StickWoodGreen",
          "Orange": "StickWoodOrange",
          "Purple": "StickWoodPurple",
          "Red": "StickWoodRed",
          "White": "StickWoodWhite",
          "Yellow": "StickWoodYellow"
        }
      },
      "Stone Arrowhead": {
        "Sizeless": {
          "Colorless": "StoneArrowhead"
        }
      },
      "Stone": {
        "Sizeless": {
          "Wood": "StoneWood"
        }
      },
      "Sword": {
        "Sizeless": {
          "Colorless": "Sword"
        }
      },
      "Tablet, Stone": {
        "Sizeless": {
          "Colorless": "TabletStone"
        }
      },
      "Tactical Knife": {
        "Sizeless": {
          "Colorless": "TacticalKnife"
        }
      },
      "Thimble ": {
        "Sizeless": {
          "Colorless": "Thimble"
        }
      },
      "Thin Star": {
        "Sizeless": {
          "Gray": "ThinStarGray"
        }
      },
      "Triangle": {
        "Sizeless": {
          "Black": "TriangleBlack",
          "Blue": "TriangleBlue",
          "Green": "TriangleGreen",
          "Pink": "TrianglePink"
        }
      },
      "Triangle, Hollow": {
        "Sizeless": {
          "Colorless": "TriangleHollow"
        }
      },
      "Wood Logs": {
        "Sizeless": {
          "Colorless": "WoodLogs"
        }
      },
      "Wood Pile": {
        "Sizeless": {
          "Colorless": "WoodPile"
        }
      },
      "D6, Alchemy": {
        "Sizeless": {
          "Orange": "D6AlchemyOrange"
        }
      },
      "D6, Damage": {
        "Sizeless": {
          "Black": "D6DamageBlack"
        }
      },
      "D6, Industry": {
        "Sizeless": {
          "Gray": "D6IndustryGray"
        }
      },
      "D6, Nature": {
        "Sizeless": {
          "Green": "D6NatureGreen"
        }
      },
      "D6, Oxygen": {
        "Sizeless": {
          "Blue": "D6OxygenBlue"
        }
      },
      "D6, Temperature": {
        "Sizeless": {
          "Red": "D6TemperatureRed"
        }
      },
      "LED": {
        "Sizeless": {
          "Black": "LEDBlack",
          "Blue": "LEDBlue",
          "Green": "LEDGreen",
          "Orange": "LEDOrange",
          "Purple": "LEDPurple",
          "Red": "LEDRed",
          "White": "LEDWhite",
          "Yellow": "LEDYellow"
        }
      },
      "Premium Carrot": {
        "Sizeless": {
          "Colorless": "PremiumCarrot"
        }
      },
      "Premium Cheese Wedge": {
        "Sizeless": {
          "Colorless": "PremiumCheeseWedge"
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
          "Black": "ChessSetHalfBlack",
          "Blue": "ChessSetHalfBlue",
          "Green": "ChessSetHalfGreen",
          "Orange": "ChessSetHalfOrange",
          "Purple": "ChessSetHalfPurple",
          "Red": "ChessSetHalfRed",
          "White": "ChessSetHalfWhite",
          "Yellow": "ChessSetHalfYellow"
        }
      },
      "Cog's 2024 Calendar": {
        "Sizeless": {
          "Colorless": "Cog's2024Calendar"
        }
      },
      "deadEarth Player's Handbook": {
        "Sizeless": {
          "Colorless": "deadEarthPlayer'sHandbook"
        }
      },
      "Designers Table Cover": {
        "Sizeless": {
          "Colorless": "DesignersTableCover"
        }
      },
      "Dominoes": {
        "Small": {
          "Colorless": "DominoesSmall"
        }
      },
      "Dynamite": {
        "Sizeless": {
          "Colorless": "Dynamite"
        }
      },
      "Electricity Symbol": {
        "Sizeless": {
          "Green": "ElectricitySymbolGreen"
        }
      },
      "Explorer, Set of 3 (Assorted Colors)": {
        "Sizeless": {
          "Colorless": "ExplorerSetof3(AssortedColors)"
        }
      },
      "Fail Faster Playtesting Journal": {
        "Sizeless": {
          "Colorless": "FailFasterPlaytestingJournal"
        }
      },
      "Figures, Missionary, Set of": {
        "5": {
          "Colorless": "FiguresMissionarySetof5"
        }
      },
      "Figures, Sci-Fi, Set of": {
        "10": {
          "Colorless": "FiguresSci-FiSetof10"
        }
      },
      "Figures, Soldier, Set of": {
        "5": {
          "Colorless": "FiguresSoldierSetof5"
        }
      },
      "Figures, Steampunk, Set of": {
        "14": {
          "Colorless": "FiguresSteampunkSetof14"
        }
      },
      "Galley Longship": {
        "Sizeless": {
          "Green": "GalleyLongshipGreen"
        }
      },
      "Game Master's Screen": {
        "Sizeless": {
          "Colorless": "GameMaster'sScreen"
        }
      },
      "Gift Certificate": {
        "5": {
          "Colorless": "GiftCertificate$5"
        },
        "25": {
          "Colorless": "GiftCertificate$25"
        }
      },
      "Glue Dots Sheet": {
        "Sizeless": {
          "Colorless": "GlueDotsSheet"
        }
      },
      "Landmark Base": {
        "Sizeless": {
          "Colorless": "LandmarkBase"
        }
      },
      "Male Farmer": {
        "Sizeless": {
          "Purple": "MaleFarmerPurple"
        }
      },
      "Mini Storage Box": {
        "Sizeless": {
          "Purple": "MiniStorageBoxPurple"
        }
      },
      "Musketeer": {
        "Sizeless": {
          "Colorless": "Musketeer"
        }
      },
      "Pernicious Puzzle #1": {
        "Sizeless": {
          "Colorless": "PerniciousPuzzle#1"
        }
      },
      "Sheet of 1\" Gold Scratch Off Circle Stickers": {
        "Sizeless": {
          "Colorless": "Sheetof1\"GoldScratchOffCircleStickers"
        }
      },
      "Sheet of 1\" Silver Scratch Off Circle Stickers": {
        "Sizeless": {
          "Colorless": "Sheetof1\"SilverScratchOffCircleStickers"
        }
      },
      "Sheet of Rectangle Scratch Off Sitckers": {
        "Sizeless": {
          "Colorless": "SheetofRectangleScratchOffSitckers"
        }
      },
      "Space Ranger Guns": {
        "Sizeless": {
          "Colorless": "SpaceRangerGuns"
        }
      },
      "Space Ranger II w/ Armament": {
        "Sizeless": {
          "Colorless": "SpaceRangerIIw/Armament"
        }
      },
      "Space Ranger w/ Armament": {
        "Sizeless": {
          "Colorless": "SpaceRangerw/Armament"
        }
      },
      "Sprue, Ages, Beige": {
        "Sizeless": {
          "Colorless": "SprueAgesBeige"
        }
      },
      "Sprue, Ages": {
        "Sizeless": {
          "Black": "SprueAgesBlack",
          "Purple": "SprueAgesPurple",
          "Tan": "SprueAgesTan",
          "Yellow": "SprueAgesYellow"
        }
      },
      "Sprue, Civil War Horse": {
        "Sizeless": {
          "Black": "SprueCivilWarHorseBlack",
          "Brown": "SprueCivilWarHorseBrown"
        }
      },
      "Sprue, Civil War Military": {
        "Sizeless": {
          "Blue": "SprueCivilWarMilitaryBlue",
          "Gray": "SprueCivilWarMilitaryGray",
          "Red": "SprueCivilWarMilitaryRed"
        }
      },
      "Sprue, Civil War Military, Lt": {
        "Sizeless": {
          "Blue": "SprueCivilWarMilitaryLtBlue"
        }
      },
      "Sprue, Civilization": {
        "Sizeless": {
          "Blue": "SprueCivilizationBlue",
          "Green": "SprueCivilizationGreen",
          "Gray": "SprueCivilizationGray",
          "Purple": "SprueCivilizationPurple",
          "Yellow": "SprueCivilizationYellow"
        }
      },
      "Sprue, Egypt Myth": {
        "Sizeless": {
          "Brown": "SprueEgyptMythBrown"
        }
      },
      "Sprue, Norse Myth, Dk": {
        "Sizeless": {
          "Blue": "SprueNorseMythDkBlue"
        }
      },
      "Sprue, Norse Myth, Lt": {
        "Sizeless": {
          "Blue": "SprueNorseMythLtBlue"
        }
      },
      "Sprue, Norse Myth, Med": {
        "Sizeless": {
          "Blue": "SprueNorseMythMedBlue"
        }
      },
      "Stake Bed Truck": {
        "Sizeless": {
          "Black": "StakeBedTruckBlack"
        }
      },
      "Standee, TGC": {
        "Sizeless": {
          "Colorless": "StandeeTGC"
        }
      },
      "TCID Lockdown Minimum Security Promo Pack": {
        "Sizeless": {
          "Colorless": "TCIDLockdownMinimumSecurityPromoPack"
        }
      },
      "TGC Follies - Shamrock Pack": {
        "Sizeless": {
          "Colorless": "TGCFollies-ShamrockPack"
        }
      },
      "Woman, High Society": {
        "Sizeless": {
          "Colorless": "WomanHighSociety"
        }
      },
      "Black 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Black7PieceDiceSet"
        }
      },
      "Blue 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Blue7PieceDiceSet"
        }
      },
      "Green 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Green7PieceDiceSet"
        }
      },
      "InFUNity Tile, Hat": {
        "Sizeless": {
          "Black": "InFUNityTileHatBlack",
          "Blue": "InFUNityTileHatBlue",
          "Green": "InFUNityTileHatGreen",
          "Orange": "InFUNityTileHatOrange",
          "Purple": "InFUNityTileHatPurple",
          "Red": "InFUNityTileHatRed",
          "White": "InFUNityTileHatWhite",
          "Yellow": "InFUNityTileHatYellow"
        }
      },
      "InFUNity Tile, Turtle": {
        "Sizeless": {
          "Black": "InFUNityTileTurtleBlack",
          "Blue": "InFUNityTileTurtleBlue",
          "Green": "InFUNityTileTurtleGreen",
          "Orange": "InFUNityTileTurtleOrange",
          "Purple": "InFUNityTileTurtlePurple",
          "Red": "InFUNityTileTurtleRed",
          "White": "InFUNityTileTurtleWhite",
          "Yellow": "InFUNityTileTurtleYellow"
        }
      },
      "Orange 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Orange7PieceDiceSet"
        }
      },
      "Phase Shift Games | Boblin's Rebellion | 1-4 players": {
        "Sizeless": {
          "Colorless": "PhaseShiftGames|Boblin'sRebellion|1-4players"
        }
      },
      "Phase Shift Games | Flutter | 2-5 players": {
        "Sizeless": {
          "Colorless": "PhaseShiftGames|Flutter|2-5players"
        }
      },
      "Phase Shift Games | Obelus | 2 players": {
        "Sizeless": {
          "Colorless": "PhaseShiftGames|Obelus|2players"
        }
      },
      "Purple 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Purple7PieceDiceSet"
        }
      },
      "Red 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Red7PieceDiceSet"
        }
      },
      "White 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "White7PieceDiceSet"
        }
      },
      "Yellow 7 Piece Dice Set": {
        "Sizeless": {
          "Colorless": "Yellow7PieceDiceSet"
        }
      }
    }
  },
  "CUSTOM": {
    "packaging": {
      "Mint Tin": {
        "Sizeless": {
          "Colorless": "MintTin"
        },
        "Tall": {
          "Colorless": "TallMintTin"
        }
      },
      "Stout Box": {
        "Small": {
          "Colorless": "SmallStoutBox"
        },
        "Medium": {
          "Colorless": "MediumStoutBox"
        },
        "Large": {
          "Colorless": "LargeStoutBox"
        }
      },
      "Poker Booster": {
        "Sizeless": {
          "Colorless": "PokerBooster"
        }
      },
      "Poker Tuck Box": {
        "36": {
          "Colorless": "PokerTuckBox36"
        },
        "54": {
          "Colorless": "PokerTuckBox54"
        },
        "72": {
          "Colorless": "PokerTuckBox72"
        },
        "90": {
          "Colorless": "PokerTuckBox90"
        },
        "108": {
          "Colorless": "PokerTuckBox108"
        }
      },
      "Bridge Hook Box": {
        "54": {
          "Colorless": "BridgeHookBox54"
        },
        "108": {
          "Colorless": "BridgeHookBox108"
        }
      },
      "Bridge Tuck Box": {
        "54": {
          "Colorless": "BridgeTuckBox54"
        },
        "108": {
          "Colorless": "BridgeTuckBox108"
        }
      },
      "Jumbo Hook Box": {
        "36": {
          "Colorless": "JumboHookBox36"
        },
        "90": {
          "Colorless": "JumboHookBox90"
        }
      },
      "Jumbo Tuck Box": {
        "90": {
          "Colorless": "JumboTuckBox90"
        }
      },
      "Prototype Box": {
        "Large": {
          "Colorless": "LargePrototypeBox"
        },
        "Medium": {
          "Colorless": "MediumPrototypeBox"
        },
        "Small": {
          "Colorless": "SmallPrototypeBox"
        }
      },
      "Retail Box": {
        "Large": {
          "Colorless": "LargeRetailBox"
        }
      },
      "Stout Box Top": {
        "Large": {
          "Colorless": "LargeStoutBoxTop"
        }
      },
      "Stout Box Top And Side": {
        "Large": {
          "Colorless": "LargeStoutBoxTopAndSide"
        },
        "Medium": {
          "Colorless": "MediumStoutBoxTopAndSide"
        }
      },
      "Pro Box": {
        "Medium": {
          "Colorless": "MediumProBox"
        },
        "Small": {
          "Colorless": "SmallProBox"
        }
      },
      "Mint Tin Sticker": {
        "Sizeless": {
          "Colorless": "MintTinSticker"
        }
      },
      "Poker Booster Box": {
        "Sizeless": {
          "Colorless": "PokerBoosterBox"
        }
      },
      "Poker Envelope": {
        "Sizeless": {
          "Colorless": "PokerEnvelope"
        }
      },
      "Poker Hook Box": {
        "18": {
          "Colorless": "PokerHookBox18"
        },
        "36": {
          "Colorless": "PokerHookBox36"
        },
        "54": {
          "Colorless": "PokerHookBox54"
        },
        "72": {
          "Colorless": "PokerHookBox72"
        },
        "90": {
          "Colorless": "PokerHookBox90"
        },
        "108": {
          "Colorless": "PokerHookBox108"
        }
      },
      "Square Hook Box": {
        "48": {
          "Colorless": "SquareHookBox48"
        },
        "96": {
          "Colorless": "SquareHookBox96"
        }
      },
      "Square Tuck Box": {
        "48": {
          "Colorless": "SquareTuckBox48"
        },
        "96": {
          "Colorless": "SquareTuckBox96"
        }
      },
      "Tarot Hook Box": {
        "40": {
          "Colorless": "TarotHookBox40"
        },
        "90": {
          "Colorless": "TarotHookBox90"
        }
      },
      "Tarot Tuck Box": {
        "40": {
          "Colorless": "TarotTuckBox40"
        },
        "90": {
          "Colorless": "TarotTuckBox90"
        }
      },
      "VHS Box": {
        "Sizeless": {
          "Colorless": "VHSBox"
        }
      }
    },
    "stickers": {
      "Custom Large Sticker": {
        "Sizeless": {
          "Colorless": "CustomLargeSticker"
        }
      },
      "Custom Medium Sticker": {
        "Sizeless": {
          "Colorless": "CustomMediumSticker"
        }
      },
      "Custom Mini Sticker": {
        "Sizeless": {
          "Colorless": "CustomMiniSticker"
        }
      },
      "Custom Small Sticker": {
        "Sizeless": {
          "Colorless": "CustomSmallSticker"
        }
      },
      "Meeple Sticker": {
        "Sizeless": {
          "Colorless": "MeepleSticker"
        }
      },
      "Pawn Sticker": {
        "Sizeless": {
          "Colorless": "PawnSticker"
        }
      }
    },
    "deck": {
      "Business Deck": {
        "Sizeless": {
          "Colorless": "BusinessDeck"
        }
      },
      "Poker Deck": {
        "Sizeless": {
          "Colorless": "PokerDeck"
        }
      },
      "Jumbo Deck": {
        "Sizeless": {
          "Colorless": "JumboDeck"
        }
      },
      "Mini Deck": {
        "Sizeless": {
          "Colorless": "MiniDeck"
        }
      },
      "Micro Deck": {
        "Sizeless": {
          "Colorless": "MicroDeck"
        }
      },
      "Mint Tin Deck": {
        "Sizeless": {
          "Colorless": "MintTinDeck"
        }
      },
      "Hex Deck": {
        "Sizeless": {
          "Colorless": "HexDeck"
        }
      },
      "Bridge Deck": {
        "Sizeless": {
          "Colorless": "BridgeDeck"
        }
      },
      "Card Crafting Deck": {
        "Sizeless": {
          "Colorless": "CardCraftingDeck"
        }
      },
      "Circle Deck": {
        "Sizeless": {
          "Colorless": "CircleDeck"
        }
      },
      "Clear Card Crafting Deck": {
        "Sizeless": {
          "Colorless": "ClearCardCraftingDeck"
        }
      },
      "Clear Euro Poker Deck": {
        "Sizeless": {
          "Colorless": "ClearEuroPokerDeck"
        }
      },
      "Deck Box": {
        "Sizeless": {
          "Colorless": "DeckBox"
        }
      },
      "Deck Box Top And Side": {
        "Sizeless": {
          "Colorless": "DeckBoxTopAndSide"
        }
      },
      "Divider Deck": {
        "Sizeless": {
          "Colorless": "DividerDeck"
        }
      },
      "Domino Deck": {
        "Sizeless": {
          "Colorless": "DominoDeck"
        }
      },
      "Euro Poker Deck": {
        "Sizeless": {
          "Colorless": "EuroPokerDeck"
        }
      },
      "Euro Square Deck": {
        "Sizeless": {
          "Colorless": "EuroSquareDeck"
        }
      },
      "Foil Euro Poker Deck": {
        "Sizeless": {
          "Colorless": "FoilEuroPokerDeck"
        }
      },
      "Foil Poker Deck": {
        "Sizeless": {
          "Colorless": "FoilPokerDeck"
        }
      },
      "Foil Tarot Deck": {
        "Sizeless": {
          "Colorless": "FoilTarotDeck"
        }
      },
      "Play Money": {
        "Sizeless": {
          "Colorless": "PlayMoney"
        }
      },
      "Pro Tarot Insert": {
        "Small": {
          "Colorless": "SmallProTarotInsert"
        }
      },
      "Square Deck": {
        "Small": {
          "Colorless": "SmallSquareDeck"
        },
        "Sizeless": {
          "Colorless": "SquareDeck"
        }
      },
      "Stout Tarot Insert": {
        "Small": {
          "Colorless": "SmallStoutTarotInsert"
        }
      },
      "Tarot Deck": {
        "Sizeless": {
          "Colorless": "TarotDeck"
        }
      },
      "Trading Deck": {
        "Sizeless": {
          "Colorless": "TradingDeck"
        }
      },
      "US Game Deck": {
        "Sizeless": {
          "Colorless": "USGameDeck"
        }
      }
    },
    "die": {
      "Custom Color D4": {
        "Sizeless": {
          "Colorless": "CustomColorD4"
        }
      },
      "Custom Color D6": {
        "Sizeless": {
          "Colorless": "CustomColorD6"
        }
      },
      "Custom Color D8": {
        "Sizeless": {
          "Colorless": "CustomColorD8"
        }
      },
      "Custom Wood D6": {
        "Sizeless": {
          "Colorless": "CustomWoodD6"
        }
      },
      "Dice Sticker": {
        "Sizeless": {
          "Colorless": "DiceSticker"
        }
      }
    },
    "premium": {},
    "board": {
      "Domino Board": {
        "Sizeless": {
          "Colorless": "DominoBoard"
        }
      },
      "Accordion Board": {
        "Sizeless": {
          "Colorless": "AccordionBoard"
        }
      },
      "Bi Fold Board": {
        "Sizeless": {
          "Colorless": "BiFoldBoard"
        }
      },
      "Half Board": {
        "Sizeless": {
          "Colorless": "HalfBoard"
        }
      },
      "Square Board": {
        "Large": {
          "Colorless": "LargeSquareBoard"
        },
        "Small": {
          "Colorless": "SmallSquareBoard"
        },
        "Sizeless": {
          "Colorless": "SquareBoard"
        }
      },
      "Six Fold Board": {
        "Medium": {
          "Colorless": "MediumSixFoldBoard"
        },
        "Sizeless": {
          "Colorless": "SixFoldBoard"
        }
      },
      "Quad Fold Board": {
        "Sizeless": {
          "Colorless": "QuadFoldBoard"
        },
        "Large": {
          "Colorless": "LargeQuadFoldBoard"
        }
      },
      "Quarter Board": {
        "Sizeless": {
          "Colorless": "QuarterBoard"
        }
      },
      "Skinny Board": {
        "Sizeless": {
          "Colorless": "SkinnyBoard"
        }
      },
      "Sliver Board": {
        "Sizeless": {
          "Colorless": "SliverBoard"
        }
      },
      "Strip Board": {
        "Sizeless": {
          "Colorless": "StripBoard"
        }
      },
      "Dual Layer Board": {
        "Large": {
          "Colorless": "LargeDualLayerBoard"
        },
        "Medium": {
          "Colorless": "MediumDualLayerBoard"
        },
        "Small": {
          "Colorless": "SmallDualLayerBoard"
        }
      }
    },
    "token": {
      "Hex Shard": {
        "Sizeless": {
          "Colorless": "HexShard"
        }
      },
      "Circle Shard": {
        "Sizeless": {
          "Colorless": "CircleShard"
        }
      },
      "Square Shard": {
        "Sizeless": {
          "Colorless": "SquareShard"
        }
      },
      "Square Chit": {
        "Small": {
          "Colorless": "SmallSquareChit"
        },
        "Medium": {
          "Colorless": "MediumSquareChit"
        },
        "Large": {
          "Colorless": "LargeSquareChit"
        }
      },
      "Circle Chit": {
        "Small": {
          "Colorless": "SmallCircleChit"
        },
        "Medium": {
          "Colorless": "MediumCircleChit"
        },
        "Large": {
          "Colorless": "LargeCircleChit"
        }
      },
      "Mini Hex Tile": {
        "Sizeless": {
          "Colorless": "MiniHexTile"
        }
      },
      "Hex Tile": {
        "Small": {
          "Colorless": "SmallHexTile"
        },
        "Medium": {
          "Colorless": "MediumHexTile"
        },
        "Large": {
          "Colorless": "LargeHexTile"
        }
      },
      "Arrow Chit": {
        "Sizeless": {
          "Colorless": "ArrowChit"
        }
      },
      "Bullseye Chit": {
        "Sizeless": {
          "Colorless": "BullseyeChit"
        }
      },
      "Custom Printed Meeple": {
        "Sizeless": {
          "Colorless": "CustomPrintedMeeple"
        }
      },
      "Domino Chit": {
        "Sizeless": {
          "Colorless": "DominoChit"
        }
      },
      "Domino Tile": {
        "Sizeless": {
          "Colorless": "DominoTile"
        }
      },
      "Ring": {
        "Large": {
          "Colorless": "LargeRing"
        },
        "Medium": {
          "Colorless": "MediumRing"
        },
        "Small": {
          "Colorless": "SmallRing"
        }
      },
      "Square Tile": {
        "Large": {
          "Colorless": "LargeSquareTile"
        },
        "Medium": {
          "Colorless": "MediumSquareTile"
        },
        "Small": {
          "Colorless": "SmallSquareTile"
        }
      },
      "Standee": {
        "Large": {
          "Colorless": "LargeStandee"
        },
        "Medium": {
          "Colorless": "MediumStandee"
        },
        "Small": {
          "Colorless": "SmallStandee"
        }
      },
      "Triangle Chit": {
        "Medium": {
          "Colorless": "MediumTriangleChit"
        }
      },
      "Mini Circle Tile": {
        "Sizeless": {
          "Colorless": "MiniCircleTile"
        }
      },
      "Mini Square Tile": {
        "Sizeless": {
          "Colorless": "MiniSquareTile"
        }
      },
      "Strip Chit": {
        "Sizeless": {
          "Colorless": "StripChit"
        }
      },
      "Token Sticker": {
        "Sizeless": {
          "Colorless": "TokenSticker"
        }
      },
      "Tombstone Shard": {
        "Sizeless": {
          "Colorless": "TombstoneShard"
        }
      },
      "Triangle Tile": {
        "Sizeless": {
          "Colorless": "TriangleTile"
        }
      }
    },
    "mat": {
      "Bi Fold Mat": {
        "Sizeless": {
          "Colorless": "BiFoldMat"
        },
        "Small": {
          "Colorless": "SmallBiFoldMat"
        }
      },
      "Domino Mat": {
        "Sizeless": {
          "Colorless": "DominoMat"
        }
      },
      "Big Mat": {
        "Sizeless": {
          "Colorless": "BigMat"
        }
      },
      "Flower Mat": {
        "Sizeless": {
          "Colorless": "FlowerMat"
        }
      },
      "Half Mat": {
        "Sizeless": {
          "Colorless": "HalfMat"
        }
      },
      "Hex Mat": {
        "Sizeless": {
          "Colorless": "HexMat"
        },
        "Large": {
          "Colorless": "LargeHexMat"
        }
      },
      "Invader Mat": {
        "Sizeless": {
          "Colorless": "InvaderMat"
        }
      },
      "Square Mat": {
        "Large": {
          "Colorless": "LargeSquareMat"
        },
        "Small": {
          "Colorless": "SmallSquareMat"
        },
        "Sizeless": {
          "Colorless": "SquareMat"
        }
      },
      "Game Mat": {
        "Medium": {
          "Colorless": "MediumGameMat"
        },
        "Small": {
          "Colorless": "SmallGameMat"
        }
      },
      "Placard Mat": {
        "Sizeless": {
          "Colorless": "PlacardMat"
        }
      },
      "Postcard Mat": {
        "Sizeless": {
          "Colorless": "PostcardMat"
        }
      },
      "Quad Fold Mat": {
        "Sizeless": {
          "Colorless": "QuadFoldMat"
        },
        "Small": {
          "Colorless": "SmallQuadFoldMat"
        }
      },
      "Quarter Mat": {
        "Sizeless": {
          "Colorless": "QuarterMat"
        }
      },
      "Skinny Mat": {
        "Sizeless": {
          "Colorless": "SkinnyMat"
        }
      },
      "Sliver Mat": {
        "Sizeless": {
          "Colorless": "SliverMat"
        }
      },
      "Slopeside Bi Fold Mat": {
        "Sizeless": {
          "Colorless": "SlopesideBiFoldMat"
        }
      },
      "Spinner Mat": {
        "Sizeless": {
          "Colorless": "SpinnerMat"
        }
      },
      "Strip Mat": {
        "Sizeless": {
          "Colorless": "StripMat"
        }
      },
      "USGame Mat": {
        "Sizeless": {
          "Colorless": "USGameMat"
        }
      }
    },
    "document": {
      "Mint Tin Accordion": {
        "4": {
          "Colorless": "MintTinAccordion4"
        },
        "6": {
          "Colorless": "MintTinAccordion6"
        },
        "8": {
          "Colorless": "MintTinAccordion8"
        }
      },
      "Poker Folio": {
        "Sizeless": {
          "Colorless": "PokerFolio"
        }
      },
      "Mint Tin Folio": {
        "Sizeless": {
          "Colorless": "MintTinFolio"
        }
      },
      "Bridge Folio": {
        "Sizeless": {
          "Colorless": "BridgeFolio"
        }
      },
      "Document": {
        "Sizeless": {
          "Colorless": "Document"
        }
      },
      "Jumbo Booklet": {
        "Sizeless": {
          "Colorless": "JumboBooklet"
        }
      },
      "Booklet": {
        "Large": {
          "Colorless": "LargeBooklet"
        },
        "Medium": {
          "Colorless": "MediumBooklet"
        },
        "Small": {
          "Colorless": "SmallBooklet"
        },
        "Tall": {
          "Colorless": "TallBooklet"
        }
      },
      "Score Pad Color": {
        "Large": {
          "Colorless": "LargeScorePadColor"
        },
        "Medium": {
          "Colorless": "MediumScorePadColor"
        },
        "Small": {
          "Colorless": "SmallScorePadColor"
        }
      },
      "Folio": {
        "Medium": {
          "Colorless": "MediumFolio"
        },
        "Small": {
          "Colorless": "SmallFolio"
        }
      },
      "Mat Book": {
        "Medium": {
          "Colorless": "MediumMatBook"
        }
      },
      "Square Folio": {
        "Sizeless": {
          "Colorless": "SquareFolio"
        }
      },
      "Tarot Booklet": {
        "Sizeless": {
          "Colorless": "TarotBooklet"
        }
      },
      "Tarot Folio": {
        "Sizeless": {
          "Colorless": "TarotFolio"
        }
      },
      "Digest Perfect Bound Book": {
        "Sizeless": {
          "Colorless": "DigestPerfectBoundBook"
        }
      },
      "Jumbo Coil Book": {
        "Sizeless": {
          "Colorless": "JumboCoilBook"
        }
      },
      "Letter Perfect Bound Book": {
        "Sizeless": {
          "Colorless": "LetterPerfectBoundBook"
        }
      },
      "Coil Book": {
        "Medium": {
          "Colorless": "MediumCoilBook"
        }
      }
    },
    "blank": {},
    "screen": {
      "Screen": {
        "Large": {
          "Colorless": "LargeScreen"
        },
        "Medium": {
          "Colorless": "MediumScreen"
        },
        "Small": {
          "Colorless": "SmallScreen"
        }
      }
    },
    "dial": {
      "Dual Dial": {
        "Sizeless": {
          "Colorless": "DualDial"
        }
      },
      "Dial": {
        "Small": {
          "Colorless": "SmallDial"
        }
      }
    },
    "NO_CATEGORY": {
      "Acrylic Shape": {
        "125": {
          "Colorless": "AcrylicShape125"
        },
        "250": {
          "Colorless": "AcrylicShape250"
        }
      },
      "Custom Large Cardstock": {
        "Sizeless": {
          "Colorless": "CustomLargeCardstock"
        }
      },
      "Custom Large Punchout": {
        "Sizeless": {
          "Colorless": "CustomLargePunchout"
        }
      },
      "Custom Medium Cardstock": {
        "Sizeless": {
          "Colorless": "CustomMediumCardstock"
        }
      },
      "Custom Medium Punchout": {
        "Sizeless": {
          "Colorless": "CustomMediumPunchout"
        }
      },
      "Custom Mini Cardstock": {
        "Sizeless": {
          "Colorless": "CustomMiniCardstock"
        }
      },
      "Custom Small Cardstock": {
        "Sizeless": {
          "Colorless": "CustomSmallCardstock"
        }
      },
      "Custom Small Punchout": {
        "Sizeless": {
          "Colorless": "CustomSmallPunchout"
        }
      },
      "Acrylic Shape 125": {
        "Large": {
          "Colorless": "LargeAcrylicShape125"
        }
      }
    }
  }
}
  module.exports = { COMPONENT_CATEGORIES }