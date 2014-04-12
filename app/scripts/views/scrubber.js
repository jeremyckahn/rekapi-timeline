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
    }

    ,render: function () {
      this.$el.html(scrubberTemplate);
    }
  });

  return ScrubberView;
});
