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

  /**
   * @param {HTMLElement} el The element to contain the widget.
   */
  Rekapi.prototype.createTimeline = function (el) {
    return new RekapiTimeline(el);
  };

  return RekapiTimeline;
});
