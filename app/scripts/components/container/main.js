define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.control-bar'
  ,'rekapi-timeline.component.timeline'
  ,'rekapi-timeline.component.details'
  ,'rekapi-timeline.component.scrubber-detail'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ControlBarComponent
  ,TimelineComponent
  ,DetailsComponent
  ,ScrubberDetailComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'container'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.controlBar = this.addComponent(ControlBarComponent, {
        el: this.view.$controlBar[0]
      });

      this.timelineComponent = this.addComponent(TimelineComponent, {
        el: this.view.$timeline[0]
      });

      this.detailsComponent = this.addComponent(DetailsComponent, {
        el: this.view.$details[0]
      });

      this.scrubberDetailComponent =
        this.addComponent(ScrubberDetailComponent, {
        el: this.view.$scrubberDetail[0]
      });
    }
  });

  return ContainerComponent;
});
