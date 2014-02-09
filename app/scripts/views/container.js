define('/scripts/views/container.js', [

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'/scripts/views/actor-tracks.js'

  ,'text!/scripts/templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,ActorTracksView

  ,containerTemplate

) {
  'use strict';

  var ContainerView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;

      this.render();
      this.actorTracksView = new ActorTracksView({
        el: this.$el.find('.rekapi-timeline-actor-tracks-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
    }

    ,render: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }
  });

  return ContainerView;
});
