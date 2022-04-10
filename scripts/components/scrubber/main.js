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

  const ScrubberComponent = Base.extend({
    name: 'scrubber',
    Model: Model,
    View: View,
    template: template,
  });

  return ScrubberComponent
})
