define([
  'underscore',
  'lateralus',

  'text!./template.mustache',

  '../../constant',
], function (
  _,
  Lateralus,

  template,

  constant
) {
  'use strict'

  const Base = Lateralus.Component.View
  const baseProto = Base.prototype

  const ScrubberComponentView = Base.extend({
    template,

    lateralusEvents: {
      'change:timelineScale': function () {
        this.render()
        this.syncContainerToTimelineLength()
      },

      'change:timelineDuration': function () {
        this.render()
      },

      requestResizeScrubberGuide() {
        this.resizeScrubberGuide()
      },

      'rekapi:afterUpdate': function () {
        this.render()
      },

      // resizeScrubberGuide calls that are called in response to a Rekapi
      // event must be deferred here so the DOM has a chance to finish building
      // itself
      'rekapi:addKeyframePropertyTrack': function () {
        _.defer(this.resizeScrubberGuide.bind(this))
      },

      'rekapi:removeKeyframePropertyTrack': function () {
        _.defer(this.resizeScrubberGuide.bind(this))
      },

      'rekapi:timelineModified': function () {
        this.syncContainerToTimelineLength()
      },
    },

    events: {
      'drag .scrubber-handle': function () {
        const millisecond = this.collectOne(
          'timelineMillisecondForHandle',
          this.$scrubberHandle
        )
        this.lateralus.update(millisecond)
      },

      /**
       * @param {jQuery.Event} evt
       */
      'click .scrubber-wrapper': function (evt) {
        if (evt.target !== this.$scrubberWrapper[0]) {
          return
        }

        const scaledMillisecond = this.collectOne(
          'timelineMillisecondForXOffset',
          evt.offsetX
        )

        const lateralus = this.lateralus
        lateralus.rekapi.pause()
        lateralus.update(scaledMillisecond, true)
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize() {
      baseProto.initialize.apply(this, arguments)

      this.syncContainerToTimelineLength()

      this.$scrubberHandle.dragon({
        within: this.$scrubberWrapper,
      })
    },

    deferredInitialize() {
      this.resizeScrubberGuide()
    },

    render() {
      this.syncHandleToTimelineLength()
    },

    syncContainerToTimelineLength() {
      const scaledContainerWidth =
        this.lateralus.model.get('timelineDuration') *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale')

      this.$scrubberWrapper.width(
        scaledContainerWidth + this.$scrubberHandle.width()
      )
    },

    syncHandleToTimelineLength() {
      const lastMillisecondUpdated =
        this.lateralus.rekapi.getLastPositionUpdated() *
        this.lateralus.model.get('timelineDuration')

      const scaledLeftValue =
        lastMillisecondUpdated *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale')

      this.$scrubberHandle.css('left', scaledLeftValue)
    },

    resizeScrubberGuide() {
      const wrapperHeight = this.collectOne('timelineWrapperHeight')
      const scrubberBottomBorder = parseInt(
        this.$scrubberWrapper.css('borderBottomWidth'),
        10
      )
      this.$scrubberGuide.css(
        'height',
        wrapperHeight - this.$el.height() + scrubberBottomBorder
      )
    },
  })

  return ScrubberComponentView
})
