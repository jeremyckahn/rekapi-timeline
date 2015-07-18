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

    ,lateralusEvents: {
      'change:timelineDuration': function () {
        this.renderAnimationLength();
      }
    }

    ,events: {
      'change .scrubber-scale input': function () {
        if (this.$scrubberScale[0].validity.valid) {
          this.lateralus.model.set(
            'timelineScale', (this.$scrubberScale.val() / 100));
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.renderAnimationLength();
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        initialZoom: this.lateralus.model.get('timelineScale') * 100
      });

      return renderData;
    }

    ,renderAnimationLength: function () {
      this.$animationLength.text(this.lateralus.model.get('timelineDuration'));
    }
  });

  return ScrubberDetailComponentView;
});
