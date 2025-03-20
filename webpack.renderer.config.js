const webpack = require('webpack');
const path = require('path');

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
        test: /\.(png|jpe?g|svg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /componentTemplates\/.+\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'componentTemplates/[name][ext]'
        }
      },
      {
        test: /componentPreviewImages\/.+\.(png)$/,
        type: 'asset/resource',
        generator: {
          filename: 'componentPreviewImages/[name][ext]'
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      '@templates': path.resolve(__dirname, 'src/main/templative/lib/create/componentTemplates'),
      '@previewImages': path.resolve(__dirname, 'src/main/templative/lib/componentPreviewImages'),
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
