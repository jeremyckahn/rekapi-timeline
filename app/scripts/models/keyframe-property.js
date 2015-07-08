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
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.KeyframeProperty instance.
      this.attributes = this.attributes.keyframeProperty;

      // FIXME: Abstract this to be `lateralusEvents` event.
      this.lateralus.rekapi.on('removeKeyframeProperty',
        this.onRekapiRemoveKeyframeProperty.bind(this));

      this.id = this.attributes.id;
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRekapiRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty === this.attributes) {
        this.destroy();
      }
    }

    /**
     * @override
     */
    ,set: function (key, value) {
      Backbone.Model.prototype.set.apply(this, arguments);

      if (key in this.attributes) {
        // Modify the keyframeProperty via its actor so that the state of the
        // animation is updated.
        var obj = {};
        obj[key] = value;
        this.attributes.actor.modifyKeyframeProperty(
            this.attributes.name, this.attributes.millisecond, obj);
      }
    }

    /**
     * FIXME: Try to obviate this.
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes.actor;
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
