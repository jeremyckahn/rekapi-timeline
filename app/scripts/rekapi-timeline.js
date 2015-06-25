define([

  'lateralus'

  ,'rekapi-timeline.component.container'

], function (

  Lateralus

  ,ContainerComponent

) {
  'use strict';

  /**
   * @param {Element} el
   * @extends {Lateralus}
   * @constuctor
   */
  var RekapiTimeline = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);
    this.containerComponent = this.addComponent(ContainerComponent);
  });

  return RekapiTimeline;
});
