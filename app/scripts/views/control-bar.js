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
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }

    ,onClickPlay: function () {
      this.rekapiTimeline.rekapi.play();
    }

    ,onClickPause: function () {
      this.rekapiTimeline.rekapi.pause();
    }

    ,onClickStop: function () {
      this.rekapiTimeline.rekapi.stop();
    }
  });

  return ControlBarView;
});
