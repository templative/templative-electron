const path = require('path');

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
          filename: 'src/main/templative/lib/componentTemplates/[name][ext]'
        }
      },
      {
        test: /src\/main\/templative\/workerThread.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'produceGameWorker.js',
          replace: 'produceGameWorker.bundle.js'
        }
      },
      {
        test: /src\/main\/templative\/workerThread.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'previewPieceWorker.js',
          replace: 'previewPieceWorker.bundle.js'
        }
      }
    ],
  },
  plugins: [],
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
