# https://kb.tabletopsimulator.com/custom-content/about-custom-objects/
import json
from typing import List, Dict, Optional, Any

class ColourState:
    def __init__(self, r: float = 0, g: float = 0, b: float = 0):
        self.r = r
        self.g = g
        self.b = b

    def to_colour(self):
        return (self.r, self.g, self.b)


class VectorState:
    def __init__(self, x: float = 0, y: float = 0, z: float = 0):
        self.x = x
        self.y = y
        self.z = z

    def to_vector(self):
        return (self.x, self.y, self.z)


class TransformState:
    def __init__(self, posX=0, posY=0, posZ=0, rotX=0, rotY=0, rotZ=0, scaleX=1, scaleY=1, scaleZ=1):
        self.posX = posX
        self.posY = posY
        self.posZ = posZ
        self.rotX = rotX
        self.rotY = rotY
        self.rotZ = rotZ
        self.scaleX = scaleX
        self.scaleY = scaleY
        self.scaleZ = scaleZ

    def to_position(self):
        return (self.posX, self.posY, self.posZ)

    def to_rotation(self):
        return (self.rotX, self.rotY, self.rotZ)

    def to_scale(self):
        return (self.scaleX, self.scaleY, self.scaleZ)


class GridState:
    def __init__(self):
        self.Type = "Box"
        self.Lines = False
        self.Color = ColourState(0, 0, 0)
        self.Opacity = 0.75
        self.ThickLines = False
        self.Snapping = False
        self.Offset = False
        self.BothSnapping = False
        self.xSize = 2
        self.ySize = 2
        self.PosOffset = VectorState(0, 1, 0)


class LightingState:
    def __init__(self):
        self.LightIntensity = 0.54
        self.LightColor = ColourState(1, 0.9804, 0.8902)
        self.AmbientIntensity = 1.3
        self.AmbientType = "Background"
        self.AmbientSkyColor = ColourState(0.5, 0.5, 0.5)
        self.AmbientEquatorColor = ColourState(0.5, 0.5, 0.5)
        self.AmbientGroundColor = ColourState(0.5, 0.5, 0.5)
        self.ReflectionIntensity = 1
        self.LutIndex = 0
        self.LutContribution = 1
        self.LutURL = None


class ObjectState:
    def __init__(self):
        self.Name = ""
        self.Transform = TransformState()
        self.Nickname = ""
        self.Description = ""
        self.ColorDiffuse = ColourState()
        self.Locked = False
        self.Grid = True
        self.Snap = True
        self.Autoraise = True
        self.Sticky = True
        self.Tooltip = True
        self.GridProjection = False
        self.HideWhenFaceDown = None
        self.Hands = None
        self.AltSound = None
        self.MaterialIndex = None
        self.MeshIndex = None
        self.Layer = None
        self.Number = None
        self.CardID = None
        self.SidewaysCard = None
        self.RPGmode = None
        self.RPGdead = None
        self.FogColor = None
        self.FogHidePointers = None
        self.FogReverseHiding = None
        self.FogSeethrough = None
        self.DeckIDs = []
        self.CustomDeck = {}
        self.CustomMesh = None
        self.CustomImage = None
        self.CustomAssetbundle = None
        self.FogOfWar = None
        self.FogOfWarRevealer = None
        self.Clock = None
        self.Counter = None
        self.Tablet = None
        self.Mp3Player = None
        self.Calculator = None
        self.Text = None
        self.XmlUI = ""
        self.CustomUIAssets = []
        self.LuaScript = ""
        self.LuaScriptState = ""
        self.ContainedObjects = []
        self.PhysicsMaterial = None
        self.Rigidbody = None
        self.JointFixed = None
        self.JointHinge = None
        self.JointSpring = None
        self.GUID = ""
        self.AttachedSnapPoints = []
        self.AttachedVectorLines = []
        self.AttachedDecals = []
        self.States = {}
        self.RotationValues = []

    def equals_object(self, obj):
        if obj is None:
            return False

        os = obj
        if not isinstance(os, ObjectState):
            return False

        if self.ColorDiffuse.to_colour() != os.ColorDiffuse.to_colour():
            return False

        self_json = self.to_json()
        os_json = os.to_json()

        return self_json == os_json

    def clone(self):
        return ObjectState.from_json(self.to_json())

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)

    @classmethod
    def from_json(cls, json_str):
        data = json.loads(json_str)
        obj = cls()
        obj.__dict__.update(data)
        return obj


