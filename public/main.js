const { app, BrowserWindow, Menu } = require('electron')
var kill  = require('tree-kill');
const { spawn } = require('child_process');
const fs = require("fs")
const {mainMenu} = require("./menuMaker")
const {listenForRenderEvents} = require("./listenForRenderEvents")

app.setName('Templative');

var reactProcess = undefined
var pythonProcess = undefined
var templativeWindow = undefined

const createWindow = () => {
    templativeWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: "Templative",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
      },
      icon: __dirname + "/favicon.ico"
    })
  
    Menu.setApplicationMenu(mainMenu);
    templativeWindow.loadURL('http://localhost:3000');
    templativeWindow.webContents.openDevTools()
    templativeWindow.on("close", () => {
        shutdown()
    })
}

const waitforhost = async (url, interval = 1000, attempts = 10) => {

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
        console.log(`${e}\n${url} failed. Trying ${count} of ${attempts}`)
      }
    }

    reject(new Error(`${url} is down: ${count} attempts tried`))
  })
}
const installImageMagick = () => {
  var resourcePath = app.isPackage ? process.resourcesPath : "."
  var imageMagickParentDirectory = `${resourcePath}/bin`
  var imageMagickTar = `${imageMagickParentDirectory}/ImageMagick-x86_64-apple-darwin20.1.0.tar.gz`
  var imageMagickOutputDirectory = `${imageMagickParentDirectory}/ImageMagick-7.0.10`
  // if (fs.existsSync(imageMagickOutputDirectory)) {
  //   console.log(`${imageMagickOutputDirectory} already exists.`)
  //   return 
  // }
  var commands = [
    // `tar xvzf ${imageMagickTar} -C ${imageMagickParentDirectory}`,
    `export MAGICK_HOME="${imageMagickOutputDirectory}"`,
    `export PATH="$MAGICK_HOME/bin:$PATH"`,
    `export DYLD_LIBRARY_PATH="$MAGICK_HOME/lib/"`
  ]
  // console.log("Installing ImageMagick")
  commands.forEach((command) => {
    spawn(command, {stdio: "inherit", shell: true})
    console.log(command)
  })
  // console.log(command)
}

const launchServers = async () => {
  try {
    var pythonProductionServerCommand = `${process.resourcesPath}/python/__main__ serve --port 8080`
    var pythonGlobalDevServerCommand = `templative serve --port 8080`
    var pythonDevServerCommand = `./python/__main__ serve --port 8080`
    // var pythonBuiltServerCommand = `/Users/oliverbarnum/Documents/git/templative-electron/python/dist/app/app` 
    var pythonServerCommand = app.isPackaged ? pythonProductionServerCommand : pythonDevServerCommand
    // pythonProcess = spawn(pythonServerCommand, { detached: false, shell: true, stdio: 'inherit' });
    // console.log(pythonServerCommand)
    // await waitforhost("http://localhost:8080/status", 2000, 20)
    
    var reactProductionServerCommand = `npx --yes serve -s ${process.resourcesPath}/build`
    var reactBuiltServerCommand = `npx --yes serve -s ./build`
    var reactDevServerCommand = `react-scripts start`
    var reactServerCommand = app.isPackaged ? reactProductionServerCommand : reactDevServerCommand
    reactProcess = spawn(reactServerCommand, { detached: false, shell: true, stdio: 'inherit' });
    console.log(reactServerCommand)
    await waitforhost("http://127.0.0.1:3000", 2000, 20)
    
    console.log(`Servers are up`)
    return 1
  } catch (err) {
    console.log(err)
    return 0
  }
}

app.whenReady().then(async () => {
  // installImageMagick()
  
  var serverStartResult = await launchServers()
  if (serverStartResult == 0) {
    console.log("Failure!")
    shutdown()
    return
  }
  createWindow()
  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
const shutdown = () => {
    kill(reactProcess.pid)
    // kill(pythonProcess.pid)
};
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      shutdown()
    }
})


listenForRenderEvents()