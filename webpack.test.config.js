const commonConfig = require('./webpack.common.config');
const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = Object.assign(commonConfig, {
  entry: {
    tests: './test/index.js',
    demo: './demo/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  devServer: {
    port: 9123
  },
  plugins: [
    new DashboardPlugin()
  ]
});
