
var kill  = require('tree-kill');
const { spawn } = require('child_process');

module.exports = class ServerRunner {
    serverName = undefined
    #commandListByEnvironment = {}
    #pingUrl = undefined
    #serverProcess = undefined

    constructor(serverName, pingUrl, commandListByEnvironment) {
        if (serverName === undefined) {
            throw "serverName cannot be undefined."
        }
        if (pingUrl === undefined) {
            throw "pingUrl cannot be undefined."
        }
        if (commandListByEnvironment === undefined) {
            throw "commandListByEnvironment cannot be undefined."
        }
        if (Object.keys(commandListByEnvironment).length === 0) {
            throw "commandListByEnvironment must have at least one environment command."
        }
        this.serverName = serverName
        this.#pingUrl = pingUrl
        this.#commandListByEnvironment = commandListByEnvironment
    }
    
    #waitforhost = async (url, interval = 1000, attempts = 10) => {
        const sleep = ms => new Promise(r => setTimeout(r, ms))
        
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
            console.log(`${this.serverName} ${url} ping failed with ${e}. Trying ${count} of ${attempts}`)
            }
        }
    
        reject(new Error(`${url} is down: ${count} attempts tried`))
        })
    }
    #launchServer = async (environment, retries=20, pingCooldownMilliseconds=2000) => {
        if (this.#serverProcess !== undefined) {
            throw "Server is already running"
        }
        try {
            var command = this.#commandListByEnvironment[environment]
            if (command === undefined) {
                console.log("")
                return 0
            }
            this.#serverProcess = spawn(command, { detached: false, shell: true, stdio: 'inherit' });
            await this.#waitforhost(this.#pingUrl, pingCooldownMilliseconds, retries)
            return 1
        } catch (err) {
            console.log(err)
        return 0
        }
    }
    attemptToStartServer = async (environment, retries=20, pingCooldownMilliseconds=2000) => {
        var serverStartResult = await this.#launchServer(environment, retries, pingCooldownMilliseconds)
        if (serverStartResult == 0) {
            console.log(`${this.serverName} failed to start`)
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