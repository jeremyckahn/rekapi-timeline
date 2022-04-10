import _ from 'underscore'
import Lateralus from 'lateralus'
import template from 'text!./template.mustache'
import KeyframePropertyComponent from '../keyframe-property/main'

const Base = Lateralus.Component.View
const baseProto = Base.prototype

const KeyframePropertyTrackComponentView = Base.extend({
  template,

  lateralusEvents: {
    /**
     * @param {KeyframePropertyModel} newKeyframeProperty
     */
    keyframePropertyAdded(newKeyframeProperty) {
      if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
        this.addKeyframePropertyComponent(newKeyframeProperty, true)
      }
    },

    /**
     * @param {KeyframePropertyComponentView} keyframePropertyView
     */
    userFocusedKeyframeProperty(keyframePropertyView) {
      this.setActiveClass(
        _.contains(this.component.components, keyframePropertyView.component)
      )
    },
  },

  events: {
    /**
     * @param {jQuery.Event} evt
     */
    dblclick(evt) {
      if (evt.target !== this.el) {
        return
      }

      const scaledMillisecond = this.collectOne(
        'timelineMillisecondForXOffset',
        evt.offsetX
      )

      this.addNewKeyframeAtMillisecond(scaledMillisecond)
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   *   @param {ActorModel} actorModel
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
    const trackName = this.model.get('trackName')

    // Is displayed to the user with CSS
    this.$el.attr('data-track-name', trackName)

    // Backfill components for any preexisting keyframeProperties
    this.actorModel.keyframePropertyCollection
      .where({ name: trackName })
      .forEach(keyframePropertyModel => {
        this.addKeyframePropertyComponent(keyframePropertyModel, false)
      })
  },

  /**
   * @param {KeyframePropertyModel} keyframePropertyModel
   * @param {boolean} doImmediatelyFocus
   */
  addKeyframePropertyComponent(keyframePropertyModel, doImmediatelyFocus) {
    const keyframePropertyComponent = this.addComponent(
      KeyframePropertyComponent,
      {
        model: keyframePropertyModel,
        doImmediatelyFocus: !!doImmediatelyFocus,
      }
    )

    this.$el.append(keyframePropertyComponent.view.$el)
  },

  /**
   * @param {boolean} isActive
   */
  setActiveClass(isActive) {
    this.$el[isActive ? 'addClass' : 'removeClass']('active')
  },

  /**
   * @param {number} millisecond
   */
  addNewKeyframeAtMillisecond(millisecond) {
    const keyframePropertyComponents = _.chain(this.component.components)
      .filter(component => component.toString() === 'keyframe-property')
      .sortBy(component => component.view.model.get('millisecond'))
      .value()

    let previousKeyframePropertyComponent = keyframePropertyComponents[0]
    let i = 1,
      len = keyframePropertyComponents.length
    for (i; i < len; i++) {
      if (
        keyframePropertyComponents[i].view.model.get('millisecond') >
        millisecond
      ) {
        break
      }

      previousKeyframePropertyComponent = keyframePropertyComponents[i]
    }

    const previousKeyframePropertyModelJson =
      previousKeyframePropertyComponent.view.model.toJSON()

    this.emit('requestNewKeyframeProperty', {
      name: previousKeyframePropertyModelJson.name,
      value: previousKeyframePropertyModelJson.value,
      easing: previousKeyframePropertyModelJson.easing,
      millisecond,
    })
  },
})

export default KeyframePropertyTrackComponentView
