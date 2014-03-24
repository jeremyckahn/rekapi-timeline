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
      this.createActorViews();
      this.buildDOM();
      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
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
      _.each(this.rekapiTimeline.getAllActors(), function (actor) {
        var actorModel =
            this.rekapiTimeline.actorCollection.addActorToCollection(actor);
        this._actorTracksViews.push(new ActorTracksView({
          rekapiTimeline: this.rekapiTimeline
          ,model: actorModel
        }));
      }, this);
    }
  });

  return AnimationTracksView;
});
