const { updateElectronApp, UpdateSourceType } = require('update-electron-app')
const { app } = require('electron')

const setupAppUpdateListener = () => {
    if (!app.isPackaged) {
        return
    }
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.StaticStorage,
        baseUrl: `https://templative-artifacts.s3.amazonaws.com/${process.platform}/${process.arch}`
      },
      updateInterval: '1 hour',
      logger: require('electron-log')
    })
}
module.exports = {
  setupAppUpdateListener
}