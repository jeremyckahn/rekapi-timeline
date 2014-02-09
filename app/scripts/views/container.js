define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'text!../templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,containerTemplate

) {
  'use strict';

  var ContainerView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.listenTo(this.rekapiTimeline, 'update', _.bind(this.render, this));
    }

    ,render: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }
  });

  return ContainerView;
});