class SaveState:
    def __init__(self):
        self.SaveName = ""
        self.GameMode = ""
        self.Gravity = 0.5
        self.PlayArea = 0.5
        self.Date = ""
        self.Table = ""
        self.TableURL = None
        self.Sky = ""
        self.SkyURL = None
        self.Note = ""
        self.Rules = ""
        self.XmlUI = ""
        self.CustomUIAssets = []
        self.LuaScript = ""
        self.LuaScriptState = ""
        self.Grid = GridState()
        self.Lighting = LightingState()
        self.Hands = None
        self.Turns = None
        self.VectorLines = []
        self.ObjectStates = []
        self.SnapPoints = []
        self.DecalPallet = []
        self.Decals = []
        self.TabStates = {}
        self.CameraStates = []
        self.VersionNumber = ""

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)

    @classmethod
    def from_json(cls, json_str):
        data = json.loads(json_str)
        obj = cls()
        obj.__dict__.update(data)
        return obj


class SnapPointState:
    def __init__(self):
        self.Position = VectorState()
        self.Rotation = VectorState()


class DecalState:
    def __init__(self):
        self.Transform = TransformState()
        self.CustomDecal = None


class CustomDecalState:
    def __init__(self):
        self.Name = ""
        self.ImageURL = ""
        self.Size = 0.0  # Size in inches


class RotationValueState:
    def __init__(self):
        self.Value = None
        self.Rotation = VectorState()


class CustomAssetState:
    def __init__(self):
        self.Name = ""
        self.URL = ""


class OrientationState:
    def __init__(self, position=None, rotation=None):
        self.position = position if position else VectorState()
        self.rotation = rotation if rotation else VectorState()


class PhysicsMaterialState:
    def __init__(self):
        self.StaticFriction = 0.4
        self.DynamicFriction = 0.4
        self.Bounciness = 0.0
        self.FrictionCombine = "Average"  # Assuming a string for simplicity
        self.BounceCombine = "Average"


class RigidbodyState:
    def __init__(self):
        self.Mass = 1.0
        self.Drag = 0.1
        self.AngularDrag = 0.1
        self.UseGravity = True


class CustomDeckState:
    def __init__(self):
        self.FaceURL = ""
        self.BackURL = ""
        self.NumWidth = None
        self.NumHeight = None
        self.BackIsHidden = False
        self.UniqueBack = False


class CustomImageState:
    def __init__(self):
        self.ImageURL = ""
        self.ImageSecondaryURL = ""
        self.WidthScale = 1.0
        self.CustomDice = None
        self.CustomToken = None
        self.CustomJigsawPuzzle = None
        self.CustomTile = None


class CustomAssetbundleState:
    def __init__(self):
        self.AssetbundleURL = ""
        self.AssetbundleSecondaryURL = ""
        self.MaterialIndex = 0
        self.TypeIndex = 0
        self.LoopingEffectIndex = 0


class CustomDiceState:
    def __init__(self):
        self.Type = "Regular"  # Placeholder


class CustomTokenState:
    def __init__(self):
        self.Thickness = 1.0
        self.MergeDistancePixels = 0.0
        self.Stackable = False


class CustomTileState:
    def __init__(self):
        self.Type = "Box"  # Could be Box, Hex, Circle, Rounded
        self.Thickness = 1.0
        self.Stackable = False
        self.Stretch = False


class CustomJigsawPuzzleState:
    def __init__(self):
        self.NumPuzzlePieces = 80
        self.ImageOnBoard = True


class CustomMeshState:
    def __init__(self):
        self.MeshURL = ""
        self.DiffuseURL = ""
        self.NormalURL = ""
        self.ColliderURL = ""
        self.Convex = True
        self.MaterialIndex = 0
        self.TypeIndex = 0
        self.CustomShader = None
        self.CastShadows = True


