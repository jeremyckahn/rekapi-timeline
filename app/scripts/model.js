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
      timelineScale: constant.DEFAULT_TIMELINE_SCALE
      ,timelineDuration: 0

      // @type {Array.<string>}
      ,supportedProperties: []
    }
  });

  return RekapiTimelineModel;
});
