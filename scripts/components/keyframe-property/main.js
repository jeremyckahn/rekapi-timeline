define(['lateralus', './view', 'text!./template.mustache'], (
  Lateralus,
  View,
  template
) => {
  'use strict'

  const Base = Lateralus.Component

  const KeyframePropertyComponent = Base.extend({
    name: 'keyframe-property',
    View,
    template,
  })

  return KeyframePropertyComponent
})
