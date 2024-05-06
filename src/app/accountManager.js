const {  shell, BrowserWindow } = require('electron')
const { channels } = require("../shared/constants");
const { verifyCredentials, isTokenValid } = require("./templativeWebsiteClient")
const { clearSessionToken, saveSessionToken, getSessionToken } = require("./sessionStore")
const axios = require("axios");

const goToAccount = async(event, args) => {
    shell.openExternal("https://www.templative.net");
}
const giveLogout = async (event, args) => {
    await clearSessionToken()
    BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_LOGOUT);
}
const login = async (email, password) => {
    var response = await verifyCredentials(email, password)
    if (response.status === axios.HttpStatusCode.Unauthorized || response.status === axios.HttpStatusCode.Forbidden ) {
        BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_INVALID_LOGIN_CREDENTIALS);
        return
    }
    if (response.status !== axios.HttpStatusCode.Ok) {
        BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
        return
    }
    await saveSessionToken(response.token);
    BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_LOGGED_IN);
}

const giveLoginInformation = async () => {
    var token = await getSessionToken()
    if (!token) {
        // console.log("GIVE_NOT_LOGGED_IN because no saved token")
        BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    var response = await isTokenValid(token)
    if (response.status !== axios.HttpStatusCode.Ok) {
        // console.log("GIVE_NOT_LOGGED_IN because bad status code checking token validity", response.status)
        BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    console.log(response.isValid, response.isValid === false)
    if (!response.isValid) {
        // console.log("GIVE_NOT_LOGGED_IN because invalid token, clear session token")
        await clearSessionToken()
        BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    BrowserWindow.getFocusedWindow().webContents.send(channels.GIVE_LOGGED_IN);
}

module.exports = {
    login,  
    goToAccount,
    giveLogout,
    giveLoginInformation
}