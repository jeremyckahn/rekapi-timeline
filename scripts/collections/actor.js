define(['underscore', 'backbone', 'lateralus', '../models/actor'], function (
  _,
  Backbone,
  Lateralus,

  ActorModel
) {
  'use strict'

  const Base = Lateralus.Component.Collection;

  const ActorCollection = Base.extend({
    model: ActorModel,

    provide: {
      /**
       * @return {ActorCollection}
       */
      actorCollection: function () {
        return this
      },
    },

    lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.Actor} actor
       */
      'rekapi:addActor': function (rekapi, actor) {
        this.addActor(actor)
      },
    },

    initialize: function () {
      // Backfill any existing actors into the collection.
      _.each(this.lateralus.rekapi.getAllActors(), this.addActor, this)
    },

    /**
     * @param {Rekapi.Actor} actor
     */
    addActor: function (actor) {
      const actorModel = this.initModel(ActorModel, { actor: actor });
      this.emit('actorAdded', this.add(actorModel))
    },
  });

  return ActorCollection
})
