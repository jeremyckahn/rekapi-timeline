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

    ,lateralusEvents: {
      'rekapi:playStateChange': function () {
        if (this.lateralus.rekapi.isPlaying()) {
          this.$el.addClass('playing');
        } else {
          this.$el.removeClass('playing');
        }
      }
    }

    ,events: {
      'click .play': function () {
        this.play();
      }

      ,'click .pause': function () {
        this.pause();
      }

      ,'click .stop': function () {
        this.emit('stopAnimation');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      if (this.lateralus.rekapi.isPlaying()) {
        this.$el.addClass('playing');
      }
    }

    ,play: function () {
      this.lateralus.rekapi.playFromCurrent();
    }

    ,pause: function () {
      this.lateralus.rekapi.pause();
    }
  });

  return ControlBarComponentView;
});
