define(['lateralus'], function (Lateralus) {
  'use strict'

  const Base = Lateralus.Component.Model;
  const baseProto = Base.prototype;

  const TimelineComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments)
    },
  });

  return TimelineComponentModel
})
