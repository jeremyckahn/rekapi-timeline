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

  var TimelineComponent = Base.extend({
    name: 'timeline'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return TimelineComponent;
});
