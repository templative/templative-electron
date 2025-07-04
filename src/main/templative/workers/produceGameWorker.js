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

    // Override console.error to capture error logs
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
      parentPort.postMessage({ type: 'error', log: message });
      originalConsoleError.apply(console, args);
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
    // Send detailed error information including stack trace
    parentPort.postMessage({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      name: error.name,
      details: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    });
  }
}

runProduction(); 
