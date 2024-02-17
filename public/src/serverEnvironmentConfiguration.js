
const TEMPLATIVE_SERVER_COMMANDS_BY_ENVIRONMENT = {
    "win32_PROD": {
        command: `${process.resourcesPath}/bin/templative.exe serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_PROD": {
        command: `${process.resourcesPath}/bin/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_TEST_BUILT": {
        command: `./out/Templative-darwin-x64/Templative.app/Contents/Resources/bin/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "win32_TEST_BUILT": {
        command: `C:/Users/User/Documents/git/templative-frontend/out/Templative-win32-x64/resources/bin/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "GLOBALLY_INSTALLED": {
        command: `templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "win32_DEV":{
        command: `C:/Users/User/Documents/git/templative-frontend/bin/templative.exe serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
    "darwin_DEV":{
        command: `/Users/oliverbarnum/Documents/git/templative-electron/bin/templative serve --port 8080`,
        testEndpoint: "http://localhost:8080/status"
    },
}
const REACT_SERVER_COMMANDS_BY_ENVIRONMENT = {
    "win32_PROD": {
      command:`${process.resourcesPath}/bin/reactServer-win.exe ${process.resourcesPath}/build`,
      testEndpoint: "http://localhost:3000"
    },
    "darwin_PROD": {
        command:`${process.resourcesPath}/bin/reactServer-macos ${process.resourcesPath}/build`,
        testEndpoint: "http://localhost:3000"
    },
    "win32_TEST_BUILT": {
      command:`./bin/reactServer.exe ./build`,
      testEndpoint: "http://127.0.0.1:3000"
    },
    "darwin_TEST_BUILT": {
        command:`./bin/reactServer ./build`,
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
