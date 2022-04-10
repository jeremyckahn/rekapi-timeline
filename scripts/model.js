import Lateralus from 'lateralus'
import constant from './constant'

const RekapiTimelineModel = Lateralus.Model.extend({
  defaults: {
    timelineScale: constant.DEFAULT_TIMELINE_SCALE,
    timelineDuration: 0,

    // @type {Array.<{name: string, defaultValue: string}>}
    supportedProperties: [],

    preventValueInputAutoSelect: false,
  },
})

export default RekapiTimelineModel
