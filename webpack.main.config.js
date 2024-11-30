module.exports = {
  entry: './src/main/main.js',
  module: {
    rules: [
      {
        test: /native_modules\/.+\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@zeit/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
};
