import Lateralus from 'lateralus'

const Base = Lateralus.Component.Model
const baseProto = Base.prototype

const ScrubberComponentModel = Base.extend({
  /**
   * Parameters are the same as http://backbonejs.org/#Model-constructor
   * @param {Object} [attributes]
   * @param {Object} [options]
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
  },
})

export default ScrubberComponentModel
