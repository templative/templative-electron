module.exports = {
  entry: './src/main.js',
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json']
  },
};
