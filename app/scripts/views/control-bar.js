define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'text!../templates/control-bar.mustache'

  ], function (

  $
  ,_
  ,Backbone

  ,controlBarTemplate

  ) {
  'use strict';

  var ControlBarView = Backbone.View.extend({
    events: {
      'click .rt-play': 'onClickPlay'
      ,'click .rt-pause': 'onClickPause'
      ,'click .rt-stop': 'onClickStop'
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();

      if (this.rekapiTimeline.rekapi.isPlaying()) {
        this.$el.addClass('rt-playing');
      }

      this.rekapiTimeline.rekapi.on(
          'playStateChange', _.bind(this.onRekapiPlayStateChanged, this));
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }

    ,onRekapiPlayStateChanged: function () {
      if (this.rekapiTimeline.isPlaying()) {
        this.$el.addClass('rt-playing');
      } else {
        this.$el.removeClass('rt-playing');
      }
    }

    ,onClickPlay: function () {
      this.play();
    }

    ,onClickPause: function () {
      this.pause();
    }

    ,onClickStop: function () {
      this.rekapiTimeline.rekapi
        .stop()
        .update(0);
    }

    ,play: function () {
      this.rekapiTimeline.rekapi.playFromCurrent();
    }

    ,pause: function () {
      this.rekapiTimeline.rekapi.pause();
    }
  });

  return ControlBarView;
});
