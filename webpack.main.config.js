const path = require('path');

module.exports = {
  entry: './src/main.js',
  module: {
    rules: require('./webpack.rules'),
  },
  externals: {
    keytar: 'commonjs2 keytar',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json']
  },
};
