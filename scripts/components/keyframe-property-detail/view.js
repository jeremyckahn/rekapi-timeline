define([
  'underscore',
  'jquery',
  'lateralus',
  'shifty',

  'text!./template.mustache',

  'aenima/components/curve-selector/main',

  '../../constant',
], function (
  _,
  $,
  Lateralus,
  shifty,

  template,

  CurveSelector,

  constant
) {
  'use strict'

  const Base = Lateralus.Component.View;
  const baseProto = Base.prototype;

  const { Tweenable } = shifty

  const R_NUMBER_STRING = /-?\d*\.?\d*/g;

  const KeyframePropertyDetailComponentView = Base.extend({
    template,

    lateralusEvents: {
      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      userFocusedKeyframeProperty(keyframePropertyView) {
        if (this.keyframePropertyModel) {
          this.stopListening(this.keyframePropertyModel)
        }

        this.keyframePropertyModel = keyframePropertyView.model
        this.listenTo(
          this.keyframePropertyModel,
          'change',
          this.render.bind(this)
        )

        const inputs = [];
        _.each(
          Tweenable.formulas,
          (formula, name) => {
            const option = document.createElement('option');
            option.innerHTML = name
            inputs.push(option)
          },
          this
        )

        this.render()
      },

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.id === this.keyframePropertyModel.id) {
          this.keyframePropertyModel = null
          this.reset()
        }
      },

      requestDeselectAllKeyframes() {
        this.$propertyName.text(this.propertyNameDefaultText)
        this.$propertyValue.val('')
        this.$propertyMillisecond.val('')
        this.$propertyEasing.val('linear')
      },
    },

    events: {
      /**
       * @param {jQuery.Event} evt
       */
      'change .property-value': function (evt) {
        const keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return
        }

        this.emit('beforeUserUpdatesKeyframeValueInput')
        const $target = $(evt.target);
        const val = $target.val();
        const rawNumberStringValue = val.match(R_NUMBER_STRING)[0];
        const currentValue = keyframePropertyModel.get('value');
        const currentValueStructure = currentValue
          .toString()
          .replace(R_NUMBER_STRING, '');
        const newValueStructure = val.replace(R_NUMBER_STRING, '');

        // Attempt to coerce the inputted value into the correct format
        if (!newValueStructure && currentValueStructure.length) {
          $target.val(val + currentValueStructure)
          $target.change()
          return
        }

        if (
          $.trim(val) === '' ||
          $.trim(rawNumberStringValue) === '' ||
          currentValueStructure !== newValueStructure
        ) {
          this.$propertyValue.val(currentValue)
          return
        }

        // If the inputted value string can be coerced into an equivalent
        // Number, do it.  Keyframe property values are initially set up as
        // numbers, and this cast prevents the user from inadvertently setting
        // inconsistently typed keyframe property values, thus breaking Rekapi.
        // jshint eqeqeq: false
        const coercedVal = val == +val ? +val : val;

        keyframePropertyModel.set($target.attr('name'), coercedVal)
        this.lateralus.update()
      },

      /**
       * @param {jQuery.Event} evt
       */
      'change .property-millisecond': function (evt) {
        const keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return
        }

        this.emit('beforeUserUpdatesKeyframeMillisecondInput')
        const $target = $(evt.target);
        const millisecond = +$target.val();

        if (
          millisecond < 0 ||
          keyframePropertyModel
            .get('actor')
            .hasKeyframeAt(millisecond, keyframePropertyModel.get('name'))
        ) {
          return
        }

        keyframePropertyModel.set('millisecond', millisecond)
        this.lateralus.update()
      },

      /**
       * @param {jQuery.Event} evt
       */
      'change select': function (evt) {
        const keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return
        }

        this.emit('beforeUserUpdatesKeyframeCurveSelector')
        const $target = $(evt.target);
        keyframePropertyModel.set($target.attr('name'), $target.val())
        this.lateralus.update()
      },

      'click .add': function () {
        if (!this.keyframePropertyModel) {
          return
        }

        const keyframePropertyModelJson = this.keyframePropertyModel.toJSON();

        const targetMillisecond =
          keyframePropertyModelJson.millisecond +
          constant.NEW_KEYFRAME_PROPERTY_BUFFER_MS;

        this.emit('requestNewKeyframeProperty', {
          name: keyframePropertyModelJson.name,
          value: keyframePropertyModelJson.value,
          easing: keyframePropertyModelJson.easing,
          millisecond: targetMillisecond,
        })
      },

      'click .delete': function () {
        if (!this.keyframePropertyModel) {
          return
        }

        var keyframePropertyModel = this.keyframePropertyModel
        keyframePropertyModel
          .getOwnerActor()
          .attributes.removeKeyframeProperty(
            keyframePropertyModel.get('name'),
            keyframePropertyModel.get('millisecond')
          )
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize() {
      baseProto.initialize.apply(this, arguments)
      this.propertyNameDefaultText = this.$propertyName.text()

      this.addSubview(CurveSelector.View, {
        el: this.$propertyEasing,
      })
    },

    render() {
      const activeElement = document.activeElement;

      // TODO: It would be nice if the template could be declaratively bound to
      // the model, rather than having to make DOM updates imperatively here.
      this.$propertyName.text(this.keyframePropertyModel.get('name'))
      this.$propertyMillisecond.val(
        this.keyframePropertyModel.get('millisecond')
      )
      this.$propertyEasing.val(this.keyframePropertyModel.get('easing'))

      this.$propertyValue.val(this.keyframePropertyModel.get('value'))

      if (!this.lateralus.model.get('preventValueInputAutoSelect')) {
        this.$propertyValue.select()
      }

      // Prevent $propertyMillisecond from losing focus, thereby enabling
      // browser-standard keyup/keydown functionality to mostly work
      if (activeElement === this.$propertyMillisecond[0]) {
        this.$propertyMillisecond.focus()
      }
    },

    reset() {
      this.$propertyName.text(this.propertyNameDefaultText)
      this.$propertyMillisecond.val('')
      this.$propertyValue.val('')
    },
  });

  return KeyframePropertyDetailComponentView
})
