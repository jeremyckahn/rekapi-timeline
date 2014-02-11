define([

  'jquery'
  ,'underscore'
  ,'backbone'

], function (

  $
  ,_
  ,Backbone

) {
  'use strict';

  var KeyframePropertyView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.keyframeProperty = opts.keyframeProperty;
      this.$el.addClass('keyframe-property-view');
    }

    ,render: function () {
    }
  });

  return KeyframePropertyView;
});
