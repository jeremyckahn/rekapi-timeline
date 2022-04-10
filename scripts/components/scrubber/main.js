import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const ScrubberComponent = Base.extend({
  name: 'scrubber',
  Model,
  View,
  template,
})

export default ScrubberComponent
