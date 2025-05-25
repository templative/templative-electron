const { BrowserWindow } = require('electron');
const { COMPONENT_INFO } = require('../../shared/componentInfo');
const { STOCK_COMPONENT_INFO } = require('../../shared/stockComponentInfo');
const { createComponentByType } = require('./lib/create/componentCreator');
const { getPreviewsPath } = require('./lib/produce/gameProducer');
const { watchAndProduceGameFiles } = require('./lib/produce/cachePreProducerWatcher');
const { createProjectInDirectory } = require('./lib/create/projectCreator');
const { convertToTabletopPlayground } = require('./lib/distribute/playground/playground');
const { createPdfForPrinting } = require('./lib/distribute/printout/printout');
const { convertToTabletopSimulator } = require('./lib/distribute/simulator/simulator');
const { listDesigners } = require('./lib/distribute/gameCrafter/accountManagement/accountManagement');
const { createSessionFromLogin } = require('./lib/distribute/gameCrafter/util/gameCrafterSession');
const { uploadGame } = require('./lib/distribute/gameCrafter/client');
const { createIconFont } = require('./lib/produce/iconFontCreator');
const { withLogCapture } = require('./logStore');
const { getTgcSession } = require('../sessionStore');
const { captureException } = require("./lib/sentryElectronWrapper");
const { updateToast } = require('../toastNotifier');
const { readOrCreateSettingsFile } = require('../settingsManager');
const path = require('path');
const { RENDER_MODE, RENDER_PROGRAM, OVERLAPPING_RENDERING_TASKS } = require('./lib/manage/models/produceProperties');
const { getSessionToken } = require('../sessionStore');
const { createProduceGameWorker, createPreviewPieceWorker } = require('./workerThread');

