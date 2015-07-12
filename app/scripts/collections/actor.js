define([

  'underscore'
  ,'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/actor'

], function (

  _
  ,Backbone
  ,Lateralus

  ,ActorModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var ActorCollection = Base.extend({
    model: ActorModel

    ,provide: {
      /**
       * @return {ActorCollection}
       */
      actorCollection: function () {
        return this;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.Actor} actor
       */
      'rekapi:addActor': function (rekapi, actor) {
        this.addActor(actor);
      }
    }

    ,initialize: function () {
      _.each(this.lateralus.getAllActors(), this.addActor, this);
    }

    /**
     * @param {Rekapi.Actor} actor
     */
    ,addActor: function (actor) {
      var actorModel = this.initModel(ActorModel, { actor: actor });
      this.emit('actorAdded', this.add(actorModel));
    }
  });

  return ActorCollection;
});
