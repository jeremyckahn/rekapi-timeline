define([
  'lateralus',

  'text!./template.mustache',

  '../keyframe-property-track/main',
], function (
  Lateralus,

  template,

  KeyframePropertyTrackComponent
) {
  'use strict'

  const Base = Lateralus.Component.View;
  const baseProto = Base.prototype;

  const ActorTracksComponentView = Base.extend({
    template,

    modelEvents: {
      /**
       * @param {string} newTrackName
       */
      keyframePropertyTrackAdded(newTrackName) {
        this.addKeyframePropertyTrackComponent(newTrackName)
      },

      beforeDispose() {
        this.component.dispose()
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize() {
      baseProto.initialize.apply(this, arguments)
      this.keyframePropertyTrackComponents = []

      // Backfill any preexisting tracks
      //
      // TODO: getTrackNames needs to be accessed directly like this because of
      // caller context issues.  The model needs to be re-architected.
      this.model.attributes
        .getTrackNames()
        .forEach(this.addKeyframePropertyTrackComponent, this)
    },

    /**
     * @param {string} trackName
     */
    addKeyframePropertyTrackComponent(trackName) {
      const keyframePropertyTrackComponent = this.addComponent(
        KeyframePropertyTrackComponent,
        {
          actorModel: this.model,
        },
        {
          modelAttributes: {
            trackName,
          },
        }
      );

      this.keyframePropertyTrackComponents.push(keyframePropertyTrackComponent)
      this.$el.append(keyframePropertyTrackComponent.view.$el)
    },
  });

  return ActorTracksComponentView
})
