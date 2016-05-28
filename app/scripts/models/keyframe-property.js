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
      ,isActive: false
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.id === this.id) {
          this.destroy();
        }
      }
    }

    /**
     * @param {Object} attributes
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.KeyframeProperty instance.
      this.attributes = this.attributes.keyframeProperty;
      _.defaults(this.attributes,
        _.omit(KeyframePropertyModel.prototype.defaults, 'keyframeProperty'));

      this.id = this.attributes.id;
    }

    /**
     * @override
     */
    ,set: function (key, value) {
      if (typeof key === 'string') {
        var oldValue = this.get(key);

        if (key in this.attributes) {
          if (this.get(key) === value) {
            return;
          }

          // Modify the keyframeProperty via its actor so that the state of the
          // animation is updated.
          var obj = {};
          obj[key] = value;
          this.attributes.actor.modifyKeyframeProperty(
              this.attributes.name, this.attributes.millisecond, obj);
        }

        this.attributes[key] = oldValue;
      }

      Backbone.Model.prototype.set.apply(this, arguments);
    }

    /**
     * @return {RekapiTimelineActorModel}
     */
    ,getOwnerActor: function () {
      return this.collection.actorModel;
    }

    /**
     * Override the standard Backbone.Model#destroy behavior, as there is no
     * server data that this model is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  utils.proxy(Rekapi.KeyframeProperty, KeyframePropertyModel, {
    subject: function () {
      return this.attributes;
    }
  });

  return KeyframePropertyModel;
});
