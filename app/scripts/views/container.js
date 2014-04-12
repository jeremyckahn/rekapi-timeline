define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'views/animation-tracks'
  ,'views/control-bar'
  ,'views/scrubber'

  ,'text!../templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,AnimationTracksView
  ,ControlBarView
  ,ScrubberView

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

      this.initialRender();
      this.animationTracksView = new AnimationTracksView({
        el: this.$el.find('.rt-animation-tracks-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.controlBarView = new ControlBarView({
        el: this.$el.find('.rt-control-bar-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.scrubberView = new ScrubberView({
        el: this.$el.find('.rt-scrubber-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }

    ,render: function () {
    }
  });

  return ContainerView;
});
