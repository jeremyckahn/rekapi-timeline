define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.scrubber'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ScrubberComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var TimelineComponent = Base.extend({
    name: 'timeline'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.scrubber = this.addComponent(ScrubberComponent, {
        el: this.view.$scrubber[0]
      });
    }
  });

  return TimelineComponent;
});
