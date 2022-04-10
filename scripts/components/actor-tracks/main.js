import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'

const Base = Lateralus.Component

const ActorTracksComponent = Base.extend({
  name: 'actor-tracks',
  Model,
  View,
  template,
})

export default ActorTracksComponent
