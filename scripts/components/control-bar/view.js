define(['lateralus', 'text!./template.mustache'], function (
  Lateralus,

  template
) {
  'use strict'

  const Base = Lateralus.Component.View;
  const baseProto = Base.prototype;

  const ControlBarComponentView = Base.extend({
    template,

    lateralusEvents: {
      'rekapi:playStateChange': function () {
        if (this.lateralus.rekapi.isPlaying()) {
          this.$el.addClass('playing')
        } else {
          this.$el.removeClass('playing')
        }
      },
    },

    events: {
      'click .play': function () {
        this.play()
      },

      'click .pause': function () {
        this.pause()
      },

      'click .stop': function () {
        this.emit('stopAnimation')
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize() {
      baseProto.initialize.apply(this, arguments)

      if (this.lateralus.rekapi.isPlaying()) {
        this.$el.addClass('playing')
      }
    },

    play() {
      this.lateralus.rekapi.playFromCurrent()
    },

    pause() {
      this.lateralus.rekapi.pause()
    },
  });

  return ControlBarComponentView
})
