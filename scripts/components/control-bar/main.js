import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const ControlBarComponent = Base.extend({
  name: 'control-bar',
  Model,
  View,
  template,
})

export default ControlBarComponent
