define([

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/keyframe-property'

], function (

  Backbone
  ,Lateralus

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {ActorModel} actorModel The actorModel that "owns" this
     *   collection.
     */
    ,initialize: function (models, opts) {
      this.actorModel = opts.actorModel;

      // FIXME: This should be leveraging `lateralusEvents`.
      this.lateralus.rekapi.on('addKeyframeProperty',
          this.onAddKeyframeProperty.bind(this));
      this.lateralus.rekapi.on('removeKeyframeProperty',
          this.onRemoveKeyframeProperty.bind(this));
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onAddKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.actorModel.getActor()) {
        this.addKeyframePropertyToCollection(keyframeProperty);
      }
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.actorModel.getActor()) {
        this.removeKeyframePropertyFromCollection(keyframeProperty);
      }
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     * @return {KeyframePropertyModel} The keyframe property model that was
     * added.
     */
    ,addKeyframePropertyToCollection: function (keyframeProperty) {
      var keyframePropertyModel = this.initModel(KeyframePropertyModel, {
        keyframeProperty: keyframeProperty
      });

      return this.add(keyframePropertyModel);
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,removeKeyframePropertyFromCollection: function (keyframeProperty) {
      this.remove(keyframeProperty.id);
    }
  });

  return KeyframePropertyCollection;
});