class CustomShaderState:
    def __init__(self):
        self.SpecularColor = ColourState(0.9, 0.9, 0.9)
        self.SpecularIntensity = 0.1
        self.SpecularSharpness = 3.0
        self.FresnelStrength = 0.1


class FogOfWarSaveState:
    def __init__(self):
        self.HideGmPointer = False
        self.HideObjects = False
        self.Height = 0.0
        self.RevealedLocations = {}


class FogOfWarRevealerSaveState:
    def __init__(self):
        self.Active = False
        self.Range = 0.0
        self.Color = ""


class TabletState:
    def __init__(self):
        self.PageURL = ""


class ClockSaveState:
    def __init__(self):
        self.ClockState = "Stopped"  # Placeholder
        self.SecondsPassed = 0
        self.Paused = False


class CounterState:
    def __init__(self):
        self.value = 0


class Mp3PlayerState:
    def __init__(self):
        self.songTitle = ""
        self.genre = ""
        self.volume = 0.5
        self.isPlaying = False
        self.loopOne = False
        self.menuTitle = "GENRES"
        self.menu = "GENRES"


class CalculatorState:
    def __init__(self):
        self.value = ""
        self.memory = 0.0


class VectorLineState:
    def __init__(self):
        self.points3 = []
        self.color = ColourState()
        self.thickness = 0.1
        self.rotation = VectorState()
        self.loop = None
        self.square = None


class CameraState:
    def __init__(self):
        self.Position = VectorState()
        self.Rotation = VectorState()
        self.Distance = 0.0
        self.Zoomed = False


class JointState:
    def __init__(self):
        self.ConnectedBodyGUID = ""
        self.EnableCollision = False
        self.Axis = VectorState()
        self.Anchor = VectorState()
        self.ConnectedAnchor = VectorState()
        self.BreakForce = 0.0
        self.BreakTorque = 0.0

    def assign(self, joint_state):
        self.__dict__.update(joint_state.__dict__)


class JointFixedState(JointState):
    pass


class JointHingeState(JointState):
    def __init__(self):
        super().__init__()
        self.UseLimits = False
        self.Limits = None  # Placeholder, could be a class
        self.UseMotor = False
        self.Motor = None  # Placeholder
        self.UseSpring = False
        self.Spring = None  # Placeholder


class JointSpringState(JointState):
    def __init__(self):
        super().__init__()
        self.Damper = 0.0
        self.MaxDistance = 0.0
        self.MinDistance = 0.0
        self.Spring = 0.0


class TabState:
    def __init__(self, title="", body="", color="", visibleColor=None, id=-1):
        self.title = title
        self.body = body
        self.color = color
        self.visibleColor = visibleColor if visibleColor else ColourState()
        self.id = id

    @classmethod
    def from_uitab(cls, to):
        return cls(
            title=to.title,
            body=to.body,
            visibleColor=ColourState(to.VisibleColor),
            color=to.VisibleColor,
            id=to.id,
        )


class TextState:
    def __init__(self):
        self.Text = ""
        self.colorstate = ColourState()
        self.fontSize = 64


class TurnsState:
    def __init__(self):
        self.Enable = False
        self.Type = "Auto"
        self.TurnOrder = []
        self.Reverse = False
        self.SkipEmpty = False
        self.DisableInteractions = False
        self.PassTurns = True
        self.TurnColor = ""


class HandsState:
    def __init__(self):
        self.Enable = True
        self.DisableUnused = False
        self.Hiding = "Default"  # Default, Reverse, Disable
        self.HandTransforms = []


class HandTransformState:
    def __init__(self, color="", transform=None):
        self.Color = color
        self.Transform = transform if transform else TransformState()


# Helper methods for serialization
def serialize_to_json(obj):
    return json.dumps(obj, default=lambda o: o.__dict__, indent=4)


def deserialize_from_json(cls, json_str):
    data = json.loads(json_str)
    obj = cls()
    obj.__dict__.update(data)
    return obj
