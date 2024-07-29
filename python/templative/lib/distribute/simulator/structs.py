from dataclasses import dataclass

@dataclass
class SimulatorComponentPlacement:
    boxPositionIndexX: int
    height: float
    boxPositionIndexZ: int
    boxColumnCount: int
    boxRowCount: int

@dataclass
class SimulatorDimensions:
    width: float
    height: float
    thickness: float

@dataclass
class SimulatorTilesetUrls:
    face: str
    back: str

@dataclass
class SimulatorTilesetLayout:
    count: int
    columns: int
    rows: int