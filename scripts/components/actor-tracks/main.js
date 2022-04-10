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

  const ActorTracksComponent = Base.extend({
    name: 'actor-tracks',
    Model: Model,
    View: View,
    template: template,
  });

  return ActorTracksComponent
})
