import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const ScrubberDetailComponent = Base.extend({
  name: 'scrubber-detail',
  Model,
  View,
  template,
})

export default ScrubberDetailComponent
