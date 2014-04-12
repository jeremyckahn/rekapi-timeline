define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'views/animation-tracks'
  ,'views/control-bar'
  ,'views/scrubber'

  ,'rekapi.timeline.constants'

  ,'text!../templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,AnimationTracksView
  ,ControlBarView
  ,ScrubberView

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

      this.animationTracksView = new AnimationTracksView({
        el: this.$el.find('.rt-animation-tracks-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.controlBarView = new ControlBarView({
        el: this.$el.find('.rt-control-bar-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.scrubberView = new ScrubberView({
        el: this.$el.find('.rt-scrubber-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.listenTo(this.rekapiTimeline, 'update',
          _.bind(this.onRekapiTimelineUpdate, this));
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }

    ,render: function () {
    }

    ,onRekapiTimelineUpdate: function () {
      this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
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
