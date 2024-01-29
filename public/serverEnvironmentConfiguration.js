
const TEMPLATIVE_SERVER_COMMANDS_BY_ENVIRONMENT = {
    "win32_PROD": {
        command: `${process.resourcesPath}/python/__main__.exe serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_PROD": {
        command: `${process.resourcesPath}/python/__main__ serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_TEST_BUILT": {
        command: `./out/Templative-darwin-x64/Templative.app/Contents/Resources/python/__main__ serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "win32_TEST_BUILT": {
        command: `C:/Users/User/Documents/git/templative-frontend/out/Templative-win32-x64/resources/python/__main__ serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "GLOBALLY_INSTALLED": {
        command: `templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "win32_DEV":{
        command: `C:/Users/User/Documents/git/templative-frontend/python/__main__.exe serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_DEV":{
        command: `C:/Users/User/Documents/git/templative-frontend/python/__main__ serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
}
const REACT_SERVER_COMMANDS_BY_ENVIRONMENT = {
    "win32_PROD": {
      command:`${process.resourcesPath}/build/app.exe ${process.resourcesPath}/build`,
      testEndpoint: "http://localhost:3000"
    },
    "darwin_PROD": {
        command:`${process.resourcesPath}/build/app ${process.resourcesPath}/build`,
        testEndpoint: "http://localhost:3000"
      },
    "TEST_BUILT": {
      command:`./build/app ./build`,
      testEndpoint: "http://127.0.0.1:3000"
    },
    "GLOBALLY_INSTALLED": {
      command:`react-scripts start`,
      testEndpoint: "http://127.0.0.1:3000"
    },
    "DEV": {
      command:`react-scripts start`,
      testEndpoint: "http://127.0.0.1:3000"
    }
}

module.exports =   {
    reactServerCommandsByEnvironment: REACT_SERVER_COMMANDS_BY_ENVIRONMENT,
    templativeServerCommandsByEnvironment: TEMPLATIVE_SERVER_COMMANDS_BY_ENVIRONMENT
}
