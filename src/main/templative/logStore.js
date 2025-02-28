const { channels } = require('../../shared/constants');
const { BrowserWindow, ipcMain } = require('electron');

class LogStore {
  constructor() {
    // Ensure this is a singleton
    if (LogStore.instance) {
      return LogStore.instance;
    }
    
    LogStore.instance = this;
    this.logs = [];
    this.maxLogs = 1000; // Limit to prevent memory issues
    
    // Set up IPC handler for log retrieval
    ipcMain.handle(channels.TO_SERVER_GET_LOGS, () => {
      return this.getLogs();
    });
  }

  addLog(message, isWarning = false, isError = false) {
    const formattedMessage = isWarning || isError ? `!!!${message}` : message;
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

function withLogCapture(fn) {
  return async function(...args) {
    // Save original console methods
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    // Override console methods
    console.log = function(...logArgs) {
      // Call original console method
      originalConsoleLog.apply(console, logArgs);
      
      // Capture log
      const message = logArgs.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      // Add to centralized log store
      logStore.addLog(message);
    };
    
    console.warn = function(...logArgs) {
      // Call original console method
      originalConsoleWarn.apply(console, logArgs);
      
      // Capture log with warning prefix
      const message = logArgs.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      // Add to centralized log store
      logStore.addLog(message, true);
    };
    
    console.error = function(...logArgs) {
      // Call original console method
      originalConsoleError.apply(console, logArgs);
      
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
    };
    
    try {
      // Execute original function
      return await fn.apply(this, args);
    } finally {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    }
  };
}

// Export a singleton instance
const logStore = new LogStore();
module.exports = {
  logStore,
  withLogCapture
}; 