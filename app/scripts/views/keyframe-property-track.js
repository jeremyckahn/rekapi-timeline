define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'views/keyframe-property'

], function (

  $
  ,_
  ,Backbone

  ,KeyframePropertyView

) {
  'use strict';

  var KeyframePropertyTrackView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {string} trackName
     *   @param {RekapiTimelineActorModel} model
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.trackName = opts.trackName;
      this._keyframePropertyViews = [];
      this.$el
          .addClass('rt-keyframe-property-track-view')
          .attr('data-track-name', this.trackName);

      this.listenTo(this.model, 'addKeyframeProperty',
          _.bind(this.onAddKeyframeProperty, this));

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.model.keyframePropertyCollection
          .where({ name: this.trackName })
          .forEach(this.createKeyframePropertyView, this);
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} keyframePropertyModel
     */
    ,onAddKeyframeProperty: function (newKeyframeProperty) {
      if (newKeyframeProperty.get('name') === this.trackName) {
        this.createKeyframePropertyView(newKeyframeProperty);
      }
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} keyframePropertyModel
     */
    ,createKeyframePropertyView: function (keyframePropertyModel) {
      // It's important to build the DOM before initializing the View in this
      // case, the initialization logic in KeyframePropertyView is way easier
      // that way.
      var keyframePropertyEl = document.createElement('div');
      this.$el.append(keyframePropertyEl);

      var keyframePropertyView = new KeyframePropertyView({
        el: keyframePropertyEl
        ,rekapiTimeline: this.rekapiTimeline
        ,keyframePropertyTrackView: this
        ,model: keyframePropertyModel
      });

      this._keyframePropertyViews.push(keyframePropertyView);
      keyframePropertyView.render();
    }
  });

  return KeyframePropertyTrackView;
});
