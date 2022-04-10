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

  const Base = Lateralus.Component;

  const AnimationTracksComponent = Base.extend({
    name: 'animation-tracks',
    Model: Model,
    View: View,
    template: template,
  });

  return AnimationTracksComponent
})
