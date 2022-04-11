import Lateralus from 'lateralus'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const KeyframePropertyComponent = Base.extend({
  name: 'keyframe-property',
  View,
  template,
})

export default KeyframePropertyComponent
