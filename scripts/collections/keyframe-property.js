define(['backbone', 'lateralus', '../models/keyframe-property'], function (
  Backbone,
  Lateralus,

  KeyframePropertyModel
) {
  'use strict'

  const Base = Lateralus.Component.Collection;

  const KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel,

    lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:addKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.actorModel.id) {
          this.addKeyframeProperty(keyframeProperty)
        }
      },

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.actorModel.id) {
          this.removeKeyframeProperty(keyframeProperty)
        }
      },
    },

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {ActorModel} actorModel The actorModel that "owns" this
     *   collection.
     */
    initialize: function (models, opts) {
      this.actorModel = opts.actorModel
    },

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    addKeyframeProperty: function (keyframeProperty) {
      const keyframePropertyModel = this.initModel(KeyframePropertyModel, {
        keyframeProperty: keyframeProperty,
      });

      this.emit('keyframePropertyAdded', this.add(keyframePropertyModel))
    },

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    removeKeyframeProperty: function (keyframeProperty) {
      this.remove(keyframeProperty.id)
    },
  });

  return KeyframePropertyCollection
})
