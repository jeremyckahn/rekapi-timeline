define([

  'underscore'
  ,'lateralus'

], function (

  _
  ,Lateralus

) {
  'use strict';

  var RekapiTimelineModel = Lateralus.Model.extend({
    defaults: {
      hasRendered: false
    }
  });

  return RekapiTimelineModel;
});