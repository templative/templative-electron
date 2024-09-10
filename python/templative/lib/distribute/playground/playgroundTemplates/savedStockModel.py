import uuid

def createSavedStockModel(component, ownerIndex, translation):
    return {
        "uniqueId": str(uuid.uuid4()),
        "objectName": component["Name"],
        "objectDescription": "",
        "objectType": "DynamicObject",
        "transform":
        {
            "rotation":
            {
                "x": 0,
                "y": 0,
                "z": 0,
                "w": 1
            },
            "translation": translation,
            "scale3D":
            {
                "x": 1,
                "y": 1,
                "z": 1
            }
        },
        "simulatingPhysics": True,
        "primaryColor": { "b": component["PrimaryColor"]["b"], "g": component["PrimaryColor"]["g"], "r": component["PrimaryColor"]["r"], "a": 255 },
        "secondaryColor": { "b": 0, "g": 0, "r": 0, "a": 255 },
        "metallic": 0,
        "roughness": 0.20000000298023224,
        "friction": 0.69999998807907104,
        "restitution": 0.30000001192092896,
        "density": 1,
        "surfaceType": "SurfaceType1",
        
        "collisionType": "CB_Regular",
        "templateId": component["GUID"],
        "shouldSnap": True,
        "previousPosition":
        {
            "x": 0,
            "y": 0,
            "z": 0
        },
        # "objectScriptPackage": "11CE4AE13E3CBFF7B4B8F826AD51E1AA",
        "objectScriptName": "",
        "persistentData": "",
        "persistentKeyData":
        {
        },
        "drawingLines": [],
        "objectTags": [],
        "objectGroupId": -1,
        "ownerIndex": ownerIndex,
        "lightsOn": True,
        "bCanBeDamaged": False
    }