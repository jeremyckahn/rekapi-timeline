define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'./components/container/main'

  ,'./utils'
  ,'./model'
  ,'./collections/actor'

  // Silent dependency
  ,'jquery-dragon'
  ,'!style-loader!raw-loader!sass-loader!../styles/main.sass'

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
   * @param {Object} config
   * @param {Array.<string>=} [config.supportedProperties]
   * @param {boolean=} [config.preventValueInputAutoSelect]
   * @extends {Lateralus}
   * @constructor
   */
  var RekapiTimeline = Lateralus.beget(function (el, rekapi, config) {
    Lateralus.apply(this, arguments);
    this.rekapi = rekapi;
    this.model.set(config);

    // This must happen in the RekapiTimelineModel constructor, rather than in
    // RekapiTimelineModel's initialize method, as this.lateralus.rekapi is not
    // set up when that method executes.
    this.model.set('timelineDuration', this.getAnimationLength());

    this.globalRenderData = this.model.pick('supportedProperties');

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

      ,'rekapi:removeKeyframePropertyComplete': function () {
        if (!this.isPlaying()) {
          // This operation needs to be deferred because Rekapi's
          // removeKeyframeProperty event is fired at point in the keyframe
          // removal process where calling update() would not reflect the new
          // state of the timeline.  However, this only needs to be done if the
          // animation is not already playing.
          var timelineDuration = this.model.get('timelineDuration');
          var lastMillisecondUpdated = this.getLastMillisecondUpdated();

          // Passing undefined to Rekapi#update causes a re-render of the
          // previously rendered frame.  If the previously rendered frame is
          // greater than the length of the timeline (possible in this case
          // because this executes within the rekapi:removeKeyframeProperty
          // event handler), update to the last frame in the timeline.
          var updateMillisecond = lastMillisecondUpdated > timelineDuration ?
              timelineDuration : undefined;

          this.update(updateMillisecond);
        }
      }

      ,'rekapi:timelineModified': function () {
        if (!this.isPlaying()) {
          var timelineDuration = this.model.get('timelineDuration');

          if (this.getLastMillisecondUpdated() > timelineDuration) {
            this.update(timelineDuration);
          }
        }

        this.model.set('timelineDuration', this.getAnimationLength());
      }
    }

    /**
     * @param {number=} opt_millisecond Same as Rekapi#update
     * @param {boolean=} opt_doResetLaterFnKeyframes Same as Rekapi#update
     * @return {Rekapi}
     */
    ,update: function () {
      var rekapi = this.rekapi;

      try {
        rekapi.update.apply(rekapi, arguments);
      } catch (e) {
        if (e.name === 'TypeError') {
          this.warn('Keyframe property format mismatch detected');
        } else {
          this.warn(e);
        }
      }

      return this.rekapi;
    }

    /**
     * @return {number}
     */
    ,getLastMillisecondUpdated: function () {
      return this.getLastPositionUpdated() * this.model.get('timelineDuration');
    }
  });

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   * @param {Object=} [config]
   */
  Rekapi.prototype.createTimeline = function (el, config) {
    return new RekapiTimeline(el, this, config || {});
  };

  utils.proxy(Rekapi, RekapiTimeline, {
    blacklistedMethodNames: ['on', 'off', 'trigger', 'update']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiTimeline;
});
