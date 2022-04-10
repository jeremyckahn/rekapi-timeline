define(['lateralus', 'text!./template.mustache'], function (
  Lateralus,

  template
) {
  'use strict'

  const Base = Lateralus.Component.View;
  const baseProto = Base.prototype;

  const DetailsComponentView = Base.extend({
    template: template,

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments)
    },
  });

  return DetailsComponentView
})
