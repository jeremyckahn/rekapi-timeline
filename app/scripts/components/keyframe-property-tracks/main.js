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

  var KeyframePropertyTracksComponent = Base.extend({
    name: 'keyframe-property-tracks'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyTracksComponent;
});
