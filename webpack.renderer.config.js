module.exports = {
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  }
};
