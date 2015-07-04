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

  var KeyframePropertyComponentView = Base.extend({
    template: template

    ,events: {
      'focus button':  function (evt) {
        evt.targetView = this;
        this.emit('focusKeyframeProperty', evt);
      }
    }

    ,modelEvents: {
      change: function () {
        this.render();
      }

      ,destroy: function () {
        this.dispose();
      }
    }

    ,lateralusEvents: {
      'change:timelineScale': function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {KeyframePropertyTrackComponentView}
     *   keyframePropertyTrackComponentView
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.initialRender();
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackComponentView.$el
        ,drag: this.onDrag.bind(this)
        ,dragEnd: this.onDragEnd.bind(this)
      });
    }

    ,render: function () {
      var elData = this.$el.data('dragon');
      if (elData && elData.isDragging) {
        return;
      }

      var scaledXCoordinate = (
          constant.PIXELS_PER_SECOND * this.model.get('millisecond')) /
          1000 * this.lateralus.timelineScale;

      this.$el.css({
        left: scaledXCoordinate
      });

      var model = this.model;
      this.$handle
          .attr('data-millisecond', model.get('millisecond'))
          .attr('data-value', model.get('value'));
    }

    ,onFocus: function (evt) {
      evt.targetView = this;
      this.emit('focusKeyframeProperty', evt);
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    // In Firefox, completing a $.fn.dragon drag does not focus the element, so
    // it must be done explicitly.
    ,onDragEnd: function () {
      this.$handle.focus();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var scaledValue =
          this.lateralus.getTimelineMillisecondForHandle(this.$el) /
          this.lateralus.timelineScale;

      this.model.set('millisecond', Math.round(scaledValue));
      this.lateralus.update();
    }
  });

  return KeyframePropertyComponentView;
});
