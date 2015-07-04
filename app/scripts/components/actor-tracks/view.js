define([

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property-track'

], function (

  Lateralus

  ,template

  ,KeyframePropertyTrackComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ActorTracksComponentView = Base.extend({
    template: template

    ,modelEvents: {
      /**
       * @param {string} newTrackName
       */
      addKeyframePropertyTrack: function (newTrackName) {
        this.addKeyframePropertyTrackComponent(newTrackName);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyTrackComponents = [];

      // Create views for any keyframes that were already defined
      this.model.getTrackNames().forEach(
          this.addKeyframePropertyTrackComponent, this);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrackComponent: function (trackName) {
      var keyframePropertyTrackComponent = this.addComponent(
          KeyframePropertyTrackComponent, {
        model: this.model
        ,trackName: trackName
      });

      this.keyframePropertyTrackComponents.push(
        keyframePropertyTrackComponent);
      this.$el.append(keyframePropertyTrackComponent.view.$el);
    }
  });

  return ActorTracksComponentView;
});
