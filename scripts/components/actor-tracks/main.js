define([
  'lateralus',

  './model',
  './view',
  'text!./template.mustache',
], (Lateralus, Model, View, template) => {
  'use strict'

  const Base = Lateralus.Component;

  const ActorTracksComponent = Base.extend({
    name: 'actor-tracks',
    Model,
    View,
    template,
  });

  return ActorTracksComponent
})
