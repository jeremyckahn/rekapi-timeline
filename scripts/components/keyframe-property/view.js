define([

  'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

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
      'mousedown':  function () {
        this.activate();
      }

      ,drag: function () {
        this.updateKeyframeProperty();
      }

      ,dragEnd: function () {
        this.overwriteRedundantProperty();
        this.emit('keyframePropertyDragEnd');
      }

      ,dragStart: function () {
        this.emit('keyframePropertyDragStart');
      }
    }

    ,modelEvents: {
      change: function () {
        this.render();
      }

      ,destroy: function () {
        this.dispose();
      }

      /**
       * @param {KeyframePropertyComponentModel} model
       * @param {boolean} isActive
       */
      ,'change:isActive': function (model, isActive) {
        this.isActivating = isActive;

        if (isActive) {
          this.emit('userFocusedKeyframeProperty', this);
        }

        this.setActiveClass(isActive);
        this.isActivating = false;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        var nextProperty = this.model.get('nextProperty');
        if (nextProperty && nextProperty.id === keyframeProperty.id) {
          this.activate();
        }
      }

      ,'change:timelineScale': function () {
        this.render();
      }

      ,userFocusedKeyframeProperty: function () {
        if (this.isActivating) {
          return;
        }

        this.model.set('isActive', false);
      }

      /**
       * @param {{ name: string, millisecond: number}} nameAndMillisecondOb
       */
      ,activateKeyframePropertyByNameAndMillisecond:
          function (nameAndMillisecondOb) {
        var modelAttrs = this.model.toJSON();

        if (nameAndMillisecondOb.name === modelAttrs.name &&
            nameAndMillisecondOb.millisecond === modelAttrs.millisecond) {
          this.activate();
        }
      }
    }

    ,provide: {
      /**
       * @return {KeyframePropertyComponentView|undefined}
       */
      activeKeyframeProperties: function () {
        if (this.model.get('isActive')) {
          return this;
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {boolean=} doImmediatelyFocus
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.$el.css('visibility', 'hidden');
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.$el.parent()
      });

      if (this.doImmediatelyFocus) {
        this.activate();
      }

      this.render();
      this.$el.css('visibility', '');
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
      this.model.set('isActive', true);
    }

    /**
     * @param {boolean} isActive
     */
    ,setActiveClass: function (isActive) {
      this.$el[isActive ? 'addClass' : 'removeClass']('active');
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var model = this.model;
      var millisecond = Math.round(
        this.collectOne('timelineMillisecondForHandle', this.$el)
      );

      if (
          // This will be true if the user drags the property vertically, which
          // would cause the drag event handler to be called but should not
          // cause any kind of a state change.
          millisecond === model.get('millisecond') ||

          this.doesPropertyAlreadyExistAt(millisecond)) {
        return;
      }

      model.set('millisecond', millisecond);
      this.lateralus.update();
    }

    ,overwriteRedundantProperty: function () {
      var model = this.model;
      var millisecond = Math.round(
        this.collectOne('timelineMillisecondForHandle', this.$el)
      );

      this.emit('beginTemporaryTimelineModifications');
      model.set('millisecond', 1e99);

      if (this.doesPropertyAlreadyExistAt(millisecond)) {
        var actor = model.get('actor');
        actor.removeKeyframeProperty(model.get('name'), millisecond);
      }

      model.set('millisecond', millisecond);
      this.emit('endTemporaryTimelineModifications');
      this.lateralus.update();
    }

    /**
     * @param {number} millisecond
     * @return {boolean}
     */
    ,doesPropertyAlreadyExistAt: function (millisecond) {
      return this.model.get('actor').hasKeyframeAt(
        millisecond, this.model.get('name')
      );
    }
  });

  return KeyframePropertyComponentView;
});
