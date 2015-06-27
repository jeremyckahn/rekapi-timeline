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

  var ScrubberDetailComponent = Base.extend({
    name: 'scrubber-detail'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ScrubberDetailComponent;
});
