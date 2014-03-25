define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'views/actor-tracks'

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
      this.buildDOM();
      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,onActorCollectionAdd: function (actorModel) {
      this.createActorView(actorModel);
    }

    ,render: function () {
      this.renderActorViews();
    }

    ,renderActorViews: function () {
      this._actorTracksViews.forEach(function (actorView) {
        actorView.render();
      });
    }

    ,buildDOM: function () {
      this.$el.children().remove();
      this._actorTracksViews.forEach(function (actorView) {
        this.$el.append(actorView.$el);
      }, this);
    }

    ,createActorViews: function () {
      var actorCollection = this.rekapiTimeline.actorCollection;
      _.each(this.rekapiTimeline.getAllActors(),
          actorCollection.addActorToCollection, actorCollection);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,createActorView: function (actorModel) {
      this._actorTracksViews.push(new ActorTracksView({
        rekapiTimeline: this.rekapiTimeline
        ,model: actorModel
      }));
    }
  });

  return AnimationTracksView;
});
