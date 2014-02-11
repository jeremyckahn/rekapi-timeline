define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'text!../templates/actor-tracks.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,actorTracksTemplate

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
      this.$el.addClass('actor-tracks');
    }

    ,render: function () {
      this.$el.html(Mustache.render(actorTracksTemplate));
    }
  });

  return ActorTracksView;
});
