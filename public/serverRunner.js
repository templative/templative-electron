
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

    #getCommandConfigurationForEnvironmentAndOs = (environment) => {
        var os = process.platform
        var commandConfiguration = this.#commandListByEnvironment[`${os}_${environment}`]
        if (commandConfiguration !== undefined) {
            return commandConfiguration
        }
        return this.#commandListByEnvironment[environment]
    }
    #attemptStart = async (commandConfiguration, retries, pingCooldownMilliseconds)=> {
        log(`Killing any process at port ${this.#port}...`)
        await killPortProcess(this.#port);

        log(`${this.serverName} is launching ${commandConfiguration.command}.`)
        var spawnedProcess = spawn(commandConfiguration.command, { detached: false, shell: true, stdio: ["pipe", "pipe", "pipe"]});
        spawnedProcess.stdout.pipe(process.stdout);            
        this.#serverProcess = spawnedProcess
        
        var count = 1
        while (count < retries) {

            await sleep(pingCooldownMilliseconds)
    
            try {
                const response = await fetch(commandConfiguration.testEndpoint)
                if (response === undefined || !response.ok) {
                    count++
                    continue
                }
                return 1
            } catch (e) {
                count++
                log(`${this.serverName} ${commandConfiguration.testEndpoint} ping failed with ${e}. Trying ${count} of ${retries}`)
            }
        }
        return 0
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
    shutdownServerIfRunning = ()=> {
        if (this.#serverProcess === undefined) {
            return
        }
        this.#serverProcess.kill()
        kill(this.#serverProcess.pid)
    }
}