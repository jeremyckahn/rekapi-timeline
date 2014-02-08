define([

  'rekapi'

  ,'views/container'

], function (

  Rekapi

  ,ContainerView

) {
  'use strict';

  /**
   * @param {HTMLElement} el The element to contain the widget.
   * @constuctor
   */
  function RekapiTimeline (el) {
    this.containerView = new ContainerView({
      el: el
    });
  }
  Rekapi.Timeline = RekapiTimeline;

  return RekapiTimeline;
});
