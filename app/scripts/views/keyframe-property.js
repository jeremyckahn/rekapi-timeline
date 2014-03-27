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
     *   @param {KeyframePropertyTrackView} keyframePropertyTrackView
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.keyframePropertyTrackView = opts.keyframePropertyTrackView;
      this.$el.addClass('keyframe-property-view');
      this.initialRender();

      if (this.rekapiTimeline.hasRendered) {
        this.onInitialTimelineDOMRender();
      } else {
        this.listenToOnce(this.rekapiTimeline, 'initialDOMRender',
            _.bind(this.onInitialTimelineDOMRender, this));
      }
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(
          KeyframePropertyTemplate, this.model.getKeyframeProperty()));
    }

    ,onInitialTimelineDOMRender: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackView.$el
        ,drag: _.bind(this.onDrag, this)
      });
    }

    ,render: function () {
      this.$el.css({
        left: (
            rekapiTimelineConstants.PIXELS_PER_SECOND
            * this.model.get('millisecond')) / 1000
      });
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var distanceFromLeft = parseInt(this.$el.css('left'), 10) -
          parseInt(this.$el.parent().css('border-left-width'), 10);

      var scaledValue = (
          distanceFromLeft / rekapiTimelineConstants.PIXELS_PER_SECOND) * 1000;

      // Modify the keyframeProperty via its actor so that the state of the
      // animation is updated.
      var model = this.model;
      model.getActor().modifyKeyframeProperty(
          model.get('name'), model.get('millisecond'), {
            millisecond: scaledValue
          });
    }
  });

  return KeyframePropertyView;
});
