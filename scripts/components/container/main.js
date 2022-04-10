import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'
import DetailsComponent from '../details/main'
import ControlBarComponent from '../control-bar/main'
import TimelineComponent from '../timeline/main'
import ScrubberDetailComponent from '../scrubber-detail/main'

const Base = Lateralus.Component

const ContainerComponent = Base.extend({
  name: 'rekapi-timeline-container',
  Model,
  View,
  template,

  initialize() {
    this.detailsComponent = this.addComponent(DetailsComponent, {
      el: this.view.$details[0],
    })

    this.controlBar = this.addComponent(ControlBarComponent, {
      el: this.view.$controlBar[0],
    })

    this.timelineComponent = this.addComponent(TimelineComponent, {
      el: this.view.$timeline[0],
    })

    this.scrubberDetailComponent = this.addComponent(ScrubberDetailComponent, {
      el: this.view.$scrubberDetail[0],
    })
  },
})

export default ContainerComponent
