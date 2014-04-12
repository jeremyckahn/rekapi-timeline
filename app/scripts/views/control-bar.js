define([

  'backbone'

  ,'text!../templates/control-bar.mustache'

  ], function (

  Backbone

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
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }

    ,onClickPlay: function () {
      this.rekapiTimeline.rekapi.playFromCurrent();
      this.$el.addClass('rt-playing');
    }

    ,onClickPause: function () {
      this.rekapiTimeline.rekapi.pause();
      this.$el.removeClass('rt-playing');
    }

    ,onClickStop: function () {
      this.rekapiTimeline.rekapi
        .stop()
        .update(0);
      this.$el.removeClass('rt-playing');
    }
  });

  return ControlBarView;
});
