define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ControlBarComponentView = Base.extend({
    template: template

    ,events: {
      'click .play': function () {
        this.play();
      }

      ,'click .pause': function () {
        this.pause();
      }

      ,'click .stop': function () {
        // FIXME: This should be an emitted event, Rekapi should not be called
        // directly here.
        this.lateralus.rekapi
          .stop()
          .update(0);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      // FIXME: This value should be `collectOne`-ed.
      if (this.lateralus.rekapi.isPlaying()) {
        this.$el.addClass('playing');
      }

      // FIXME: This should be abstracted into a `lateralusEvent`.
      this.lateralus.rekapi.on(
          'playStateChange', this.onRekapiPlayStateChanged.bind(this));
    }

    ,onRekapiPlayStateChanged: function () {
      if (this.lateralus.rekapi.isPlaying()) {
        this.$el.addClass('playing');
      } else {
        this.$el.removeClass('playing');
      }
    }

    ,play: function () {
      // FIXME: This should be `emit`-ed.
      this.lateralus.rekapi.playFromCurrent();
    }

    ,pause: function () {
      // FIXME: This should be `emit`-ed.
      this.lateralus.rekapi.pause();
    }
  });

  return ControlBarComponentView;
});
