define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyComponent = Base.extend({
    name: 'keyframe-property'
    ,View: View
    ,template: template
  });

  return KeyframePropertyComponent;
});
