const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.js',
  externals: [nodeExternals()],
  module: {
    rules: require('./webpack.rules'),
  },
  
};
