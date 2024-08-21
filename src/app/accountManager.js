const path = require("path")
const axios = require("axios");
const {  shell, BrowserWindow,BrowserView, app } = require('electron')
const { channels } = require("../shared/constants");
const { verifyCredentials, isTokenValid, verifyCredentialsGoogle } = require("./templativeWebsiteClient")
const { clearSessionToken, clearEmail, saveSessionToken, saveEmail, getSessionToken, getEmail } = require("./sessionStore")
let mainWindow;

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

function setupOauthListener(window) {
    mainWindow = window;

    if (process.defaultApp) {
        if (process.argv.length >= 2) {
            app.setAsDefaultProtocolClient('templative', process.execPath, [path.resolve(process.argv[1])]);
        }
    } else {
        app.setAsDefaultProtocolClient('templative');
    }

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        app.quit();
    } else {
        app.on('second-instance', async (event, commandLine, workingDirectory) => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.focus();
            }

            const deepLink = commandLine.pop().slice(0, -1);
            await handleDeepLink(deepLink);
        });

        app.on('open-url', async (event, url) => {
            event.preventDefault();
            await handleDeepLink(url);
        });
    }
}

function decodeBase64(encodedData) {
    return decodeURIComponent(escape(atob(encodedData)));
}

function grabTokenAndEmail(data) {
    const [encodedToken, encodedEmail] = data.split('.');
    const token = decodeBase64(encodedToken);
    const email = decodeBase64(encodedEmail);
    return { token, email };
}

async function handleDeepLink(url) {
    // console.log(url)
    var url = url + "="
    const parsedUrl = new URL(url);
    const data = parsedUrl.searchParams.get('data');
    
    if (!data) {
        console.error("No data parameter found in the URL");
        return
    }
    const { token, email } = grabTokenAndEmail(data);
    if (!(token && email)) {
        console.log("Missing info token and email.");
    }
    // console.log("Recieved deep link in accountManager.js:");
    // console.log(token);
    // console.log(email);
    await saveSessionToken(token);
    await saveEmail(email)
    mainWindow.webContents.send(channels.GIVE_LOGGED_IN, token, email);
}

module.exports = {
    setupOauthListener,
    login,  
    goToAccount,
    giveLogout,
    giveLoginInformation
}