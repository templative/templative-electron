const { app } = require('electron');
const path = require('path');
const storage = require('node-persist');
const crypto = require('crypto');

// Initialize storage
(async () => {
    await storage.init({
        dir: path.join(app.getPath('userData'), 'secure-storage'),
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        continuous: true,
        interval: false,
        ttl: false
    });
})();

const staticBytes = [
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20
];

const ENCRYPTION_KEY = Buffer.from(staticBytes);
const IV_LENGTH = 16; 

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const getSessionToken = async () => {
    const encryptedToken = await storage.getItem('Templative_sessionToken');
    return encryptedToken ? decrypt(encryptedToken) : null;
}

const saveSessionToken = async (sessionToken) => {
    const encryptedToken = encrypt(sessionToken);
    await storage.setItem('Templative_sessionToken', encryptedToken);
}

const clearSessionToken = async () => {
    await storage.removeItem('Templative_sessionToken');
}

const getEmail = async () => {
    const encryptedEmail = await storage.getItem('Templative_email');
    return encryptedEmail ? decrypt(encryptedEmail) : null;
}

const saveEmail = async (email) => {
    const encryptedEmail = encrypt(email);
    await storage.setItem('Templative_email', encryptedEmail);
}

const clearEmail = async () => {
    await storage.removeItem('Templative_email');
}

const saveTgcSession = async (id, userId) => {
    await storage.setItem('tgcSessionId', id);
    await storage.setItem('tgcUserId', userId);
}

const getTgcSession = async () => {
    try {
        const id = await storage.getItem('tgcSessionId');
        const userId = await storage.getItem('tgcUserId');
        
        // Check for undefined, null, or empty values
        if (!id || !userId) {
            console.log("Missing TGC session data:", { id: id || "missing", userId: userId || "missing" });
            return null;
        }
        
        return { id, userId };
    } catch (error) {
        console.error("Error retrieving TGC session:", error);
        return null;
    }
}

const clearTgcSession = async () => {
    await storage.removeItem('tgcSessionId');
    await storage.removeItem('tgcUserId');
}

const saveGithubToken = async (token) => {
    const encryptedToken = encrypt(token);
    await storage.setItem('Templative_githubToken', encryptedToken);
}

const getGithubToken = async () => {
    const encryptedToken = await storage.getItem('Templative_githubToken');
    return encryptedToken ? decrypt(encryptedToken) : null;
}

const clearGithubToken = async () => {
    await storage.removeItem('Templative_githubToken');
}

const saveUser = async (user) => {
    const encryptedUser = encrypt(JSON.stringify(user));
    await storage.setItem('Templative_user', encryptedUser);
}

const getUser = async () => {
    const encryptedUser = await storage.getItem('Templative_user');
    return encryptedUser ? JSON.parse(decrypt(encryptedUser)) : null;
}

const clearUser = async () => {
    await storage.removeItem('Templative_user');
}

const saveOAuthState = async (state) => {
    await storage.setItem('Templative_oauthState', state);
}

const getOAuthState = async () => {
    return await storage.getItem('Templative_oauthState');
}

const clearOAuthState = async () => {
    await storage.removeItem('Templative_oauthState');
}

module.exports = {
    clearSessionToken,
    saveSessionToken,
    getSessionToken,
    getEmail,
    saveEmail,
    clearEmail,
    saveTgcSession,
    getTgcSession,
    clearTgcSession,
    saveGithubToken,
    getGithubToken,
    clearGithubToken,
    saveUser,
    getUser,
    clearUser,
    saveOAuthState,
    getOAuthState,
    clearOAuthState
}
