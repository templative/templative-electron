class ProduceProperties {
  constructor(inputDirectoryPath, outputDirectoryPath, isPublish, isSimple, targetLanguage, isClipped=false) {
    this.inputDirectoryPath = inputDirectoryPath;
    this.outputDirectoryPath = outputDirectoryPath;
    this.isPublish = isPublish;
    this.isSimple = isSimple;
    this.targetLanguage = targetLanguage;
    this.isClipped = isClipped;
  }
}

class PreviewProperties {
  constructor(inputDirectoryPath, outputDirectoryPath, pieceName, targetLanguage, isClipped=false) {
    this.inputDirectoryPath = inputDirectoryPath;
    this.outputDirectoryPath = outputDirectoryPath;
    this.pieceName = pieceName;
    this.isPublish = false;
    this.isSimple = false;
    this.targetLanguage = targetLanguage;
    this.isClipped = isClipped;
  }
}

module.exports = {
  ProduceProperties,
  PreviewProperties
};