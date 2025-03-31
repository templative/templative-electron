const httpOperations = require('../util/httpOperations.js');

/**
 * Simple function to format data into an ASCII table
 * @param {Array} data Array of arrays containing row data
 * @param {Object} options Options object with headers array
 * @returns {String} Formatted table string
 */
function formatTable(data, { headers }) {
  if (!data || data.length === 0) return 'No data to display';
  
  // Calculate column widths based on data and headers
  const colWidths = headers.map((header, colIndex) => {
    const maxDataLength = data.reduce((max, row) => {
      return Math.max(max, String(row[colIndex] || '').length);
    }, 0);
    return Math.max(maxDataLength, header.length);
  });
  
  // Generate header row
  const headerRow = headers.map((header, i) => 
    header.padEnd(colWidths[i])).join(' | ');
  
  // Generate separator
  const separator = colWidths.map(width => 
    '-'.repeat(width)).join('-+-');
  
  // Generate data rows
  const rows = data.map(row => 
    row.map((cell, i) => 
      String(cell || '').padEnd(colWidths[i])).join(' | '));
  
  // Combine all parts
  return [headerRow, separator, ...rows].join('\n');
}

async function printUser(gameCrafterSession) {
  console.log(await httpOperations.getUser(gameCrafterSession));
}

async function listGames(gameCrafterSession) {
  const gamesResponse = await httpOperations.getGamesForUser(gameCrafterSession);
  await printGames(gamesResponse.items);
}

async function deletePageOfGames(gameCrafterSession) {
  const gamesResponse = await httpOperations.getGamesForUser(gameCrafterSession);
  let deleted = '';
  const tasks = [];
  for (const game of gamesResponse.items) {
    deleted += game.name + ' ';
    tasks.push(httpOperations.deleteGame(gameCrafterSession, game.id));
  }
  const res = await Promise.all(tasks);
}

async function listGamesForUserDesigners(gameCrafterSession) {
  const designersResponse = await httpOperations.getDesigners(gameCrafterSession);
  const designers = designersResponse.items;

  const games = [];
  for (const designer of designers) {
    const gamesResponse = await httpOperations.getGamesForDesignerId(gameCrafterSession, designer.id);
    games.push(...gamesResponse.items);
  }

  printGames(games);
}

async function printGames(games) {
  const headers = ['name', 'skuId', 'link'];
  const data = [];

  for (const game of games) {
    const gameName = game.name;
    const skuId = game.sku_id;
    const gameLink = 'https://www.thegamecrafter.com' + game.edit_uri;
    data.push([gameName, skuId, gameLink]);
  }

  console.log(formatTable(data, { headers }));
}

async function listDesigners(gameCrafterSession) {
  const designersResponse = await httpOperations.getDesigners(gameCrafterSession);
  return designersResponse.items;
}

module.exports = {
  printUser,
  listGames,
  deletePageOfGames,
  listGamesForUserDesigners,
  printGames,
  listDesigners,
};