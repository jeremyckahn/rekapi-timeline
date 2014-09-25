define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'./keyframe-property-track'

], function (

  $
  ,_
  ,Backbone

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
      this.$el.addClass('rt-actor-view');

      this.listenTo(this.model, 'addKeyframePropertyTrack',
          _.bind(this.onAddKeyframePropertyTrack, this));

      // Create views for any keyframes that were already defined
      this.model.getTrackNames().forEach(
          this.createKeyframePropertyTrackView, this);
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
  });

  return ActorTracksView;
});
