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
      this.render();
      this._$keyframeProperty = this.$el.find('.keyframe-property');
      this._$keyframeProperty.dragon({
        within: this.keyframePropertyTrackView.$el
        ,drag: _.bind(this.onDrag, this)
      });
    }

    ,render: function () {
      this.$el.html(
          Mustache.render(KeyframePropertyTemplate, this.keyframeProperty));
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var $container = this.keyframePropertyTrackView.$el;
      var distanceFromLeft = this._$keyframeProperty.offset().left
          - $container.offset().left
          - parseInt($container.css('border-left-width'), 10)
          - parseInt($container.css('padding-left'), 10);

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
