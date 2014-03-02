define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'views/keyframe-property-track'

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
     *   @param {Rekapi.Actor} actor
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.actor = opts.actor;
      this._keyframePropertyTrackViews = [];
      this.$el.addClass('actor-tracks-view');
      this.createKeyframePropertyTrackViews();
      this.initialRender();
    }

    ,initialRender: function () {
      this._keyframePropertyTrackViews.forEach(
          function (keyframePropertyTrackView) {
        this.$el.append(keyframePropertyTrackView.$el);
      }, this);
    }

    ,render: function () {
      this.renderKeyframePropertyTracks();
    }

    ,renderKeyframePropertyTracks: function () {
      this._keyframePropertyTrackViews.forEach(
          function (keyframePropertyTrackView) {
        keyframePropertyTrackView.render();
      });
    }

    ,createKeyframePropertyTrackViews: function () {
      this.actor.getTrackNames().forEach(function (trackName) {
        this._keyframePropertyTrackViews.push(new KeyframePropertyTrackView({
          rekapiTimeline: this.rekapiTimeline
          ,actor: this.actor
          ,trackName: trackName
        }));
      }, this);
    }
  });

  return ActorTracksView;
});
