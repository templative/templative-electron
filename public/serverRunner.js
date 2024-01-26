
var kill  = require('tree-kill');
const { spawn } = require('child_process');
const {log, error} = require("./logger")
const { killPortProcess } = require('kill-port-process');

const sleep = ms => new Promise(r => setTimeout(r, ms))

module.exports = class ServerRunner {
    serverName = undefined
    #port = undefined
    #commandListByEnvironment = {}
    #serverProcess = undefined

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
        this.#port = port
        this.#commandListByEnvironment = commandListByEnvironment
    }
    
    #waitforhost = async (url, interval = 1000, attempts = 10) => {
        
        let count = 1
    
        return new Promise(async (resolve, reject) => {
        while (count < attempts) {
    
            await sleep(interval)
    
            try {
            const response = await fetch(url)
            if (response !== undefined && response.ok) {
                if (response.status === 200) {
                    resolve()
                    break
                }
            } else {
                count++
            }
            } catch (e) {
                count++
                log(`${this.serverName} ${url} ping failed with ${e}. Trying ${count} of ${attempts}`)
            }
        }
    
        reject(new Error(`${url} is down: ${count} attempts tried`))
        })
    }
    #getCommandConfigurationForEnvironmentAndOs = (environment) => {
        var os = process.platform
        var commandConfiguration = this.#commandListByEnvironment[`${os}_${environment}`]
        if (commandConfiguration !== undefined) {
            return commandConfiguration
        }
        return this.#commandListByEnvironment[environment]
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
            log(`Killing any process at port ${this.#port}...`)
            await killPortProcess(this.#port);

            log(`${this.serverName} is launching ${commandConfiguration.command}.`)
            var spawnedProcess = spawn(commandConfiguration.command, { detached: false, shell: true, stdio: ["pipe", "pipe", "pipe"]});
            spawnedProcess.stdout.pipe(process.stdout);            
            this.#serverProcess = spawnedProcess
            
            await this.#waitforhost(commandConfiguration.testEndpoint, pingCooldownMilliseconds, retries)
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
    shutdownServerIfRunning = ()=> {
        if (this.#serverProcess === undefined) {
            return
        }
        kill(this.#serverProcess.pid)
    }
}
