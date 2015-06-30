define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline.component.container'

  ,'rekapi-timeline/model'
  ,'rekapi-timeline/constant'

  // Silent dependency
  ,'jquery-dragon'

], function (

  _
  ,Lateralus
  ,Rekapi

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
    this.rekapi.on('timelineModified', this.emit.bind('melineModified', this));
    this.emit('timelineModified');
  }, {
    Model: RekapiTimelineModel
  });

  /**
   * FIXME: Legacy code.  Change this to be a `provide`-ed method.
   * Gets the Rekapi timeline millisecond value for a slider handle-like
   * element.  This is used for converting the position of keyframe DOM
   * elements and the timeline scrubber position into the value it represents
   * in the animation.
   * @param {jQuery} $handle The handle element to retrieve the millisecond
   * value for.
   * @return {number}
   */
  RekapiTimeline.prototype.getTimelineMillisecondForHandle =
      function ($handle) {
    var distanceFromLeft = parseInt($handle.css('left'), 10) -
        parseInt($handle.parent().css('border-left-width'), 10);
    var baseMillisecond = (
        distanceFromLeft / constant.PIXELS_PER_SECOND) * 1000;

    return baseMillisecond;
  };

  /**
   * FIXME: Legacy code.  Change this to be a `lateralusEvent`.
   * @param {number} newScale
   */
  RekapiTimeline.prototype.setTimelineScale = function (newScale) {
    this.timelineScale = newScale;
    this.trigger('change:timelineScale', newScale);
  };

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   */
  Rekapi.prototype.createTimeline = function (el) {
    return new RekapiTimeline(this, el);
  };

  // Proxy Rekapi.prototype method that do not conflict with Backbone APIs to
  // RekapiTimeline
  var whitelistedProtoMethods =
      _.difference(Object.keys(Rekapi.prototype), ['on', 'off']);
  _.each(whitelistedProtoMethods, function (rekapiMethodName) {
    RekapiTimeline.prototype[rekapiMethodName] = function () {
      return Rekapi.prototype[rekapiMethodName].apply(this.rekapi, arguments);
    };
  }, this);

  return RekapiTimeline;
});
