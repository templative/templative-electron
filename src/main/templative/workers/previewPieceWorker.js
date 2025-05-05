const { parentPort, workerData } = require('worker_threads');

const { producePiecePreview } = require('../lib/produce/gameProducer');

async function runPreviewPiece() {
  try {
    const { directoryPath, componentFilter, pieceFilter, language, renderProgram } = workerData;
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
      parentPort.postMessage({ type: 'log', log: message });
      originalConsoleLog.apply(console, args);
    };
    await producePiecePreview(directoryPath, componentFilter, pieceFilter, language, renderProgram);
    parentPort.postMessage({ success: true, data: {} });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

runPreviewPiece();
