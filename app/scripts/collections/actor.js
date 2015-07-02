define([

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/actor'

], function (

  Backbone
  ,Lateralus

  ,ActorModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var ActorCollection = Base.extend({
    model: ActorModel
  });

  return ActorCollection;
});
