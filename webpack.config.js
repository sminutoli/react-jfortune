// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/jfortune.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jfortune.bundle.js'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
