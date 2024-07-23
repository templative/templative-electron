const {  shell, BrowserWindow } = require('electron')
const { channels } = require("../shared/constants");
const { verifyCredentials, isTokenValid, verifyCredentialsGoogle } = require("./templativeWebsiteClient")
const { clearSessionToken, clearEmail, saveSessionToken, saveEmail, getSessionToken, getEmail } = require("./sessionStore")
const axios = require("axios");

const goToAccount = async(event, args) => {
    shell.openExternal("https://www.templative.net");
}
const giveLogout = async (event, args) => {
    await clearSessionToken()
    await clearEmail()
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGOUT);
}
const login = async (_, email, password) => {
    var response = await verifyCredentials(email, password)
    if (response.statusCode === axios.HttpStatusCode.Unauthorized || response.statusCode === axios.HttpStatusCode.Forbidden ) {
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_INVALID_LOGIN_CREDENTIALS);
        return
    }
    if (response.statusCode !== axios.HttpStatusCode.Ok) {
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
        return
    }
    await saveSessionToken(response.token);
    await saveEmail(email)
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, response.token, email);
}
const loginGoogle = async (_, token) => {
    var response = await verifyCredentialsGoogle(token)
    if (response.statusCode === axios.HttpStatusCode.Unauthorized || response.statusCode === axios.HttpStatusCode.Forbidden ) {
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_INVALID_LOGIN_CREDENTIALS);
        return
    }
    if (response.statusCode !== axios.HttpStatusCode.Ok) {
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
        return
    }
    await saveSessionToken(response.token);
    await saveEmail(response.email)
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, response.token, response.email);
}

const giveLoginInformation = async () => {
    var token = await getSessionToken()
    var email = await getEmail()
    if (!token || !email) {
        // console.log("GIVE_NOT_LOGGED_IN because no saved token")
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    var response = await isTokenValid(email, token)
    if (response.statusCode !== axios.HttpStatusCode.Ok) {
        // console.log("GIVE_NOT_LOGGED_IN because bad status code checking token validity", response.status)
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    if (!response.isValid) {
        // console.log("GIVE_NOT_LOGGED_IN because invalid token, clear session token")
        await clearSessionToken()
        await clearEmail()
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, token, email);
}

module.exports = {
    login,  
    loginGoogle,
    goToAccount,
    giveLogout,
    giveLoginInformation
}