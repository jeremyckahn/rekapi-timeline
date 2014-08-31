define([

  'underscore'
  ,'backbone'

  ,'rekapi.timeline.constants'

  ,'text!templates/scrubber.mustache'

  ], function (

  _
  ,Backbone

  ,rekapiTimelineConstants

  ,scrubberTemplate

  ) {
  'use strict';

  var ScrubberView = Backbone.View.extend({
    events: {
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.initialRender();

      this.$scrubberContainer = this.$el.find('.rt-scrubber-container');
      this.$scrubberHandle =
          this.$scrubberContainer.find('.rt-scrubber-handle');
      this.$scrubberGuide = this.$el.find('.rt-scrubber-guide');
      this.listenToOnce(
          this.rekapiTimeline, 'initialDOMRender',
          _.bind(this.resizeScrubberGuide, this));

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberContainer
        ,drag: _.bind(this.onScrubberDrag, this)
      });

      this.rekapiTimeline.rekapi.on('afterUpdate',
          _.bind(this.onRekapiAfterUpdate, this));
      this.rekapiTimeline.rekapi.on('timelineModified',
          _.bind(this.onRekapiTimelineModified, this));

      this.listenTo(this.rekapiTimeline, 'change:timelineScale',
          _.bind(this.onChangeTimelineScale, this));
    }

    ,initialRender: function () {
      this.$el.html(scrubberTemplate);
    }

    ,render: function () {
      this.syncContainerToTimelineLength();
      this.syncHandleToTimelineLength();
    }

    ,onScrubberDrag: function () {
      var millisecond = this.rekapiTimeline.getTimelineMillisecondForHandle(
          this.$scrubberHandle) / this.rekapiTimeline.timelineScale;
      this.rekapiTimeline.rekapi.update(millisecond);
    }

    ,onRekapiAfterUpdate: function () {
      this.render();
    }

    ,onRekapiTimelineModified: function () {
      this.render();
    }

    ,onChangeTimelineScale: function () {
      this.render();
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
          this.rekapiTimeline.getAnimationLength() *
          (rekapiTimelineConstants.PIXELS_PER_SECOND / 1000) *
          this.rekapiTimeline.timelineScale;

      this.$scrubberContainer.width(
          scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
          this.rekapiTimeline.rekapi.getLastPositionUpdated() *
          this.rekapiTimeline.rekapi.getAnimationLength();
      var scaledLeftValue = lastMillisecondUpdated *
          (rekapiTimelineConstants.PIXELS_PER_SECOND / 1000) *
          this.rekapiTimeline.timelineScale;

      this.$scrubberHandle.css('left', scaledLeftValue);
    }

    ,resizeScrubberGuide: function () {
      var wrapperHeight =
          this.rekapiTimeline.containerView.$timelineWrapper.height();
      this.$scrubberGuide.css('height', wrapperHeight - this.$el.height());
    }
  });

  return ScrubberView;
});
