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

  var KeyframePropertyDetailComponent = Base.extend({
    name: 'keyframe-property-detail'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyDetailComponent;
});
