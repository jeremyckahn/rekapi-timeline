define(['lateralus', './model', './view', 'text!./template.mustache'], (
  Lateralus,
  Model,
  View,
  template
) => {
  'use strict'

  const Base = Lateralus.Component

  const KeyframePropertyDetailComponent = Base.extend({
    name: 'keyframe-property-detail',
    Model,
    View,
    template,
  })

  return KeyframePropertyDetailComponent
})
