define([

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property'

], function (

  Lateralus

  ,template

  ,KeyframePropertyComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyTrackComponentView = Base.extend({
    template: template

    ,modelEvents: {
      /**
       * @param {KeyframePropertyModel} newKeyframeProperty
       */
      addKeyframeProperty: function (newKeyframeProperty) {
        if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
          this.addKeyframePropertyComponent(newKeyframeProperty);
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {ActorModel} actorModel
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyComponents = [];
      var trackName = this.model.get('trackName');
      this.$el.attr('data-track-name', trackName);

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.actorModel.keyframePropertyCollection
        .where({ name: trackName })
        .forEach(this.addKeyframePropertyComponent, this);
    }

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     */
    ,addKeyframePropertyComponent: function (keyframePropertyModel) {
      // It's important to build the DOM before initializing the View in this
      // case, the initialization logic in KeyframePropertyView is way easier
      // that way.
      var keyframePropertyEl = document.createElement('div');
      this.$el.append(keyframePropertyEl);

      var keyframePropertyComponent = this.addComponent(
          KeyframePropertyComponent, {
        el: keyframePropertyEl
        ,keyframePropertyTrackComponentView: this
        ,model: keyframePropertyModel
      });

      this.keyframePropertyComponents.push(keyframePropertyComponent);

      // FIXME: Is this line still necessary?
      keyframePropertyComponent.view.render();
    }
  });

  return KeyframePropertyTrackComponentView;
});
