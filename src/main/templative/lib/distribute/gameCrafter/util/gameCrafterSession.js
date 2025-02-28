const axios = require('axios');
const { login: gameCrafterLogin, logout: gameCrafterLogout } = require('./httpOperations.js');

class GameCrafterSession {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000, // 30 seconds in milliseconds
      httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
    });
    this.sessionId = null;
    this.userId = null;
  }

  login(sessionId, userId) {
    this.sessionId = sessionId;
    this.userId = userId;
  }

  async close() {
    // Axios doesn't require manual closing, but we'll keep the method
    // for interface compatibility
    this.axiosInstance = null;
  }
}

async function login(publicApiKey, userName, userPassword) {
  const gameCrafterSession = new GameCrafterSession();

  try {
    const loginResult = await gameCrafterLogin(gameCrafterSession, publicApiKey, userName, userPassword);
    gameCrafterSession.login(loginResult.id, loginResult.user_id);
    return gameCrafterSession;
  } catch (e) {
    await gameCrafterSession.close();
    throw e;
  }
}

async function logout(gameCrafterSession) {
  await gameCrafterLogout(gameCrafterSession);
}

async function createSessionFromLogin(id, userId) {
  const gameCrafterSession = new GameCrafterSession();
  gameCrafterSession.login(id, userId);
  return gameCrafterSession;
}

module.exports = { GameCrafterSession, login, logout, createSessionFromLogin };
