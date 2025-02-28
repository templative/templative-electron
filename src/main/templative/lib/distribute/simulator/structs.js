class SimulatorComponentPlacement {
  constructor(boxPositionIndexX, height, boxPositionIndexZ, boxColumnCount, boxRowCount) {
    this.boxPositionIndexX = boxPositionIndexX;
    this.height = height;
    this.boxPositionIndexZ = boxPositionIndexZ;
    this.boxColumnCount = boxColumnCount;
    this.boxRowCount = boxRowCount;
  }
}

class SimulatorDimensions {
  constructor(width, height, thickness) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
  }
}

class SimulatorTilesetUrls {
  constructor(face, back) {
    this.face = face;
    this.back = back;
  }
}

class SimulatorTilesetLayout {
  constructor(count, columns, rows) {
    this.count = count;
    this.columns = columns;
    this.rows = rows;
  }
}

module.exports = { SimulatorComponentPlacement, SimulatorDimensions, SimulatorTilesetUrls, SimulatorTilesetLayout };