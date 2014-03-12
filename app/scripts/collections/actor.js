define([

  'underscore'
  ,'backbone'

  ,'models/actor'

], function (

  _
  ,Backbone

  ,RekapiTimelineActorModel

  ) {
  'use strict';

  var RekapiTimelineActorCollection = Backbone.Collection.extend({
    model: RekapiTimelineActorModel

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {RekapiTimeline} rekapiTimeline
     */
    ,initialize: function (models, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;

      var addActor = _.bind(this.addActor, this);
      _.each(this.rekapiTimeline.rekapi.getAllActors(), addActor);
      this.rekapiTimeline.rekapi.on('addActor', addActor);
    }

    /**
     * @param {Rekapi.Actor} actor
     */
    ,addActor: function (actor) {
      this.add({}, {
        actor: actor
        ,rekapiTimeline: this.rekapiTimeline
      });
    }
  });

  return RekapiTimelineActorCollection;
});
