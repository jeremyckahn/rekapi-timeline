define([

  'lateralus'

  ,'rekapi-timeline.component.container'

  ,'rekapi-timeline/model'
  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,ContainerComponent

  ,RekapiTimelineModel
  ,constant

) {
  'use strict';

  /**
   * @param {Element} el
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @extends {Lateralus}
   * @constuctor
   */
  var RekapiTimeline = Lateralus.beget(function (el, rekapi) {
    Lateralus.apply(this, arguments);
    this.rekapi = rekapi;
    this.timelineScale = constant.DEFAULT_TIMELINE_SCALE;
    this.containerComponent = this.addComponent(ContainerComponent);
    this.model.set('hasRendered', true);
    this.emit('initialDOMRender');
    this.rekapi.on('timelineModified', this.emit.bind('update', this));
    this.emit('update');
  }, {
    Model: RekapiTimelineModel
  });

  return RekapiTimeline;
});
