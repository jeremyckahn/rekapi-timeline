define([

  'underscore'
  ,'backbone'
  ,'rekapi'

], function (

  _
  ,Backbone
  ,Rekapi

  ) {
  'use strict';

  var RekapiTimelineKeyframePropertyModel = Backbone.Model.extend({
    /**
     * @param {Object} attrs Should not contain any properties.
     * @param {Object} opts
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (attrs, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.attributes = opts.keyframeProperty;
    }
  });

  // Proxy all Rekapi.KeyframeProperty.prototype methods to
  // RekapiTimelineKeyframePropertyModel
  _.each(Rekapi.KeyframeProperty.prototype,
      function (keyframePropertyMethod, keyframePropertyMethodName) {
    RekapiTimelineKeyframePropertyModel.prototype[keyframePropertyMethodName] =
        function () {
      return keyframePropertyMethod.apply(this.attributes, arguments);
    };
  }, this);

  return RekapiTimelineKeyframePropertyModel;
});
