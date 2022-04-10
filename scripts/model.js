define(['underscore', 'lateralus', './constant'], function (
  _,
  Lateralus,

  constant
) {
  'use strict'

  const RekapiTimelineModel = Lateralus.Model.extend({
    defaults: {
      timelineScale: constant.DEFAULT_TIMELINE_SCALE,
      timelineDuration: 0,

      // @type {Array.<{name: string, defaultValue: string}>}
      supportedProperties: [],

      preventValueInputAutoSelect: false,
    },
  });

  return RekapiTimelineModel
})
