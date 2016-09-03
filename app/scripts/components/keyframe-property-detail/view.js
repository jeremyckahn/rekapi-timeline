define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'aenima/components/curve-selector/main'

  ,'../../constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,CurveSelector

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var R_NUMBER_STRING = /-?\d*\.?\d*/g;

  var KeyframePropertyDetailComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      userFocusedKeyframeProperty: function (keyframePropertyView) {
        if (this.keyframePropertyModel) {
          this.stopListening(this.keyframePropertyModel);
        }

        this.keyframePropertyModel = keyframePropertyView.model;
        this.listenTo(this.keyframePropertyModel, 'change',
          this.render.bind(this));

        var inputs = [];
        _.each(Tweenable.prototype.formula, function (formula, name) {
          var option = document.createElement('option');
          option.innerHTML = name;
          inputs.push(option);
        }, this);

        this.render();
      }

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      ,'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.id === this.keyframePropertyModel.id) {
          this.keyframePropertyModel = null;
          this.reset();
        }
      }

      ,requestDeselectAllKeyframes: function () {
        this.$propertyName.text(this.propertyNameDefaultText);
        this.$propertyValue.val('');
        this.$propertyMillisecond.val('');
        this.$propertyEasing.val('linear');
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'change .property-value': function (evt) {
        var keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return;
        }

        this.emit('beforeUserUpdatesKeyframeValueInput');
        var $target = $(evt.target);
        var val = $target.val();
        var rawNumberStringValue = val.match(R_NUMBER_STRING)[0];
        var currentValue = keyframePropertyModel.get('value');
        var currentValueStructure =
          currentValue.toString().replace(R_NUMBER_STRING, '');
        var newValueStructure = val.replace(R_NUMBER_STRING, '');

        if (
          $.trim(val) === '' ||
          $.trim(rawNumberStringValue) === '' ||
          currentValueStructure !== newValueStructure
        ) {
          this.$propertyValue.val(currentValue);
          return;
        }

        // If the inputted value string can be coerced into an equivalent
        // Number, do it.  Keyframe property values are initially set up as
        // numbers, and this cast prevents the user from inadvertently setting
        // inconsistently typed keyframe property values, thus breaking Rekapi.
        // jshint eqeqeq: false
        var coercedVal = val == +val ? +val : val;

        keyframePropertyModel.set($target.attr('name'), coercedVal);
        this.lateralus.update();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'change .property-millisecond': function (evt) {
        var keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return;
        }

        this.emit('beforeUserUpdatesKeyframeMillisecondInput');
        var $target = $(evt.target);
        var millisecond = +$target.val();

        if (millisecond < 0 ||
            keyframePropertyModel.get('actor').hasKeyframeAt(
              millisecond
              ,keyframePropertyModel.get('name')
            )
          ) {
          return;
        }

        keyframePropertyModel.set('millisecond', millisecond);
        this.lateralus.update();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'change select': function (evt) {
        var keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return;
        }

        this.emit('beforeUserUpdatesKeyframeCurveSelector');
        var $target = $(evt.target);
        keyframePropertyModel.set($target.attr('name'), $target.val());
        this.lateralus.update();
      }

      ,'click .add': function () {
        if (!this.keyframePropertyModel) {
          return;
        }

        var keyframePropertyModelJson = this.keyframePropertyModel.toJSON();

        var targetMillisecond =
          keyframePropertyModelJson.millisecond +
          constant.NEW_KEYFRAME_PROPERTY_BUFFER_MS;

        this.emit('requestNewKeyframeProperty', {
          name: keyframePropertyModelJson.name
          ,value: keyframePropertyModelJson.value
          ,easing: keyframePropertyModelJson.easing
          ,millisecond: targetMillisecond
        });
      }

      ,'click .delete': function () {
        if (!this.keyframePropertyModel) {
          return;
        }

        var keyframePropertyModel = this.keyframePropertyModel;
        keyframePropertyModel.getOwnerActor().removeKeyframeProperty(
          keyframePropertyModel.get('name')
          ,keyframePropertyModel.get('millisecond'));
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.propertyNameDefaultText = this.$propertyName.text();

      this.addSubview(CurveSelector.View, {
        el: this.$propertyEasing
      });
    }

    ,render: function () {
      var activeElement = document.activeElement;

      // TODO: It would be nice if the template could be declaratively bound to
      // the model, rather than having to make DOM updates imperatively here.
      this.$propertyName.text(this.keyframePropertyModel.get('name'));
      this.$propertyMillisecond.val(
        this.keyframePropertyModel.get('millisecond'));
      this.$propertyEasing.val(this.keyframePropertyModel.get('easing'));

      this.$propertyValue.val(this.keyframePropertyModel.get('value'));

      if (!this.lateralus.model.get('preventValueInputAutoSelect')) {
        this.$propertyValue.select();
      }

      // Prevent $propertyMillisecond from losing focus, thereby enabling
      // browser-standard keyup/keydown functionality to mostly work
      if (activeElement === this.$propertyMillisecond[0]) {
        this.$propertyMillisecond.focus();
      }
    }

    ,reset: function () {
      this.$propertyName.text(this.propertyNameDefaultText);
      this.$propertyMillisecond.val('');
      this.$propertyValue.val('');
    }
  });

  return KeyframePropertyDetailComponentView;
});
