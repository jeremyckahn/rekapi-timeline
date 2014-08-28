require.config({
  baseUrl: '/scripts'
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
    ,'jquery-mousewheel': {
      deps: [
        'jquery'
      ]
    }
  }
  ,paths: {
    jquery:           '../bower_components/jquery/dist/jquery'
    ,'jquery-dragon':  '../bower_components/jquery-dragon/src/jquery.dragon'
    ,'jquery-mousewheel':
        '../bower_components/jquery-mousewheel/jquery.mousewheel'
    ,backbone:        '../bower_components/backbone/backbone'
    ,underscore:      '../bower_components/underscore/underscore'
    ,mustache:        '../bower_components/mustache/mustache'
    ,text:            '../bower_components/requirejs-text/text'
    ,rekapi:          '../bower_components/rekapi/dist/rekapi'
    ,shifty:          '../bower_components/shifty/dist/shifty'

    // jck-extensions
    /* jshint maxlen: 120 */
    ,'auto-update-textfield':
        '../bower_components/jck-library-extensions/src/backbone/auto-update-textfield/auto-update-textfield'
    ,'incrementer-field':
        '../bower_components/jck-library-extensions/src/backbone/incrementer-field/incrementer-field'
    ,tabs: '../bower_components/jck-library-extensions/src/backbone/tabs/tabs'
    ,pane: '../bower_components/jck-library-extensions/src/backbone/pane/pane'
    ,alert: '../bower_components/jck-library-extensions/src/backbone/alert/alert'
    ,modal: '../bower_components/jck-library-extensions/src/backbone/modal/modal'
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
  'use strict';

  var timelineEl = document.querySelector('#timeline');
  var rekapi = new Rekapi(document.body);

  var actor = rekapi.addActor({
    context: document.querySelector('#actor-1')
  });

  actor
    .keyframe(0, {
      translateX: '0px'
      ,translateY: '0px'
      ,scaleX: 1
      ,scaleY: 1
    })
    .keyframe(1000, {
      translateX: '150px'
      ,translateY: '100px'
    });

  var timeline = rekapi.createTimeline(timelineEl);
  rekapi.play(1);

  console.log(window.rekapi = rekapi);
  console.log(window.timeline = timeline);

});
