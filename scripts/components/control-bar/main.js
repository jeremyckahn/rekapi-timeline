define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',
], function (
  Lateralus,

  Model,
  View,
  template
) {
  'use strict'

  var Base = Lateralus.Component

  var ControlBarComponent = Base.extend({
    name: 'control-bar',
    Model: Model,
    View: View,
    template: template,
  })

  return ControlBarComponent
})
