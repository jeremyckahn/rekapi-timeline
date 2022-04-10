define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',
], (Lateralus, Model, View, template) => {
  'use strict'

  const Base = Lateralus.Component;

  const AnimationTracksComponent = Base.extend({
    name: 'animation-tracks',
    Model,
    View,
    template,
  });

  return AnimationTracksComponent
})
