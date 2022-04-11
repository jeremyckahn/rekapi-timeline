import Lateralus from 'lateralus'
import template from 'text!./template.mustache'
import ActorTracksComponent from '../actor-tracks/main'

const Base = Lateralus.Component.View
const baseProto = Base.prototype

const AnimationTracksComponentView = Base.extend({
  template,

  lateralusEvents: {
    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    actorAdded(actorModel) {
      this.addActorComponent(actorModel)
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments)
    this.actorTracksComponents = []

    // Backfill any preexisting ActorModels
    this.collectOne('actorCollection').each(this.addActorComponent, this)
  },

  /**
   * @param {RekapiTimelineActorModel} actorModel
   */
  addActorComponent(actorModel) {
    const actorTracksComponent = this.addComponent(ActorTracksComponent, {
      model: actorModel,
    })

    this.actorTracksComponents.push(actorTracksComponent)
    this.$el.append(actorTracksComponent.view.$el)
  },
})

export default AnimationTracksComponentView
