class ProduceProperties {
  constructor(inputDirectoryPath, outputDirectoryPath, isPublish, isSimple, targetLanguage, isClipped=false, renderMode=RENDER_MODE.RENDER_EXPORT_WITHOUT_CACHE, renderProgram=RENDER_PROGRAM.TEMPLATIVE) {
    this.inputDirectoryPath = inputDirectoryPath;
    this.outputDirectoryPath = outputDirectoryPath;
    this.isPublish = isPublish;
    this.isSimple = isSimple;
    this.targetLanguage = targetLanguage;
    this.isClipped = isClipped;
    this.renderMode = renderMode;
    this.renderProgram = renderProgram;
  }
}

const RENDER_MODE = {
  RENDER_EXPORT_WITHOUT_CACHE: 'RENDER_EXPORT_WITHOUT_CACHE',
  RENDER_EXPORT_USING_CACHE: 'RENDER_EXPORT_USING_CACHE', 
  RENDER_TO_CACHE: 'RENDER_TO_CACHE'
}
const RENDER_PROGRAM = {
  TEMPLATIVE: 'Templative',
  INKSCAPE: 'Inkscape'
}

class PreviewProperties {
  constructor(inputDirectoryPath, outputDirectoryPath, pieceName, targetLanguage, isClipped=false, renderProgram=RENDER_PROGRAM.TEMPLATIVE) {
    this.inputDirectoryPath = inputDirectoryPath;
    this.outputDirectoryPath = outputDirectoryPath;
    this.pieceName = pieceName;
    this.isPublish = false;
    this.isSimple = false;
    this.targetLanguage = targetLanguage;
    this.isClipped = isClipped;
    this.renderMode = RENDER_MODE.RENDER_EXPORT_WITHOUT_CACHE;
    this.renderProgram = renderProgram;
  }
}

module.exports = {
  RENDER_MODE,
  RENDER_PROGRAM,
  ProduceProperties,
  PreviewProperties
};