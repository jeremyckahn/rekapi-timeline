define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property'

], function (

  _
  ,Lateralus

  ,template

  ,KeyframePropertyComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyTrackComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyModel} newKeyframeProperty
       */
      keyframePropertyAdded: function (newKeyframeProperty) {
        if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
          this.addKeyframePropertyComponent(newKeyframeProperty, true);
        }
      }

      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      ,userFocusedKeyframeProperty: function (keyframePropertyView) {
        this.setActiveClass(
          _.contains(
            this.component.components, keyframePropertyView.component
          )
        );
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {ActorModel} actorModel
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      var trackName = this.model.get('trackName');

      // Is displayed to the user with CSS
      this.$el.attr('data-track-name', trackName);

      // Backfill components for any preexisting keyframeProperties
      this.actorModel.keyframePropertyCollection
        .where({ name: trackName })
        .forEach(function (keyframePropertyModel) {
          this.addKeyframePropertyComponent(keyframePropertyModel, false);
        }.bind(this));
    }

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     * @param {boolean} doImmediatelyFocus
     */
    ,addKeyframePropertyComponent:
      function (keyframePropertyModel, doImmediatelyFocus) {

      var keyframePropertyComponent = this.addComponent(
          KeyframePropertyComponent, {
        model: keyframePropertyModel
        ,doImmediatelyFocus: !!doImmediatelyFocus
      });

      this.$el.append(keyframePropertyComponent.view.$el);
    }

    /**
     * @param {boolean} isActive
     */
    ,setActiveClass: function (isActive) {
      this.$el[isActive ? 'addClass' : 'removeClass']('active');
    }
  });

  return KeyframePropertyTrackComponentView;
});
