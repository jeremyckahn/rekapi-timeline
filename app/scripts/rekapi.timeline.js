define([

  'rekapi'
  ,'underscore'
  ,'backbone'

  ,'views/container'

], function (

  Rekapi
  ,_
  ,Backbone

  ,ContainerView

) {
  'use strict';

  /**
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @param {HTMLElement} el The element to contain the widget.
   * @constuctor
   */
  function RekapiTimeline (rekapi, el) {
    this.rekapi = rekapi;
    this.containerView = new ContainerView({
      el: el
      ,rekapiTimeline: this
    });

    this.rekapi.on('timelineModified',
        _.bind(this.onRekapiTimelineModified, this));

    this.trigger('update');
  }

  RekapiTimeline.prototype.onRekapiTimelineModified = function () {
    this.trigger('update');
  };

  _.extend(RekapiTimeline.prototype, Backbone.Events);

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   */
  Rekapi.prototype.createTimeline = function (el) {
    return new RekapiTimeline(this, el);
  };

  return RekapiTimeline;
});
