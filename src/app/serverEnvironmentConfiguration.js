
const TEMPLATIVE_SERVER_COMMANDS_BY_ENVIRONMENT = {
    "win32_PROD": {
        command: `"${process.resourcesPath}/bin/templative/templative.exe" serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_PROD": {
        command: `"${process.resourcesPath}/bin/templative/templative" serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_TEST_BUILT": {
        command: `./out/Templative-darwin-x64/Templative.app/Contents/Resources/bin/templative/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "win32_TEST_BUILT": {
        command: `C:/Users/User/Documents/git/templative-frontend/out/Templative-win32-x64/resources/bin/templative/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "GLOBALLY_INSTALLED": {
        command: `templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "win32_DEV":{
        command: `C:/Users/olive/Documents/git/templative-electron/bin/templative/templative.exe serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_DEV":{
        command: `/Users/oliverbarnum/Documents/git/templative-electron/bin/templative/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
}

module.exports =   {
    templativeServerCommandsByEnvironment: TEMPLATIVE_SERVER_COMMANDS_BY_ENVIRONMENT
}
