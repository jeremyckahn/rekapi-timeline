import Lateralus from 'lateralus'
import template from 'text!./template.mustache'

const Base = Lateralus.Component.View
const baseProto = Base.prototype

const DetailsComponentView = Base.extend({
  template,

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
  },
})

export default DetailsComponentView
