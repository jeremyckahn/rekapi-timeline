define([

  'underscore'
  ,'lateralus'

  ,'rekapi-timeline/constant'

], function (

  _
  ,Lateralus

  ,constant

) {
  'use strict';

  var RekapiTimelineModel = Lateralus.Model.extend({
    defaults: {
      hasBooted: false
      ,timelineScale: constant.DEFAULT_TIMELINE_SCALE
    }
  });

  return RekapiTimelineModel;
});
