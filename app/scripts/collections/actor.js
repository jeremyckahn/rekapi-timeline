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

      var addActorToCollection = _.bind(this.addActorToCollection, this);
      this.rekapiTimeline.rekapi.on('addActor', addActorToCollection);
    }

    /**
     * @param {Rekapi.Actor} actor
     * @return {RekapiTimelineActorModel}
     */
    ,addActorToCollection: function (actor) {
      this.add({}, {
        actor: actor
        ,rekapiTimeline: this.rekapiTimeline
      });

      var actorModel = this.findWhere({ id: actor.id });

      return actorModel;
    }
  });

  return RekapiTimelineActorCollection;
});
