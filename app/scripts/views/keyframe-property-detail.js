define([

  'backbone'
  ,'mustache'

  ,'text!templates/keyframe-property-detail.mustache'

], function (

  Backbone
  ,Mustache

  ,keyframePropertyDetailTemplate

) {
  'use strict';

  var KeyframePropertyDetailView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();
    }

    ,render: function () {
      this.$el.html(keyframePropertyDetailTemplate);
    }
  });

  return KeyframePropertyDetailView;
});
