const { exec } = require('child_process');
const { log, error } = require("./logger");
const os = require('os');

const setupGitCredentialHelper = async () => {
    try {
        const platform = os.platform();
        let command;
        
        if (platform === 'win32') {
            command = 'git config --global credential.helper manager-core';
        } else if (platform === 'darwin') {
            command = 'git config --global credential.helper osxkeychain';
        } else {
            log('Git credential helper setup not supported on this platform');
            return;
        }
        
        return new Promise((resolve, reject) => {
            exec(command, (err) => {
                if (err) {
                    error(`Failed to setup git credential helper: ${err}`);
                    reject(err);
                    return;
                }
                log('Git credential helper setup complete');
                resolve();
            });
        });
    } catch (err) {
        error(`Failed to setup git credential helper: ${err}`);
        throw err;
    }
};

module.exports = {
    setupGitCredentialHelper
}; 