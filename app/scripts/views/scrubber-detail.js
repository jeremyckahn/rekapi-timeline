define([

  'underscore'
  ,'backbone'
  ,'mustache'

  ,'incrementer-field'

  ,'rekapi.timeline.constants'

  ,'text!templates/scrubber-detail.mustache'

  ], function (

  _
  ,Backbone
  ,Mustache

  ,IncrementerFieldView

  ,rekapiTimelineConstants

  ,scrubberDetailTemplate

  ) {
  'use strict';

  var ScrubberView = Backbone.View.extend({
    events: {
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();

      this.scrubberScaleView = new IncrementerFieldView({
        el: this.$el.find('.rt-scrubber-scale')[0]
      });

      this.scrubberScaleView.increment = 0.1;
      this.scrubberScaleView.mousewheelIncrement = 0.01;
      this.scrubberScaleView.onValReenter = _.bind(function (newScale) {
        this.rekapiTimeline.setTimelineScale(newScale);
      }, this);
    }

    ,render: function () {
      this.$el.html(Mustache.render(scrubberDetailTemplate, {
        scale: this.rekapiTimeline.timelineScale
      }));
    }
  });

  return ScrubberView;
});
