define([
  'underscore',
  'lateralus',
  'rekapi',

  './components/container/main',

  './model',
  './collections/actor',

  // Silent dependencies
  'jquery-dragon',
  '../styles/main.sass',
], function (
  _,
  Lateralus,
  rekapi,

  ContainerComponent,

  RekapiTimelineModel,
  ActorCollection
) {
  'use strict'

  const { Rekapi } = rekapi

  /**
   * @param {Element} el
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @param {Object} config
   * @param {Array.<string>=} [config.supportedProperties]
   * @param {boolean=} [config.preventValueInputAutoSelect]
   * @extends {Lateralus}
   * @constructor
   */
  const RekapiTimeline = Lateralus.beget(
    function (el, rekapi, config) {
      Lateralus.apply(this, arguments)
      this.rekapi = rekapi
      this.model.set(config)

      // This must happen in the RekapiTimelineModel constructor, rather than in
      // RekapiTimelineModel's initialize method, as this.lateralus.rekapi is not
      // set up when that method executes.
      this.model.set('timelineDuration', this.rekapi.getAnimationLength())

      this.globalRenderData = this.model.pick('supportedProperties')

      // Amplify all Rekapi events to "rekapi:" lateralusEvents.
      this.rekapi.getEventNames().forEach(eventName => {
        this.rekapi.on(eventName, () => {
          this.emit.apply(
            this,
            [`rekapi:${eventName}`].concat(_.toArray(arguments))
          )
        })
      })

      this.actorCollection = this.initCollection(ActorCollection)

      this.containerComponent = this.addComponent(ContainerComponent, {
        el,
      })
    },
    {
      Model: RekapiTimelineModel,
    }
  )

  _.extend(RekapiTimeline.prototype, {
    lateralusEvents: {
      stopAnimation() {
        this.rekapi.stop()
        this.update(0)
      },

      'rekapi:removeKeyframePropertyComplete': function () {
        if (!this.rekapi.isPlaying()) {
          // This operation needs to be deferred because Rekapi's
          // removeKeyframeProperty event is fired at point in the keyframe
          // removal process where calling update() would not reflect the new
          // state of the timeline.  However, this only needs to be done if the
          // animation is not already playing.
          const timelineDuration = this.model.get('timelineDuration')
          const lastMillisecondUpdated = this.rekapi.getLastMillisecondUpdated()

          // Passing undefined to Rekapi#update causes a re-render of the
          // previously rendered frame.  If the previously rendered frame is
          // greater than the length of the timeline (possible in this case
          // because this executes within the rekapi:removeKeyframeProperty
          // event handler), update to the last frame in the timeline.
          const updateMillisecond =
            lastMillisecondUpdated > timelineDuration
              ? timelineDuration
              : undefined

          this.update(updateMillisecond)
        }
      },

      'rekapi:timelineModified': function () {
        if (!this.rekapi.isPlaying()) {
          const timelineDuration = this.model.get('timelineDuration')

          if (this.rekapi.getLastMillisecondUpdated() > timelineDuration) {
            this.update(timelineDuration)
          }
        }

        this.model.set('timelineDuration', this.rekapi.getAnimationLength())
      },
    },

    /**
     * @param {number=} opt_millisecond Same as Rekapi#update
     * @param {boolean=} opt_doResetLaterFnKeyframes Same as Rekapi#update
     * @return {Rekapi}
     */
    update() {
      const rekapi = this.rekapi

      try {
        rekapi.update.apply(rekapi, arguments)
      } catch (e) {
        if (e.name === 'TypeError') {
          this.warn('Keyframe property format mismatch detected')
        } else {
          this.warn(e)
        }
      }

      return this.rekapi
    },

    /**
     * @return {number}
     */
    getLastMillisecondUpdated() {
      return this.getLastPositionUpdated() * this.model.get('timelineDuration')
    },
  })

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   * @param {Object=} [config]
   */
  Rekapi.prototype.createTimeline = function (el, config) {
    return new RekapiTimeline(el, this, config || {})
  }

  return _.extend(
    {
      timeline: RekapiTimeline,
    },
    rekapi
  )
})
