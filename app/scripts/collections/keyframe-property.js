define([

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/keyframe-property'

], function (

  Backbone
  ,Lateralus

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel
  });

  return KeyframePropertyCollection;
});
