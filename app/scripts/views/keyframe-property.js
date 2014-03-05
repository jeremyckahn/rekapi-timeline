define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'rekapi.timeline.constants'

  ,'text!templates/keyframe-property.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,rekapiTimelineConstants

  ,KeyframePropertyTemplate

) {
  'use strict';

  var KeyframePropertyView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     *   @param {KeyframePropertyTrackView} keyframePropertyTrackView
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.keyframePropertyTrackView = opts.keyframePropertyTrackView;
      this.keyframeProperty = opts.keyframeProperty;
      this.$el.addClass('keyframe-property-view');
      this.initialRender();

      this.$el.dragon({
        within: this.keyframePropertyTrackView.$el
        ,drag: _.bind(this.onDrag, this)
      });
    }

    ,initialRender: function () {
      this.$el.html(
          Mustache.render(KeyframePropertyTemplate, this.keyframeProperty));
    }

    ,render: function () {
      this.$el.css({
        top: 1
        ,left: (
            rekapiTimelineConstants.PIXELS_PER_SECOND
            * this.keyframeProperty.millisecond) / 1000
      });
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var distanceFromLeft = this.$el.offset().left
          - this.keyframePropertyTrackView.getMinimumBounds().left;

      var scaledValue = (
          distanceFromLeft / rekapiTimelineConstants.PIXELS_PER_SECOND) * 1000;

      // Modify the keyframeProperty via its actor so that the state of the
      // animation is updated.
      var keyframeProperty = this.keyframeProperty;
      keyframeProperty.actor.modifyKeyframeProperty(
          keyframeProperty.name, keyframeProperty.millisecond, {
            millisecond: scaledValue
          });
    }
  });

  return KeyframePropertyView;
});
