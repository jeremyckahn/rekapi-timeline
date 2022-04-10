define(['lateralus', './model', './view', 'text!./template.mustache'], (
  Lateralus,
  Model,
  View,
  template
) => {
  'use strict'

  const Base = Lateralus.Component

  const ControlBarComponent = Base.extend({
    name: 'control-bar',
    Model,
    View,
    template,
  })

  return ControlBarComponent
})
