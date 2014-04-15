define([

  'underscore'
  ,'backbone'
  ,'mustache'

  ,'text!templates/keyframe-property-detail.mustache'

], function (

  _
  ,Backbone
  ,Mustache

  ,keyframePropertyDetailTemplate

) {
  'use strict';

  var KeyframePropertyDetailView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();
      this.$propertyName = this.$el.find('.rt-keyframe-property-name');

      this.listenTo(this.rekapiTimeline, 'focusKeyframeProperty',
          _.bind(this.onFocusKeyframeProperty, this));
    }

    ,render: function () {
      this.$el.html(keyframePropertyDetailTemplate);
    }

    ,onFocusKeyframeProperty: function (evt) {
      this.$propertyName.text(evt.targetView.model.get('name'));
    }
  });

  return KeyframePropertyDetailView;
});
