import Lateralus from 'lateralus'
import Model from './model'
import View from './view'
import template from 'text!./template.mustache'
import KeyframePropertyDetailComponent from '../keyframe-property-detail/main'

const Base = Lateralus.Component

const DetailsComponent = Base.extend({
  name: 'details',
  Model,
  View,
  template,

  initialize() {
    this.keyframePropertyDetailComponent = this.addComponent(
      KeyframePropertyDetailComponent,
      {
        el: this.view.$keyframePropertyDetail[0],
      }
    )
  },
})

export default DetailsComponent
