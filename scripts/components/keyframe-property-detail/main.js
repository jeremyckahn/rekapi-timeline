import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const KeyframePropertyDetailComponent = Base.extend({
  name: 'keyframe-property-detail',
  Model,
  View,
  template,
})

export default KeyframePropertyDetailComponent
