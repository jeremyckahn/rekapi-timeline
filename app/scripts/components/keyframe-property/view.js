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
      'mousedown .keyframe-property':  function () {
        this.activate();
      }

      ,drag: function () {
        this.updateKeyframeProperty();
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

      ,userFocusedKeyframeProperty: function () {
        this.setActiveClass(false);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {boolean=} doImmediatelyFocus
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.render();
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.$el.parent()
      });

      if (this.doImmediatelyFocus) {
        this.activate();
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
    }

    ,activate: function () {
      this.emit('userFocusedKeyframeProperty', this);
      this.setActiveClass(true);
    }

    /**
     * @param {boolean} isActive
     */
    ,setActiveClass: function (isActive) {
      this.$handle[isActive ? 'addClass' : 'removeClass']('active');
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
