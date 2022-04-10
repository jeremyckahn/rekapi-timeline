define(() => {
  'use strict'

  const rekapiTimelineConstants = {
    // How many pixels wide the keyframe tracks should be for every second of
    // the animatiom.
    PIXELS_PER_SECOND: 300,

    // How many milliseconds after the currently focused keyframe property to
    // add a new property when the user clicks the "add new property" button.
    NEW_KEYFRAME_PROPERTY_BUFFER_MS: 500,

    DEFAULT_TIMELINE_SCALE: 1,

    DEFAULT_KEYFRAME_PROPERTY_VALUE: 0,
    DEFAULT_KEYFRAME_PROPERTY_MILLISECOND: 0,
  };

  return rekapiTimelineConstants
})
