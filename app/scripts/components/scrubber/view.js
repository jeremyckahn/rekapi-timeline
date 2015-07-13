define([

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

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
      }

      ,'rekapi:timelineModified': function () {
        this.render();
      }

      ,'rekapi:afterUpdate': function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      // This may be problematic.  See
      // https://github.com/jeremyckahn/rekapi-timeline/blob/16cb67620dddef8bf89184d064b5c7200ff8a8aa/app/scripts/views/container.js#L79-L84
      this.listenTo(this.lateralus.rekapi, 'addKeyframePropertyTrack',
          this.resizeScrubberGuide.bind(this));

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberWrapper
        ,drag: this.onScrubberDrag.bind(this)
      });
    }

    ,deferredInitialize: function () {
      this.resizeScrubberGuide();
    }

    ,render: function () {
      this.syncContainerToTimelineLength();
      this.syncHandleToTimelineLength();
    }

    ,onScrubberDrag: function () {
      var millisecond =
        this.collectOne('timelineMillisecondForHandle', this.$scrubberHandle);
      this.lateralus.rekapi.update(millisecond);
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
        this.lateralus.getAnimationLength() *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

      this.$scrubberWrapper.width(
        scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
        this.lateralus.rekapi.getLastPositionUpdated() *
        this.lateralus.rekapi.getAnimationLength();
      var scaledLeftValue = lastMillisecondUpdated *
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
