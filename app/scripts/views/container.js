define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'views/animation-tracks'

  ,'text!../templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,AnimationTracksView

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
      this.animationTracksView = new AnimationTracksView({
        el: this.$el.find('.rekapi-timeline-animation-tracks-view')[0]
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
