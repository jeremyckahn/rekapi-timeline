define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'text!templates/control-bar.mustache'

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

      // FIXME: Needs to be torn down.
      $(document.body).on('keydown', _.bind(this.onWindowKeydown, this));
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }

    ,onWindowKeydown: function (evt) {
      var keyCode = evt.keyCode;

      // This is true if the user is focused on an element such as an input or
      // a link.  RekapiTimeline keyboard shortcuts should be disabled, in that
      // case.
      if (evt.target !== evt.currentTarget) {
        return;
      }

      if (keyCode === 32) { // space
        if (this.rekapiTimeline.isPlaying()) {
          this.pause();
        } else {
          this.play();
        }
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
      this.$el.removeClass('rt-playing');
    }

    ,play: function () {
      this.rekapiTimeline.rekapi.playFromCurrent();
      this.$el.addClass('rt-playing');
    }

    ,pause: function () {
      this.rekapiTimeline.rekapi.pause();
      this.$el.removeClass('rt-playing');
    }
  });

  return ControlBarView;
});
