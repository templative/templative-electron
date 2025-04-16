const path = require("path")
const axios = require("axios");
const os = require("os");
const {  shell, BrowserWindow,BrowserView, app } = require('electron')
const { channels } = require("../shared/constants");
const { verifyCredentials, isTokenValid, verifyCredentialsGoogle, loginIntoGameCrafter } = require("./templativeWebsiteClient")
const { clearSessionToken, clearEmail, saveSessionToken, saveEmail, getSessionToken, getEmail, getTgcSession, saveTgcSession, clearTgcSession, getGithubToken, saveGithubToken, clearGithubToken } = require("./sessionStore")
let mainWindow;
const { updateToast } = require("./toastNotifier");

const goToAccount = async(event, args) => {
    shell.openExternal("https://templative.net/");
}
const reportBug = async(event, args) => {
    shell.openExternal("https://discord.com/channels/1257955995918008351/1261183276387799123");
}
const giveFeedback = async(event, args) => {
    shell.openExternal("https://discord.com/channels/1257955995918008351/1257956358435639419");
}
const viewDocumentation = async(event, args) => {
    shell.openExternal("https://templative.net/docs");
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
    updateToast("Logged in successfully.", "success");
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, response.token, email);
}
const giveLoginInformation = async () => {
    // if (!app.isPackaged) {
    //     BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, "Fakeasstoken", "oliverbarnum32@gmail.com");
    //     return
    // }
    var token = await getSessionToken()
    var email = await getEmail()
    if (!token || !email) {
        // console.warn("GIVE_NOT_LOGGED_IN because no saved token")
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    var response = await isTokenValid(email, token)
    if (response.statusCode !== axios.HttpStatusCode.Ok) {
        // console.warn("GIVE_NOT_LOGGED_IN because bad status code checking token validity", response.status)
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    if (!response.isValid) {
        // console.warn("GIVE_NOT_LOGGED_IN because invalid token, clear session token")
        await clearSessionToken()
        await clearEmail()
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, token, email);
}
const giveGithubAuth = async (_) => {
    return await getGithubToken();
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

    // Ensure we only have one instance of the app running
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        // If we can't get the lock, focus the existing window and quit this instance
        app.quit();
    } else {
        app.on('second-instance', async (event, commandLine, workingDirectory) => {
            // If a second instance is launched, focus the main window
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.focus();
                
                // Handle the deep link from the command line arguments
                const deepLink = commandLine.pop();
                await handleDeepLink(deepLink);
            }
        });

        // Handle deep links on macOS
        app.on('open-url', async (event, url) => {
            event.preventDefault();
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.focus();
                await handleDeepLink(url);
            }
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
    var parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.toLowerCase();
    console.log("Deep Link URL", url)
    // Handle TheGameCrafter SSO callback - make sure it's the right protocol
    if (protocol === 'templative:' && parsedUrl.searchParams.has('sso_id')) {
        const ssoId = parsedUrl.searchParams.get('sso_id');
        if (!ssoId) {
            console.error("No SSO ID found in TGC callback");
            return;
        }
        const data = await loginIntoGameCrafter(ssoId);
        await saveTgcSession(data["result"]["id"], data["result"]["user_id"]);
        updateToast("Logged into TheGameCrafter successfully.", "success");
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TGC_LOGIN_STATUS, { isLoggedIn: true });
        return;
    }

    // For some reason, on Windows, the URL is missing a trailing =
    if (os.platform() === "win32") {
        url = url + "="
    }
    parsedUrl = new URL(url);
    // Handle Templative.net OAuth callback
    const data = parsedUrl.searchParams.get('data');
    if (!data) {
        console.error("No data parameter found in the URL");
        return;
    }
    const { token, email } = grabTokenAndEmail(data);
    if (!(token && email)) {
        console.error("Missing info token and email.");
        return;
    }
    await saveSessionToken(token);
    await saveEmail(email);
    mainWindow.webContents.send(channels.GIVE_LOGGED_IN, token, email);
}

async function getTgcSessionFromStore() {
    try {
        const session = await getTgcSession();
        return { 
            isLoggedIn: session !== null,
            sessionInfo: session ? {
                hasId: !!session.id,
                hasUserId: !!session.userId
            } : null
        };
    } catch (error) {
        console.error("Error getting TGC session:", error);
        return { isLoggedIn: false, error: error.message };
    }
}

async function logoutTgc() {
    await clearTgcSession()
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TGC_LOGIN_STATUS, { isLoggedIn: false });
}

async function clearGithubAuth(_) {
    await clearGithubToken();
}

async function pollGithubAuth(_, deviceCode) {
    let pollAttempts = 0;
    const maxAttempts = 12; // 1 minute total polling time
    const pollDelay = 10000; // 10 seconds between polls

    // Wait 10 seconds before first poll
    await new Promise(resolve => setTimeout(resolve, 10000));

    const pollInterval = setInterval(async () => {
        try {
            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: "Ov23liv6aAD44ZpLEdPY",
                    device_code: deviceCode,
                    grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
                })
            });

            const data = await response.json();
            pollAttempts++;

            if (data.error) {
                if (data.error === 'authorization_pending') {
                    if (pollAttempts >= maxAttempts) {
                        clearInterval(pollInterval);
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            channels.GIVE_GITHUB_AUTH_ERROR, 
                            'Authorization timeout. Please try again.'
                        );
                    }
                    return;
                }
                clearInterval(pollInterval);
                BrowserWindow.getAllWindows()[0].webContents.send(
                    channels.GIVE_GITHUB_AUTH_ERROR, 
                    data.error_description || 'Authorization failed'
                );
                return;
            }

            clearInterval(pollInterval);
            await saveGithubToken(data.access_token)
            BrowserWindow.getAllWindows()[0].webContents.send(
                channels.GIVE_GITHUB_AUTH_SUCCESS, 
                data.access_token
            );

        } catch (error) {
            clearInterval(pollInterval);
            BrowserWindow.getAllWindows()[0].webContents.send(
                channels.GIVE_GITHUB_AUTH_ERROR, 
                'Failed to connect to GitHub'
            );
        }
    }, pollDelay);
}

module.exports = {
    setupOauthListener,
    login,  
    goToAccount,
    giveLogout,
    giveLoginInformation,
    getTgcSessionFromStore,
    logoutTgc,
    pollGithubAuth,
    giveGithubAuth,
    clearGithubAuth,
    reportBug,
    giveFeedback,
    viewDocumentation
}