import Lateralus from 'lateralus'

const Base = Lateralus.Component.Model
const baseProto = Base.prototype

const KeyframePropertyTrackComponentModel = Base.extend({
  defaults: {
    trackName: '',
  },
  /**
   * Parameters are the same as http://backbonejs.org/#Model-constructor
   * @param {Object} [attributes]
   * @param {Object} [options]
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
  },
})

export default KeyframePropertyTrackComponentModel
