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

      this.keyframePropertyCollection =
          new RekapiTimelineKeyframePropertyCollection(null, {
        rekapiTimeline: this.rekapiTimeline
        ,actorModel: this
      });
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
