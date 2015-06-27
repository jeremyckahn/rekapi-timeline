define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.timeline'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,TimelineComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'container'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.timelineComponent = this.addComponent(TimelineComponent, {
        el: this.view.$timeline[0]
      });
    }
  });

  return ContainerComponent;
});
