define([

  'underscore'
  ,'backbone'
  ,'rekapi'

], function (

  _
  ,Backbone
  ,Rekapi

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
