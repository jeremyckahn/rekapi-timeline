const path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { version } = require('./package.json');

const rootDir = modulePath => path.resolve(__dirname, modulePath);

module.exports = {
  entry: {
    demo: './scripts/demo.js',
    'rekapi-timeline': './scripts/rekapi-timeline.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'rekapi-timeline',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  resolveLoader: {
    alias: {
      text: 'raw-loader'
    }
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    symlinks: false,
    alias: {
      'jquery-dragon': rootDir('node_modules/jquery-dragon/src/jquery.dragon'),
      aenima: rootDir('node_modules/aenima'),
      bezierizer: rootDir('node_modules/bezierizer/dist/bezierizer'),
      lateralus: rootDir('node_modules/lateralus/dist/lateralus'),
      lodash: rootDir('node_modules/lodash/index.js'),
      rekapi: rootDir('node_modules/rekapi/src/main'),
      shifty: rootDir('node_modules/shifty/src/main'),
      underscore: 'lodash'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          rootDir('scripts'),
          rootDir('node_modules/shifty'),
          rootDir('node_modules/rekapi'),
          rootDir('node_modules/aenima'),
          rootDir('node_modules/webpack-dev-server')
        ]
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader'
        }]
      }, {
        test: /\.(sass|scss|css)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              rootDir('node_modules/compass-mixins/lib')
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist' ]),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        unused: true,
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),
    new CopyWebpackPlugin([
      { from: 'index.html' }
    ]),
    new Webpack.BannerPlugin(version)
  ],
  devServer: {
    port: 9013
  }
};