const createTemplativeComponent = withLogCapture(async (event, data) => {
  try {
    const { componentName, componentType, directoryPath, componentAIDescription } = data;
    
    await createComponentByType(directoryPath, componentName, componentType, componentAIDescription)
    updateToast(`Created ${componentName}.`, "success");
    
    return { success: true };
  } catch (error) {
    console.error('Error creating component:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const produceTemplativeProject = withLogCapture(async (event, request) => {
  try {
    const { isDebug, isComplex, componentFilter, language, directoryPath } = request;
    const NOT_CLIPPED = false;
    const NOT_PUBLISHED = false;
    const settings = await readOrCreateSettingsFile();
    const isCacheIgnored = settings.isCacheIgnored;
    const renderProgram = settings.renderProgram || RENDER_PROGRAM.TEMPLATIVE;
    const overlappingRenderingTasks = settings.overlappingRenderingTasks || OVERLAPPING_RENDERING_TASKS.ONE_AT_A_TIME;
    const renderMode = isCacheIgnored ? RENDER_MODE.RENDER_EXPORT_WITHOUT_CACHE : RENDER_MODE.RENDER_EXPORT_USING_CACHE;
    const toastResolver = (data) => {
      updateToast(`/${path.basename(data.outputDirectoryPath)} render complete.`, "brush");
    }
    await createProduceGameWorker({
        directoryPath,
        componentFilter,
        isSimple: !isComplex,
        isPublished: NOT_PUBLISHED,
        language,
        isClipped: NOT_CLIPPED,
        renderMode,
        renderProgram,
        overlappingRenderingTasks
    }, toastResolver);

    return { success: true };
  } catch (error) {
    console.error('Error producing game:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const getPreviewsDirectory = withLogCapture(async (event) => {
  try {
    const directory = await getPreviewsPath()
    return { previewsDirectory: directory };
  } catch (error) {
    console.error('Error getting previews directory:', error);
    captureException(error);
    return { success: false, error: error.message };
  }
});

const previewPiece = withLogCapture(async (event, data) => {
  try {
    const { componentFilter, pieceFilter, language, directoryPath } = data;
    const previewsDirectory = await getPreviewsPath();
    const settings = await readOrCreateSettingsFile();
    const renderProgram = settings.renderProgram || RENDER_PROGRAM.TEMPLATIVE;
    const toastResolver = (data) => { 
      updateToast(`${componentFilter} preview complete.`, "brush");
    }
    await createPreviewPieceWorker({directoryPath, previewsDirectory, componentFilter, pieceFilter, language, renderProgram}, toastResolver);
    return { success: true, message: 'Piece preview generated' };
  } catch (error) {
    console.error('Error previewing piece:', error);
    captureException(error); 
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const createTemplativeProject = withLogCapture(async (directoryPath, projectName, templateName) => {
  try {    
    await createProjectInDirectory(directoryPath, projectName, templateName);
    updateToast(`Created ${projectName}.`, "success");
    return { success: true, message: 'Project created' };
  } catch (error) {
    console.error('Error creating project:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const createPlaygroundPackage = withLogCapture(async (event, data) => {
  try {
    const { outputDirectorypath, playgroundPackagesDirectorypath } = data;
    
    const result = await convertToTabletopPlayground(outputDirectorypath, playgroundPackagesDirectorypath);
    updateToast(`/${path.basename(outputDirectorypath)} Playground package created.`, "success");
    return { success: result === 1, message: 'Playground package created' };
  } catch (error) {
    console.error('Error creating Playground package:', error);
    captureException(error); 
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const createPrintout = withLogCapture(async (event, data) => {
  try {
    const { outputDirectorypath, isBackIncluded, size, areBordersDrawn } = data;
    
    const result = await createPdfForPrinting(outputDirectorypath, isBackIncluded, size, areBordersDrawn);
    updateToast(`/${path.basename(outputDirectorypath)} Printout PDF created.`, "success");
    return { success: result === 1, message: 'Printout PDF created' };
  } catch (error) {
    console.error('Error creating printout:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const createSimulatorSave = withLogCapture(async (event, data) => {
  try {
    const { outputDirectorypath, tabletopSimulatorDocumentsDirectorypath } = data;
    const templativeToken = await getSessionToken();
    if (!templativeToken) {
      return { success: false, error: 'You must be logged into Templative to create a Tabletop Simulator save.' };
    }
    const result = await convertToTabletopSimulator(outputDirectorypath, tabletopSimulatorDocumentsDirectorypath, templativeToken);
    updateToast(`/${path.basename(outputDirectorypath)} Simulator save created.`, "success");
    return { success: result === 1, message: 'Simulator save created' };
  } catch (error) {
    console.error('Error creating simulator save:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const listGameCrafterDesigners = withLogCapture(async (event, data) => {
  try {
    const session = await getTgcSession();
    if (!session) {
      return { success: false, error: 'Not logged into TheGameCrafter' };
    }
    
    const gameCrafterSession = await createSessionFromLogin(session.id, session.userId);
    const designers = await listDesigners(gameCrafterSession);
    return { success: true, designers };
  }
  catch(error) {
    console.error('Error listing designers:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const uploadTemplativeProjectToGameCrafter = withLogCapture(async (event, data) => {
  try {
    const { gameDirectoryRootPath, outputDirectorypath, isPublish, isIncludingStock, isProofed, designerId } = data;
    
    const session = await getTgcSession();
    if (!session) {
      return { success: false, error: 'Not logged into TheGameCrafter' };
    }
    
    const gameCrafterSession = await createSessionFromLogin(session.id, session.userId);
    
    const gameUrl = await uploadGame(
      gameCrafterSession, 
      gameDirectoryRootPath, 
      outputDirectorypath, 
      isPublish, 
      isIncludingStock, 
      isProofed, 
      designerId
    );
    updateToast(`/${path.basename(outputDirectorypath)} uploaded to TheGameCrafter.`, "success");
    return { success: true, message: 'Game uploaded', gameUrl };
  } catch (error) {
    console.error('Error uploading game:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

const watchAndProduceTemplativeProject = async (gameDirectoryRootPath) => {
  await watchAndProduceGameFiles(gameDirectoryRootPath);
}

const createTemplativeIconFont = withLogCapture(async (event, data) => {
  try {
    const { name, svgFiles, outputPath } = data;
    
    // Create a temporary directory for the SVG files since createIconFont expects a directory
    const fs = require('fs').promises;
    const os = require('os');
    const tempDir = path.join(os.tmpdir(), `templative-icon-font-${Date.now()}`);
    
    try {
      // Create temp directory
      await fs.mkdir(tempDir, { recursive: true });
      
      // Copy SVG files to temp directory
      for (const svgFilePath of svgFiles) {
        const fileName = path.basename(svgFilePath);
        const destPath = path.join(tempDir, fileName);
        await fs.copyFile(svgFilePath, destPath);
      }
      
      // Create the icon font
      await createIconFont(name, tempDir, outputPath);
      
      updateToast(`Created ${name} icon font`, "success");
      return { success: true, message: 'Icon font created successfully' };
    } finally {
      // Clean up temp directory
      try {
        await fs.rm(tempDir, { recursive: true });
      } catch (cleanupError) {
        console.warn('Failed to clean up temp directory:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error creating icon font:', error);
    captureException(error);
    updateToast(error.message, "error");
    return { success: false, error: error.message };
  }
});

module.exports = {
  createTemplativeComponent,
  produceTemplativeProject,
  getPreviewsDirectory,
  previewPiece,
  createTemplativeProject,
  createPlaygroundPackage,
  createPrintout,
  createSimulatorSave,
  listGameCrafterDesigners,
  uploadTemplativeProjectToGameCrafter,
  watchAndProduceTemplativeProject,
  createTemplativeIconFont
} 