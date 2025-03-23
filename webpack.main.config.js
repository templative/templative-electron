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
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'src/main/templative/lib/componentTemplates/[name][ext]'
        }
      }
    ],
  },
  plugins: [
  
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.svg', '.png']
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
