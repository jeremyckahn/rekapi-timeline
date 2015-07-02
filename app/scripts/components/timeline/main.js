define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.scrubber'
  ,'rekapi-timeline.component.animation-tracks'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ScrubberComponent
  ,AnimationTracksComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var TimelineComponent = Base.extend({
    name: 'timeline'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.scrubberComponent = this.addComponent(ScrubberComponent, {
        el: this.view.$scrubber[0]
      });

      this.animationTracksComponent = this.addComponent(
          AnimationTracksComponent, {
        el: this.view.$animationTracks[0]
      });
    }
  });

  return TimelineComponent;
});
