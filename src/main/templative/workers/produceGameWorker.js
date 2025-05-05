const { parentPort, workerData } = require('worker_threads');
const { produceGame } = require('../lib/produce/gameProducer');

async function runProduction() {
  try {
    const { directoryPath, componentFilter, isSimple, isPublished, language, isClipped, renderMode, renderProgram, overlappingRenderingTasks } = workerData;
    
    // Override console.log to capture logs
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
      parentPort.postMessage({ type: 'log', log: message });
      originalConsoleLog.apply(console, args);
    };

    const outputDirectoryPath = await produceGame(
      directoryPath, 
      componentFilter, 
      isSimple,
      isPublished, 
      language, 
      isClipped,
      renderMode,
      renderProgram,
      overlappingRenderingTasks
    );

    parentPort.postMessage({ success: true, data: {outputDirectoryPath} });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

runProduction(); 
