import _ from 'underscore'
import Lateralus from 'lateralus'
import ActorModel from '../models/actor'

const Base = Lateralus.Component.Collection

const ActorCollection = Base.extend({
  model: ActorModel,

  provide: {
    /**
     * @return {ActorCollection}
     */
    actorCollection() {
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

  initialize() {
    // Backfill any existing actors into the collection.
    _.each(this.lateralus.rekapi.getAllActors(), this.addActor, this)
  },

  /**
   * @param {Rekapi.Actor} actor
   */
  addActor(actor) {
    const actorModel = this.initModel(ActorModel, { actor })
    this.emit('actorAdded', this.add(actorModel))
  },
})

export default ActorCollection
