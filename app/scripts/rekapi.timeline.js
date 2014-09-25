define([

  'rekapi'
  ,'underscore'
  ,'backbone'

  ,'./views/container'

  ,'./collections/actor'

  ,'./rekapi.timeline.constants'

  ,'jquery-dragon'

], function (

  Rekapi
  ,_
  ,Backbone

  ,ContainerView

  ,RekapiTimelineActorCollection

  ,rekapiTimelineConstants

) {
  'use strict';

  /**
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @param {HTMLElement} el The element to contain the widget.
   * @constuctor
   */
  function RekapiTimeline (rekapi, el) {
    this.rekapi = rekapi;
    this.timelineScale = rekapiTimelineConstants.DEFAULT_TIMELINE_SCALE;
    this.actorCollection = new RekapiTimelineActorCollection(null, {
      rekapiTimeline: this
    });

    this.containerView = new ContainerView({
      el: el
      ,rekapiTimeline: this
    });

    this.hasRendered = true;
    this.trigger('initialDOMRender');

    this.rekapi.on('timelineModified',
        _.bind(this.onRekapiTimelineModified, this));

    this.trigger('update');
  }

  RekapiTimeline.prototype.onRekapiTimelineModified = function () {
    this.trigger('update');
  };

  /**
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
        distanceFromLeft / rekapiTimelineConstants.PIXELS_PER_SECOND) * 1000;

    return baseMillisecond;
  };

  /**
   * @param {number} newScale
   */
  RekapiTimeline.prototype.setTimelineScale = function (newScale) {
    this.timelineScale = newScale;
    this.trigger('change:timelineScale', newScale);
  };

  /**
   * @param {Object} object
   */
  RekapiTimeline.prototype.dispose = function (object) {
    if (typeof object.stopListening === 'function') {
      object.stopListening();
    }

    _.each(object, function (value, key) {
      if (typeof value !== 'undefined') {
        if (value instanceof $) {
          value.off();
          value.remove();
        }

        delete object[key];
      }
    });
  };

  _.extend(RekapiTimeline.prototype, Backbone.Events);

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
