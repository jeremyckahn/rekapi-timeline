define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property-detail'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,KeyframePropertyDetailComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var DetailsComponent = Base.extend({
    name: 'details'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.keyframePropertyDetailComponent =
        this.addComponent(KeyframePropertyDetailComponent, {
        el: this.view.$keyframePropertyDetail[0]
      });
    }
  });

  return DetailsComponent;
});
