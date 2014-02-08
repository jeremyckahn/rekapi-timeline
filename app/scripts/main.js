'use strict';

require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }
  },
  paths: {
    jquery: '../bower_components/jquery/jquery'
    ,backbone: '../bower_components/backbone/backbone'
    ,underscore: '../bower_components/underscore/underscore'
    ,text: '../bower_components/requirejs-text/text'
    ,rekapi: '../bower_components/rekapi/dist/rekapi'
    ,shifty: '../bower_components/shifty/dist/shifty'

    ,'rekapi.timeline': 'rekapi.timeline'
  }
});

require([

  'rekapi'

  // Doesn't return value is not used here, it is attached to the Rekapi
  // object.
  ,'rekapi.timeline'

], function (

  Rekapi

) {

  var timelineEl = document.querySelector('#timeline');
  var timeline = new Rekapi.Timeline(timelineEl);
  console.log(timeline);

});
