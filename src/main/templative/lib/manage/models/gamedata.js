class StudioData {
  constructor(studioDataBlob) {
    this.studioDataBlob = studioDataBlob;
  }
}

class GameData extends StudioData {
  constructor(studioDataBlob, gameDataBlob) {
    super(studioDataBlob);
    this.gameDataBlob = gameDataBlob;
  }
}

class ComponentData extends GameData {
  constructor(studioDataBlob, gameDataBlob, componentDataBlob) {
    super(studioDataBlob, gameDataBlob);
    this.componentDataBlob = componentDataBlob;
  }
}

class ComponentBackData extends ComponentData {
  constructor(studioDataBlob, gameDataBlob, componentDataBlob, componentBackDataBlob = {}, sourcedVariableNamesSpecificToPieceOnBackArtData = [], pieceUniqueBackHash = "") {
    super(studioDataBlob, gameDataBlob, componentDataBlob);
    this.componentBackDataBlob = componentBackDataBlob;
    this.pieceUniqueBackHash = pieceUniqueBackHash;
    this.sourcedVariableNamesSpecificToPieceOnBackArtData = sourcedVariableNamesSpecificToPieceOnBackArtData;
  }
}

class PieceData extends ComponentBackData {
  constructor(studioDataBlob, gameDataBlob, componentDataBlob, componentBackDataBlob, sourcedVariableNamesSpecificToPieceOnBackArtData, pieceUniqueBackHash, pieceDataBlob) {
    super(studioDataBlob, gameDataBlob, componentDataBlob, componentBackDataBlob, sourcedVariableNamesSpecificToPieceOnBackArtData, pieceUniqueBackHash);
    this.pieceData = pieceDataBlob;
  }
}

module.exports = {
  StudioData,
  GameData,
  ComponentData,
  ComponentBackData,
  PieceData
};
