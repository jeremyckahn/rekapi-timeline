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

      this.scrubberScaleView.increment = 10;
      this.scrubberScaleView.mousewheelIncrement = 1;
      this.scrubberScaleView.onValReenter = _.bind(function (newScale) {
        this.rekapiTimeline.setTimelineScale(newScale / 100);
      }, this);
    }

    ,render: function () {
      this.$el.html(Mustache.render(scrubberDetailTemplate, {
        initialZoom: this.rekapiTimeline.timelineScale * 100
      }));
    }
  });

  return ScrubberView;
});
