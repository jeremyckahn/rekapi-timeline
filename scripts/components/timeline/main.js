define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',

  '../scrubber/main',
  '../animation-tracks/main',
], function (
  Lateralus,

  Model,
  View,
  template,

  ScrubberComponent,
  AnimationTracksComponent
) {
  'use strict'

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

  return TimelineComponent
})
