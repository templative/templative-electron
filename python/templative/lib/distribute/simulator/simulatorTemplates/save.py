import time
def createSave(name, objectStates):
    return {
        # Add missing fields
        "EpochTime": int(time.time()),  # Need to import time at top
        "VersionNumber": "v13.3",
        "GameType": "",
        "GameComplexity": "",
        "Tags": [],
        "Gravity": 0.5,
        "PlayArea": 0.5,
        
        "SaveName": name,
        "GameMode": name,
        "Date": "12/28/2015 3:50:33 AM",
        "Table": "Table_RPG",
        "Sky": "Sky_Forest",
        "Note": "",
        "Rules": "",
        "PlayerTurn": "",
        
        # Update Grid to include missing fields
        "Grid": {
            "Type": 0,
            "Lines": False,
            "Color": {
                "r": 0.0,
                "g": 0.0,
                "b": 0.0
            },
            "Opacity": 0.75,
            "ThickLines": False,
            "Snapping": False,
            "Offset": False,
            "BothSnapping": False,
            "xSize": 2.0,
            "ySize": 2.0,
            "PosOffset": {
                "x": 0.0,
                "y": 1.0,
                "z": 0.0
            }
        },

        # Add missing sections
        "Lighting": {
            "LightIntensity": 0.54,
            "LightColor": {
                "r": 1.0,
                "g": 0.9804,
                "b": 0.8902
            },
            "AmbientIntensity": 1.3,
            "AmbientType": 0,
            "AmbientSkyColor": {
                "r": 0.5,
                "g": 0.5,
                "b": 0.5
            },
            "AmbientEquatorColor": {
                "r": 0.5,
                "g": 0.5,
                "b": 0.5
            },
            "AmbientGroundColor": {
                "r": 0.5,
                "g": 0.5,
                "b": 0.5
            },
            "ReflectionIntensity": 1.0,
            "LutIndex": 0,
            "LutContribution": 1.0
        },

        # Simplify Hands structure
        "Hands": {
            "Enable": True,
            "DisableUnused": False,
            "Hiding": 0
        },

        # Add missing sections
        "ComponentTags": {
            "labels": []
        },
        "Turns": {
            "Enable": False,
            "Type": 0,
            "TurnOrder": [],
            "Reverse": False,
            "SkipEmpty": False,
            "DisableInteractions": False,
            "PassTurns": True,
            "TurnColor": ""
        },
        "DecalPallet": [],
        "LuaScript": "--[[ Lua code. See documentation: https://api.tabletopsimulator.com/ --]]\n\n--[[ The onLoad event is called after the game save finishes loading. --]]\nfunction onLoad()\n    --[[ print('onLoad!') --]]\nend\n\n--[[ The onUpdate event is called once per frame. --]]\nfunction onUpdate()\n    --[[ print('onUpdate loop!') --]]\nend",
        "LuaScriptState": "",
        "XmlUI": "<!-- Xml UI. See documentation: https://api.tabletopsimulator.com/ui/introUI/ -->",
        
        "DrawImage": "iVBORw0KGgoAAAANSUhEUgAAAWAAAADQCAYAAAA53LuNAAAFFElEQVR4Ae3QgQAAAADDoPlTH+SFUGHAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgy8DQx5DAABHyNK3wAAAABJRU5ErkJggg==",
        "VectorLines": [],
        "ObjectStates": objectStates,
        "TabStates": {
            "0": {
            "title": "Rules",
            "body": "",
            "visibleColor": {
                "r": 0.5,
                "g": 0.5,
                "b": 0.5
            },
            "id": 0
            },
            "1": {
            "title": "White",
            "body": "",
            "visibleColor": {
                "r": 1.0,
                "g": 1.0,
                "b": 1.0
            },
            "id": 1
            },
            "2": {
            "title": "Red",
            "body": "",
            "visibleColor": {
                "r": 0.856,
                "g": 0.1,
                "b": 0.094
            },
            "id": 2
            },
            "3": {
            "title": "Orange",
            "body": "",
            "visibleColor": {
                "r": 0.882,
                "g": 0.517,
                "b": 0.219
            },
            "id": 3
            },
            "4": {
            "title": "Yellow",
            "body": "",
            "visibleColor": {
                "r": 0.905,
                "g": 0.898,
                "b": 0.172
            },
            "id": 4
            },
            "5": {
            "title": "Green",
            "body": "",
            "visibleColor": {
                "r": 0.192,
                "g": 0.701,
                "b": 0.168
            },
            "id": 5
            },
            "6": {
            "title": "Blue",
            "body": "",
            "visibleColor": {
                "r": 0.118,
                "g": 0.53,
                "b": 1.0
            },
            "id": 6
            },
            "7": {
            "title": "Purple",
            "body": "",
            "visibleColor": {
                "r": 0.627,
                "g": 0.125,
                "b": 0.941
            },
            "id": 7
            },
            "8": {
            "title": "Pink",
            "body": "",
            "visibleColor": {
                "r": 0.96,
                "g": 0.439,
                "b": 0.807
            },
            "id": 8
            },
            "9": {
            "title": "Black",
            "body": "",
            "visibleColor": {
                "r": 0.1,
                "g": 0.1,
                "b": 0.1
            },
            "id": 9
            }
        }
    }