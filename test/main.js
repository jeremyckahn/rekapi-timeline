/* global mocha */
require.config({
  baseUrl: '../app/scripts'
  ,shim: {
    underscore: {
      exports: '_'
    }
    ,backbone: {
      deps: [
        'underscore'
        ,'jquery'
      ]
      ,exports: 'Backbone'
    }
    ,'jquery-dragon': {
      deps: [
        'jquery'
      ]
    }
    ,'mocha': {
      exports: 'mocha'
    }
  }
  ,paths: {
    jquery:           '../bower_components/jquery/dist/jquery'
    ,'jquery-dragon':  '../bower_components/jquery-dragon/src/jquery.dragon'
    ,backbone:        '../bower_components/backbone/backbone'
    ,underscore:      '../bower_components/underscore/underscore'
    ,mustache:        '../bower_components/mustache/mustache'
    ,text:            '../bower_components/requirejs-text/text'
    ,rekapi:          '../bower_components/rekapi/dist/rekapi'
    ,shifty:          '../bower_components/shifty/dist/shifty'
    ,chai:            '../../test/bower_components/chai/chai'
    ,mocha:           '../../test/bower_components/mocha/mocha'
  }
});

mocha.setup({
  ui: 'bdd'
});

require([

  '../../test/spec/test'

], function (

) {
  'use strict';

  if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
  } else {
    mocha.run();
  }

});
