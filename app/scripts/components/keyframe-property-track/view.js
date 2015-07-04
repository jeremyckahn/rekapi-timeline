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
        if (newKeyframeProperty.get('name') === this.trackName) {
          this.addKeyframePropertyComponent(newKeyframeProperty);
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {string} trackName
     *   @param {ActorModel} model
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyComponents = [];
      this.$el.attr('data-track-name', this.trackName);

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.model.keyframePropertyCollection
        .where({ name: this.trackName })
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
