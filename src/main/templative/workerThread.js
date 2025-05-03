const { Worker } = require('worker_threads');
const path = require('path');
const { BrowserWindow } = require('electron');

const createWorker = (workerName, workerData, onSuccessCallback = () => {}) => {
  // Get the correct worker path based on environment
  const workerPath = new URL(`./workers/${workerName}.js`, import.meta.url);

  return new Promise((resolve, reject) => {
    try {
      const worker = new Worker(workerPath, {
        workerData
      });

      worker.on('message', (message) => {
        if (message.success !== undefined) {
          if (message.success) {
            onSuccessCallback(message.data);
            
            resolve(message.data);
          } else {
            reject(new Error(message.error));
          }
        } else if (message.type === 'log') {
          console.log(message.log);
        }
      });

      worker.on('error', (err) => {
        console.error('Worker error:', err);
        reject(err);
      });
      
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    } catch (err) {
      console.error('Failed to create worker:', err);
      reject(err);
    }
  });
}

module.exports = {
  createWorker
};