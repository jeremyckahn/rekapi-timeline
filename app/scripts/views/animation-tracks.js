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
      this.initialRender();
      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
    }

    ,initialRender: function () {
      this.$el.children().remove();
      this._actorTracksViews.forEach(function (actorView) {
        this.$el.append(actorView.$el);
      }, this);
    }

    ,render: function () {
      this.renderActorViews();
    }

    ,renderActorViews: function () {
      this._actorTracksViews.forEach(function (actorView) {
        actorView.render();
      });
    }

    ,createActorViews: function () {
      _.each(this.rekapiTimeline.rekapi.getAllActors(), function (actor) {
        this._actorTracksViews.push(new ActorTracksView({
          rekapiTimeline: this.rekapiTimeline
          ,actor: actor
        }));
      }, this);
    }
  });

  return AnimationTracksView;
});
