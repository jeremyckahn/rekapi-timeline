define([

  'underscore'
  ,'backbone'

  ,'../models/keyframe-property'

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

      this.rekapiTimeline.rekapi.on('addKeyframeProperty',
          _.bind(this.onAddKeyframeProperty, this));
      this.rekapiTimeline.rekapi.on('removeKeyframeProperty',
          _.bind(this.onRemoveKeyframeProperty, this));
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
     * @return {RekapiTimelineKeyframePropertyModel} The keyframe property
     * model that was added.
     */
    ,addKeyframePropertyToCollection: function (keyframeProperty) {
      this.add({}, {
        keyframeProperty: keyframeProperty
        ,rekapiTimeline: this.rekapiTimeline
      });

      return this.findWhere({ id: keyframeProperty.id });
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,removeKeyframePropertyFromCollection: function (keyframeProperty) {
      this.remove(this.findWhere({ id: keyframeProperty.id }));
    }
  });

  return RekapiTimelineKeyframePropertyCollection;
});
