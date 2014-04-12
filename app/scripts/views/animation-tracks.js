define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'rekapi.timeline.constants'

  ,'views/actor-tracks'

], function (

  $
  ,_
  ,Backbone

  ,rekapiTimelineConstants

  ,ActorTracksView

) {
  'use strict';

  var AnimationTracksView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this._actorTracksViews = [];
      this.$actorWrapper = this.$el.find('.rt-animation-tracks-wrapper');

      this.listenTo(this.rekapiTimeline.actorCollection, 'add',
          _.bind(this.onActorCollectionAdd, this));

      this.listenTo(this.rekapiTimeline, 'update',
          _.bind(this.onRekapiTimelineUpdate, this));

      this.createActorViews();
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,onActorCollectionAdd: function (actorModel) {
      this.createActorView(actorModel);
    }

    ,onRekapiTimelineUpdate: function () {
      this.$actorWrapper.css('width', this.getPixelWidthForTracks());
    }

    ,createActorViews: function () {
      // Creates views for any actors that were already in the animimation
      var actorCollection = this.rekapiTimeline.actorCollection;
      _.each(this.rekapiTimeline.getAllActors(),
          actorCollection.addActorToCollection, actorCollection);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,createActorView: function (actorModel) {
      var actorTracksView = new ActorTracksView({
          rekapiTimeline: this.rekapiTimeline
          ,model: actorModel
        });
      this._actorTracksViews.push(actorTracksView);
      this.$actorWrapper.append(actorTracksView.$el);
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

  return AnimationTracksView;
});
