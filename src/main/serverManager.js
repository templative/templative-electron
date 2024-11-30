const {log, error, warn} = require("./logger")

module.exports = class ServerManager {
    #serverRunners = []
    constructor(serverRunners) {
        if (serverRunners === undefined) {
            throw "An array of serverRunners must be provided."
        }
        if (serverRunners.length === 0) {
            warn("No server runners were provided.")
        }
        this.#serverRunners = serverRunners
    }
    async runServers(environment) {
        for(var s = 0 ; s < this.#serverRunners.length ; s++) {
            var server = this.#serverRunners[s]
            var startupSuccess = await server.attemptToStartServer(environment)
            if (startupSuccess === 0) {
                await this.shutDownServers()
                return 0
            }
        }
        return 1
    }
    async shutDownServers() {
        try {
            // Wait for all servers to shut down
            await Promise.all(
                this.#serverRunners.map(serverRunner => serverRunner.shutdownServerIfRunning())
            );
            log("All servers shut down successfully");
        } catch (err) {
            error(`Error during server shutdown: ${err}`);
        }
    }
}