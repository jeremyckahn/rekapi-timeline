const path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: {
    tests: './test/index.js',
    demo: './demo/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  devServer: {
    port: 9123
  }
};
