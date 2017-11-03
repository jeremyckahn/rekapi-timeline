const path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const package = require('./package.json');
const { name, version } = package;

const dist = 'dist';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, `${dist}`),
    filename: `app.js`,
    library: `${name}`,
    libraryTarget: 'umd',
    umdNamedDefine: true
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
  plugins: [
    new CleanWebpackPlugin([ dist ]),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        unused: true
      },
      output: {
        comments: false
      }
    }),
    new Webpack.BannerPlugin(version),
  ]
};
