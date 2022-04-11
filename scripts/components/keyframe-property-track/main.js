import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const KeyframePropertyTrackComponent = Base.extend({
  name: 'keyframe-property-track',
  Model,
  View,
  template,

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

export default KeyframePropertyTrackComponent
