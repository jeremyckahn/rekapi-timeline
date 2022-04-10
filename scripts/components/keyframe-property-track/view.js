define([
  'underscore',
  'lateralus',

  'text!./template.mustache',

  '../keyframe-property/main',
], function (
  _,
  Lateralus,

  template,

  KeyframePropertyComponent
) {
  'use strict'

  const Base = Lateralus.Component.View;
  const baseProto = Base.prototype;

  const KeyframePropertyTrackComponentView = Base.extend({
    template: template,

    lateralusEvents: {
      /**
       * @param {KeyframePropertyModel} newKeyframeProperty
       */
      keyframePropertyAdded: function (newKeyframeProperty) {
        if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
          this.addKeyframePropertyComponent(newKeyframeProperty, true)
        }
      },

      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      userFocusedKeyframeProperty: function (keyframePropertyView) {
        this.setActiveClass(
          _.contains(this.component.components, keyframePropertyView.component)
        )
      },
    },

    events: {
      /**
       * @param {jQuery.Event} evt
       */
      dblclick: function (evt) {
        if (evt.target !== this.el) {
          return
        }

        const scaledMillisecond = this.collectOne(
          'timelineMillisecondForXOffset',
          evt.offsetX
        );

        this.addNewKeyframeAtMillisecond(scaledMillisecond)
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {ActorModel} actorModel
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments)
      const trackName = this.model.get('trackName');

      // Is displayed to the user with CSS
      this.$el.attr('data-track-name', trackName)

      // Backfill components for any preexisting keyframeProperties
      this.actorModel.keyframePropertyCollection
        .where({ name: trackName })
        .forEach(
          function (keyframePropertyModel) {
            this.addKeyframePropertyComponent(keyframePropertyModel, false)
          }.bind(this)
        )
    },

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     * @param {boolean} doImmediatelyFocus
     */
    addKeyframePropertyComponent: function (
      keyframePropertyModel,
      doImmediatelyFocus
    ) {
      const keyframePropertyComponent = this.addComponent(
        KeyframePropertyComponent,
        {
          model: keyframePropertyModel,
          doImmediatelyFocus: !!doImmediatelyFocus,
        }
      );

      this.$el.append(keyframePropertyComponent.view.$el)
    },

    /**
     * @param {boolean} isActive
     */
    setActiveClass: function (isActive) {
      this.$el[isActive ? 'addClass' : 'removeClass']('active')
    },

    /**
     * @param {number} millisecond
     */
    addNewKeyframeAtMillisecond: function (millisecond) {
      const keyframePropertyComponents = _.chain(this.component.components)
        .filter(function (component) {
          return component.toString() === 'keyframe-property'
        })
        .sortBy(function (component) {
          return component.view.model.get('millisecond')
        })
        .value();

      let previousKeyframePropertyComponent = keyframePropertyComponents[0];
      let i = 1, len = keyframePropertyComponents.length;
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
        previousKeyframePropertyComponent.view.model.toJSON();

      this.emit('requestNewKeyframeProperty', {
        name: previousKeyframePropertyModelJson.name,
        value: previousKeyframePropertyModelJson.value,
        easing: previousKeyframePropertyModelJson.easing,
        millisecond: millisecond,
      })
    },
  });

  return KeyframePropertyTrackComponentView
})
