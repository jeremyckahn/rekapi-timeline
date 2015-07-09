define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberDetailComponentView = Base.extend({
    template: template

    ,events: {
      'change .scrubber-scale': function () {
        // FIXME: This should be emitted.
        // FIXME: Needs validation to prevent negative values.
        this.lateralus.setTimelineScale(this.$scrubberScale.val() / 100);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        initialZoom: this.lateralus.timelineScale * 100
      });

      return renderData;
    }
  });

  return ScrubberDetailComponentView;
});
