define(['lateralus', 'rekapi', '../collections/keyframe-property'], function (
  Lateralus,
  Rekapi,

  KeyframePropertyCollection
) {
  'use strict'

  const Base = Lateralus.Component.Model

  const ActorModel = Base.extend({
    defaults: {
      actor: Rekapi.Actor,
    },

    provide: {
      /**
       * NOTE: This won't work if rekapi-timeline ever supports multiple
       * actors.
       * @return {ActorModel}
       */
      currentActorModel() {
        return this
      },
    },

    lateralusEvents: {
      /**
       * @param {{
       *   name: string,
       *   value: number|string,
       *   millisecond: number,
       *   easing: string }} args
       */
      requestNewKeyframeProperty(args) {
        const stateObj = {}
        stateObj[args.name] = args.value
        this.attributes.keyframe(args.millisecond, stateObj, args.easing)
      },

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:addKeyframePropertyTrack': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.id) {
          this.addKeyframePropertyTrack(keyframeProperty.name)
        }
      },

      'rekapi:removeActor': function (rekapi, actor) {
        if (actor.id === this.id) {
          this.dispose()
        }
      },
    },

    /**
     * @param {Object} attrs
     *   @param {Rekapi.Actor} actor
     */
    initialize() {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.Actor instance.
      //
      // TODO: This is an extemely bad pattern and it should not be used.
      this.attributes = this.attributes.actor

      this.id = this.attributes.id
      this.attributes
        .getTrackNames()
        .forEach(this.addKeyframePropertyTrack, this)

      const keyframePropertyCollection = this.initCollection(
        KeyframePropertyCollection,
        null,
        { actorModel: this }
      )

      this.keyframePropertyCollection = keyframePropertyCollection

      // Backfill the collection with any keyframeProperties the actor may
      // already have.
      this.attributes.getTrackNames().forEach(function (trackName) {
        this.attributes
          .getPropertiesInTrack(trackName)
          .forEach(
            keyframePropertyCollection.addKeyframeProperty,
            keyframePropertyCollection
          )
      }, this)
    },

    /**
     * @param {string} trackName
     */
    addKeyframePropertyTrack(trackName) {
      this.emit('keyframePropertyTrackAdded', trackName)
    },
  })

  return ActorModel
})
