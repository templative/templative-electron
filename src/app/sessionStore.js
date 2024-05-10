const keytar = require("keytar")

const getSessionToken = async () => {
    return await keytar.getPassword("Templative", 'sessionToken')
}
const saveSessionToken = async (sessionToken) => {
    await keytar.setPassword("Templative", 'sessionToken', sessionToken);
}
const clearSessionToken = async () => {
    await keytar.deletePassword("Templative", 'sessionToken');
}

const getEmail = async () => {
    return await keytar.getPassword("Templative", 'email')
}
const saveEmail = async (email) => {
    await keytar.setPassword("Templative", 'email', email);
}
const clearEmail = async () => {
    await keytar.deletePassword("Templative", 'email');
}


module.exports = {
    clearSessionToken,
    saveSessionToken,
    getSessionToken,
    getEmail,
    saveEmail,
    clearEmail
}