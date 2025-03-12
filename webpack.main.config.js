module.exports = {
  entry: './src/main/main.js',
  mode: 'development',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  module: {
    rules: [
      {
        test: /\.node$/,
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
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  externals: [
    'electron',
    'fs',
    'path',
    'os',
    'crypto',
    'child_process'
  ],
  devtool: 'eval-cheap-module-source-map'
};
