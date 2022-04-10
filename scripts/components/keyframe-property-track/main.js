define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',
], function (
  Lateralus,

  Model,
  View,
  template
) {
  'use strict'

  var Base = Lateralus.Component

  var KeyframePropertyTrackComponent = Base.extend({
    name: 'keyframe-property-track',
    Model: Model,
    View: View,
    template: template,

    lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {string} trackName
       */
      'rekapi:removeKeyframePropertyTrack': function (rekapi, trackName) {
        if (trackName === this.model.get('trackName')) {
          this.dispose()
        }
      },
    },
  })

  return KeyframePropertyTrackComponent
})
