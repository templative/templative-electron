const RENDER_MODE = {
  RENDER_EXPORT_WITHOUT_CACHE: 'RENDER_EXPORT_WITHOUT_CACHE',
  RENDER_EXPORT_USING_CACHE: 'RENDER_EXPORT_USING_CACHE', 
  RENDER_TO_CACHE: 'RENDER_TO_CACHE'
}
const RENDER_PROGRAM = {
  TEMPLATIVE: 'Templative',
  INKSCAPE: 'Inkscape'
}
const OVERLAPPING_RENDERING_TASKS = {
  ONE_AT_A_TIME: 'One at a Time',
  ALL_AT_ONCE: 'All at Once'
}

class ProduceProperties {
  constructor(inputDirectoryPath, outputDirectoryPath, isPublish, isSimple, targetLanguage, isClipped=false, renderMode=RENDER_MODE.RENDER_EXPORT_WITHOUT_CACHE, renderProgram=RENDER_PROGRAM.TEMPLATIVE, overlappingRenderingTasks=OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME) {
    this.inputDirectoryPath = inputDirectoryPath;
    this.outputDirectoryPath = outputDirectoryPath;
    this.isPublish = isPublish;
    this.isSimple = isSimple;
    this.targetLanguage = targetLanguage;
    this.isClipped = isClipped;
    this.renderMode = renderMode;
    this.renderProgram = renderProgram;
    this.overlappingRenderingTasks = overlappingRenderingTasks;
  }
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
    this.overlappingRenderingTasks = OVERLAPPING_RENDERING_TASKS.ALL_AT_ONCE;
  }
}

module.exports = {
  RENDER_MODE,
  RENDER_PROGRAM,
  OVERLAPPING_RENDERING_TASKS,
  ProduceProperties,
  PreviewProperties
};