define([

  'backbone'

], function (

  Backbone

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

  return RekapiTimelineActorModel;
});
