from os import path, makedirs
import json
import numpy as np
from PIL import Image

def createGitIngore(directory):
    gitIgnore = "output/*\nprintout.pdf\n.playground\n.animation"
    with open(path.join(directory, ".gitignore"), "w") as file:
        file.write(gitIgnore)

def createComponentCompose(directory):
    componentCompose = []
    with open(path.join(directory, "component-compose.json"), "w") as file:
        file.write(json.dumps(componentCompose, indent=4))

def createGameCompose(directory):
    gameCompose = {
        "outputDirectory": "./output",

        "piecesGamedataDirectory": "./gamedata/piece",
        "componentGamedataDirectory": "./gamedata/component",
        
        "artdataDirectory": "./artdata",
        "artTemplatesDirectory": "./art",
        "artInsertsDirectory": "./art"
    }
    with open(path.join(directory, "game-compose.json"), "w") as file:
        file.write(json.dumps(gameCompose, indent=4))

def createStudio(directory):
    studio = {
        "name": "Template Studio"
    }
    with open(path.join(directory, "studio.json"), "w") as file:
        file.write(json.dumps(studio, indent=4))

def createRulesFile(directory):
    rules = "# Rules\n\nPlay the game."
    with open(path.join(directory, "rules.md"), "w") as file:
        file.write(rules)

def createLastFile(directory):
    with open(path.join(directory, "output/.last"), "w") as file:
        file.write("")

def createGame(directory):
    game = {
        "name": "Game Name",
        "version": "0.0.0",
        "versionName": "Template",
        "shortDescription": "Tagline",
        "longDescription": "Long description.",
        "coolFactors": [
            "First",
            "Second",
            "Third"
        ],
        "tags": [],
        "websiteUrl": "",
        "category": "Card Games",
        "minAge": "12+",
        "playTime": "30-60",
        "minPlayers": "2",
        "maxPlayers": "2"
    }
    with open(path.join(directory, "game.json"), "w") as file:
        file.write(json.dumps(game, indent=4))

def createImage(directory, name, width, height):
    img = np.zeros([height,width,3],dtype=np.uint8)
    img.fill(255)
    im = Image.fromarray(img)
    im.save(path.join(directory, 'gamecrafter/%s.png' % name))

def createGameCrafterImage(directory):
    createImage(directory, "actionShot", 800, 600)
    createImage(directory, "advertisement", 216, 150)
    createImage(directory, "backdrop", 1600, 600)
    createImage(directory, "logo", 350, 150)

def createProjectInDirectory(directory):
    # if(path.exists(path.join(directory, "game-compose.json"))):
    #     print("This directory already contains a gameExisting game compose here.")
    #     return 0

    createStudio(directory)
    createRulesFile(directory)
    createGame(directory)
    createGameCompose(directory)
    createComponentCompose(directory)
    createGitIngore(directory)

    makedirs(path.join(directory, "output"), exist_ok=True)
    createLastFile(directory)

    makedirs(path.join(directory, "gamedata/component"), exist_ok=True)
    makedirs(path.join(directory, "gamedata/piece"), exist_ok=True)

    makedirs(path.join(directory, "gamecrafter"), exist_ok=True)
    createGameCrafterImage(directory)

    makedirs(path.join(directory, "artdata"), exist_ok=True)

    makedirs(path.join(directory, "art"), exist_ok=True)

    return 1