const { BrowserWindow } = require('electron');
const { COMPONENT_INFO } = require('../../shared/componentInfo');
const { STOCK_COMPONENT_INFO } = require('../../shared/stockComponentInfo');
const { createComponentByType } = require('./lib/create/componentCreator');
const { produceGame, getPreviewsPath, producePiecePreview } = require('./lib/produce/gameProducer');
const { watchAndProduceGameFiles } = require('./lib/produce/cachePreProducerWatcher');
const { createProjectInDirectory } = require('./lib/create/projectCreator');
const { convertToTabletopPlayground } = require('./lib/distribute/playground/playground');
const { createPdfForPrinting } = require('./lib/distribute/printout/printout');
const { convertToTabletopSimulator } = require('./lib/distribute/simulator/simulator');
const { listDesigners } = require('./lib/distribute/gameCrafter/accountManagement/accountManagement');
const { createSessionFromLogin } = require('./lib/distribute/gameCrafter/util/gameCrafterSession');
const { uploadGame } = require('./lib/distribute/gameCrafter/client');
const { withLogCapture } = require('./logStore');
const { getTgcSession } = require('../../main/sessionStore');

const createTemplativeComponent = withLogCapture(async (event, data) => {
  try {
    const { componentName, componentType, directoryPath, componentAIDescription } = data;
    
    await createComponentByType(directoryPath, componentName, componentType, componentAIDescription)
    
    return { success: true };
  } catch (error) {
    console.error('Error creating component:', error);
    return { success: false, error: error.message };
  }
});

const produceTemplativeProject = withLogCapture(async (event, request) => {
  try {
    const { isDebug, isComplex, componentFilter, language, directoryPath } = request;
    
    const outputDirectoryPath = await produceGame(directoryPath, componentFilter, !isComplex, false, language)

    return { success: true, outputDirectoryPath };
  } catch (error) {
    console.error('Error producing game:', error);
    return { success: false, error: error.message };
  }
});

const getPreviewsDirectory = withLogCapture(async (event) => {
  try {
    return { previewsDirectory: getPreviewsPath() };
  } catch (error) {
    console.error('Error getting previews directory:', error);
    return { success: false, error: error.message };
  }
});

const previewPiece = withLogCapture(async (event, data) => {
  try {
    const { componentFilter, pieceFilter, language, directoryPath } = data;
    
    await producePiecePreview(directoryPath, componentFilter, pieceFilter, language)
    
    return { success: true, message: 'Piece preview generated' };
  } catch (error) {
    console.error('Error previewing piece:', error);
    return { success: false, error: error.message };
  }
});

const createTemplativeProject = withLogCapture(async (directoryPath, projectName, templateName) => {
  try {    
    await createProjectInDirectory(directoryPath, projectName, templateName);
    return { success: true, message: 'Project created' };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
});

const createPlaygroundPackage = withLogCapture(async (event, data) => {
  try {
    const { outputDirectorypath, playgroundPackagesDirectorypath } = data;
    
    const result = await convertToTabletopPlayground(outputDirectorypath, playgroundPackagesDirectorypath);
    
    return { success: result === 1, message: 'Playground package created' };
  } catch (error) {
    console.error('Error creating Playground package:', error);
    return { success: false, error: error.message };
  }
});

const createPrintout = withLogCapture(async (event, data) => {
  try {
    const { outputDirectorypath, isBackIncluded, size, areMarginsIncluded } = data;
    
    const result = await createPdfForPrinting(outputDirectorypath, isBackIncluded, size, areMarginsIncluded);
    
    return { success: result === 1, message: 'Printout PDF created' };
  } catch (error) {
    console.error('Error creating printout:', error);
    return { success: false, error: error.message };
  }
});

const createSimulatorSave = withLogCapture(async (event, data) => {
  try {
    const { outputDirectorypath, tabletopSimulatorDocumentsDirectorypath } = data;
    
    const result = await convertToTabletopSimulator(outputDirectorypath, tabletopSimulatorDocumentsDirectorypath);
    
    return { success: result === 1, message: 'Simulator save created' };
  } catch (error) {
    console.error('Error creating simulator save:', error);
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
    
    return { success: true, message: 'Game uploaded', gameUrl };
  } catch (error) {
    console.error('Error uploading game:', error);
    return { success: false, error: error.message };
  }
});

const watchAndProduceTemplativeProject = async (gameDirectoryRootPath) => {
  await watchAndProduceGameFiles(gameDirectoryRootPath);
}

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
  watchAndProduceTemplativeProject
} 