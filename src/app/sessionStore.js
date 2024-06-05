const { app } = require('electron');
const path = require('path');
const storage = require('node-persist');
const crypto = require('crypto');

// Initialize storage
console.log(path.join(app.getPath('userData'), 'secure-storage'))
storage.init({
    dir: path.join(app.getPath('userData'), 'secure-storage'),
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,
    continuous: true,
    interval: false,
    ttl: false
});

// Encryption key (must be 32 bytes for aes-256)
const ENCRYPTION_KEY = crypto.randomBytes(32); // Replace with a secure key
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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

module.exports = {
    clearSessionToken,
    saveSessionToken,
    getSessionToken,
    getEmail,
    saveEmail,
    clearEmail
}
