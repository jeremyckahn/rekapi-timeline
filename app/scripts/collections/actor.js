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

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.Actor} actor
       */
      'rekapi:addActor': function (rekapi, actor) {
        this.addActorToCollection(actor);
      }
    }

    /**
     * @param {Rekapi.Actor} actor
     */
    ,addActorToCollection: function (actor) {
      var actorModel = this.initModel(ActorModel, { actor: actor });
      this.emit('actorAdded', this.add(actorModel));
    }
  });

  return ActorCollection;
});
