define([

  'underscore'
  ,'backbone'
  ,'rekapi'

], function (

  _
  ,Backbone
  ,Rekapi

  ) {
  'use strict';

  var RekapiTimelineKeyframePropertyModel = Backbone.Model.extend({
    /**
     * @param {Object} attrs Should not contain any properties.
     * @param {Object} opts
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (attrs, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.attributes = opts.keyframeProperty;

      this.rekapiTimeline.rekapi.on('removeKeyframeProperty',
          _.bind(this.onRekapiRemoveKeyframeProperty, this));
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRekapiRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty === this.attributes) {
        this.destroy();
      }
    }

    ,set: function (key, value) {
      Backbone.Model.prototype.set.apply(this, arguments);

      if (key in this.attributes) {
        // Modify the keyframeProperty via its actor so that the state of the
        // animation is updated.
        var obj = {};
        obj[key] = value;
        this.getActor().modifyKeyframeProperty(
            this.get('name'), this.get('millisecond'), obj);
      }

    }

    /**
     * @return {Rekapi.KeyframeProperty}
     */
    ,getKeyframeProperty: function () {
      return this.attributes;
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes.actor;
    }

    /**
     * Overrides the standard Backbone.Model#destroy behavior, as there is no
     * server data that thmodel is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  // Proxy all Rekapi.KeyframeProperty.prototype methods to
  // RekapiTimelineKeyframePropertyModel
  _.each(Rekapi.KeyframeProperty.prototype,
      function (keyframePropertyMethod, keyframePropertyMethodName) {
    RekapiTimelineKeyframePropertyModel.prototype[keyframePropertyMethodName] =
        function () {
      return keyframePropertyMethod.apply(this.attributes, arguments);
    };
  }, this);

  return RekapiTimelineKeyframePropertyModel;
});
