/**
 * Find the most box-like shape (closest to a square) for a given count
 * @param {number} totalCount - Total number of items to arrange
 * @returns {Array<number>} - [columns, rows] for the most box-like arrangement
 */
function findBoxiestShape(totalCount) {
  if (totalCount <= 0) {
    return [0, 0];
  }

  const sideLength = Math.floor(Math.sqrt(totalCount));

  for (let i = sideLength; i > 0; i--) {
    if (totalCount % i === 0) {
      return [i, totalCount / i];
    }
  }

  return [1, totalCount];
}

module.exports = {
  findBoxiestShape
}; 