define([

  'backbone'

  ,'text!../templates/scrubber.mustache'

  ], function (

  Backbone

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
      });
    }

    ,render: function () {
      this.$el.html(scrubberTemplate);
    }
  });

  return ScrubberView;
});
