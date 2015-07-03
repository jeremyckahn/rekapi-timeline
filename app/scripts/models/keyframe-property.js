define([

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline/utils'

], function (

  _
  ,Backbone
  ,Lateralus
  ,Rekapi

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var KeyframePropertyModel = Base.extend({
    defaults: {
      keyframeProperty: Rekapi.KeyframeProperty
    }

    /**
     * @param {Object} attributes
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,initialize: function () {
      // FIXME: Abstract this to be `lateralusEvents` event.
      this.lateralus.rekapi.on('removeKeyframeProperty',
        this.onRekapiRemoveKeyframeProperty.bind(this));

      this.id = this.attributes.keyframeProperty.id;
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRekapiRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty === this.attributes.keyframeProperty) {
        this.destroy();
      }
    }

    /**
     * @override
     */
    ,set: function (key, value) {
      Backbone.Model.prototype.set.apply(this, arguments);

      if (key in this.attributes.keyframeProperty) {
        // Modify the keyframeProperty via its actor so that the state of the
        // animation is updated.
        var obj = {};
        obj[key] = value;
        this.attributes.keyframeProperty.actor.modifyKeyframeProperty(
            this.get('name'), this.get('millisecond'), obj);
      }
    }

    /**
     * FIXME: Obviate this.
     * @return {Rekapi.KeyframeProperty}
     */
    ,getKeyframeProperty: function () {
      return this.attributes.keyframeProperty;
    }

    /**
     * FIXME: Try to obviate this.
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes.keyframeProperty.actor;
    }

    /**
     * FIXME: Try to obviate this.
     * @return {RekapiTimelineActorModel}
     */
    ,getActorModel: function () {
      return this.collection.actorModel;
    }

    /**
     * Overrides the standard Backbone.Model#destroy behavior, as there is no
     * server data that this model is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  utils.proxy(Rekapi.KeyframeProperty, KeyframePropertyModel);

  return KeyframePropertyModel;
});
