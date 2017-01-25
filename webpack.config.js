const path = require('path');
const Webpack = require('webpack');

const { version } = require('./package.json');
const isProduction = process.env.NODE_ENV === 'production';

const modulePaths = [
  'scripts',
  path.join(__dirname, 'node_modules')
];

module.exports = {
  entry: 'rekapi-timeline.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  devtool: 'source-map',
  resolveLoader: {

    // http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies
    fallback: modulePaths,

    alias: {
      text: 'raw-loader'
    }
  },
  resolve: {
    modulesDirectories: modulePaths,

    // http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies
    fallback: modulePaths,

    alias: {
      underscore: 'lodash/index',
      jquery: 'jquery/dist/jquery',
      'jquery-dragon': 'jquery-dragon/src/jquery.dragon',
      shifty: 'shifty/dist/shifty',
      rekapi: 'rekapi/dist/rekapi',
      keydrown: 'keydrown/dist/keydrown',
      backbone: 'backbone/backbone',
      lateralus: 'lateralus/dist/lateralus',
      'lateralus.component.tabs': 'lateralus-components/tabs/main',
      mustache: 'mustache/mustache',
      aenima: 'aenima',
      bezierizer: 'bezierizer/dist/bezierizer'
    }
  },
  plugins: [
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
  ],
  devServer: {
    port: 9013
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './node_modules/compass-mixins/lib')
    ],
    outputStyle: isProduction ? 'compressed' : 'expanded',
    sourceComments: !isProduction
  }
};
