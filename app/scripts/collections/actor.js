define([

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/actor'

], function (

  Backbone
  ,Lateralus

  ,ActorModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var ActorCollection = Base.extend({
    model: ActorModel

    ,initialize: function () {
      // FIXME: This should be leveraging `lateralusEvents`.
      this.lateralus.rekapi.on('addActor', this.onRekapiAddActor.bind(this));
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.Actor} actor
     */
    ,onRekapiAddActor: function (rekapi, actor) {
      this.addActorToCollection(actor);
    }

    /**
     * @param {Rekapi.Actor} actor
     * @return {ActorModel}
     */
    ,addActorToCollection: function (actor) {
      var actorModel = this.initModel(ActorModel, { actor: actor });
      return this.add(actorModel);
    }
  });

  return ActorCollection;
});
