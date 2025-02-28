const { COMPONENT_INFO } = require('./lib/componentInfo');
const { STOCK_COMPONENT_INFO } = require('./lib/stockComponentInfo');
const { createComponentByType } = require('./lib/create/componentCreator');
const { produceGame, getPreviewsPath, producePiecePreview } = require('./lib/produce/gameProducer');
const { convertToTabletopPlayground } = require('./lib/distribute/playground/playground');
const { createPdfForPrinting } = require('./lib/distribute/printout/printout');
const { convertToTabletopSimulator } = require('./lib/distribute/simulator/simulator');

const getComponentInfo = async () => {
  return COMPONENT_INFO;
}

const getStockComponentInfo = async () => {
  return STOCK_COMPONENT_INFO;
}

const createTemplativeComponent = async (event, data) => {
  try {
    const { componentName, componentType, directoryPath, componentAIDescription } = data;
    
    await createComponentByType(directoryPath, componentName, componentType, componentAIDescription)
    
    return { success: true };
  } catch (error) {
    console.error('Error creating component:', error);
    return { success: false, error: error.message };
  }
}

// Stub implementation for producing a game
const produceTemplativeProject = async (event, request) => {
  try {
    const { isDebug, isComplex, componentFilter, language, directoryPath } = request;
    
    const outputDirectoryPath = await produceGame(directoryPath, componentFilter, !isComplex, false, language)

    return { success: true, outputDirectoryPath };
  } catch (error) {
    console.error('Error producing game:', error);
    return { success: false, error: error.message };
  }
}

// Stub implementation for getting previews directory
const getPreviewsDirectory = async (event) => {
  try {
    // This would normally return the actual previews directory
    // For now, we'll just return a placeholder
    return { previewsDirectory: getPreviewsPath() };
  } catch (error) {
    console.error('Error getting previews directory:', error);
    return { success: false, error: error.message };
  }
}

// Stub implementation for previewing a piece
const previewPiece = async (event, data) => {
  try {
    const { componentFilter, pieceFilter, language, directoryPath } = data;
    
    await producePiecePreview(directoryPath, componentFilter, pieceFilter, language)
    
    return { success: true, message: 'Piece preview generated' };
  } catch (error) {
    console.error('Error previewing piece:', error);
    return { success: false, error: error.message };
  }
}

const createTemplativeProject = async (event, data) => {
  try {
    const { directoryPath } = data;
    
    await createProjectInDirectory(directoryPath);
    return { success: true, message: 'Piece preview generated' };
  } catch (error) {
    console.error('Error previewing piece:', error);
    return { success: false, error: error.message };
  }
}

// Implementation for creating a Tabletop Playground package
const createPlaygroundPackage = async (event, data) => {
  try {
    const { outputDirectorypath, playgroundPackagesDirectorypath } = data;
    
    const result = await convertToTabletopPlayground(outputDirectorypath, playgroundPackagesDirectorypath);
    
    return { success: result === 1, message: 'Playground package created' };
  } catch (error) {
    console.error('Error creating Playground package:', error);
    return { success: false, error: error.message };
  }
}

const createPrintout = async (event, data) => {
  try {
    const { outputDirectorypath, isBackIncluded, size, areMarginsIncluded } = data;
    
    const result = await createPdfForPrinting(outputDirectorypath, isBackIncluded, size, areMarginsIncluded);
    
    return { success: result === 1, message: 'Printout PDF created' };
  } catch (error) {
    console.error('Error creating printout:', error);
    return { success: false, error: error.message };
  }
}

const createSimulatorSave = async (event, data) => {
  try {
    const { outputDirectorypath, tabletopSimulatorDocumentsDirectorypath } = data;
    
    const result = await convertToTabletopSimulator(outputDirectorypath, tabletopSimulatorDocumentsDirectorypath);
    
    return { success: result === 1, message: 'Simulator save created' };
  } catch (error) {
    console.error('Error creating simulator save:', error);
    return { success: false, error: error.message };
  }
}

const listGameCrafterDesigners = async (event, data) => {
  try {
    // gameCrafterSession = await createSessionFromLogin(id, userId)
    // designers = await listDesigners(gameCrafterSession)
    return { success: true, designers };
  }
  catch(error) {
    console.error('Error listing designers:', error);
    return { success: false, error: error.message };
  }
}

const uploadTemplativeProjectToGameCrafter = async (event, data) => {
  try {
    const { gameRootDirectoryPath, outputDirectory, isPublish, isStock, isProofed, designerId } = data;
    
    // const result = await uploadGame(gameCrafterSession, gameRootDirectoryPath, outputDirectory, isPublish, isStock, isProofed, designerId);
    
    return { success: true, message: 'Game uploaded' };
  } catch (error) {
    console.error('Error uploading game:', error);
    return { success: false, error: error.message };
  }
}
module.exports = {
  getComponentInfo,
  getStockComponentInfo,
  createTemplativeComponent,
  produceTemplativeProject,
  getPreviewsDirectory,
  previewPiece,
  createTemplativeProject,
  createPlaygroundPackage,
  createPrintout,
  createSimulatorSave,
  listGameCrafterDesigners,
  uploadTemplativeProjectToGameCrafter
} 