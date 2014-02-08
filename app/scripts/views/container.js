define([

  'jquery'
  ,'backbone'
  ,'mustache'

  ,'text!../templates/container.mustache'

], function (

  $
  ,Backbone
  ,Mustache

  ,containerTemplate

) {
  'use strict';

  var ContainerView = Backbone.View.extend({
    initialize: function () {
      this.render();
    }

    ,render: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }
  });

  return ContainerView;
});
