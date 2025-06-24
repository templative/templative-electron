const path = require('path');
const StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
  entry: 
  {
    index: './src/main/main.js',
    produceGameWorker: './src/main/templative/workers/produceGameWorker.js',
    previewPieceWorker: './src/main/templative/workers/previewPieceWorker.js'
  },
  output: {
    filename: (pathData) => {
      if (pathData.chunk.name === 'produceGameWorker') {
        return 'produceGameWorker.bundle.js';
      } else if (pathData.chunk.name === 'previewPieceWorker') {
        return 'previewPieceWorker.bundle.js';
      }
      return '[name].js';
    },
    path: path.resolve(__dirname, '.webpack/main')
  },

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
          filename: (pathData) => {
            const filename = pathData.filename;
            if (filename.includes('componentTemplateOutlines')) {
              return 'src/main/templative/lib/componentTemplateOutlines/[name][ext]';
            }
            return 'src/main/templative/lib/componentTemplates/[name][ext]';
          }
        }
      }
    ],
  },
  plugins: [
    new StringReplacePlugin({
      replacements: [
        {
          pattern: /produceGameWorker\.js/g,
          replacement: () => 'produceGameWorker.bundle.js'
        },
        {
          pattern: /previewPieceWorker\.js/g,
          replacement: () => 'previewPieceWorker.bundle.js'
        }
      ]
    }),
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
    'child_process',
    'worker_threads'
  ],
  devtool: 'eval-cheap-module-source-map'
};
