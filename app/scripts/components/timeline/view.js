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

  var TimelineComponentView = Base.extend({
    template: template

    ,provide: {
      /**
       * Determines how wide this View's element should be, in pixels.
       * @return {number}
       */
      pixelWidthForTracks: function () {
        var animationLength =
            this.rekapiTimeline.rekapi.getAnimationLength();
        var animationSeconds = (animationLength / 1000);

        // The width of the tracks container should always be the pixel width
        // of the animation plus the width of the timeline element to allow for
        // lengthening of the animation tracks by the user.
        return (constant.PIXELS_PER_SECOND * animationSeconds) +
            this.$el.width();
      }

      ,timelineWrapperHeight: function () {
        return this.$timelineWrapper.height();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return TimelineComponentView;
});
