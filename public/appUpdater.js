const { app, autoUpdater, dialog } = require('electron')
const { updateElectronApp, UpdateSourceType } = require('update-electron-app');

const onUpdateRecieved = (event, releaseNotes, releaseName, updateURL) => {
    console.log(event, releaseName, releaseNotes, updateURL)
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response !== 0) {
        return
      } 
      autoUpdater.quitAndInstall()
    })
  }
const onError = (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
}
const onCheckingForUpdate = () => {
  console.log("Checking for update!")
}
const onUpdateAvailable = () => {
  console.log("Update!")
}
const onUpdateNotAvailable = () => {
  console.log("No update.")
}
const setupAppUpdateListener = () => {
    if (!app.isPackaged) {
        return
    }

    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.StaticStorage,
        baseUrl: `https://templative-artifacts.s3.us-west-2.amazonaws.com/${process.platform}/${process.arch}`
      }
    });
    // const baseUrl = `http://127.0.0.1:5000`// `https://www.templative.net`
    // const url = `${baseUrl}/updates?processplatform=${process.platform}`
    // console.log(`Listening for updates at ${url}.`)
    // autoUpdater.setFeedURL({ url })
    // setInterval(() => autoUpdater.checkForUpdates(), 60000)
    // autoUpdater.on('update-downloaded', onUpdateRecieved)
    // autoUpdater.on('error', onError)
    // autoUpdater.on('update-not-available', onUpdateNotAvailable)
    // autoUpdater.on('update-available', onUpdateAvailable)
    // autoUpdater.on('checking-for-update', onCheckingForUpdate)
}
module.exports = {
  setupAppUpdateListener
}