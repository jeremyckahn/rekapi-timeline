define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'./actor-tracks'

], function (

  $
  ,_
  ,Backbone

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

      this.listenTo(this.rekapiTimeline.actorCollection, 'add',
          _.bind(this.onActorCollectionAdd, this));

      this.createActorViews();
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,onActorCollectionAdd: function (actorModel) {
      this.createActorView(actorModel);
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
      this.$el.append(actorTracksView.$el);
    }
  });

  return AnimationTracksView;
});
