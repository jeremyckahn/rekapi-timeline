import _ from 'underscore'
import Lateralus from 'lateralus'
import template from 'text!./template.mustache'

const Base = Lateralus.Component.View
const baseProto = Base.prototype

const ScrubberDetailComponentView = Base.extend({
  template,

  lateralusEvents: {
    'change:timelineDuration': function () {
      this.renderAnimationLength()
    },

    'rekapi:afterUpdate': function () {
      this.renderCurrentPosition()
    },
  },

  events: {
    'change .scrubber-scale input': function () {
      if (this.$scrubberScale[0].validity.valid) {
        this.lateralus.model.set(
          'timelineScale',
          this.$scrubberScale.val() / 100
        )
      }
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
    this.renderAnimationLength()
  },

  /**
   * @override
   */
  getTemplateRenderData() {
    const renderData = baseProto.getTemplateRenderData.apply(this, arguments)

    _.extend(renderData, {
      initialZoom: this.lateralus.model.get('timelineScale') * 100,
    })

    return renderData
  },

  renderAnimationLength() {
    this.$animationLength.text(this.lateralus.model.get('timelineDuration'))
  },

  renderCurrentPosition() {
    const lateralus = this.lateralus
    const currentPosition =
      lateralus.rekapi.getLastPositionUpdated() *
      lateralus.model.get('timelineDuration')

    // Default the rendered value to 0, as currentPosition may be NaN.
    this.$currentPosition.text(Math.floor(currentPosition) || 0)
  },
})

export default ScrubberDetailComponentView
