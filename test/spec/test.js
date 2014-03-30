/* global assert, describe, mocha, it */
require.config({
  baseUrl: 'scripts'
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
  }
});

require([

  'rekapi'
  ,'rekapi.timeline'

], function (

  Rekapi

) {
  'use strict';

  describe('The code loads', function () {
    it('should define Rekapi.prototype.createTimeline', function () {
      assert.isFunction(Rekapi.prototype.createTimeline);
    });
  });

  mocha.run();

});

