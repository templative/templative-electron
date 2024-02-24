module.exports = [
    {
        // We're specifying native_modules in the test because the asset relocator loader generates a
        // "fake" .node file which is really a cjs file.
        test: /native_modules[/\\].+\.node$/,
        use: 'node-loader',
    },
    {
      test: /\.(png|jp(e*)g|svg|gif)$/,
      type: "asset/resource",
    },
    {
      test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
      parser: { amd: false },
      use: {
          loader: '@vercel/webpack-asset-relocator-loader',
          options: {
          outputAssetBase: 'native_modules',
          },
      },
    },
    {
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        exclude: /node_modules/,
        presets: ['@babel/preset-react']
      }
    }
  }
];