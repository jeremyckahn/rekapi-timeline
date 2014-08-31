define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'views/control-bar'
  ,'views/scrubber'
  ,'views/animation-tracks'
  ,'views/scrubber-detail'
  ,'views/keyframe-property-detail'

  ,'rekapi.timeline.constants'

  ,'text!templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,ControlBarView
  ,ScrubberView
  ,AnimationTracksView
  ,ScrubberDetailView
  ,KeyframePropertyDetailView

  ,rekapiTimelineConstants

  ,containerTemplate

) {
  'use strict';

  var ContainerView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;

      this.initialRender();
      this.$timeline = this.$el.find('.rt-timeline');
      this.$timelineWrapper = this.$el.find('.rt-timeline-wrapper');

      this.controlBarView = new ControlBarView({
        el: this.$el.find('.rt-control-bar-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.scrubberView = new ScrubberView({
        el: this.$el.find('.rt-scrubber-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.animationTracksView = new AnimationTracksView({
        el: this.$el.find('.rt-animation-tracks-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.scrubberDetailView = new ScrubberDetailView({
        el: this.$el.find('.rt-scrubber-detail-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.keyframePropertyDetailView = new KeyframePropertyDetailView({
        el: this.$el.find('.rt-keyframe-property-detail-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.listenTo(this.rekapiTimeline, 'update',
          _.bind(this.onRekapiTimelineUpdate, this));

      // This handler must be bound here (as opposed to within ScrubberView)
      // because the order that the addKeyframePropertyTrack handlers are
      // executed is significant.  This particular handler resizes the scrubber
      // guide line.  For that calculation, the DOM that represents the
      // property tracks must be updated.  Binding this handler here ensures
      // that the DOM update occurs before it is measured.
      this.listenTo(this.rekapiTimeline.rekapi, 'addKeyframePropertyTrack',
          _.bind(this.onRekapiAddKeyframePropertyTrack, this));
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }

    ,render: function () {
    }

    ,onRekapiTimelineUpdate: function () {
      this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
    }

    ,onRekapiAddKeyframePropertyTrack: function () {
      this.scrubberView.resizeScrubberGuide();
    }

    /**
     * Determines how wide this View's element should be, in pixels.
     * @return {number}
     */
    ,getPixelWidthForTracks: function () {
      var animationLength =
          this.rekapiTimeline.rekapi.getAnimationLength();
      var animationSeconds = (animationLength / 1000);

      // The width of the tracks container should always be the pixel width of
      // the animation plus the width of the timeline element to allow for
      // lengthening of the animation tracks by the user.
      return (rekapiTimelineConstants.PIXELS_PER_SECOND * animationSeconds)
          + this.$timeline.width();
    }
  });

  return ContainerView;
});
