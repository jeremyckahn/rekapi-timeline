define([

  'lateralus'
  ,'rekapi'

  ,'rekapi-timeline/collections/keyframe-property'

  ,'rekapi-timeline/utils'

], function (

  Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var ActorModel = Base.extend({
    defaults: {
      actor: Rekapi.Actor
    }

    /**
     * @param {Object} attrs
     *   @param {Rekapi.Actor} actor
     */
    ,initialize: function () {
      this.getTrackNames().forEach(this.addKeyframePropertyTrack, this);

      // FIXME: This should be leveraging `lateralusEvents`.
      this.rekapiTimeline.rekapi.on('addKeyframePropertyTrack',
        this.onRekapiAddKeyframePropertyTrack.bind(this));

      this.keyframePropertyCollection = this.initCollection(
        KeyframePropertyCollection
        ,null
        ,{ actorModel: this }
      );

      // FIXME: This should be leveraging `lateralusEvents`.
      this.listenTo(this.keyframePropertyCollection, 'add',
        this.onAddKeyframeProperty.bind(this));

      // Backfill the collection with any keyframeProperties the actor may
      // already have.
      this.getTrackNames().forEach(function (trackName) {
        this.getPropertiesInTrack(trackName).forEach(
          this.keyframePropertyCollection.addKeyframePropertyToCollection,
          this.keyframePropertyCollection);
      }, this);
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRekapiAddKeyframePropertyTrack: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.attributes.actor) {
        this.addKeyframePropertyTrack(keyframeProperty.name);
      }
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} model
     */
    ,onAddKeyframeProperty: function (model) {
      this.emit('addKeyframeProperty', model);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.emit('addKeyframePropertyTrack', trackName);
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes.actor;
    }
  });

  utils.proxy(Rekapi.Actor, ActorModel);

  return ActorModel;
});