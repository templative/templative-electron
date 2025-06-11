const path = require("path")
const axios = require("axios");
const os = require("os");
const {  shell, BrowserWindow,BrowserView, app } = require('electron')
const { channels } = require("../shared/constants");
const { loginUsingEmailAndPassword, isTokenValid, initiateGoogleOAuth, refreshToken, logout, loginIntoGameCrafter, doesUserOwnTemplative } = require("../shared/TemplativeApiClient")
const { 
    clearSessionToken, 
    clearEmail, 
    saveSessionToken, 
    saveEmail, 
    getSessionToken, 
    getEmail, 
    getTgcSession, 
    saveTgcSession, 
    clearTgcSession, 
    getGithubToken, 
    saveGithubToken, 
    clearGithubToken,
    saveUser,
    getUser,
    clearUser,
    saveOAuthState,
    getOAuthState,
    clearOAuthState
} = require("./sessionStore")
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
    try {
        // Call the logout endpoint
        await logout();
        
        // Clear all stored authentication data
        await clearSessionToken()
        await clearEmail()
        await clearUser()
        await clearOAuthState()
        
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGOUT);
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local data even if server call fails
        await clearSessionToken()
        await clearEmail()
        await clearUser()
        await clearOAuthState()
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGOUT);
    }
}

const login = async (_, email, password) => {
    var response = await loginUsingEmailAndPassword(email, password)
    if (response.statusCode === axios.HttpStatusCode.Unauthorized || response.statusCode === axios.HttpStatusCode.Forbidden ) {
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_INVALID_LOGIN_CREDENTIALS);
        return
    }
    if (response.statusCode !== axios.HttpStatusCode.Ok) {
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
        return
    }
    
    // Save the new JWT token and user data
    await saveSessionToken(response.token);
    await saveEmail(response.user.email);
    await saveUser(response.user);
    
    updateToast("Logged in successfully.", "success");
    // Send login success with ownership information
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, response.token, response.user.email, response.ownership);
}

const initiateGoogleLogin = async () => {
    try {
        const response = await initiateGoogleOAuth();
        
        if (response.statusCode !== axios.HttpStatusCode.Ok) {
            console.error('AccountManager: OAuth initiation failed with status:', response.statusCode);
            BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
            return { success: false, error: 'OAuth initiation failed' };
        }
        
        await saveOAuthState(response.state);
        shell.openExternal(response.authUrl);
        
        return { success: true, message: 'OAuth flow initiated' };
        
    } catch (error) {
        console.error('AccountManager: Google OAuth initiation failed:', error);
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
        return { success: false, error: error.message };
    }
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
    
    var response = await isTokenValid(token)
    if (response.statusCode !== axios.HttpStatusCode.Ok) {
        // console.warn("GIVE_NOT_LOGGED_IN because bad status code checking token validity", response.status)
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    
    if (!response.isValid) {
        // console.warn("GIVE_NOT_LOGGED_IN because invalid token, clear session token")
        await clearSessionToken()
        await clearEmail()
        await clearUser()
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_NOT_LOGGED_IN);
        return
    }
    
    // Update stored user data if it's different
    if (response.user) {
        await saveUser(response.user);
        await saveEmail(response.user.email);
    }
    
    // Send login success with ownership information
    BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, token, email, response.ownership);
}

const attemptTokenRefresh = async () => {
    try {
        const token = await getSessionToken();
        if (!token) {
            return false;
        }
        
        const response = await refreshToken(token);
        if (response.success && response.token) {
            await saveSessionToken(response.token);
            await saveUser(response.user);
            await saveEmail(response.user.email);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
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
            } else {
                console.error('AccountManager: No mainWindow available for deep link handling');
            }
        });
    }
}

