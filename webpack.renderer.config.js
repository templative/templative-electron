const webpack = require('webpack');

module.exports = {
  target: 'electron-renderer',
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'styleTag',
              esModule: false
            }
          }, 
          'css-loader'
        ],
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        exclude: [/node_modules\//, /src\/main\//]
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        exclude: [/node_modules\//, /src\/renderer\//],
        generator: {
          filename: 'assets/[name][ext]'
        },
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        exclude: [/node_modules\//],
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        },
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.svg', '.png']
  }
};
