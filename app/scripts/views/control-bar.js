define([

  'backbone'

  ,'text!../templates/control-bar.mustache'

  ], function (

  Backbone

  ,controlBarTemplate

  ) {
  'use strict';

  var ControlBarView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }
  });

  return ControlBarView;
});
