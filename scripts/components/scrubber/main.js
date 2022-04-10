define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',
], (Lateralus, Model, View, template) => {
  'use strict'

  const Base = Lateralus.Component;

  const ScrubberComponent = Base.extend({
    name: 'scrubber',
    Model,
    View,
    template,
  });

  return ScrubberComponent
})
