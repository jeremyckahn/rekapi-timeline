define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'text!templates/keyframe-property.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,KeyframePropertyTemplate

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
      this.render();
    }

    ,render: function () {
      this.$el.html(
          Mustache.render(KeyframePropertyTemplate, this.keyframeProperty));
    }
  });

  return KeyframePropertyView;
});
