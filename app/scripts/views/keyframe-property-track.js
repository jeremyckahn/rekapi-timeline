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
      this.$el.addClass('keyframe-property-track-view');

      this.listenTo(this.model, 'addKeyframeProperty',
          _.bind(this.onAddKeyframeProperty, this));

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.model.keyframePropertyCollection
          .where({ name: this.trackName })
          .forEach(this.createKeyframePropertyView, this);

      this.buildDOM();
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} keyframePropertyModel
     */
    ,onAddKeyframeProperty: function (newKeyframeProperty) {
      this.createKeyframePropertyView(newKeyframeProperty);
    }

    ,render: function () {
      this.renderKeyframeProperties();
    }

    ,renderKeyframeProperties: function () {
      this._keyframePropertyViews.forEach(function (keyframePropertyView) {
        keyframePropertyView.render();
      });
    }

    ,buildDOM: function () {
      this._keyframePropertyViews.forEach(function (keyframePropertyView) {
        this.$el.append(keyframePropertyView.$el);
      }, this);
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} keyframePropertyModel
     */
    ,createKeyframePropertyView: function (keyframePropertyModel) {
      this._keyframePropertyViews.push(new KeyframePropertyView({
        rekapiTimeline: this.rekapiTimeline
        ,keyframePropertyTrackView: this
        ,model: keyframePropertyModel
      }));
    }

    /**
     * Gets the minimum $.fn.offset()-friendly coordinates for which containing
     * elements should stay within.
     * @return {{left: number, top: number}}
     */
    ,getMinimumBounds: function () {
      var $el = this.$el;
      var elOffset = $el.offset();

      var minimumLeft = elOffset.left
          + parseInt($el.css('border-left-width'), 10)
          + parseInt($el.css('padding-left'), 10);
      var minimumTop = elOffset.top
          + parseInt($el.css('border-top-width'), 10)
          + parseInt($el.css('padding-top'), 10);

      return {
        left: minimumLeft
        ,top: minimumTop
      };
    }
  });

  return KeyframePropertyTrackView;
});
