const path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { name, version } = require('./package.json');

const dist = 'dist';

module.exports = {
  entry: {
    'rekapi-timeline': './src/rekapi-timeline.js',
    tests: './test/index.js',
    demo: './demo/index.js'
  },
  output: {
    path: path.join(__dirname, `${dist}`),
    filename: '[name].js',
    library: 'rekapi-timeline',
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
