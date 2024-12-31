const path = require("path")
const axios = require("axios");
const os = require("os");
const {  shell, BrowserWindow,BrowserView, app } = require('electron')
const { channels } = require("../shared/constants");
const { verifyCredentials, isTokenValid, verifyCredentialsGoogle } = require("./templativeWebsiteClient")
const { clearSessionToken, clearEmail, saveSessionToken, saveEmail, getSessionToken, getEmail, getTgcSession, saveTgcSession, clearTgcSession, getGithubToken, saveGithubToken, clearGithubToken } = require("./sessionStore")
let mainWindow;

const goToAccount = async(event, args) => {
    shell.openExternal("https://templative-server-84c7a76c7ddd.herokuapp.com/");
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

async function loginIntoGameCrafter(sso) {
    try {
        console.log('SSO:', sso);
        const response = await fetch(`https://templative-d1a3033da970.herokuapp.com/the-game-crafter/sso?sso=${sso}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to login into Game Crafter:', response.status, response.statusText);
            throw new Error('Failed to login into Game Crafter');
        }
        const data = await response.json();
        await saveTgcSession(data["result"]["id"], data["result"]["user_id"]);
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TGC_LOGIN_STATUS, { isLoggedIn: true });
    } catch (error) {
        console.error('Error fetching designers:', error);
    }
}

async function handleDeepLink(url) {
    var parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.toLowerCase();

    // Handle TheGameCrafter SSO callback - make sure it's the right protocol
    if (protocol === 'templative:' && parsedUrl.searchParams.has('sso_id')) {
        const ssoId = parsedUrl.searchParams.get('sso_id');
        if (!ssoId) {
            console.error("No SSO ID found in TGC callback");
            return;
        }
        await loginIntoGameCrafter(ssoId);
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
    const session = await getTgcSession();
    return { isLoggedIn: session !== null };
}

async function getDesigners() {
    try {
        var session = await getTgcSession()
        if (!session) {
            return { isLoggedIn: false, designers: [] }
        }
        
        const response = await fetch(`http://localhost:8085/the-game-crafter/designers?id=${session.id}&userId=${session.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 400) {
            await clearTgcSession();
            return { isLoggedIn: false, designers: [] };
        }

        if (!response.ok) {
            throw new Error('Failed to fetch designers');
        }

        const data = await response.json();
        return { isLoggedIn: true, designers: data.designers };
    } catch (error) {
        console.error('Error fetching designers:', error);
        return [];
    }
}

async function uploadGame(_,data) {
    try {
        var session = await getTgcSession()
        if (!session) {
            return { isLoggedIn: false }
        }
        const response = await fetch('http://localhost:8085/the-game-crafter/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                sessionId: session.id,
                userId: session.userId
            })
        });

        if (response.status === 440) {
            // Session is invalid/expired
            await clearTgcSession();
            return { isLoggedIn: false };
        }

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return { isLoggedIn: true };
    } catch (error) {
        console.error('Error uploading game:', error);
        return { isLoggedIn: true, error: error.message };
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
    getDesigners,
    uploadGame,
    logoutTgc,
    pollGithubAuth,
    giveGithubAuth,
    clearGithubAuth
}