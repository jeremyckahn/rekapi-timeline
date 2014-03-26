define([

  'underscore'
  ,'backbone'
  ,'rekapi'

  ,'collections/keyframe-property'

], function (

  _
  ,Backbone
  ,Rekapi

  ,RekapiTimelineKeyframePropertyCollection

  ) {
  'use strict';

  var RekapiTimelineActorModel = Backbone.Model.extend({
    /**
     * @param {Object} attrs Should not contain any properties.
     * @param {Object} opts
     *   @param {Rekapi.Actor} actor
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (attrs, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.attributes = opts.actor;
      this.getTrackNames().forEach(this.addKeyframePropertyTrack, this);

      this.keyframePropertyCollection =
          new RekapiTimelineKeyframePropertyCollection(null, {
        rekapiTimeline: this.rekapiTimeline
        ,actorModel: this
      });

      this.listenTo(this.keyframePropertyCollection, 'add',
          _.bind(this.onAddKeyframeProperty, this));

      // Backfill the collection with any keyframeProperties the actor may
      // already have
      this.getTrackNames().forEach(function (trackName) {
        this.getPropertiesInTrack(trackName).forEach(
            this.keyframePropertyCollection.addKeyframePropertyToCollection,
            this.keyframePropertyCollection);
      }, this);
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} model
     */
    ,onAddKeyframeProperty: function (model) {
      this.trigger('addKeyframeProperty', model);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.trigger('addKeyframePropertyTrack', trackName);
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes;
    }
  });

  // Proxy all Rekapi.Actor.prototype methods to RekapiTimelineActorModel
  _.each(Rekapi.Actor.prototype, function (actorMethod, actorMethodName) {
    RekapiTimelineActorModel.prototype[actorMethodName] = function () {
      return actorMethod.apply(this.attributes, arguments);
    };
  }, this);

  return RekapiTimelineActorModel;
});
