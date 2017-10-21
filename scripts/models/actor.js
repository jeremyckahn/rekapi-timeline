define([

  'lateralus'
  ,'rekapi'

  ,'../collections/keyframe-property'

], function (

  Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var ActorModel = Base.extend({
    defaults: {
      actor: Rekapi.Actor
    }

    ,provide: {
      /**
       * NOTE: This won't work if rekapi-timeline ever supports multiple
       * actors.
       * @return {ActorModel}
       */
      currentActorModel: function () {
        return this;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {{
       *   name: string,
       *   value: number|string,
       *   millisecond: number,
       *   easing: string }} args
       */
      requestNewKeyframeProperty: function (args) {
        var stateObj = {};
        stateObj[args.name] = args.value;
        this.attributes.keyframe(args.millisecond, stateObj, args.easing);
      }

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      ,'rekapi:addKeyframePropertyTrack': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.id) {
          this.addKeyframePropertyTrack(keyframeProperty.name);
        }
      }

      ,'rekapi:removeActor': function (rekapi, actor) {
        if (actor.id === this.id) {
          this.dispose();
        }
      }
    }

    /**
     * @param {Object} attrs
     *   @param {Rekapi.Actor} actor
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.Actor instance.
      //
      // TODO: This is an extemely bad pattern and it should not be used.
      this.attributes = this.attributes.actor;

      this.id = this.attributes.id;
      this.attributes.getTrackNames().forEach(
        this.addKeyframePropertyTrack,
        this
      );

      var keyframePropertyCollection = this.initCollection(
        KeyframePropertyCollection
        ,null
        ,{ actorModel: this }
      );

      this.keyframePropertyCollection = keyframePropertyCollection;

      // Backfill the collection with any keyframeProperties the actor may
      // already have.
      this.attributes.getTrackNames().forEach(function (trackName) {
        this.attributes.getPropertiesInTrack(trackName).forEach(
          keyframePropertyCollection.addKeyframeProperty,
          keyframePropertyCollection);
      }, this);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.emit('keyframePropertyTrackAdded', trackName);
    }
  });

  return ActorModel;
});
