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
        this.emit('userFocusedKeyframeProperty', evt);
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
     *   @param {boolean=} doImmediatelyFocus
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.render();
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackComponentView.$el
        ,drag: this.onDrag.bind(this)
        ,dragEnd: this.onDragEnd.bind(this)
      });

      if (this.doImmediatelyFocus) {
        this.$handle.focus();
      }
    }

    ,render: function () {
      var elData = this.$el.data('dragon');
      if (elData && elData.isDragging) {
        return;
      }

      var scaledXCoordinate = (
          constant.PIXELS_PER_SECOND * this.model.get('millisecond')) /
          1000 * this.lateralus.model.get('timelineScale');

      this.$el.css({
        left: scaledXCoordinate
      });

      var model = this.model;
      this.$handle
          .attr('data-millisecond', model.get('millisecond'))
          .attr('data-value', model.get('value'));
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
        this.collectOne('timelineMillisecondForHandle', this.$el);

      this.model.set('millisecond', Math.round(scaledValue));
      this.lateralus.update();
    }
  });

  return KeyframePropertyComponentView;
});
