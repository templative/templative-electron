const path = require('path');
const { Worker } = require('worker_threads');
const createProduceGameWorker = (workerData, onSuccessCallback = () => {}) => {
  return new Promise((resolve, reject) => {
    try {
      const worker = new Worker("./src/main/templative/workers/produceGameWorker.js", {
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

const createPreviewPieceWorker = (workerData, onSuccessCallback = () => {}) => {
  return new Promise((resolve, reject) => {
    try {
      const worker = new Worker("./src/main/templative/workers/previewPieceWorker.js", {
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
  createProduceGameWorker,
  createPreviewPieceWorker
};