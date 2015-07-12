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
      hasRendered: false
      ,hasBooted: false
      ,timelineScale: constant.DEFAULT_TIMELINE_SCALE
    }
  });

  return RekapiTimelineModel;
});
