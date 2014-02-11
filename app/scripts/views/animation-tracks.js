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
      this._actorViews = [];
      this.createActorViews();
      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
    }

    ,render: function () {
      this.$el.children().remove();
      this._actorViews.forEach(function (actorView) {
        this.$el.append(actorView.$el);
      }, this);
    }

    ,createActorViews: function () {
      _.each(this.rekapiTimeline.rekapi.getAllActors(), function (actor) {
        this._actorViews.push(new ActorTracksView({
          rekapiTimeline: this.rekapiTimeline
          ,actor: actor
        }));
      }, this);
    }
  });

  return AnimationTracksView;
});
