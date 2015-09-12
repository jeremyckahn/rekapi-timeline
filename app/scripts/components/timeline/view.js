define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  _
  ,Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var TimelineComponentView = Base.extend({
    template: template

    ,events: {
      'click .add': function () {
        this.addNewKeyframePropertyFromInput();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'keyup .new-track-name': function (evt) {
        if (evt.which === 13) { // enter key
          this.addNewKeyframePropertyFromInput();
        }
      }
    }

    ,lateralusEvents: {
      'change:timelineDuration': function () {
        this.updateWrapperWidth();
      }
    }

    ,provide: {
      timelineWrapperHeight: function () {
        return this.$timelineWrapper.height() -
          this.$newTrackNameInputWrapper.outerHeight();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.updateWrapperWidth();
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        supportedPropertiesAreRestricted:
          !!this.lateralus.model.get('supportedProperties').length
      });

      return renderData;
    }

    /**
     * Determines how wide this View's element should be, in pixels.
     * @return {number}
     */
    ,getPixelWidthForTracks: function () {
      var animationLength = this.lateralus.model.get('timelineDuration');
      var animationSeconds = (animationLength / 1000);

      // The width of the tracks container should always be the pixel width of
      // the animation plus the width of the timeline element to allow for
      // lengthening of the animation tracks by the user.
      return (constant.PIXELS_PER_SECOND * animationSeconds) +
        this.$el.width();
    }

    ,updateWrapperWidth: function () {
      this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
    }

    ,addNewKeyframePropertyFromInput: function () {
      var newTrackName = this.$newTrackName.val();
      var currentActorModel = this.collectOne('currentActorModel');
      var keyframeObject = {};
      var supportedProperties = this.lateralus.model.get('supportedProperties');

      var defaultValue = supportedProperties.length ?
        _.findWhere(supportedProperties, { name: newTrackName }).defaultValue
        : constant.DEFAULT_KEYFRAME_PROPERTY_VALUE;

      keyframeObject[newTrackName] = defaultValue;
      currentActorModel.keyframe(
        constant.DEFAULT_KEYFRAME_PROPERTY_MILLISECOND, keyframeObject);
    }
  });

  return TimelineComponentView;
});
