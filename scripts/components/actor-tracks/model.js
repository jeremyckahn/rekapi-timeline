define(['lateralus'], function (Lateralus) {
  'use strict'

  const Base = Lateralus.Component.Model
  const baseProto = Base.prototype

  const ActorTracksComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize() {
      baseProto.initialize.apply(this, arguments)
    },
  })

  return ActorTracksComponentModel
})
