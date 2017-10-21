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

  var ScrubberComponent = Base.extend({
    name: 'scrubber'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ScrubberComponent;
});
