const { app, BrowserWindow, Menu, protocol  } = require('electron')

const createStartupWindow = () => {
    var startupWindow = new BrowserWindow({
      width: 125 * 2, height: 100 * 2,
      title: "Templative Startup",
      center:true, resizable:false, movable: true, minimizable: false,
      maximizable: false, closable: false, focusable: false, alwaysOnTop: false,
      fullscreenable: false, skipTaskbar: true, frame: false, hiddenInMissionControl: true,
      titleBarStyle: "hidden", backgroundColor: '#282c34',
      show: false,
      icon: __dirname + "/favicon.ico",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webSecurity: false,
      },
    })
    startupWindow.loadURL(`file://${__dirname}/startup.html`);
    startupWindow.show()
    return startupWindow
  }