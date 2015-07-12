define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline.component.container'

  ,'rekapi-timeline/utils'
  ,'rekapi-timeline/model'
  ,'rekapi-timeline/constant'
  ,'rekapi-timeline/collections/actor'

  // Silent dependency
  ,'jquery-dragon'

], function (

  _
  ,Lateralus
  ,Rekapi

  ,ContainerComponent

  ,utils
  ,RekapiTimelineModel
  ,constant
  ,ActorCollection

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

    // Amplify all Rekapi events to "rekapi:" lateralusEvents.
    this.rekapi.getEventNames().forEach(function (eventName) {
      this.rekapi.on(eventName, function () {
        this.emit.apply(
          this, ['rekapi:' + eventName].concat(_.toArray(arguments)));
      }.bind(this));
    }.bind(this));

    // FIXME: This should be on the Lateralus.Model.
    this.timelineScale = constant.DEFAULT_TIMELINE_SCALE;

    this.actorCollection = this.initCollection(ActorCollection);

    this.containerComponent = this.addComponent(ContainerComponent, {
      el: el
    });

    this.model.set('hasRendered', true);
    this.emit('initialDOMRender');

    _.defer(this.deferredInitialize.bind(this));
  }, {
    Model: RekapiTimelineModel
  });

  RekapiTimeline.prototype.deferredInitialize = function () {
    this.model.set('hasBooted', true);
  };

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
   * FIXME: Legacy code.  Change this to be a `lateralusEvents` event.
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
    return new RekapiTimeline(el, this);
  };

  utils.proxy(Rekapi, RekapiTimeline, {
    blacklistedMethodNames: ['on', 'off']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiTimeline;
});
