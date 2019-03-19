const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './projects/electron/main.ts',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'electron-main',
  mode: 'development',
  plugins: [
    new CopyWebpackPlugin(['projects/electron/package.json']),
  ],
  watch: true,
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../dist/electron'),
  },
};
