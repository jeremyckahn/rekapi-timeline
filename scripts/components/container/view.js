import $ from 'jquery'
import Lateralus from 'lateralus'
import template from 'text!./template.mustache'
import constant from '../../constant'

const Base = Lateralus.Component.View
const baseProto = Base.prototype

const ContainerComponentView = Base.extend({
  template,

  provide: {
    /**
     * Gets the Rekapi timeline millisecond value for a slider handle-like
     * element.  This is used for converting the position of keyframe DOM
     * elements and the timeline scrubber position into the value it
     * represents in the animation timeline.
     * @param {jQuery} $handle The handle element to retrieve the millisecond
     * value for.
     * @return {number}
     */
    timelineMillisecondForHandle($handle) {
      const distanceFromLeft =
        parseInt($handle.css('left'), 10) -
        parseInt($handle.parent().css('border-left-width'), 10)
      const baseMillisecond =
        (distanceFromLeft / constant.PIXELS_PER_SECOND) * 1000

      return baseMillisecond / this.lateralus.model.get('timelineScale')
    },

    /**
     * @param {number} xOffset Should be a pixel value
     * @return {number}
     */
    timelineMillisecondForXOffset(xOffset) {
      const baseMillisecond = (xOffset / constant.PIXELS_PER_SECOND) * 1000

      return Math.floor(
        baseMillisecond / this.lateralus.model.get('timelineScale')
      )
    },
  },

  lateralusEvents: {
    /**
     * @param {Rekapi} rekapi
     * @param {string} trackName
     */
    'rekapi:removeKeyframePropertyTrack': function (rekapi, trackName) {
      const currentActorModel = this.collectOne('currentActorModel')

      // Remove corresponding inline styles for the removed track
      $(currentActorModel.get('context')).css(trackName, '')
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
  },
})

export default ContainerComponentView
