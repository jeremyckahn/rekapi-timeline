define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'text!templates/keyframe-property.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,KeyframePropertyTemplate

) {
  'use strict';

  var KeyframePropertyView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     *   @param {KeyframePropertyTrackView} keyframePropertyTrackView
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.keyframePropertyTrackView = opts.keyframePropertyTrackView;
      this.keyframeProperty = opts.keyframeProperty;
      this.$el.addClass('keyframe-property-view');
      this.render();
      this._$keyframeProperty = this.$el.find('.keyframe-property');
      this._$keyframeProperty.dragon({
        within: this.keyframePropertyTrackView.$el
      });
    }

    ,render: function () {
      this.$el.html(
          Mustache.render(KeyframePropertyTemplate, this.keyframeProperty));
    }
  });

  return KeyframePropertyView;
});
