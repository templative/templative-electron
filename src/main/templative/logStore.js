const { channels } = require('../../shared/constants');
const { BrowserWindow, ipcMain } = require('electron');

class LogStore {
  constructor() {
    // Ensure this is a singleton
    if (LogStore.instance) {
      return LogStore.instance;
    }
    
    LogStore.instance = this;
    this.logs = ["Welcome to Templative!"];
    this.maxLogs = 1000; // Limit to prevent memory issues
    
    // Set up IPC handler for log retrieval
    ipcMain.handle(channels.TO_SERVER_GET_LOGS, () => {
      return this.getLogs();
    });
  }

  addLog(message, isWarning = false, isError = false) {
    const formattedMessage = isWarning || isError ? `!!! ${message}` : message;
    this.logs.push(formattedMessage);
    
    // Trim logs if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Send to renderer
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send(channels.GIVE_LOG_MESSAGE, formattedMessage);
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

// Use a counter instead of a boolean flag to track nested calls
let logCaptureCount = 0;
const originalConsoleMethods = {
  log: console.log,
  warn: console.warn,
  error: console.error
};
let consoleOverridden = false;
// Add a callstack tracking variable
let capturedCallOrigin = null;

function withLogCapture(fn) {
  return async function(...args) {
    const needsToSetup = logCaptureCount === 0;
    logCaptureCount++;
    
    // Store the original Error.prepareStackTrace if we need to set up
    const originalPrepareStackTrace = needsToSetup ? Error.prepareStackTrace : null;
    
    try {
      // Only override console methods if this is the first capturing call
      if (needsToSetup && !consoleOverridden) {
        consoleOverridden = true;
        
        // Store the current call site to identify our execution context
        const tempError = new Error();
        Error.captureStackTrace(tempError);
        capturedCallOrigin = tempError.stack;
        
        console.log = function(...logArgs) {
          // Call original console method
          originalConsoleMethods.log.apply(console, logArgs);
          
          // Only capture if this call is from our execution context
          if (isFromCapturedContext()) {
            // Capture log
            const message = logArgs.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            
            // Add to centralized log store
            logStore.addLog(message);
          }
        };
        
        console.warn = function(...logArgs) {
          // Call original console method
          originalConsoleMethods.warn.apply(console, logArgs);
          
          // Only capture if this call is from our execution context
          if (isFromCapturedContext()) {
            // Capture log with warning prefix
            const message = logArgs.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            
            // Add to centralized log store
            logStore.addLog(message, true);
          }
        };
        
        console.error = function(...logArgs) {
          // Call original console method
          originalConsoleMethods.error.apply(console, logArgs);
          
          // Only capture if this call is from our execution context
          if (isFromCapturedContext()) {
            // Capture log with warning prefix (for errors)
            const message = logArgs.map(arg => {
              if (arg instanceof Error) {
                return arg.stack || arg.message;
              } else if (typeof arg === 'object') {
                return JSON.stringify(arg);
              } else {
                return String(arg);
              }
            }).join(' ');
            
            // Add to centralized log store
            logStore.addLog(message, true, true);
          }
        };
      }
      
      // Execute original function
      return await fn.apply(this, args);
    } finally {
      logCaptureCount--;
      
      // Only restore console methods if this is the last capturing call
      if (logCaptureCount === 0 && consoleOverridden) {
        console.log = originalConsoleMethods.log;
        console.warn = originalConsoleMethods.warn;
        console.error = originalConsoleMethods.error;
        consoleOverridden = false;
        capturedCallOrigin = null;
        
        // Restore original prepareStackTrace if we modified it
        if (originalPrepareStackTrace) {
          Error.prepareStackTrace = originalPrepareStackTrace;
        }
      }
    }
  };
}

// Helper function to determine if a console call is from our captured context
function isFromCapturedContext() {
  // Create a new error to get the current call stack
  const tempError = new Error();
  Error.captureStackTrace(tempError);
  const currentStack = tempError.stack;
  
  // Check if the current call is from the same module/file as the captured origin
  // This is a simplified approach - you might need more sophisticated checks
  // depending on your application structure
  
  // Get the calling file from the stack
  const callerMatch = currentStack.split('\n')[2]?.match(/\((.+?):\d+:\d+\)/);
  const callerFile = callerMatch ? callerMatch[1] : '';
  
  // If we can't determine the caller, err on the side of not capturing
  if (!callerFile) return false;
  
  // Check if this file is part of your application code (not node_modules)
  // You might need to adjust this check based on your project structure
  return !callerFile.includes('node_modules') && 
         (callerFile.includes('/src/') || callerFile.includes('\\src\\'));
}

// Export a singleton instance
const logStore = new LogStore();
module.exports = {
  logStore,
  withLogCapture
}; 