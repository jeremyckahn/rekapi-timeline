import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const AnimationTracksComponent = Base.extend({
  name: 'animation-tracks',
  Model,
  View,
  template,
})

export default AnimationTracksComponent
