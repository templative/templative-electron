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
            presets: [
              '@babel/preset-react',
              ['@babel/preset-env', {
                modules: false,
                targets: {
                  esmodules: true
                }
              }]
            ]
          }
        },
        exclude: /node_modules\/(?!(@uiw)\/).*/
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            // For SVG imports in JS/JSX files that should be components
            resourceQuery: /react/, // matches ?react
            use: ['@svgr/webpack'],
          },
          {
            // For all other SVG imports
            type: 'asset/resource',
            generator: {
              filename: 'assets/[name][ext]'
            },
          }
        ],
        exclude: [/node_modules\//]
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
    extensions: ['.js', '.jsx', '.json', '.svg', '.png'],
    extensionAlias: {
      '.js': ['.js', '.ts', '.jsx'],
      '.mjs': ['.mjs', '.mts']
    }
  },
  experiments: {
    topLevelAwait: true
  }
};
