define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ActorTracksComponent = Base.extend({
    name: 'actor-tracks'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ActorTracksComponent;
});
