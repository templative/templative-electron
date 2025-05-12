
/**
 * Resolves a scoped value from game data
 * @param {string|Object} scopedValue - The scoped value to resolve
 * @param {Object} pieceGameData - Game data
 * @returns {Promise<string>} - The resolved value
 */

async function getScopedValue(scopedValue, pieceGameData) {
  if (scopedValue === null) {
      throw new Error("scopedValue cannot be null.");
  }

  const scope = scopedValue["scope"];
  const source = scopedValue["source"];

  let scopeData = null;
  if (scope === "studio") {
      scopeData = pieceGameData.studioDataBlob;
  } else if (scope === "game") {
      scopeData = pieceGameData.gameDataBlob;
  } else if (scope === "component") {
      scopeData = pieceGameData.componentDataBlob;
  } else if (scope === "piece") {
      scopeData = pieceGameData.pieceData ? pieceGameData.pieceData : pieceGameData.componentBackDataBlob;
  } else if (scope === "global") {
      return source;
  } else if (scope === "utility") {
      const utilityFunctions = {
          "git-sha": getCurrentGitSha
      };
      if (!(source in utilityFunctions)) {
          console.log(`Missing function ${source} not found in ${scope} scope.`);
          return source;
      }
      return utilityFunctions[source]();
  }

  if (!(source in scopeData)) {
      console.log(`Missing key ${source} not found in ${scope} scope.`);
      return source;
  }

  return scopeData[source];
}
module.exports = {
  getScopedValue
}; 