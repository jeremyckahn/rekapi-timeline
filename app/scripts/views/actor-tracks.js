define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'rekapi.timeline.constants'

  ,'views/keyframe-property-track'

], function (

  $
  ,_
  ,Backbone

  ,rekapiTimelineConstants

  ,KeyframePropertyTrackView

) {
  'use strict';

  var ActorTracksView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this._keyframePropertyTrackViews = [];
      this.$el.addClass('actor-view');

      this.listenTo(this.model, 'addKeyframePropertyTrack',
          _.bind(this.onAddKeyframePropertyTrack, this));

      // Create views for any keyframes that were already defined
      this.model.getTrackNames().forEach(
          this.createKeyframePropertyTrackView, this);

      this.listenTo(this.rekapiTimeline, 'update',
          _.bind(this.onRekapiTimelineUpdate, this));
    }

    /**
     * @param {string} newTrackName
     */
    ,onAddKeyframePropertyTrack: function (newTrackName) {
      this.createKeyframePropertyTrackView(newTrackName);
    }

    ,createKeyframePropertyTrackView: function (trackName) {
      var keyframePropertyTrackView = new KeyframePropertyTrackView({
        rekapiTimeline: this.rekapiTimeline
        ,model: this.model
        ,trackName: trackName
      });

      this._keyframePropertyTrackViews.push(keyframePropertyTrackView);
      this.$el.append(keyframePropertyTrackView.$el);
    }

    ,onRekapiTimelineUpdate: function () {
      this.$el.css('width', this.getPixelWidthForTracks());
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
      // the animation plus the width of the animation tracks view element to
      // allow for lengthening of the animation tracks.
      return (rekapiTimelineConstants.PIXELS_PER_SECOND * animationSeconds)
          + this.rekapiTimeline.containerView.animationTracksView.$el.width();
    }
  });

  return ActorTracksView;
});
