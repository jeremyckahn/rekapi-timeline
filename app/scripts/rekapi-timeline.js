define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline.component.container'

  ,'rekapi-timeline/utils'
  ,'rekapi-timeline/model'
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
  ,ActorCollection

) {
  'use strict';

  /**
   * @param {Element} el
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @extends {Lateralus}
   * @constructor
   */
  var RekapiTimeline = Lateralus.beget(function (el, rekapi) {
    Lateralus.apply(this, arguments);
    this.rekapi = rekapi;

    // This must happen in the RekapiTimelineModel constructor, rather than in
    // RekapiTimelineModel's initialize method, as this.lateralus.rekapi is not
    // setup when that method executes.
    this.model.set('timelineDuration', this.getAnimationLength());

    // Amplify all Rekapi events to "rekapi:" lateralusEvents.
    this.getEventNames().forEach(function (eventName) {
      this.rekapi.on(eventName, function () {
        this.emit.apply(
          this, ['rekapi:' + eventName].concat(_.toArray(arguments)));
      }.bind(this));
    }.bind(this));

    this.actorCollection = this.initCollection(ActorCollection);

    this.containerComponent = this.addComponent(ContainerComponent, {
      el: el
    });
  }, {
    Model: RekapiTimelineModel
  });

  _.extend(RekapiTimeline.prototype, {
    lateralusEvents: {
      stopAnimation: function () {
        this.stop().update(0);
      }

      ,'rekapi:removeKeyframeProperty': function () {
        if (!this.isPlaying()) {
          // This operation needs to be deferred because Rekapi's
          // removeKeyframeProperty event is fired at point in the keyframe
          // removal process where calling update() would not reflect the new
          // state of the timeline.  However, this only needs to be done if the
          // animation is not already playing.
          //
          // TODO: Perhaps change how this event works in Rekapi so that the
          // _.defer is not necessary?
          _.defer(function () {
            this.update();
          }.bind(this));
        }
      }

      ,'rekapi:timelineModified': function () {
        if (!this.isPlaying()) {
          var timelineDuration = this.model.get('timelineDuration');
          var lastMillisecondUpdated =
            this.getLastPositionUpdated() * timelineDuration;

          if (lastMillisecondUpdated > timelineDuration) {
            this.update(timelineDuration);
          }
        }

        this.model.set('timelineDuration', this.getAnimationLength());
      }
    }
  });

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
