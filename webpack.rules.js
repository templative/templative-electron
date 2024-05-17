module.exports = [
  {
    // Specify native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    // Handle image assets
    test: /\.(png|jp(e*)g|svg|gif)$/,
    type: 'asset/resource',
  },
  {
    // Handle JavaScript and JSX files with Babel loader
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react'],
      },
    },
  },
];
