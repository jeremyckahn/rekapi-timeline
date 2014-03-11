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
      'click .rekapi-timeline-play': 'onClickPlay'
      ,'click .rekapi-timeline-pause': 'onClickPause'
      ,'click .rekapi-timeline-stop': 'onClickStop'
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
        this.$el.addClass('rekapi-timeline-playing');
      }
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }

    ,onClickPlay: function () {
      this.rekapiTimeline.rekapi.play();
      this.$el.addClass('rekapi-timeline-playing');
    }

    ,onClickPause: function () {
      this.rekapiTimeline.rekapi.pause();
      this.$el.removeClass('rekapi-timeline-playing');
    }

    ,onClickStop: function () {
      this.rekapiTimeline.rekapi
        .stop()
        .update(0);
      this.$el.removeClass('rekapi-timeline-playing');
    }
  });

  return ControlBarView;
});
