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

module.exports = {
    clearSessionToken,
    saveSessionToken,
    getSessionToken
}