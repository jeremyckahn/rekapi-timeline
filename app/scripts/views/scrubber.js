define([

  'underscore'
  ,'backbone'

  ,'text!../templates/scrubber.mustache'

  ], function (

  _
  ,Backbone

  ,scrubberTemplate

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

      this.$scrubberContainer = this.$el.find('.rt-scrubber-container');
      this.$scrubberHandle =
          this.$scrubberContainer.find('.rt-scrubber-handle');

      this.$scrubberHandle.dragon({
        within: this.$scrubberContainer
        ,drag: _.bind(this.onScrubberDrag, this)
      });
    }

    ,render: function () {
      this.$el.html(scrubberTemplate);
    }

    ,onScrubberDrag: function () {
      var millisecond = this.rekapiTimeline.getTimelineMillisecondForHandle(
          this.$scrubberHandle);
      this.rekapiTimeline.rekapi.update(millisecond);
    }
  });

  return ScrubberView;
});
