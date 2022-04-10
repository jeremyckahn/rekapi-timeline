'use strict'

require.config({
  baseUrl: '/',
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery',
    },
  },
  paths: {
    jquery: 'node_modules/jquery/dist/jquery',
    'jquery-dragon': 'node_modules/jquery-dragon/src/jquery.dragon',
    backbone: 'node_modules/backbone/backbone',
    underscore: 'node_modules/lodash/index',
    mustache: 'node_modules/mustache/mustache',
    shifty: 'node_modules/shifty/dist/shifty',
    rekapi: 'node_modules/rekapi/dist/rekapi',
  },
  packages: [
    {
      name: 'lateralus',
      location: 'node_modules/lateralus/scripts',
      main: 'lateralus',
    },
    {
      name: 'rekapi-timeline',
      location: 'scripts',
      main: 'rekapi-timeline',
    },
    {
      name: 'aenima',
      location: 'node_modules/aenima',
    },
  ],
})
