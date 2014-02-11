define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'text!../templates/animation-tracks.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,actorTracksTemplate

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
      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
    }

    ,render: function () {
      this.$el.html(Mustache.render(actorTracksTemplate));
    }
  });

  return AnimationTracksView;
});
