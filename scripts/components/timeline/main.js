import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'
import ScrubberComponent from '../scrubber/main'
import AnimationTracksComponent from '../animation-tracks/main'

const Base = Lateralus.Component

const TimelineComponent = Base.extend({
  name: 'timeline',
  Model,
  View,
  template,

  initialize() {
    this.scrubberComponent = this.addComponent(ScrubberComponent, {
      el: this.view.$scrubber[0],
    })

    this.animationTracksComponent = this.addComponent(
      AnimationTracksComponent,
      {
        el: this.view.$animationTracks[0],
      }
    )
  },
})

export default TimelineComponent
