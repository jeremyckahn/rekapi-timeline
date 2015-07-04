define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.actor-tracks'

], function (

  _
  ,Lateralus

  ,template

  ,ActorTracksComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var AnimationTracksComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.actorTracksComponents = [];

      // FIXME: This should be leveraging `lateralusEvents`.
      this.listenTo(
        this.lateralus.actorCollection
        ,'add'
        ,this.onActorCollectionAdd.bind(this)
      );

      this.createActorComponents();
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,onActorCollectionAdd: function (actorModel) {
      this.createActorComponent(actorModel);
    }

    ,createActorComponents: function () {
      // Creates views for any actors that were already in the animimation
      var actorCollection = this.lateralus.actorCollection;
      _.each(this.lateralus.getAllActors(),
          actorCollection.addActorToCollection, actorCollection);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,createActorComponent: function (actorModel) {
      var actorTracksComponent = this.addComponent(ActorTracksComponent, {
        model: actorModel
      });

      this.actorTracksComponents.push(actorTracksComponent);
      this.$el.append(actorTracksComponent.view.$el);
    }
  });

  return AnimationTracksComponentView;
});
