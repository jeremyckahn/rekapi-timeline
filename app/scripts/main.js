/*global require*/
'use strict';

require.config({
  baseUrl: '/'
  ,shim: {
    bootstrap: {
      deps: ['jquery']
      ,exports: 'jquery'
    }
  }
  ,paths: {
    text: 'bower_components/requirejs-text/text'
    ,jquery: 'bower_components/jquery/dist/jquery'
    ,backbone: 'bower_components/backbone/backbone'
    ,underscore: 'bower_components/lodash/dist/lodash'
    ,mustache: 'bower_components/mustache/mustache'
  }
  ,packages: [{
    name: 'lateralus'
    ,location: 'bower_components/lateralus/scripts'
    ,main: 'lateralus'
  }, {
    name: 'rekapi-timeline'
    ,location: 'scripts'
    ,main: 'rekapi-timeline'
  }, {
    name: 'rekapi-timeline.component.container'
    ,location: 'scripts/components/container'
  }, {
    name: 'rekapi-timeline.component.timeline'
    ,location: 'scripts/components/timeline'
  }, {
    name: 'rekapi-timeline.component.control-bar'
    ,location: 'scripts/components/control-bar'
  }, {
    name: 'rekapi-timeline.component.details'
    ,location: 'scripts/components/details'
  }, {
    name: 'rekapi-timeline.component.scrubber'
    ,location: 'scripts/components/scrubber'
  }]
});

require([

  'rekapi-timeline'

], function (

  RekapiTimeline

) {
  window.rekapiTimeline =
    new RekapiTimeline(document.getElementById('rekapi-timeline'));
});