async function handleDeepLink(url) {
    console.log('AccountManager: Handling deep link:', url);
    var parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.toLowerCase();
    
    // Handle Google OAuth callback - check for oauth-callback in hostname or search params
    if (protocol === 'templative:' && (
        parsedUrl.hostname === 'oauth-callback' || 
        parsedUrl.pathname === '//oauth-callback' ||
        parsedUrl.pathname === '/oauth-callback' ||
        url.includes('oauth-callback')
    )) {
        const token = parsedUrl.searchParams.get('token');
        const userParam = parsedUrl.searchParams.get('user');
        const error = parsedUrl.searchParams.get('error');
        
        if (error) {
            console.error('AccountManager: OAuth error:', error);
            updateToast("Google login failed: " + error, "error");
            BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
            return;
        }
        
        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                
                // Check ownership for OAuth users
                let ownershipInfo = { hasProduct: false };
                try {
                    const ownershipResponse = await doesUserOwnTemplative(user.email, token);
                    ownershipInfo = { hasProduct: ownershipResponse.hasProduct };
                } catch (ownershipError) {
                    console.error('Error checking ownership during OAuth callback:', ownershipError);
                    // Don't fail login if ownership check fails
                }
                
                // Save the authentication data
                await saveSessionToken(token);
                await saveEmail(user.email);
                await saveUser(user);
                await clearOAuthState(); // Clear the stored state
                
                updateToast("Logged in with Google successfully.", "success");
                BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_LOGGED_IN, token, user.email, ownershipInfo);
            } catch (parseError) {
                console.error('AccountManager: Error parsing user data:', parseError);
                updateToast("Google login failed: Invalid user data", "error");
                BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_UNABLE_TO_LOG_IN);
            }
        } else {
            console.error('AccountManager: Missing token or user data in OAuth callback');
        }
        return;
    }
    
    // Handle TheGameCrafter SSO callback - make sure it's the right protocol
    if (protocol === 'templative:' && parsedUrl.searchParams.has('sso_id')) {
        const ssoId = parsedUrl.searchParams.get('sso_id');
        if (!ssoId) {
            console.error("AccountManager: No SSO ID found in TGC callback");
            return;
        }
        const data = await loginIntoGameCrafter(ssoId);
        await saveTgcSession(data["result"]["id"], data["result"]["user_id"]);
        updateToast("Logged into TheGameCrafter successfully.", "success");
        BrowserWindow.getAllWindows()[0].webContents.send(channels.GIVE_TGC_LOGIN_STATUS, { isLoggedIn: true });
        return;
    }

    // Legacy Templative OAuth callback (keeping for backward compatibility)
    if (protocol === 'templative:' && !parsedUrl.searchParams.has('sso_id') && !parsedUrl.pathname.includes('oauth-callback')) {
        // For some reason, on Windows, the URL is missing a trailing =
        if (os.platform() === "win32") {
            url = url + "="
        }
        parsedUrl = new URL(url);
        
        const data = parsedUrl.searchParams.get('data');
        if (!data) {
            console.error("AccountManager: No data parameter found in the URL");
            return;
        }
        const { token, email } = grabTokenAndEmail(data);
        if (!(token && email)) {
            console.error("AccountManager: Missing info token and email.");
            return;
        }
        
        // Check ownership for legacy OAuth users
        let ownershipInfo = { hasProduct: false };
        try {
            const ownershipResponse = await doesUserOwnTemplative(email, token);
            ownershipInfo = { hasProduct: ownershipResponse.hasProduct };
        } catch (ownershipError) {
            console.error('Error checking ownership during legacy OAuth callback:', ownershipError);
            // Don't fail login if ownership check fails
        }
        
        await saveSessionToken(token);
        await saveEmail(email);
        mainWindow.webContents.send(channels.GIVE_LOGGED_IN, token, email, ownershipInfo);
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

// Add this function for testing deep links
const testDeepLink = async () => {
    const testUrl = 'templative://oauth-callback?token=test-token&user=' + encodeURIComponent(JSON.stringify({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User'
    }));
    await handleDeepLink(testUrl);
}

const checkTemplativeOwnership = async () => {
    try {
        const token = await getSessionToken();
        const email = await getEmail();
        
        if (!token || !email) {
            return { hasProduct: false, statusCode: 401 };
        }
        
        const response = await doesUserOwnTemplative(email, token);
        return response;
    } catch (error) {
        console.error('Error checking Templative ownership:', error);
        return { hasProduct: false, statusCode: 500 };
    }
}

module.exports = {
    setupOauthListener,
    login,  
    initiateGoogleLogin,
    goToAccount,
    giveLogout,
    giveLoginInformation,
    attemptTokenRefresh,
    getTgcSessionFromStore,
    logoutTgc,
    pollGithubAuth,
    giveGithubAuth,
    clearGithubAuth,
    reportBug,
    giveFeedback,
    viewDocumentation,
    testDeepLink,
    checkTemplativeOwnership
}