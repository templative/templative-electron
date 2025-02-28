// Main API index file that exports all command groups
const create = require('./create/index');
const produce = require('./produce/index');
const manage = require('./manage/index');
const distribute = require('./distribute/index');

module.exports = {
  create,
  produce,
  manage,
  distribute
}; 