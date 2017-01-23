define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      'change:timelineScale': function () {
        this.render();
        this.syncContainerToTimelineLength();
      }

      ,'change:timelineDuration': function () {
        this.render();
      }

      ,requestResizeScrubberGuide: function () {
        this.resizeScrubberGuide();
      }

      ,'rekapi:afterUpdate': function () {
        this.render();
      }

      // resizeScrubberGuide calls that are called in response to a Rekapi
      // event must be deferred here so the DOM has a chance to finish building
      // itself
      ,'rekapi:addKeyframePropertyTrack': function () {
        _.defer(this.resizeScrubberGuide.bind(this));
      }

      ,'rekapi:removeKeyframePropertyTrack': function () {
        _.defer(this.resizeScrubberGuide.bind(this));
      }

      ,'rekapi:timelineModified': function () {
        this.syncContainerToTimelineLength();
      }
    }

    ,events: {
      'drag .scrubber-handle': function () {
        var millisecond =
          this.collectOne('timelineMillisecondForHandle', this.$scrubberHandle);
        this.lateralus.update(millisecond);
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'click .scrubber-wrapper': function (evt) {
        if (evt.target !== this.$scrubberWrapper[0]) {
          return;
        }

        var scaledMillisecond =
          this.collectOne('timelineMillisecondForXOffset', evt.offsetX);

        var lateralus = this.lateralus;
        lateralus.pause();
        lateralus.update(scaledMillisecond, true);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberWrapper
      });
    }

    ,deferredInitialize: function () {
      this.resizeScrubberGuide();
    }

    ,render: function () {
      this.syncHandleToTimelineLength();
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
        this.lateralus.model.get('timelineDuration') *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

      this.$scrubberWrapper.width(
        scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
        this.lateralus.getLastPositionUpdated() *
        this.lateralus.model.get('timelineDuration');

      var scaledLeftValue =
        lastMillisecondUpdated *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

      this.$scrubberHandle.css('left', scaledLeftValue);
    }

    ,resizeScrubberGuide: function () {
      var wrapperHeight = this.collectOne('timelineWrapperHeight');
      var scrubberBottomBorder =
        parseInt(this.$scrubberWrapper.css('borderBottomWidth'), 10);
      this.$scrubberGuide.css('height',
        wrapperHeight - this.$el.height() + scrubberBottomBorder);
    }
  });

  return ScrubberComponentView;
});
