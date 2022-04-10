define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',
], (Lateralus, Model, View, template) => {
  'use strict'

  const Base = Lateralus.Component;

  const ScrubberDetailComponent = Base.extend({
    name: 'scrubber-detail',
    Model,
    View,
    template,
  });

  return ScrubberDetailComponent
})
