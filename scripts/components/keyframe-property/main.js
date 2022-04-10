define(['lateralus', './view', 'text!./template.mustache'], function (
  Lateralus,

  View,
  template
) {
  'use strict'

  const Base = Lateralus.Component;

  const KeyframePropertyComponent = Base.extend({
    name: 'keyframe-property',
    View: View,
    template: template,
  });

  return KeyframePropertyComponent
})
