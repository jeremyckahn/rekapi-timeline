const commonConfig = require('./webpack.common.config');
const path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { name, version } = require('./package.json');

const dist = 'dist';

module.exports = Object.assign(commonConfig, {
  entry: {
    'rekapi-timeline': './src/index.js'
  },
  output: {
    path: path.join(__dirname, `${dist}`),
    filename: '[name].js',
    library: 'rekapi-timeline',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals : {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    },
    'react-draggable': {
      root: 'ReactDraggable',
      commonjs: 'react-draggable',
      commonjs2: 'react-draggable',
      amd: 'react-draggable'
    },
    rekapi: 'rekapi',
    shifty: 'shifty'
  },
  plugins: [
    new CleanWebpackPlugin([ dist ]),
    new Webpack.DefinePlugin({
      'process.env': {
         NODE_ENV: JSON.stringify('production')
       }
    }),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        unused: true
      },
      output: {
        comments: false
      }
    }),
    new Webpack.BannerPlugin(version)
  ]
});
