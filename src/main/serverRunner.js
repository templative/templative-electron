var kill  = require('tree-kill');
const { spawn } = require('child_process');
const {log, error} = require("./logger")
const killPort = require('kill-port');

const sleep = ms => new Promise(r => setTimeout(r, ms))

const MAX_BACKOFF_DELAY = 10000; // 10 seconds maximum delay

module.exports = class ServerRunner {
    serverName = undefined
    port = undefined
    #commandListByEnvironment = {}
    #serverProcess = undefined
    #progressCallback = () => {};

    constructor(serverName, port, commandListByEnvironment) {
        if (serverName === undefined) {
            throw new Error("serverName cannot be undefined.")
        }
        if (port === undefined) {
            throw new Error("port cannot be undefined.")
        }
        if (commandListByEnvironment === undefined) {
            throw new Error("commandListByEnvironment cannot be undefined.")
        }
        if (Object.keys(commandListByEnvironment).length === 0) {
            throw new Error("commandListByEnvironment must have at least one environment command.")
        }
        this.serverName = serverName
        this.port = port
        this.#commandListByEnvironment = commandListByEnvironment
    }

    setProgressCallback(callback) {
        this.#progressCallback = callback;
    }

    #calculateBackoff(attempt, baseDelay = 1000) {
        return Math.min(baseDelay * Math.pow(2, attempt), MAX_BACKOFF_DELAY);
    }

    #getCommandConfigurationForEnvironmentAndOs = (environment) => {
        var os = process.platform
        var commandConfiguration = this.#commandListByEnvironment[`${os}_${environment}`]
        if (commandConfiguration !== undefined) {
            return commandConfiguration
        }
        return this.#commandListByEnvironment[environment]
    }
    #attemptStart = async (commandConfiguration, retries, pingCooldownMilliseconds)=> {
        try {
            // First check if port is in use
            try {
                await killPort(this.port, "tcp");
                // Add a small delay after killing the port
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                // Ignore "No process running on port" error as it's expected
                if (!err.message.includes('No process running on port')) {
                    error(`Error killing port ${this.port}: ${err}`);
                }
            }

            // Double-check the port is actually free before starting
            try {
                const tcpServer = require('net').createServer();
                await new Promise((resolve, reject) => {
                    tcpServer.once('error', err => {
                        tcpServer.close();
                        if (err.code === 'EADDRINUSE') {
                            reject(new Error(`Port ${this.port} is still in use`));
                        } else {
                            reject(err);
                        }
                    });
                    tcpServer.once('listening', () => {
                        tcpServer.close();
                        resolve();
                    });
                    tcpServer.listen(this.port);
                });
            } catch (err) {
                error(`Port ${this.port} is not available: ${err}`);
                return 0;
            }
            
            this.#progressCallback("Launching server...", 10);

            log(`${this.serverName} is launching ${commandConfiguration.command}.`)
            var spawnedProcess = spawn(commandConfiguration.command, { detached: false, shell: true});
            spawnedProcess.stdout.setEncoding('utf8');
            spawnedProcess.stdout.on('data', function(data) {
                log(`${data}`);
                console.log(`${data}`);
            });

            spawnedProcess.stderr.setEncoding('utf8');
            spawnedProcess.stderr.on('data', function(data) {
                error(`${data}`);
                console.log(`${data}`);
            });       

            spawnedProcess.on('close', function(code) {
                console.log(`${code}`);
                log(`Closing with code ${code}.`);
            });          
            this.#serverProcess = spawnedProcess
            
            var attempt = 0;
            while (attempt < retries) {
                const progress = Math.min(10 + ((attempt + 1) / retries) * 80, 90);
                this.#progressCallback(`Connecting to server (attempt ${attempt + 1}/${retries})...`, progress);

                const backoffDelay = this.#calculateBackoff(attempt);
                await sleep(backoffDelay);
        
                try {
                    const response = await fetch(commandConfiguration.testEndpoint)
                    if (response === undefined || !response.ok) {
                        attempt++;
                        continue;
                    }
                    this.#progressCallback("Server connected successfully!", 100);
                    return 1;
                } catch (e) {
                    attempt++;
                    log(`${this.serverName} ${commandConfiguration.testEndpoint} ping failed with ${e}. Trying ${attempt} of ${retries}`);
                }
            }
            this.#progressCallback("Server failed to start", 100);
            return 0;
        } catch (err) {
            error(`Error during start of ${this.serverName}: ${err}`);
            return 0;
        }
    }
    #launchServer = async (environment, retries=20, pingCooldownMilliseconds=2000) => {
        if (this.#serverProcess !== undefined) {
            throw new Error("Server is already running.")
        }
        try {
            var commandConfiguration = this.#getCommandConfigurationForEnvironmentAndOs(environment)
            if (commandConfiguration === undefined) {
                error(`No command for ${environment} env of ${this.serverName}.`)
                return 0
            }
            var result = await this.#attemptStart(commandConfiguration, retries, pingCooldownMilliseconds)
            if (result === 0) {
                return 0
            }
            log(`${this.serverName} connection established.`)
            return 1
        } catch (err) {
            error(`${commandConfiguration.command}\n${this.serverName} command failed due to: \n${err}.`)
            return 0
        }
    }
    attemptToStartServer = async (environment, retries=30, pingCooldownMilliseconds=2000) => {
        var serverStartResult = await this.#launchServer(environment, retries, pingCooldownMilliseconds)
        if (serverStartResult === 0) {
            error(`${this.serverName} failed to start`)
            this.shutdownServerIfRunning()
            return 0
        }
        return 1
    }
    shutdownServerIfRunning = async () => {
        if (this.#serverProcess === undefined) {
            return;
        }
        
        return new Promise((resolve) => {
            try {
                // First try SIGTERM for graceful shutdown
                kill(this.#serverProcess.pid, 'SIGTERM', async (err) => {
                    if (err) {
                        // If SIGTERM fails, try SIGINT
                        kill(this.#serverProcess.pid, 'SIGINT', async (err) => {
                            if (err) {
                                // As a last resort, use SIGKILL
                                kill(this.#serverProcess.pid, 'SIGKILL', () => {});
                            }
                        });
                    }
                    
                    // Force kill the port just to be sure
                    await killPort(this.port, "tcp").catch(() => {});
                    this.#serverProcess = undefined;
                    resolve();
                });
            } catch (err) {
                error(`Error during shutdown of ${this.serverName}: ${err}`);
                resolve();
            }
        });
    }
}