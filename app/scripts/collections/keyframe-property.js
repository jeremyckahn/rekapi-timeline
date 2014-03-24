define([

  'underscore'
  ,'backbone'

  ,'models/keyframe-property'

], function (

  _
  ,Backbone

  ,RekapiTimelineKeyframePropertyModel

  ) {
  'use strict';

  var RekapiTimelineKeyframePropertyCollection = Backbone.Collection.extend({
    model: RekapiTimelineKeyframePropertyModel

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {RekapiTimelineActorModel} actorModel
     */
    ,initialize: function (models, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.actorModel = opts.actorModel;

      var rawActorProperties = [];

      var actor = this.actorModel.getActor();
      actor.getTrackNames().forEach(function (trackName) {
        actor.getPropertiesInTrack(trackName).forEach(
            Array.prototype.push, rawActorProperties);
      });

      rawActorProperties
        .filter(function (keyframeProperty) {
          return keyframeProperty.actor === actor;
        })
        .forEach(this.addKeyframePropertyToCollection, this);

      this.rekapiTimeline.rekapi.on('addKeyframeProperty',
          _.bind(this.onAddKeyframeProperty, this));
      this.rekapiTimeline.rekapi.on('removeKeyframeProperty',
          _.bind(this.onRemoveKeyframeProperty, this));
    }

    ,onAddKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.actorModel.getActor()) {
        this.addKeyframePropertyToCollection(keyframeProperty);
      }
    }

    ,addKeyframePropertyToCollection: function (keyframeProperty) {
      this.add({}, {
        keyframeProperty: keyframeProperty
        ,rekapiTimeline: this.rekapiTimeline
      });

      return this.findWhere({ id: keyframeProperty.id });
    }

    ,onRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.actorModel.getActor()) {
        this.removeKeyframePropertyFromCollection(keyframeProperty);
      }
    }

    ,removeKeyframePropertyFromCollection: function (keyframeProperty) {
      this.remove(this.findWhere({ id: keyframeProperty.id }));
    }
  });

  return RekapiTimelineKeyframePropertyCollection;
});
